using HAWK.dbcontext;
using HAWK.DTOs;
using HAWK.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HAWK.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ServiceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServiceController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/service/GetAll
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var services = await _context.Services.ToListAsync();
            return Ok(services);
        }

        // GET: api/service/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
                return NotFound(new { message = "Service not found" });

            return Ok(service);
        }

        // POST: api/service
        [Authorize(Roles = "SuperAdmin,Admin,Main Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ServiceCreateDto dto)
        {
            Console.WriteLine($"[ServiceController] Create called. Title: {dto.title}, Desc: {dto.description}, Image: {dto.image?.FileName}");

            if (!ModelState.IsValid)
            {
                var errors = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                Console.WriteLine($"[ServiceController] Invalid Model State: {errors}");
                return BadRequest(ModelState);
            }

            var service = new Service
            {
                title = dto.title,
                description = dto.description,
                linkedCertificate = dto.linkedCertificate,
                linkedProjectIds = dto.linkedProjectIds
            };

            // Image/Icon is optional for Service? Or required?
            // Let's make it optional. If uploaded, save file.
            if (dto.image != null && dto.image.Length > 0)
            {
                try 
                {
                    var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "server", "services");
                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.image.FileName);
                    var filePath = Path.Combine(folderPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await dto.image.CopyToAsync(stream);
                    }
                    // URL needs forward slashes
                    service.image = "/server/services/" + fileName;
                } 
                catch (Exception ex) 
                {
                    Console.WriteLine($"[ServiceController] Error saving image: {ex.Message}");
                    return StatusCode(500, $"Internal server error saving image: {ex.Message}");
                }
            }

            try 
            {
                _context.Services.Add(service);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetById), new { id = service.id }, service);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ServiceController] Error saving to DB: {ex.Message}");
                // Return just the message to simplify frontend handling if possible, or object
                return StatusCode(500, new { message = $"Internal server error saving to database: {ex.Message}" });
            }
        }

        // PUT: api/service/{id}
        [Authorize(Roles = "SuperAdmin,Admin,Main Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] ServiceCreateDto dto)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
                return NotFound(new { message = "Service not found" });

            service.title = dto.title;
            service.description = dto.description;
            service.linkedCertificate = dto.linkedCertificate;
            
            var oldProjectIds = service.linkedProjectIds;
            service.linkedProjectIds = dto.linkedProjectIds;

            // Handle Image Upload
            if (dto.image != null && dto.image.Length > 0)
            {
                // Delete old image if exists
                if (!string.IsNullOrEmpty(service.image))
                {
                    var oldPath = Path.Combine(Directory.GetCurrentDirectory(), service.image.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "server", "services");
                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.image.FileName);
                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.image.CopyToAsync(stream);
                }

                service.image = "/server/services/" + fileName;
            }

            await _context.SaveChangesAsync();

            // Sync project scopes
            await SyncProjectScopes(service, oldProjectIds);
            await _context.SaveChangesAsync();

            return Ok(service);
        }

        // DELETE: api/service/{id}
        [Authorize(Roles = "SuperAdmin,Admin,Main Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
                return NotFound(new { message = "Service not found" });

            // Delete associated image file
            if (!string.IsNullOrEmpty(service.image))
            {
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), service.image.TrimStart('/'));
                if (System.IO.File.Exists(imagePath))
                    System.IO.File.Delete(imagePath);
            }

            _context.Services.Remove(service);
            
            // Remove service title from all linked projects' scope
            await SyncProjectScopes(service, service.linkedProjectIds, forceRemoveAll: true);
            
            await _context.SaveChangesAsync();
            return Ok(new { message = "Service deleted successfully" });
        }
        [Authorize(Roles = "SuperAdmin,Admin,Main Admin")]
        [HttpPost]
        public async Task<IActionResult> BulkUpdate([FromBody] List<ServiceUpdateDto> updates)
        {
            if (updates == null || !updates.Any())
                return BadRequest("No updates provided");

            foreach (var update in updates)
            {
                var service = await _context.Services.FindAsync(update.id);
                if (service != null)
                {
                    service.linkedProjectIds = update.linkedProjectIds;
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Bulk update successful" });
        }

        private async Task SyncProjectScopes(Service service, string? oldProjectIds, bool forceRemoveAll = false)
        {
            var newIds = forceRemoveAll ? new List<int>() : (service.linkedProjectIds ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(id => int.TryParse(id, out var val) ? val : (int?)null)
                .Where(v => v.HasValue).Select(v => v.Value).ToList();

            var oldIds = (oldProjectIds ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(id => int.TryParse(id, out var val) ? val : (int?)null)
                .Where(v => v.HasValue).Select(v => v.Value).ToList();

            var addedIds = newIds.Except(oldIds);
            var removedIds = oldIds.Except(newIds);

            foreach (var id in addedIds)
            {
                var project = await _context.Projects.FindAsync(id);
                if (project != null)
                {
                    var scopes = (project.scope ?? "").Split(new[] { ", " }, StringSplitOptions.RemoveEmptyEntries).ToList();
                    if (!scopes.Any(s => s.Equals(service.title, StringComparison.OrdinalIgnoreCase)))
                    {
                        scopes.Add(service.title);
                        project.scope = string.Join(", ", scopes);
                    }
                }
            }

            foreach (var id in removedIds)
            {
                var project = await _context.Projects.FindAsync(id);
                if (project != null)
                {
                    var scopes = (project.scope ?? "").Split(new[] { ", " }, StringSplitOptions.RemoveEmptyEntries).ToList();
                    var match = scopes.FirstOrDefault(s => s.Equals(service.title, StringComparison.OrdinalIgnoreCase));
                    if (match != null)
                    {
                        scopes.Remove(match);
                        project.scope = string.Join(", ", scopes);
                    }
                }
            }
        }
    }

    public class ServiceUpdateDto
    {
        public int id { get; set; }
        public string? linkedProjectIds { get; set; }
    }
}

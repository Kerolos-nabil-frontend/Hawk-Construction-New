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
    public class CertificateController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CertificateController(AppDbContext context)
        {
            _context = context;
        }
        // GET: api/project
        // GET: api/certificate/GetAll?type=certificate
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? type = null)
        {
            var query = _context.Certificates.AsQueryable();

            if (!string.IsNullOrEmpty(type))
            {
                // Assuming 'category' stores 'certificate' or 'reference'
                // Treat null as 'certificate' for legacy compatibility
                if (type == "certificate")
                {
                    query = query.Where(c => c.category == type || c.category == null);
                }
                else
                {
                    query = query.Where(c => c.category == type);
                }
            }

            var certificates = await query.Include(c => c.Images).ToListAsync();
            return Ok(certificates);
        }
        // GET: api/certificate/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var certificate = await _context.Certificates.FindAsync(id);
            if (certificate == null)
                return NotFound(new { message = "Certificate not found" });

            return Ok(certificate);
        }
        // POST: api/certificate
        [Authorize(Roles = "SuperAdmin,Admin,Main Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CertificateCreateDto dto)
        {
            if (dto.image == null || dto.image.Length == 0)
                return BadRequest("Image file is required");

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "server");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.image.FileName);
            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.image.CopyToAsync(stream);
            }

            var certificate = new Certificate
            {
                title = dto.title,
                description = dto.description,
                image = "/server/" + fileName,
                category = dto.category, // Save category
                linkedProjectIds = dto.linkedProjectIds,
                linkedServiceIds = dto.linkedServiceIds
            };

            _context.Certificates.Add(certificate);
            await _context.SaveChangesAsync();

            // Handle Multiple Images
            if (dto.images != null && dto.images.Count > 0)
            {
                foreach (var img in dto.images)
                {
                    var imgFileName = Guid.NewGuid().ToString() + Path.GetExtension(img.FileName);
                    var imgFilePath = Path.Combine(folderPath, imgFileName);
                    using (var stream = new FileStream(imgFilePath, FileMode.Create))
                    {
                        await img.CopyToAsync(stream);
                    }
                    _context.CertificateImages.Add(new CertificateImage
                    {
                        CertificateId = certificate.id,
                        image = "/server/" + imgFileName
                    });
                }
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetAll), new { id = certificate.id }, certificate);
        }
        // PUT: api/certificate/{id}
        [Authorize(Roles = "SuperAdmin,Admin,Main Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] CertificateCreateDto dto)
        {
            var certificate = await _context.Certificates.FindAsync(id);
            if (certificate == null)
                return NotFound(new { message = "Certificate not found" });

            // If new image uploaded
            if (dto.image != null && dto.image.Length > 0)
            {
                var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), certificate.image.TrimStart('/'));
                if (System.IO.File.Exists(oldImagePath))
                    System.IO.File.Delete(oldImagePath);

                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "server");
                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.image.FileName);
                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.image.CopyToAsync(stream);
                }

                certificate.image = "/server/" + fileName;
            }

            certificate.title = dto.title;
            certificate.description = dto.description;
            certificate.category = dto.category; // Update category
            certificate.linkedProjectIds = dto.linkedProjectIds;
            certificate.linkedServiceIds = dto.linkedServiceIds;

            // Handle New Multiple Images
            if (dto.images != null && dto.images.Count > 0)
            {
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "server");
                foreach (var img in dto.images)
                {
                    var imgFileName = Guid.NewGuid().ToString() + Path.GetExtension(img.FileName);
                    var imgFilePath = Path.Combine(folderPath, imgFileName);
                    using (var stream = new FileStream(imgFilePath, FileMode.Create))
                    {
                        await img.CopyToAsync(stream);
                    }
                    _context.CertificateImages.Add(new CertificateImage
                    {
                        CertificateId = certificate.id,
                        image = "/server/" + imgFileName
                    });
                }
            }

            await _context.SaveChangesAsync();

            return Ok(certificate);
        }

        // DELETE: api/certificate/{id}
        [Authorize(Roles = "SuperAdmin,Admin,Main Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var certificate = await _context.Certificates.FindAsync(id);
            if (certificate == null)
                return NotFound(new { message = "Certificate not found" });

            // Delete image file if exists
            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), certificate.image.TrimStart('/'));
            if (System.IO.File.Exists(imagePath))
                System.IO.File.Delete(imagePath);

            _context.Certificates.Remove(certificate);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Certificate deleted successfully" });
        }
    }
}

using HAWK.DTOs;
using HAWK.Models;
using HAWK.dbcontext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace HAWK.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class CareerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CareerController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Career/GetAll
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var careers = await _context.Careers.OrderByDescending(c => c.createdAt).ToListAsync();
            return Ok(careers);
        }

        // GET: api/Career/GetById/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var career = await _context.Careers.FindAsync(id);
            if (career == null) return NotFound("Job posting not found.");
            return Ok(career);
        }

        // POST: api/Career/Create
        [Authorize(Roles = "SuperAdmin,Admin,Main Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CareerCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var career = new Career
            {
                title = dto.title,
                description = dto.description,
                type = dto.type,
                location = dto.location,
                isActive = dto.isActive,
                createdAt = DateTime.UtcNow
            };

            _context.Careers.Add(career);
            await _context.SaveChangesAsync();

            return Ok(career);
        }

        // PUT: api/Career/Update/{id}
        [Authorize(Roles = "SuperAdmin,Admin,Main Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CareerCreateDto dto)
        {
            var career = await _context.Careers.FindAsync(id);
            if (career == null) return NotFound("Job posting not found.");

            career.title = dto.title;
            career.description = dto.description;
            career.type = dto.type;
            career.location = dto.location;
            career.isActive = dto.isActive;

            await _context.SaveChangesAsync();
            return Ok(career);
        }

        // DELETE: api/Career/Delete/{id}
        [Authorize(Roles = "SuperAdmin,Admin,Main Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var career = await _context.Careers.FindAsync(id);
            if (career == null) return NotFound("Job posting not found.");

            _context.Careers.Remove(career);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Job posting deleted successfully." });
        }

        // POST: api/Career/Apply
        [HttpPost]
        public async Task<IActionResult> Apply([FromForm] CareerApplicationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var message = new MimeMessage();

                // The sender must match your mailbox
                message.From.Add(new MailboxAddress("HAWK Careers", "info@hawkalahlia.com"));

                // The receiver is your HR inbox
                message.To.Add(new MailboxAddress("HR Department", "info@hawkalahlia.com"));

                // Subject
                message.Subject = $"New Career Application - {dto.Subject}";

                // Body with applicant info
                var builder = new BodyBuilder
                {
                    TextBody =
        $@"New career application received

Applicant Email: {dto.Email}

Message:
{dto.Body}"
                };

                // Attach CV
                using (var ms = new MemoryStream())
                {
                    await dto.CV.CopyToAsync(ms);
                    builder.Attachments.Add(
                        dto.CV.FileName,
                        ms.ToArray(),
                        ContentType.Parse(dto.CV.ContentType)
                    );
                }

                message.Body = builder.ToMessageBody();

                using var client = new SmtpClient();

                // Connect using your mail server (SSL/TLS, port 465)
                await client.ConnectAsync("mail.hawkalahlia.com", 465, SecureSocketOptions.SslOnConnect);

                // Authenticate using your full email and password
                await client.AuthenticateAsync("info@hawkalahlia.com", "Hawk90001448");

                // Send the email
                await client.SendAsync(message);

                // Disconnect safely
                await client.DisconnectAsync(true);

                return Ok(new { message = "Application sent successfully!" });
            }
            catch (Exception ex)
            {
                // Log exception if needed
                return StatusCode(500, new { message = "Error sending application", error = ex.Message });
            }
        }

    }
}

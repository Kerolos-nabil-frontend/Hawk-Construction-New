using HAWK.DTOs;
using Microsoft.AspNetCore.Authorization;
using HAWK.Models;
using HAWK.dbcontext;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;

namespace HAWK.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDetails()
        {
            var info = await _context.ContactInfos.Include(c => c.Branches).FirstOrDefaultAsync();
            
            if (info == null)
            {
                // Seed with default data if empty
                info = new ContactInfo
                {
                    Email = "info@hawkalahlia.com", 
                    KuwaitPhone1 = "+965 22458183",
                    KuwaitPhone2 = "+965 90001448",
                    KuwaitWhatsapp = "+965 98765305",
                    KuwaitAddress = "Al 'Asimah Governorate, Sharq, Mubarak Al-Kabeer St., Block No.6, Maryam Tower, 14th Floor",
                    KuwaitMapLink = "https://www.google.com/maps?q=Al+'Asimah+Governorate,+Sharq,+Mubarak+Al-Kabeer+St.,+Block+No.6,+Maryam+Tower,+14th+Floor",
                    UaePhone = "+971 502572582",
                    UaeAddress = "Dubai, United Arab Emirates",
                    UaeMapLink = "https://www.google.com/maps?q=Dubai,+United+Arab+Emirates"
                };
                
                _context.ContactInfos.Add(info);
                await _context.SaveChangesAsync();
            }

            return Ok(info);
        }

        [Authorize(Roles = "SuperAdmin,Admin,Main Admin")]
        [HttpPost]
        public async Task<IActionResult> UpdateDetails([FromBody] ContactInfoDto dto)
        {
            var info = await _context.ContactInfos.Include(c => c.Branches).FirstOrDefaultAsync();
            if (info == null)
            {
                info = new ContactInfo();
                _context.ContactInfos.Add(info);
            }

            info.Email = dto.Email;
            info.KuwaitPhone1 = dto.KuwaitPhone1;
            info.KuwaitPhone2 = dto.KuwaitPhone2;
            info.KuwaitWhatsapp = dto.KuwaitWhatsapp;
            info.KuwaitAddress = dto.KuwaitAddress;
            info.KuwaitMapLink = dto.KuwaitMapLink;
            info.UaePhone = dto.UaePhone;
            info.UaeAddress = dto.UaeAddress;
            info.UaeMapLink = dto.UaeMapLink;

            // Update Branches
            // Remove branches not in DTO
            var branchesToRemove = info.Branches.Where(b => !dto.Branches.Any(d => d.Id == b.Id)).ToList();
            _context.Branches.RemoveRange(branchesToRemove);

            // Update or Add branches
            foreach (var bDto in dto.Branches)
            {
                if (bDto.Id.HasValue && bDto.Id > 0)
                {
                    var existingBranch = info.Branches.FirstOrDefault(b => b.Id == bDto.Id);
                    if (existingBranch != null)
                    {
                        existingBranch.Title = bDto.Title;
                        existingBranch.Phone1 = bDto.Phone1;
                        existingBranch.Phone2 = bDto.Phone2;
                        existingBranch.Whatsapp = bDto.Whatsapp;
                        existingBranch.Address = bDto.Address;
                        existingBranch.MapLink = bDto.MapLink;
                    }
                }
                else
                {
                    info.Branches.Add(new Branch
                    {
                        Title = bDto.Title,
                        Phone1 = bDto.Phone1,
                        Phone2 = bDto.Phone2,
                        Whatsapp = bDto.Whatsapp,
                        Address = bDto.Address,
                        MapLink = bDto.MapLink
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(info);
        }

        [HttpPost]
        public async Task<IActionResult> Send([FromForm] ContactDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var message = new MimeMessage();

                // The sender must match your mailbox
                message.From.Add(new MailboxAddress("HAWK Contact Form", "info@hawkalahlia.com"));

                // The receiver is your HR/info inbox
                message.To.Add(new MailboxAddress("Info Department", "info@hawkalahlia.com"));

                // Subject
                message.Subject = $"New Contact Message - {dto.Subject}";

                // Body with sender info
                var builder = new BodyBuilder
                {
                    TextBody =
        $@"New contact message received

From: {dto.Name} ({dto.Email})

Subject: {dto.Subject}

Message:
{dto.Message}"
                };

                message.Body = builder.ToMessageBody();

                using var client = new SmtpClient();

                // Connect using your mail server and port - Assuming same config as CareerController
                await client.ConnectAsync("mail.hawkalahlia.com", 465, SecureSocketOptions.SslOnConnect);

                // Authenticate using your full email and password - Assuming same as CareerController
                await client.AuthenticateAsync("info@hawkalahlia.com", "Hawk90001448");

                // Send the email
                await client.SendAsync(message);

                // Disconnect safely
                await client.DisconnectAsync(true);

                return Ok(new { message = "Message sent successfully!" });
            }
            catch (Exception ex)
            {
                // Log exception if needed
                return StatusCode(500, new { message = "Error sending message", error = ex.Message });
            }
        }
    }
}

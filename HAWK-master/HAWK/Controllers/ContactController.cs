using HAWK.DTOs;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Mvc;
using MimeKit;

namespace HAWK.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ContactController : ControllerBase
    {
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

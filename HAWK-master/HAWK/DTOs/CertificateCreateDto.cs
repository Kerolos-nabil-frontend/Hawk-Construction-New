using System.ComponentModel.DataAnnotations;

namespace HAWK.DTOs
{
    public class CertificateCreateDto
    {
        [Required]
        public string title { get; set; }
        [Required]
        public string description { get; set; }
        public IFormFile? image { get; set; }
        public string? category { get; set; }
        public string? linkedProjectIds { get; set; }
        public string? linkedServiceIds { get; set; }
    }
}

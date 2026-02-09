using System.ComponentModel.DataAnnotations;

namespace HAWK.DTOs
{
    public class CertificateCreateDto
    {
        [Required]
        public string title { get; set; }
        [Required]
        public string description { get; set; }
        public string category { get; set; } = "certificate";
        [Required]
        public IFormFile image { get; set; }
    }
}

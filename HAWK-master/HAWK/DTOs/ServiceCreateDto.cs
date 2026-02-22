using System.ComponentModel.DataAnnotations;

namespace HAWK.DTOs
{
    public class ServiceCreateDto
    {
        [Required]
        public string title { get; set; }
        public string? description { get; set; }
        public IFormFile? image { get; set; }
        public string? linkedCertificate { get; set; }
        public string? linkedProjectIds { get; set; }
    }
}

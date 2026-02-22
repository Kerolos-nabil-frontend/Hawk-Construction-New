using System.ComponentModel.DataAnnotations;

namespace HAWK.DTOs
{
    public class ProjectCreateDto
    {
        [Required]
        public string title { get; set; }
        [Required]
        public string area { get; set; }
        [Required]
        public string scope { get; set; } // Will store the Service Name
        [Required]
        public string contractor { get; set; }
        public IFormFile? image { get; set; }
        public IFormFile? video { get; set; }

        public string? owner { get; set; }
        public string? category { get; set; }
        public string? linkedCertificate { get; set; }

        // Multiple Images (Gallery)
        public List<IFormFile>? images { get; set; }
    }
}

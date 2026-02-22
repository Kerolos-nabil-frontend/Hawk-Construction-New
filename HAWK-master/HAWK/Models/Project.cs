using System.ComponentModel.DataAnnotations;

namespace HAWK.Models
{
    public class Project
    {
        [Key]
        public int id { get; set; }
        [Required]
        public string title { get; set; }
        [Required]
        public string image { get; set; }
        [Required]
        public string area { get; set; }
        [Required]
        public string scope { get; set; } // Now used for Service Name
        [Required]
        public string contractor { get; set; }
        public string video { get; set; }
        
        // New fields
        public string? owner { get; set; }
        public string? category { get; set; }
        public string? linkedCertificate { get; set; }

        // Multiple Images
        public ICollection<ProjectImage> Images { get; set; } = new List<ProjectImage>();
    }
}

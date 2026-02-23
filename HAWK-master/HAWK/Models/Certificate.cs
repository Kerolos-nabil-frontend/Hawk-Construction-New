using System.ComponentModel.DataAnnotations;

namespace HAWK.Models
{
    public class Certificate
    {
        [Key]
        public int id { get; set; }
        [Required]
        public string title { get; set; }
        [Required]
        public string description { get; set; }
        [Required]
        public string image { get; set; }
        public string? category { get; set; } // 'certificate' or 'reference'

        // Multiple Images
        public ICollection<CertificateImage> Images { get; set; } = new List<CertificateImage>();

        // Linking
        public string? linkedProjectIds { get; set; } // Comma separated IDs
        public string? linkedServiceIds { get; set; } // Comma separated IDs
    }
}

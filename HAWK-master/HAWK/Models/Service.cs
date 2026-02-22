using System.ComponentModel.DataAnnotations;

namespace HAWK.Models
{
    public class Service
    {
        [Key]
        public int id { get; set; }
        [Required]
        public string title { get; set; }
        public string? description { get; set; }
        public string? image { get; set; }
        public string? linkedCertificate { get; set; }
        public string? linkedProjectIds { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace HAWK.Models
{
    public class Career
    {
        [Key]
        public int id { get; set; }
        
        [Required]
        public string title { get; set; }
        
        [Required]
        public string description { get; set; }
        
        [Required]
        public string type { get; set; } // Full-time, Part-time, etc.
        
        [Required]
        public string location { get; set; } // e.g. "Kuwait City"
        
        public bool isActive { get; set; } = true;
        
        public DateTime createdAt { get; set; } = DateTime.UtcNow;
    }
}

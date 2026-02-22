using System.ComponentModel.DataAnnotations;

namespace HAWK.DTOs
{
    public class CareerCreateDto
    {
        [Required]
        public string title { get; set; }
        
        [Required]
        public string description { get; set; }
        
        [Required]
        public string type { get; set; } 
        
        [Required]
        public string location { get; set; }

        public bool isActive { get; set; } = true;
    }
}

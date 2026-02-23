using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HAWK.Models
{
    public class CertificateImage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string image { get; set; }

        public int CertificateId { get; set; }

        [ForeignKey("CertificateId")]
        [JsonIgnore]
        public Certificate Certificate { get; set; }
    }
}

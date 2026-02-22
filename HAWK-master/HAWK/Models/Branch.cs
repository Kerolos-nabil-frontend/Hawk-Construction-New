namespace HAWK.Models
{
    public class Branch
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Phone1 { get; set; } = string.Empty;
        public string Phone2 { get; set; } = string.Empty;
        public string Whatsapp { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string MapLink { get; set; } = string.Empty;

        // Foreign key
        public int ContactInfoId { get; set; }
    }
}

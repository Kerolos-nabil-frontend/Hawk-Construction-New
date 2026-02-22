
namespace HAWK.DTOs
{
    public class ContactInfoDto
    {
        public string Email { get; set; } = string.Empty;
        
        // Kuwait Branch
        public string KuwaitPhone1 { get; set; } = string.Empty;
        public string KuwaitPhone2 { get; set; } = string.Empty;
        public string KuwaitWhatsapp { get; set; } = string.Empty;
        public string KuwaitAddress { get; set; } = string.Empty;
        public string KuwaitMapLink { get; set; } = string.Empty;

        // UAE Branch
        public string UaePhone { get; set; } = string.Empty;
        public string UaeAddress { get; set; } = string.Empty;
        public string UaeMapLink { get; set; } = string.Empty;

        public List<BranchDto> Branches { get; set; } = new List<BranchDto>();
    }
}

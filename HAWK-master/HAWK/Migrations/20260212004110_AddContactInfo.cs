using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HAWK.Migrations
{
    /// <inheritdoc />
    public partial class AddContactInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContactInfos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KuwaitPhone1 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KuwaitPhone2 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KuwaitWhatsapp = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KuwaitAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KuwaitMapLink = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UaePhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UaeAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UaeMapLink = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactInfos", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactInfos");
        }
    }
}

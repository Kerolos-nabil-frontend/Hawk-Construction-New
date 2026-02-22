using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HAWK.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProjectAndCertificates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "linkedCertificate",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "owner",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true);

            /*migrationBuilder.AddColumn<string>(
                name: "category",
                table: "Certificates",
                type: "nvarchar(max)",
                nullable: true);*/
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "linkedCertificate",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "owner",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "category",
                table: "Certificates");
        }
    }
}

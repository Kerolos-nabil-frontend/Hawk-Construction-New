using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HAWK.Migrations.CategoryFixV2
{
    /// <inheritdoc />
    public partial class AddLinkedProjectIdsToService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "linkedProjectIds",
                table: "Services",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "linkedProjectIds",
                table: "Services");
        }
    }
}

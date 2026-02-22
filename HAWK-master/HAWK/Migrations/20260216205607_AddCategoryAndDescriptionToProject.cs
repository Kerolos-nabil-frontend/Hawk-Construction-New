using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HAWK.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryAndDescriptionToProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "video",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            // migrationBuilder.AddColumn<string>(
            //     name: "category",
            //     table: "Projects",
            //     type: "nvarchar(max)",
            //     nullable: true);

            // migrationBuilder.AddColumn<string>(
            //     name: "description",
            //     table: "Projects",
            //     type: "nvarchar(max)",
            //     nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "category",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "description",
                table: "Projects");

            migrationBuilder.AlterColumn<string>(
                name: "video",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HAWK.Migrations.CategoryFixV2
{
    /// <inheritdoc />
    public partial class AddCategoryFieldToProjectModelV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.AddColumn<string>(
            //    name: "category",
            //    table: "Projects",
            //    type: "nvarchar(max)",
            //    nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "category",
                table: "Projects");
        }
    }
}

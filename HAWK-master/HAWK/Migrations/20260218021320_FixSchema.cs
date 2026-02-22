using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HAWK.Migrations
{
    /// <inheritdoc />
    public partial class FixSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.CreateTable(
            //     name: "Careers",
            //     columns: table => new
            //     {
            //         id = table.Column<int>(type: "int", nullable: false)
            //             .Annotation("SqlServer:Identity", "1, 1"),
            //         title = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         description = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         type = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         location = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         isActive = table.Column<bool>(type: "bit", nullable: false),
            //         createdAt = table.Column<DateTime>(type: "datetime2", nullable: false)
            //     },
            //     constraints: table =>
            //     {
            //         table.PrimaryKey("PK_Careers", x => x.id);
            //     });

            // migrationBuilder.CreateTable(
            //     name: "ContactInfos",
            //     columns: table => new
            //     {
            //         Id = table.Column<int>(type: "int", nullable: false)
            //             .Annotation("SqlServer:Identity", "1, 1"),
            //         Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         KuwaitPhone1 = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         KuwaitPhone2 = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         KuwaitWhatsapp = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         KuwaitAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         KuwaitMapLink = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         UaePhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         UaeAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         UaeMapLink = table.Column<string>(type: "nvarchar(max)", nullable: false)
            //     },
            //     constraints: table =>
            //     {
            //         table.PrimaryKey("PK_ContactInfos", x => x.Id);
            //     });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Careers");

            migrationBuilder.DropTable(
                name: "ContactInfos");
        }
    }
}

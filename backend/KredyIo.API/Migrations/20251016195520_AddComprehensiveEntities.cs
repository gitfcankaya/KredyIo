using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KredyIo.API.Migrations
{
    /// <inheritdoc />
    public partial class AddComprehensiveEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "LoanProducts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "MaxAge",
                table: "LoanProducts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinAge",
                table: "LoanProducts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "LoanProducts",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Purpose",
                table: "LoanProducts",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresCollateral",
                table: "LoanProducts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresGuarantor",
                table: "LoanProducts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "CustomerCount",
                table: "Banks",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Rating",
                table: "Banks",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "LoanProducts");

            migrationBuilder.DropColumn(
                name: "MaxAge",
                table: "LoanProducts");

            migrationBuilder.DropColumn(
                name: "MinAge",
                table: "LoanProducts");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "LoanProducts");

            migrationBuilder.DropColumn(
                name: "Purpose",
                table: "LoanProducts");

            migrationBuilder.DropColumn(
                name: "RequiresCollateral",
                table: "LoanProducts");

            migrationBuilder.DropColumn(
                name: "RequiresGuarantor",
                table: "LoanProducts");

            migrationBuilder.DropColumn(
                name: "CustomerCount",
                table: "Banks");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Banks");
        }
    }
}

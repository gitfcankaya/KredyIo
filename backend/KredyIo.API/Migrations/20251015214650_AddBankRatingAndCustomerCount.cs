using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KredyIo.API.Migrations
{
    /// <inheritdoc />
    public partial class AddBankRatingAndCustomerCount : Migration
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

            migrationBuilder.AddColumn<DateTime>(
                name: "CampaignEndDate",
                table: "DepositRates",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CampaignRate",
                table: "DepositRates",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "AnnualSpendRequirement",
                table: "CreditCardProducts",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BenefitsSummary",
                table: "CreditCardProducts",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CardCategory",
                table: "CreditCardProducts",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CardType",
                table: "CreditCardProducts",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasConcierge",
                table: "CreditCardProducts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasInsurance",
                table: "CreditCardProducts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsContactless",
                table: "CreditCardProducts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "CreditCardProducts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVirtual",
                table: "CreditCardProducts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "MaxCreditLimit",
                table: "CreditCardProducts",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxInstallments",
                table: "CreditCardProducts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MinCreditLimit",
                table: "CreditCardProducts",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "CreditCardProducts",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WelcomeBonusType",
                table: "CreditCardProducts",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TargetAudience",
                table: "Campaigns",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Terms",
                table: "Campaigns",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

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
                name: "CampaignEndDate",
                table: "DepositRates");

            migrationBuilder.DropColumn(
                name: "CampaignRate",
                table: "DepositRates");

            migrationBuilder.DropColumn(
                name: "AnnualSpendRequirement",
                table: "CreditCardProducts");

            migrationBuilder.DropColumn(
                name: "BenefitsSummary",
                table: "CreditCardProducts");

            migrationBuilder.DropColumn(
                name: "CardCategory",
                table: "CreditCardProducts");

            migrationBuilder.DropColumn(
                name: "CardType",
                table: "CreditCardProducts");

            migrationBuilder.DropColumn(
                name: "HasConcierge",
                table: "CreditCardProducts");

            migrationBuilder.DropColumn(
                name: "HasInsurance",
                table: "CreditCardProducts");

            migrationBuilder.DropColumn(
                name: "IsContactless",
                table: "CreditCardProducts");

            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "CreditCardProducts");

            migrationBuilder.DropColumn(
                name: "IsVirtual",
                table: "CreditCardProducts");

            migrationBuilder.DropColumn(
                name: "MaxCreditLimit",
                table: "CreditCardProducts");

            migrationBuilder.DropColumn(
                name: "MaxInstallments",
                table: "CreditCardProducts");

            migrationBuilder.DropColumn(
                name: "MinCreditLimit",
                table: "CreditCardProducts");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "CreditCardProducts");

            migrationBuilder.DropColumn(
                name: "WelcomeBonusType",
                table: "CreditCardProducts");

            migrationBuilder.DropColumn(
                name: "TargetAudience",
                table: "Campaigns");

            migrationBuilder.DropColumn(
                name: "Terms",
                table: "Campaigns");

            migrationBuilder.DropColumn(
                name: "CustomerCount",
                table: "Banks");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Banks");
        }
    }
}

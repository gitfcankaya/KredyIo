using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using KredyIo.API.Models.Enums;

namespace KredyIo.API.Models.Entities
{
    public class CreditCard
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        
        public int BankId { get; set; }
        
        public CreditCardType Type { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal AnnualFee { get; set; } // Yıllık aidat
        
        [Column(TypeName = "decimal(18,4)")]
        public decimal CashAdvanceRate { get; set; } // Nakit avans faizi %
        
        [Column(TypeName = "decimal(18,4)")]
        public decimal PurchaseRate { get; set; } // Alışveriş faizi %
        
        public int RewardPoints { get; set; } // 100 TL başına puan
        
        [MaxLength(500)]
        public string? ImageUrl { get; set; }
        
        [MaxLength(1000)]
        public string? Description { get; set; }
        
        [Column(TypeName = "TEXT")]
        public string? Benefits { get; set; } // JSON format - avantajlar
        
        [Column(TypeName = "TEXT")]
        public string? Features { get; set; } // JSON format - özellikler
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? MinimumIncome { get; set; } // Minimum gelir şartı
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
        
        // Navigation Properties
        [ForeignKey("BankId")]
        public virtual Bank Bank { get; set; } = null!;
    }
}
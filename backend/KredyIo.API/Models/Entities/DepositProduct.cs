using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using KredyIo.API.Models.Enums;

namespace KredyIo.API.Models.Entities
{
    public class DepositProduct
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        
        public int BankId { get; set; }
        
        public DepositType Type { get; set; }
        
        [Column(TypeName = "decimal(18,4)")]
        public decimal InterestRate { get; set; } // Yıllık faiz oranı %
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal MinimumAmount { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? MaximumAmount { get; set; }
        
        public int MinimumTerm { get; set; } // Gün cinsinden
        
        public int? MaximumTerm { get; set; } // Gün cinsinden
        
        [MaxLength(10)]
        public string Currency { get; set; } = "TRY";
        
        [MaxLength(1000)]
        public string? Description { get; set; }
        
        [MaxLength(2000)]
        public string? Features { get; set; } // JSON format - özellikler
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
        
        // Navigation Properties
        [ForeignKey("BankId")]
        public virtual Bank Bank { get; set; } = null!;
    }
}
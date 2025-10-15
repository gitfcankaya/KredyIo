using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using KredyIo.API.Models.Enums;

namespace KredyIo.API.Models.Entities
{
    public class InvestmentProduct
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string? Symbol { get; set; } // BIST kodu, döviz kodu vb.
        
        public InvestmentType Type { get; set; }
        
        [Column(TypeName = "decimal(18,4)")]
        public decimal CurrentPrice { get; set; }
        
        [Column(TypeName = "decimal(18,4)")]
        public decimal DailyChange { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal DailyChangePercent { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? Volume { get; set; }
        
        [Column(TypeName = "decimal(18,4)")]
        public decimal? HighPrice { get; set; } // Günlük en yüksek
        
        [Column(TypeName = "decimal(18,4)")]
        public decimal? LowPrice { get; set; } // Günlük en düşük
        
        [Column(TypeName = "decimal(18,4)")]
        public decimal? OpenPrice { get; set; } // Açılış fiyatı
        
        [MaxLength(10)]
        public string Currency { get; set; } = "TRY";
        
        [MaxLength(1000)]
        public string? Description { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? LastPriceUpdate { get; set; }
    }
}
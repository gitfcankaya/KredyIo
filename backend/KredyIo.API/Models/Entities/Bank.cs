using System.ComponentModel.DataAnnotations;

namespace KredyIo.API.Models.Entities
{
    public class Bank
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Code { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? LogoUrl { get; set; }

        [MaxLength(500)]
        public string? WebsiteUrl { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        public decimal? Rating { get; set; }

        public int? CustomerCount { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
        public virtual ICollection<DepositProduct> DepositProducts { get; set; } = new List<DepositProduct>();
        public virtual ICollection<CreditCard> CreditCards { get; set; } = new List<CreditCard>();
    }
}
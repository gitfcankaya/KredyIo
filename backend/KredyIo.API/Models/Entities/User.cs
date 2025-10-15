using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using KredyIo.API.Models.Enums;

namespace KredyIo.API.Models.Entities
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(500)]
        public string PasswordHash { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string? FirstName { get; set; }
        
        [MaxLength(100)]
        public string? LastName { get; set; }
        
        [MaxLength(20)]
        public string? PhoneNumber { get; set; }
        
        public DateTime? BirthDate { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? MonthlyIncome { get; set; }
        
        public UserRole Role { get; set; } = UserRole.User;
        
        public bool IsActive { get; set; } = true;
        
        public bool EmailVerified { get; set; } = false;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? LastLoginDate { get; set; }
        
        // Navigation Properties
        public virtual ICollection<UserFavorite> Favorites { get; set; } = new List<UserFavorite>();
        public virtual ICollection<UserComparison> Comparisons { get; set; } = new List<UserComparison>();
    }
}
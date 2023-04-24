using System.ComponentModel.DataAnnotations;

namespace SocialMedia_app.Models
{
    public class UserProfile
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public byte[] Password { get; set; }
        public byte[] PassworkKey { get; set; }
        public string? Country { get; set; }
        public string Avatar { get; set; } = $"/person/unknown.jpg";
        public DateTime? Date_of_birth { get; set; }
        public string? Given_name { get; set; }
        [Required]
        [MaxLength(20)]
        public string Surname { get; set; }
        public ICollection<PostLike> Likes { get; set; }
        public ICollection<UserPost> Posts { get; set; }
        public ICollection<PostComment> Comments { get; set; }
        public ICollection<Friendship> Friends { get; set; }
    }
}

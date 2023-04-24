using System.ComponentModel.DataAnnotations;

namespace SocialMedia_app.Models
{
    public class UserPost
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string WrittenText { get; set; }
        public string? MediaLocation { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public UserProfile User { get; set; }
        public ICollection<PostLike> Likes { get; set; }
        public ICollection<PostComment> Comments { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace SocialMedia_app.Models
{
    public class PostLike
    {
        [Key]
        public int Id { get; set; }

        public UserProfile User { get; set; }
        public UserPost Post { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
    }
}

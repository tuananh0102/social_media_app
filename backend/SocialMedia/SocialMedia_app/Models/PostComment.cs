using System.ComponentModel.DataAnnotations;

namespace SocialMedia_app.Models
{
    public class PostComment
    {
        [Key]
        public int Id { get; set; }

        public UserProfile User { get; set; }

        public UserPost Post { get; set; }
        [Required]
        [MaxLength(1000)]
        public string Comment { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
    }
}

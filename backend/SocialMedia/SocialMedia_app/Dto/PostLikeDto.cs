using SocialMedia_app.Models;

namespace SocialMedia_app.Dto
{
    public class PostLikeDto
    {
        
        public int UserId { get; set; }
        public string Email { get; set; }
        public string WrittenText { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}

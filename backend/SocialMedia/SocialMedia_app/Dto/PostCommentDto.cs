using SocialMedia_app.Models;
using System.ComponentModel.DataAnnotations;

namespace SocialMedia_app.Dto
{
    public class PostCommentDto
    {
        public int Id { get; set; }

        public string Comment { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
    }
}

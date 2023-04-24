using SocialMedia_app.Models;
using System.ComponentModel.DataAnnotations;

namespace SocialMedia_app.Dto
{
    public class UserPostDto
    {
        public int id { get; set; }
        public string writtenText { get; set; }
        public string mediaLocation { get; set; }
        public int userId { get; set; }
        public string surname { get; set; }
        public string given_name { get; set; }
        public string avatar { get; set; }

        public DateTime created { get; set; } = DateTime.Now;
    }
}

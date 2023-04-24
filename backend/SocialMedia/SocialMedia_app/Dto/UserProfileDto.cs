using System.ComponentModel.DataAnnotations;

namespace SocialMedia_app.Dto
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Avatar { get; set; } 
        public string Country { get; set; }
        public DateTime Date_of_birth { get; set; }
        public string Given_name { get; set; }
        public string Surname { get; set; }
    }
}

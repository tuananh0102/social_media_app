using System.ComponentModel.DataAnnotations;

namespace SocialMedia_app.Dto
{
    public class RegisterDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Country { get; set; }
        public DateTime? Date_of_birth { get; set; }
        public string? Given_name { get; set; }
        public string Surname { get; set; }
    }
}

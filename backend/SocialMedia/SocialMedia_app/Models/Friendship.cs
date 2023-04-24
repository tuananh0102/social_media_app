namespace SocialMedia_app.Models
{
    public class Friendship
    {
        public int ProfileRequestId { get; set; }
        public int ProfileAcceptId { get; set; }
        public bool StatusAccepted { get; set; } = false;
        public UserProfile User { get; set; }
    }
}

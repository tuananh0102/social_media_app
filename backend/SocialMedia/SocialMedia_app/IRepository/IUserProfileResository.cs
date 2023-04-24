using SocialMedia_app.Dto;
using SocialMedia_app.Models;

namespace SocialMedia_app.IRepository
{
    public interface IUserProfileResository
    {
        Task<UserProfile> Authenticate(string email, string password);
        ICollection<UserProfile> GetAllUserProfiles();
        ICollection<UserProfile> GetUserProfileBySurname(string surname);
        UserProfile GetUserProfileById(int id);
        bool UpdateAvatar(int id, string location);
        bool Register(RegisterDto registerDto);
        bool DeleteUserProfile(int id);
        bool IsUserProfileExist(int id);
        bool IsEmailExist(string email);
        bool Save();
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SocialMedia_app.DBContext;
using SocialMedia_app.Dto;
using SocialMedia_app.IRepository;
using SocialMedia_app.Models;
using System.Security.Cryptography;

namespace SocialMedia_app.Repository
{
    public class UserProfileRepository : IUserProfileResository
    {
        private readonly DataContext _context;

        public UserProfileRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<UserProfile> Authenticate(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if(user == null)
            {
                return null;
            }
            if (!MatchPasswordHash(password, user.Password, user.PassworkKey))
            {
                return null;
            }
            return user;
        }

        private bool MatchPasswordHash(string passwordText, byte[] password, byte[] passwordKey)
        {

            using (var hmac = new HMACSHA512(passwordKey))
            {
                var passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(passwordText));
                for(int i = 0; i< passwordHash.Length; i++)
                {
                    if (passwordHash[i] != password[i])
                    {
                        return false;
                    }
                }

                return true;
            }
        }

        public bool Register(RegisterDto registerDto)
        {
            if(IsEmailExist(registerDto.Email))
            {
                return false;
            }

            byte[] passwordHash, passwordKey;
            using (var hmac = new HMACSHA512())
            {
                passwordKey = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDto.Password));
            }

            UserProfile user = new UserProfile
            {
                Email = registerDto.Email,
                Password = passwordHash,
                PassworkKey = passwordKey,
                Surname = registerDto.Surname,
                Date_of_birth = registerDto.Date_of_birth,
                Country = registerDto.Country,
            };

            _context.Users.Add(user);
            return Save();
        }

        public bool DeleteUserProfile(int id)
        {
            var user = _context.Users.Where(u => u.Id == id).FirstOrDefault();
            _context.Users.Remove(user);
            return Save();
        }

        public ICollection<UserProfile> GetAllUserProfiles()
        {
            var users = _context.Users.ToList();
            return users;
        }

        public UserProfile GetUserProfileById(int id)
        {
            return _context.Users.Where(u => u.Id == id).FirstOrDefault();
        }

        public ICollection<UserProfile> GetUserProfileBySurname(string surname)
        {
            return _context.Users.Where(u => u.Surname.StartsWith(surname)).ToList();
        }

        public bool IsEmailExist(string email)
        {
            return _context.Users.Any(u => u.Email == email);
        }

        public bool IsUserProfileExist(int id)
        {
            return _context.Users.Any(u => u.Id == id);
        }

        

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public bool UpdateAvatar(int id, string location)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return false;
            }
            user.Avatar = location;
            return Save();
        }
    }
}

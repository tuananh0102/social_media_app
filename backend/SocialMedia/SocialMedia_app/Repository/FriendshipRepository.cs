using Microsoft.EntityFrameworkCore;
using SocialMedia_app.DBContext;
using SocialMedia_app.IRepository;
using SocialMedia_app.Models;
using System.Numerics;

namespace SocialMedia_app.Repository
{
    public class FriendshipRepository : IFriendshipRepository
    {
        private readonly DataContext _context;

        public FriendshipRepository(DataContext context)
        {
            _context = context;
        }
        public bool AcceptRequestAddFriend(int requestId, int acceptId)
        {
            var friendship = _context.Friendships.FirstOrDefault(f =>
            f.ProfileRequestId == requestId && f.ProfileAcceptId == acceptId);
            if (friendship == null)
            {
                return false;
            }
            friendship.StatusAccepted = true;

            return Save();
            
        }

        public bool CreateRequestAddFriend(int requestId, int acceptId)
        {
            if (IsFriendshipExist(requestId, acceptId))
            {
                return false;
            }
            var isExist = _context.Users.Any(u => u.Id == acceptId);
            if (!isExist) return false;
            var friendship = new Friendship { ProfileRequestId = requestId, ProfileAcceptId = acceptId };
            var user = _context.Users.FirstOrDefault(u => u.Id == requestId);
            friendship.User = user;
            _context.Add(friendship);
            return Save();
        }

        public bool DeleteFriendship(int userId1, int userId2)
        {
            var friendship = _context.Friendships
                .Where(f => (f.ProfileRequestId == userId1 && f.ProfileAcceptId == userId2)
            || (f.ProfileRequestId == userId2 && f.ProfileAcceptId == userId1)).FirstOrDefault();

            if (friendship == null)
            {
                return false;
            }
            _context.Remove(friendship);
            return Save();
        }

        public ICollection<UserProfile> GetFriendsByUser(int userId)
        {
            var friendIds = _context.Friendships
                .Where(f => f.StatusAccepted == true)
                .Where(f => f.ProfileRequestId == userId || f.ProfileAcceptId == userId)
                .Select(f => f.ProfileRequestId == userId? f.ProfileAcceptId: f.ProfileRequestId)
                .ToList();
            ICollection<UserProfile> friends = new List<UserProfile>();
            foreach(var friendId in friendIds)
            {
                var friend = _context.Users.FirstOrDefault(u => u.Id ==  friendId);
                friends.Add(friend);
            }

            return friends;
        }

        public ICollection<Friendship> GetFriendships()
        {
            return _context.Friendships.ToList();
        }

        public ICollection<Friendship> GetFriendshipsNotAccept(int userId)
        {
            var requestAddFriends = _context.Friendships.Where(f => f.ProfileAcceptId == userId).Include(f => f.User)
                .Where(f => f.StatusAccepted != true).ToList();

            return requestAddFriends;
        }

        public bool IsFriend(int userId1, int userId2)
        {
            return _context.Friendships.Any(f =>
           ((f.ProfileRequestId == userId1 && f.ProfileAcceptId == userId2)
           || (f.ProfileRequestId == userId2 && f.ProfileAcceptId == userId1)) && f.StatusAccepted == true);
        }

        public bool IsFriendshipExist(int userId1, int userId2)
        {
            return _context.Friendships.Any(f => 
            (f.ProfileRequestId == userId1 && f.ProfileAcceptId == userId2) 
            ||  (f.ProfileRequestId == userId2 && f.ProfileAcceptId == userId1));
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}

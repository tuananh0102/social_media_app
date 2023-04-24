using SocialMedia_app.Models;

namespace SocialMedia_app.IRepository
{
    public interface IFriendshipRepository
    {
        ICollection<UserProfile> GetFriendsByUser(int userId);
        ICollection<Friendship> GetFriendships();
        ICollection<Friendship> GetFriendshipsNotAccept(int userId);
        bool CreateRequestAddFriend(int requestId, int responseId);
        bool AcceptRequestAddFriend(int requestId, int responseId);
        bool DeleteFriendship(int userId1, int userId2);
        bool IsFriendshipExist(int userId1, int userId2);
        bool IsFriend(int userId1, int userId2);

        bool Save();
    }
}

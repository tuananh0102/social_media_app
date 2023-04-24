using SocialMedia_app.Models;

namespace SocialMedia_app.IRepository
{
    public interface IUserPostRespository
    {
        bool CreateUserPost(UserPost userPost, int userId);
        ICollection<UserPost> GetUserPosts();
        ICollection<UserPost> GetUserPostsByUser(int userId);
        UserPost GetUserPostById(int postId);
        bool UpdateUserPost(int userId,UserPost userPost);
        bool DeleteUserPost(int userId,int postId);
        bool IsUserPostExisted(int postId);
        bool Save();
    }
}

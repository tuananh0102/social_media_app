using SocialMedia_app.Models;

namespace SocialMedia_app.IRepository
{
    public interface IPostLikeRepository
    {
        ICollection<PostLike> GetAllPostLikes();
        ICollection<PostLike> GetPostLikesByPost(int postId);
        bool CreatePostLike(int userId, int  postId, PostLike postLike);
        bool DeletePostLike(int userId, int postId);
        bool IsPostLikeExisted(int userId, int postId);
        bool Save();
    }
}

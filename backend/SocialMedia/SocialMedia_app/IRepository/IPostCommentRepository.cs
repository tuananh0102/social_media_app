using SocialMedia_app.Models;

namespace SocialMedia_app.IRepository
{
    public interface IPostCommentRepository
    {
        ICollection<PostComment> GetAllPostComments();
        ICollection<PostComment> GetPostCommentByPost(int  postId);
        ICollection<PostComment> GetPostCommentByUserPost(int userId, int postId);
        bool CreatePostComment(int userId, int postId, PostComment postCommentt);
        bool UpdatePostComment(PostComment postComment);
        bool DeletePostComment(int postCommentId);
        bool IsPostCommentExist(int postCommentId);
        bool Save();
    }
}

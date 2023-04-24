using Microsoft.EntityFrameworkCore;
using SocialMedia_app.DBContext;
using SocialMedia_app.IRepository;
using SocialMedia_app.Models;

namespace SocialMedia_app.Repository
{
    public class PostCommentRepository : IPostCommentRepository
    {
        private readonly DataContext _context;

        public PostCommentRepository(DataContext context)
        {
            _context = context;
        }
        public bool CreatePostComment(int userId, int postId, PostComment postComment)
        {
            var user = _context.Users.Where(u => u.Id == userId).FirstOrDefault();
            if (user == null)
            {
                return false;
            }
            var post = _context.Posts.FirstOrDefault(u => u.Id == postId);
            if (post == null)
            {
                return false;
            }
            postComment.User = user;
            postComment.Post = post;
            _context.Add(postComment);
            return Save();
        }

        public bool DeletePostComment(int postCommentId)
        {
            var comment = _context.PostComments
                .FirstOrDefault(p => p.Id == postCommentId);
            if (comment == null)
            {
                return false;
            }
            _context.Remove(comment);
            return Save();
        }

        public ICollection<PostComment> GetAllPostComments()
        {
            var comments = _context.PostComments.Include(p => p.User).Include(p => p.Post).ToList();
            return comments;
        }

        public ICollection<PostComment> GetPostCommentByPost(int postId)
        {

            var comments = _context.PostComments.Include(p => p.User).Include(p => p.Post)
                .Where(p => p.Post.Id == postId).ToList();
            
            return comments;
        }

        public ICollection<PostComment> GetPostCommentByUserPost(int userId, int postId)
        {
            var comments = _context.PostComments
                .Include(p => p.User).Include(p => p.Post)
                .Where(p => p.User.Id == userId && p.Post.Id == postId)
                .ToList();
            return comments;
        }

        public bool IsPostCommentExist(int postCommentId)
        {
            return _context.PostComments.Any(p => p.Id == postCommentId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }


        public bool UpdatePostComment(PostComment postComment)
        {
            _context.Update(postComment);
            return Save();
        }
    }
}

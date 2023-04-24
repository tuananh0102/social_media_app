using Microsoft.EntityFrameworkCore;
using SocialMedia_app.DBContext;
using SocialMedia_app.IRepository;
using SocialMedia_app.Models;

namespace SocialMedia_app.Repository
{
    // duplicate get user
    public class UserPostRepository : IUserPostRespository
    {
        private readonly DataContext _context;

        public UserPostRepository(DataContext context)
        {
            _context = context;
        }
        public bool CreateUserPost(UserPost userPost, int userId)
        {
            var user = _context.Users.FirstOrDefault(x => x.Id == userId);
            userPost.User = user;
            _context.Posts.Add(userPost); // why when swap with under line occur fail
            user.Posts.Add(userPost);
            return Save();
        }


        public bool DeleteUserPost(int userId,int postId)
        {
            var user = _context.Users.FirstOrDefault(x => x.Id == userId);
            if(user != null)
            {
                var post = _context.Posts.FirstOrDefault(x => x.Id == postId);
                //user.Posts.Remove(post);
                _context.Remove(post);
            }
            return Save();
        }

        public UserPost GetUserPostById(int postId)
        {
            var post = _context.Posts.Include(p => p.User).FirstOrDefault(p => p.Id == postId);
            return post;
        }

        public ICollection<UserPost> GetUserPosts()
        {
            var posts = _context.Posts.Include(p =>  p.User).ToList();
            return posts;
        }

        public ICollection<UserPost> GetUserPostsByUser(int userId)
        {
            var user = _context.Users.Any(u => u.Id ==  userId);
            if (!user) return null;
            var posts = _context.Posts.Where(p => p.User.Id == userId).Include(p => p.User).ToList();
            return posts;
        }

        public bool IsUserPostExisted(int postId)
        {
            return _context.Posts.Any(p => p.Id == postId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public bool UpdateUserPost(int userId ,UserPost userPost)
        {
            
            _context.Posts.Update(userPost);
            return Save();
        }
    }
}

using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using SocialMedia_app.DBContext;
using SocialMedia_app.IRepository;
using SocialMedia_app.Models;
using System.Text.Json.Serialization;
using System.Text.Json;
using SocialMedia_app.Dto;

namespace SocialMedia_app.Repository
    // Duplicate get user
{
    public class PostLikeRepository : IPostLikeRepository
    {
        private readonly DataContext _context;

        public PostLikeRepository(DataContext context)
        {
            _context = context;
        }
        public bool CreatePostLike(int userId, int postId, PostLike postLike)
        {
            if(IsPostLikeExisted(userId, postId))
            {
                return false;
            }
            var user = _context.Users.Where(u => u.Id == userId).FirstOrDefault();
            if (user == null)
            {
                return false;
            }
            var post = _context.Posts.Where(p => p.Id == postId).FirstOrDefault();
            if (post == null)
            {
                return false;
            }
            postLike.User = user;
            postLike.Post = post;
            _context.Add(postLike);
            return Save();
        }

        public bool DeletePostLike(int userId, int postId)
        {
            
            var postLike = _context.PostLikes
                .Where(p => p.User.Id == userId && p.Post.Id == postId)
                .FirstOrDefault();
            if (postLike == null)
            {
                return false;
            }
            _context.Remove(postLike);
            return Save();
        }

        public ICollection<PostLike> GetAllPostLikes()
        {
           var postLikes = _context.PostLikes.Include(p => p.User)
                .Include(p => p.Post)
                .ToList();
            return postLikes;
        }

        public ICollection<PostLike> GetPostLikesByPost(int postId)
        {
            var postLikes = _context.PostLikes.Where(p => p.Post.Id == postId)
                .Include(p => p.User)
                .ToList();

            return postLikes;
        }

        public bool IsPostLikeExisted(int userId, int postId)
        {
            return _context.PostLikes.Any(p => p.User.Id == userId && p.Post.Id == postId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SocialMedia_app.Dto;
using SocialMedia_app.IRepository;
using SocialMedia_app.Models;

namespace SocialMedia_app.Controllers
{
    [Route("api")]
    [ApiController]
    public class PostLikeController : BaseController
    {
        private readonly IPostLikeRepository _postLikeRepository;
        private readonly IMapper _mapper;

        public PostLikeController(IPostLikeRepository postLikeRepository, IMapper mapper)
        {
            _postLikeRepository = postLikeRepository;
            _mapper = mapper;
        }

        [HttpGet("postlikes")]
        public IActionResult GetAllPostLikes()
        {
            var postLikes = _postLikeRepository.GetAllPostLikes()
                .Select(p => new PostLikeDto
                {
                    UserId = p.User.Id,
                    Email = p.User.Email,
                    WrittenText = p.Post.WrittenText,
                    CreatedAt = p.Created
                }).ToList();
                
            
            return Ok(postLikes);
        }

        [HttpGet("post/{postId}/postlikes")]
        public IActionResult GetPostLikesByPost(int postId)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);
            var postLikes = _postLikeRepository.GetPostLikesByPost(postId)
                .Select(p => new { p.User.Id,p.User.Surname, p.Created }).ToList();

            return Ok(postLikes);
        }

        [HttpPost("post/{postId}postlike")]
        public IActionResult CreatePostLike(int postId)
        {
            
           
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            int userId = getCurrentUserId();
            if (userId == -1)
                return BadRequest("user id claim not found in token");
            var success = _postLikeRepository.CreatePostLike(userId, postId, new PostLike());
            if (!success) return StatusCode(404, "Invalid");
            return Ok("Created postlike successfull");
        }

        [HttpDelete("post/{postId}/postlike")]
        public IActionResult DeletePostLike(int postId)
        {
            int userId = getCurrentUserId();
            if (userId == -1)
                return BadRequest("user id claim not found in token");
            var success = _postLikeRepository.DeletePostLike(userId, postId);

            if (!success) return StatusCode(404, "invalid");
            return Ok("Delete like successfully");
        }
    }
}

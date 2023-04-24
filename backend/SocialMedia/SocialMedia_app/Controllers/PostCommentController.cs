using AutoMapper;
using AutoMapper.Configuration.Conventions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMedia_app.Dto;
using SocialMedia_app.IRepository;
using SocialMedia_app.Models;
using SocialMedia_app.Repository;

namespace SocialMedia_app.Controllers
{
    [Route("api")]
    [ApiController]
    [Authorize]
    public class PostCommentController : BaseController
    {
        private readonly IPostCommentRepository _postCommentRepository;
        private readonly IMapper _mapper;

        public PostCommentController(IPostCommentRepository postCommentRepository, IMapper mapper)
        {
            _postCommentRepository = postCommentRepository;
            _mapper = mapper;
        }

        [HttpGet("comments")]
        public IActionResult GetAllComments()
        {
            var comments = _postCommentRepository.GetAllPostComments()
                .Select(p => new
                {
                    id = p.Id,
                    userId = p.User.Id, 
                    user = p.User.Surname, 
                    comment = p.Comment, 
                    created = p.Created, 
                    postId = p.Post.Id
                });
            return Ok(comments);
        }

        [HttpGet("comments/post")]
        public IActionResult GetCommentByPost(int postId)
        {
            var comments = _postCommentRepository.GetPostCommentByPost(postId)
                .Select(p => new
                {
                    userId = p.User.Id,
                    surname = p.User.Surname,
                    given_name = p.User.Given_name,
                    avatar = $"{Environment.GetEnvironmentVariable("ASPNETCORE_BASE_URL")}/Assets{p.User.Avatar}",
                    comment = p.Comment,
                    created = p.Created,
                    postId = p.Post.Id
                }).OrderByDescending(p => p.created); 
            return Ok(comments);
        }

        [HttpGet("comments/post/{postId}")]
        public IActionResult GetCommentByUserPost(int postId) 
        {
            int userId = getCurrentUserId();
            if (userId == -1)
                return BadRequest("user id claim not found in token");
            var comments = _postCommentRepository.GetPostCommentByUserPost(userId, postId)
                .Select(p => new
                {
                    userId = p.User.Id,
                    surname = p.User.Surname,
                    given_name = p.User.Given_name,
                    avatar = $"{Environment.GetEnvironmentVariable("ASPNETCORE_BASE_URL")}/Assets{p.User.Avatar}",
                    comment = p.Comment,
                    created = p.Created,
                    postId = p.Post.Id
                });
            return Ok(comments);
        }

        [HttpPost("comment/post/{postId}")]
        public IActionResult CreatePostComment(int postId, [FromBody] PostCommentDto postCommentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            int userId = getCurrentUserId();
            if (userId == -1)
                return BadRequest("user id claim not found in token");
            var mapperComment = _mapper.Map<PostComment>(postCommentDto);
            var success = _postCommentRepository.CreatePostComment(userId, postId, mapperComment);
            if (!success) return StatusCode(404, "Create fail");
            return Ok("Create successfully");
        }

        [HttpPatch("post/{postId}/comment/{commentId}")]
        public IActionResult UpdateComment(int postId, int commentId,[FromBody] PostCommentDto postCommentDto)
        {
            if (postCommentDto == null) return BadRequest();
            if (!_postCommentRepository.IsPostCommentExist(postId))
                return NotFound();
            int userId = getCurrentUserId();
            if (userId == -1)
                return BadRequest("user id claim not found in token");
            postCommentDto.Id = commentId;
            var mapperPost = _mapper.Map<PostComment>(postCommentDto);
            _postCommentRepository.UpdatePostComment(mapperPost);
            if (!ModelState.IsValid)
                return BadRequest();
            return Ok("Update comment successfully");
        }

        [HttpDelete("comment/{id}")]
        public IActionResult DeleteComment(int id)
        {
            if(!_postCommentRepository.IsPostCommentExist(id)) return NotFound();
            int userId = getCurrentUserId();
            if (userId == -1)
                return BadRequest("user id claim not found in token");
            var success = _postCommentRepository.DeletePostComment(id);
            if(!success) return BadRequest();
            return Ok("Delete comment successfully");
        }
    }
}

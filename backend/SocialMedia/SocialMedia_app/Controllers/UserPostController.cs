
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMedia_app.Dto;
using SocialMedia_app.IRepository;
using SocialMedia_app.Models;
using System.Security.Claims;

namespace SocialMedia_app.Controllers
{
    public class UserPostController : BaseController
    {
        private readonly IUserPostRespository _userPostRespository;
        private readonly IMapper _mapper;
        private readonly IFileRepository _fileRepository;


        //private int getCurrentUserId()
        //{
        //    var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
        //    if (userIdClaim == null)
        //        return -1;
        //    int userId = Int32.Parse(userIdClaim.Value);
        //    return userId;
        //}

        public UserPostController(IUserPostRespository userPostRespository, IMapper mapper, IFileRepository fileRepository)
        {
            _userPostRespository = userPostRespository;
            _mapper = mapper;
            _fileRepository = fileRepository;
        }

        [HttpGet("allPosts")]
        [Authorize]
        public IActionResult GetAllPosts()
        {
            var a = Environment.GetEnvironmentVariable("ASPNETCORE_BASE_URL");
            var posts = _userPostRespository.GetUserPosts().Select(p => new UserPostDto
            {
                id = p.Id,
                writtenText = p.WrittenText,
                mediaLocation = $"{Environment.GetEnvironmentVariable("ASPNETCORE_BASE_URL")}/Assets{p.MediaLocation}",
                created = p.Created,
                userId = p.User.Id,
                surname = p.User.Surname,
                given_name = p.User.Given_name,
                avatar = $"{Environment.GetEnvironmentVariable("ASPNETCORE_BASE_URL")}/Assets{p.User.Avatar}",
            }).OrderBy(p => p.created);
            return Ok(posts);
        }

        [HttpGet("post/{id}")]
        public IActionResult GetPostById(int id) 
        { 
            if(!_userPostRespository.IsUserPostExisted(id))
            {
                return NotFound();
            }
            var p = _userPostRespository.GetUserPostById(id);
            
            if (p == null)
            {
                return NotFound();
            }
            var resPost = new UserPostDto
            {
                id = p.Id,
                writtenText = p.WrittenText,
                mediaLocation = $"{Environment.GetEnvironmentVariable("ASPNETCORE_BASE_URL")}/Assets{p.MediaLocation}",
                created = p.Created,
                userId = p.User.Id,
                surname = p.User.Surname,
                given_name = p.User.Given_name,
                avatar = $"{Environment.GetEnvironmentVariable("ASPNETCORE_BASE_URL")}/Assets{p.User.Avatar}",
            };
            return Ok(resPost);
        }

        [HttpGet("user/{userId}/posts")]
        [Authorize]
        public IActionResult GetPostsByUser(int userId)
        {
            
            if (userId <= 0)
                return BadRequest("user id claim not found in token");
            var posts = _userPostRespository.GetUserPostsByUser(userId);
            if (posts == null)
                return BadRequest();
            var resPosts = posts.Select(p => new UserPostDto
            {
                id = p.Id,
                writtenText = p.WrittenText,
                mediaLocation = $"{Environment.GetEnvironmentVariable("ASPNETCORE_BASE_URL")}/Assets{p.MediaLocation}",
                created = p.Created,
                userId = p.User.Id,
                surname = p.User.Surname,
                given_name = p.User.Given_name,
                avatar = $"{Environment.GetEnvironmentVariable("ASPNETCORE_BASE_URL")}/Assets{p.User.Avatar}",
            }).OrderBy(p => p.created);

            return Ok(resPosts);
        }

        [HttpPost("post")]
        [Authorize]

        public IActionResult CreatePost([FromForm] PostUploadDto postUploadDto, [FromForm] FileModel avatar)
        {
            if(postUploadDto == null)
                return BadRequest();
            int userId = getCurrentUserId();
            if (userId == -1)
                return BadRequest("user id claim not found in token");

            var mapperUserPost = _mapper.Map<UserPost>(postUploadDto);

            mapperUserPost.MediaLocation = _fileRepository.Upload(avatar, "post");

            var success = _userPostRespository.CreateUserPost(mapperUserPost, userId);
            if(!success) return BadRequest();
            if(!ModelState.IsValid)
                return BadRequest();
            return Ok("Create post successfully");
        }

        [HttpDelete("post/{postId}")]
        public IActionResult DeletePost(int postId) 
        {
            if(!_userPostRespository.IsUserPostExisted(postId))
            {
                return NotFound();
            }
            int userId = getCurrentUserId();
            if (userId == -1)
                return BadRequest("user id claim not found in token");
            _userPostRespository.DeleteUserPost(userId, postId);
            return Ok("Delete post successfully");
        }

        [HttpPatch("post/{postId}")]
        public IActionResult UpdatePost(int postId,[FromBody] UserPostDto userPostDto)
        {
            if(userPostDto == null) return BadRequest();
            if (!_userPostRespository.IsUserPostExisted(postId))
                return NotFound();
            int userId = getCurrentUserId();
            if (userId == -1)
                return BadRequest("user id claim not found in token");

            userPostDto.id = postId;
            var mapperPost = _mapper.Map<UserPost>(userPostDto);
            _userPostRespository.UpdateUserPost(userId , mapperPost);
            if(!ModelState.IsValid)
                return BadRequest();
            return Ok("Update post successfully");
        }
    }
}

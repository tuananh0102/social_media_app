using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SocialMedia_app.Dto;
using SocialMedia_app.IRepository;
using SocialMedia_app.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace SocialMedia_app.Controllers
{
    [Route("api")]
    [ApiController]
    [Authorize]
    public class UserController : Controller
    {
        private readonly IUserProfileResository _userProfileResository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IFileRepository _fileRepository;

        public UserController(IUserProfileResository userProfileResository, IMapper mapper, IConfiguration configuration, IFileRepository fileRepository)
        {
            _userProfileResository = userProfileResository;
            _mapper = mapper;
            _configuration = configuration;
            _fileRepository = fileRepository;
        }

        //[HttpGet("users")]
        //public IActionResult GetAllUsers()
        //{
        //    var users = _userProfileResository.GetAllUserProfiles();
        //    var mapperUsers = _mapper.Map<List<UserProfileDto>>(users);
        //    if (users == null)
        //    {
        //        return BadRequest();
        //    }
        //    return Ok(mapperUsers);
        //}
        [HttpGet("users")]
        public IActionResult GetUsers(string? name)
        {

            var users = _userProfileResository.GetAllUserProfiles()
                .Where(user => user.Surname.StartsWith(name == null ? "" : name)).ToList();
            if (users == null)
                return BadRequest();
            var mapperUsers = _mapper.Map<List<UserProfileDto>>(users);
            foreach(var user in mapperUsers)
            {

                user.Avatar = $"{Environment.GetEnvironmentVariable("ASPNETCORE_BASE_URL")}/Assets{user.Avatar}";
            }
            return Ok(mapperUsers);
        }

        [HttpGet("currentUser")]
        public IActionResult GetCurrentUser() 
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if(userIdClaim == null)
            {
                return BadRequest();
            }
            int id = Int32.Parse(userIdClaim.Value);
            var user = _userProfileResository.GetUserProfileById(id);
            if (user == null) return NotFound();
            return Ok(user);

        }


        [HttpGet("user/{id}")]
        [AllowAnonymous]
        public IActionResult GetUserById(int id)
        {
            if(!_userProfileResository.IsUserProfileExist(id))
            {
                return BadRequest();
            }
            var user = _userProfileResository.GetUserProfileById(id);
            var mapperUser = _mapper.Map<UserProfileDto>(user);
            mapperUser.Avatar = $"{Environment.GetEnvironmentVariable("ASPNETCORE_BASE_URL")}/Assets{mapperUser.Avatar}";
            if (user == null)
                return BadRequest();
            return Ok(mapperUser);
        }


        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]RegisterDto userDto)
        {
            if(userDto == null)
                return BadRequest(); 
            
            if(!ModelState.IsValid) return BadRequest();
            if(!_userProfileResository.Register(userDto))
                return BadRequest();
            var user = await _userProfileResository.Authenticate(userDto.Email, userDto.Password);
            if(user == null) return NotFound();
            var loginReq = new LoginResDto
            {
                Id = user.Id,
                Email = userDto.Email,
                Token = CreateJwt(user)
            };
            return Ok(loginReq);

        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginReqDto loginReq)
        {
            var user = await _userProfileResository.Authenticate(loginReq.Email, loginReq.Password);
            if (user == null) return Unauthorized();
            var loginRes = new LoginResDto
            {
                Id = user.Id,
                Email = loginReq.Email,
                Token = CreateJwt(user)
            };
            return Ok(loginRes);
        }

        private string CreateJwt(UserProfile user)
        {
            var secretKey = Environment.GetEnvironmentVariable("ASPNETCORE_AppSettings__Key");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var claims = new Claim[]
            {
                new Claim(ClaimTypes.Name, user.Surname),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var signingCredentials = new SigningCredentials(
                key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(100),
                SigningCredentials = signingCredentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescription);
            return tokenHandler.WriteToken(token);
        }

        [HttpDelete("user/{id}")]
        public IActionResult DeleteUser(int id)
        {
            if (!_userProfileResository.IsUserProfileExist(id))
                return NotFound();
            _userProfileResository.DeleteUserProfile(id);
            if(!ModelState.IsValid)
                return BadRequest();
            return Ok("Delete user successfully");
        }

        //[HttpPost("user/upload")]
        //[AllowAnonymous]
        //public IActionResult Upload([FromForm] FileModel file)
        //{
        //    string path =_fileRepository.Upload(file, "person");
        //    return Ok(path);
        //}

        [HttpPatch("user/avatar")]
        public IActionResult ChangeAvatar([FromForm] FileModel file)
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return BadRequest();
            int userId = Int32.Parse(userIdClaim.Value);
            if (userId == -1)
                return BadRequest("user id claim not found in token");
            string location = _fileRepository.Upload(file, "person");
            bool success = _userProfileResository.UpdateAvatar(userId, location);
            if (!success) return BadRequest();
            return Ok("Update successfully");

        }
    }
}

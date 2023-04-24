using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMedia_app.Dto;
using SocialMedia_app.IRepository;

namespace SocialMedia_app.Controllers
{
    [Route("api")]
    [ApiController]
    [Authorize]
    public class FriendshipController : BaseController
    {
        private readonly IFriendshipRepository _friendshipRepository;
        private readonly IMapper _mapper;

        public FriendshipController(IFriendshipRepository friendshipRepository, IMapper mapper)
        {
            _friendshipRepository = friendshipRepository;
            _mapper = mapper;
        }

        [HttpGet("friendships")]
        [AllowAnonymous]
        public IActionResult GetFriendships()
        {
            var friendships = _friendshipRepository.GetFriendships();
            return Ok(friendships);
        }

        [HttpGet("friends/{userId}")]

        public IActionResult GetFriendsByUser(int userId)
        {
            
            if (userId <= 0)
                return BadRequest("user id claim not found in token");
            var friends = _friendshipRepository.GetFriendsByUser(userId);
            
            var mapperFriends = _mapper.Map<List<UserProfileDto>>(friends);
            foreach(var friend in mapperFriends)
            {
                friend.Avatar = $"{Environment.GetEnvironmentVariable("ASPNETCORE_BASE_URL")}/Assets{friend.Avatar}";
            }
                
            return Ok(mapperFriends);
        }

        [HttpGet("friendship/request")]
        public IActionResult GetRequestAddFriend(int userId)
        {
            if (userId <= 0) return BadRequest();
            var requests = _friendshipRepository.GetFriendshipsNotAccept(userId).Select(f => new
            {
                surname = f.User.Surname,
                given_name = f.User.Given_name,
                avatar = $"{Environment.GetEnvironmentVariable("ASPNETCORE_BASE_URL")}/Assets{f.User.Avatar}",
                requestId = f.ProfileRequestId,
                acceptId = f.ProfileAcceptId,
                status = f.StatusAccepted
            });

            return Ok(requests);
        }

        [HttpGet("isfriend")]
        public IActionResult GetIsFriend(int requestId)
        {
            int acceptId = getCurrentUserId();
            if (requestId == -1)
                return BadRequest("user id claim not found in token");

            var isFriend = _friendshipRepository.IsFriend(acceptId, requestId);
            return Ok(isFriend);
        }

        [HttpPost("addfriend/{acceptId}")]

        public IActionResult CreateRequestAddFriend( int acceptId)
        {
            int requestId = getCurrentUserId();
            if (requestId == -1)
                return BadRequest("user id claim not found in token");
            var success = _friendshipRepository.CreateRequestAddFriend(requestId, acceptId);
            if(!success)
            {
                return NotFound();
            }
            return Ok("Send request Add friend successfully");
        }

        [HttpPost("acceptfriend/{requestId}")]

        public IActionResult AcceptRequestAddFriend(int requestId)
        {
            int acceptId = getCurrentUserId();
            if (acceptId == -1)
                return BadRequest("user id claim not found in token");
            var success = _friendshipRepository.AcceptRequestAddFriend(requestId, acceptId);
            if(!success )
            {
                return NotFound();
            }
            return Ok("Accept successfully");
        }

        [HttpDelete("friendship")]

        public IActionResult DeleteFriend(int userId1) 
        {
            int userId2 = getCurrentUserId();
            if (userId2 == -1)
                return BadRequest("user id claim not found in token");
            var success = _friendshipRepository.DeleteFriendship(userId1, userId2);
            if (!success)
                return BadRequest();
            return Ok("Delete friendship successfully");
        }
    }
}

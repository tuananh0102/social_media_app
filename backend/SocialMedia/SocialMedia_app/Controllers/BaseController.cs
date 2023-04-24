using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SocialMedia_app.IRepository;
using System.Security.Claims;

namespace SocialMedia_app.Controllers
{
    [Route("api")]
    [ApiController]
    public class BaseController:Controller
    {

        protected int getCurrentUserId()
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return -1;
            int userId = Int32.Parse(userIdClaim.Value);
            return userId;
        }
    }
}

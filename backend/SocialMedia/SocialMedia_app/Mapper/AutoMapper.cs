using AutoMapper;
using SocialMedia_app.Dto;
using SocialMedia_app.Models;

namespace SocialMedia_app.Mapper
{
    public class AutoMapper: Profile
    {
        public AutoMapper()
        {
            CreateMap<UserProfile, UserProfileDto>();
            CreateMap<UserPost, UserPostDto>();
            CreateMap<UserPostDto, UserPost>();
            CreateMap<PostLike, PostLikeDto>();
            CreateMap<PostLikeDto, PostLike>();
            CreateMap<PostCommentDto, PostComment>();
            CreateMap<PostUploadDto, UserPost>();
           
            
        }
    }
}

using SocialMedia_app.Models;

namespace SocialMedia_app.IRepository
{
    public interface IFileRepository
    {
        string Upload(FileModel file, string folder);
    }
}

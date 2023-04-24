using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using SocialMedia_app.DBContext;
using SocialMedia_app.IRepository;
using SocialMedia_app.Models;

namespace SocialMedia_app.Repository
{
    public class FileRepository : IFileRepository
    {
        private readonly DataContext _context;

        public FileRepository(DataContext context)
        {
            _context = context;
        }
        public string Upload(FileModel file, string folder)
        {
            try
            {

                FileInfo fileInfo = new FileInfo(file.FormFile.FileName);
                string fileName = fileInfo.Name;
                string path = Path.Combine(Directory.GetCurrentDirectory(), $"Assets/{folder}",fileName);
                string urlPath = $"/{folder}/{fileName}";
                using (Stream stream = new FileStream(path, FileMode.Create))
                {
                    file.FormFile.CopyTo(stream);
                }
                return urlPath;
            } catch (Exception ex)
            {
                throw (ex);
            }
             
        }
    }
}

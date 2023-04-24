using Microsoft.EntityFrameworkCore;
using SocialMedia_app.Models;

namespace SocialMedia_app.DBContext
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) 
        {
        }

        public DbSet<UserProfile> Users { get; set; }
        public DbSet<UserPost> Posts { get; set; }
        public DbSet<PostLike> PostLikes { get; set; }
        public DbSet<PostComment> PostComments { get; set; }
        public DbSet<Friendship> Friendships { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserPost>()
                .HasOne<UserProfile>(up => up.User)
                .WithMany(up => up.Posts)
                .OnDelete(DeleteBehavior.ClientSetNull);


            modelBuilder.Entity<PostLike>()
                .HasOne<UserProfile>(pl => pl.User)
                .WithMany(up => up.Likes)
                .OnDelete(DeleteBehavior.ClientSetNull);
            modelBuilder.Entity<PostLike>()
                .HasOne<UserPost>(pl => pl.Post)
                .WithMany(up => up.Likes);

            modelBuilder.Entity<PostComment>()
                .HasOne<UserProfile>(pc => pc.User)
                .WithMany(up => up.Comments)
                .OnDelete(DeleteBehavior.ClientSetNull);
            modelBuilder.Entity<PostComment>()
                .HasOne<UserPost>(pc => pc.Post)
                .WithMany(up => up.Comments)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<Friendship>()
                .HasKey(f => new { f.ProfileRequestId, f.ProfileAcceptId });
            modelBuilder.Entity<Friendship>()
                .HasOne<UserProfile>(f => f.User)
                .WithMany(up => up.Friends)
                .HasForeignKey(f => f.ProfileRequestId)
                .OnDelete(DeleteBehavior.ClientSetNull);
                

        } 
    }
}

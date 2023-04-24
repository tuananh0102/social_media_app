using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialMedia_app.Migrations
{
    /// <inheritdoc />
    public partial class Add_StatusAccepted : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "StatusAccepted",
                table: "Friendships",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StatusAccepted",
                table: "Friendships");
        }
    }
}

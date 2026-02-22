using HAWK.DTOs;
using HAWK.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace HAWK.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminManagementController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AdminManagementController(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // Public ping to test reachability
        [HttpGet("Ping")]
        [AllowAnonymous]
        public IActionResult Ping()
        {
            return Ok(new { message = "AdminManagement endpoint is reachable", isAuthenticated = User.Identity?.IsAuthenticated });
        }

        [HttpGet("GetAllUsers")]
        [Authorize(Roles = "SuperAdmin,Main Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userManager.Users.ToListAsync();
                var userDtos = new List<UserDto>();

                foreach (var user in users)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    userDtos.Add(new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FullName = user.FullName ?? "User",
                        Roles = roles.ToList()
                    });
                }

                return Ok(userDtos);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching users", detail = ex.Message });
            }
        }

        [HttpPost("CreateAdmin")]
        [Authorize(Roles = "SuperAdmin,Main Admin")]
        public async Task<IActionResult> CreateAdmin([FromBody] CreateAdminDto dto)
        {
            // Logging for debugging (view in server console)
            Console.WriteLine($"[AdminManagement] Attempting to create user: {dto?.Email} with role: {dto?.Role}");

            if (dto == null) return BadRequest("Invalid payload");

            var user = new AppUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName ?? "Admin User"
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                Console.WriteLine($"[AdminManagement] Creation failed: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                return BadRequest(result.Errors);
            }

            var role = !string.IsNullOrEmpty(dto.Role) ? dto.Role : "Admin";
            
            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new IdentityRole(role));
            }

            await _userManager.AddToRoleAsync(user, role);
            Console.WriteLine($"[AdminManagement] User {dto.Email} created successfully with role {role}");

            return Ok(new { message = "Admin created successfully" });
        }

        [HttpDelete("DeleteUser/{id}")]
        [Authorize(Roles = "SuperAdmin,Main Admin")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("User not found");

            // Prevent deleting yourself
            var currentUserId = _userManager.GetUserId(User);
            if (currentUserId == id)
                return BadRequest("You cannot delete yourself");

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "User deleted successfully" });
        }
    }
}

using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TakeHomeWebApp.Models
{
    public class TakeHomeDatabaseContext : DbContext
    {
        public DbSet<Source> Sources { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Filename=C:\\Users\\niklaus\\Documents\\GitHub\\take-home\\db.sqlite");
        }
    }
}

using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TakeHomeWebApp.Models
{
    public class TakeHomeDatabaseContext : DbContext
    {
        public TakeHomeDatabaseContext(DbContextOptions<TakeHomeDatabaseContext> options) : base(options) { }

        public DbSet<Source> Sources { get; set; }
        public DbSet<Message> Messages { get; set; }
    }
}

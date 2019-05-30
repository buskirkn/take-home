using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TakeHomeWebApp.Models;

namespace TakeHomeWebApp.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            using (var db = new TakeHomeDatabaseContext())
            {
                var newSource = new Source
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = "NIK TEST",
                    Environment = "test",
                    Encoding = "utf8",
                    Created = DateTime.Now,
                    Updated = DateTime.Now,
                };

                db.Sources.Add(newSource);

                //db.SaveChanges();
            }

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

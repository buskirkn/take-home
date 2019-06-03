using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TakeHomeWebApp.Models;

namespace TakeHomeWebApp.Controllers
{
    public abstract class BaseController : Controller
    {
        protected readonly TakeHomeDatabaseContext _database;

        public BaseController(TakeHomeDatabaseContext databaseContext)
        {
            _database = databaseContext;
        }
    }
}
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
        protected TakeHomeDatabaseContext _database = new TakeHomeDatabaseContext();
    }
}
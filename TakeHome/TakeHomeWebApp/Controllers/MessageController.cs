using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace TakeHomeWebApp.Controllers
{
    public class MessageController : BaseController
    {
        [Route("message")]
        [HttpPost]
        public IActionResult CreateMessage()
        {
            return View();
        }

        [Route("message/{messageId}")]
        [HttpPost]
        public IActionResult UpdateMessage(string messageId)
        {
            return View();
        }

        [Route("message/{messageId}")]
        [HttpDelete]
        public IActionResult DeleteMessage(string messageId)
        {
            return View();
        }
    }
}
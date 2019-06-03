using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TakeHomeWebApp.Models;

namespace TakeHomeWebApp.Controllers
{
    public class MessageController : BaseController
    {
        [Route("message")]
        [HttpPost]
        public IActionResult CreateMessage([FromBody]string sourceId, [FromBody]string content, [FromBody]string status)
        {
            if (!AllowedMessageStatuses.Contains(status))
            {
                return BadRequest($"{status} is not a valid message status.");
            }

            if (_database.Sources.Find(sourceId) == null)
            {
                return NotFound("Source could not be found.");
            }

            var newMessage = new Message
            {
                Id = Guid.NewGuid().ToString(),
                SourceId = sourceId,
                Content = content,
                Status = status,
                Created = DateTime.UtcNow,
                Updated = DateTime.UtcNow,
            };

            _database.Messages.Add(newMessage);

            _database.SaveChanges();

            return Ok();
        }

        [Route("message/{messageId}")]
        [HttpPost]
        public IActionResult UpdateMessage(string messageId, [FromBody]string content, [FromBody]string status)
        {
            var message = _database.Messages.Find(messageId);

            if (!AllowedMessageStatuses.Contains(status))
            {
                return BadRequest($"{status} is not a valid message status.");
            }

            if (message == null)
            {
                return NotFound("Message could not be found.");
            }

            message.Content = content;
            message.Status = status;

            _database.SaveChanges();

            return Ok();
        }

        [Route("message/{messageId}")]
        [HttpDelete]
        public IActionResult DeleteMessage(string messageId)
        {
            var message = _database.Messages.Find(messageId);

            if (message == null)
            {
                return NotFound("Message could not be found.");
            }

            _database.Remove(message);

            _database.SaveChanges();

            return Ok();
        }

        private static IReadOnlyList<string> AllowedMessageStatuses = new List<string>
        {
            "processing", "enqueued", "error", "finished"
        };
    }
}
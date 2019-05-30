using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TakeHomeWebApp.Models;

namespace TakeHomeWebApp.Controllers
{
    public class SourceController : BaseController
    {
        [Route("source/{sourceId}")]
        [HttpGet]
        public IActionResult GetSource(string sourceId)
        {
            var source = _database.Sources.Find(sourceId);

            if (source == null)
            {
                return NotFound();
            }

            return Json(source);
        }

        [Route("source")]
        [HttpGet]
        public IActionResult GetAllSources()
        {
            var sources = _database.Sources.ToList();

            return Json(sources);
        }

        [Route("source/{sourceId}/message")]
        [HttpGet]
        public IActionResult GetSourceMessages(string sourceId)
        {
            var sourceMessages = _database.Messages.Where(message => message.SourceId == sourceId).ToList();

            return Json(sourceMessages);
        }

        [Route("source")]
        [HttpPost]
        public IActionResult CreateSource([FromBody]string name, [FromBody]string environment, [FromBody]string encoding)
        {
            if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(environment) || string.IsNullOrEmpty(encoding))
            {
                return BadRequest();
            }

            var newSource = new Source
            {
                Id = Guid.NewGuid().ToString(),
                Name = name,
                Environment = environment,
                Encoding = encoding,
                Created = DateTime.UtcNow,
                Updated = DateTime.UtcNow
            };

            _database.Sources.Add(newSource);

            _database.SaveChanges();

            return Json(newSource);
        }

        [Route("source/{sourceId}")]
        [HttpPost]
        public IActionResult UpdateSource(string sourceId, [FromBody]string name, [FromBody]string environment, [FromBody]string encoding)
        {
            if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(environment) || string.IsNullOrEmpty(encoding))
            {
                return BadRequest();
            }

            var sourceToUpdate = _database.Sources.Find(sourceId);

            if (sourceToUpdate == null)
            {
                return NotFound();
            }

            sourceToUpdate.Name = name;
            sourceToUpdate.Environment = environment;
            sourceToUpdate.Encoding = encoding;
            sourceToUpdate.Updated = DateTime.UtcNow;

            _database.SaveChanges();

            return Json(sourceToUpdate);
        }

        [Route("source/{sourceId}")]
        [HttpDelete]
        public IActionResult DeleteSource(string sourceId)
        {
            throw new NotImplementedException("Not implemented: pending question about delete structure.");
        }
    }
}
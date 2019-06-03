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
        public SourceController(TakeHomeDatabaseContext databaseContext) : base(databaseContext) { }

        // *****************************************************************
        /// <summary>
        /// Retrieves the Source with the given Id. If no source
        /// exists, NotFound is returned.
        /// </summary>
        /// <param name="sourceId">The id of the source to retrieve.</param>
        /// <returns>A Source object</returns>
        // *****************************************************************
        [Route("source/{sourceId}")]
        [HttpGet]
        public IActionResult GetSource(string sourceId)
        {
            var source = _database.Sources.Find(sourceId);

            if (source == null)
            {
                return NotFound("Source could not be found.");
            }

            return Json(source);
        }

        // *****************************************************************
        /// <summary>
        /// Retrieves all sources.
        /// </summary>
        /// <returns>An array of source objects</returns>
        // *****************************************************************
        [Route("source")]
        [HttpGet]
        public IActionResult GetAllSources()
        {
            var sources = _database.Sources.ToList();

            return Json(sources);
        }

        // *****************************************************************
        /// <summary>
        /// Returns all messages for a source.
        /// </summary>
        /// <param name="sourceId">The id of the source to return messages for</param>
        /// <returns>An array of message objects</returns>
        // *****************************************************************
        [Route("source/{sourceId}/message")]
        [HttpGet]
        public IActionResult GetSourceMessages(string sourceId)
        {
            var sourceMessages = _database.Messages.Where(message => message.SourceId == sourceId).ToList();

            return Json(sourceMessages);
        }

        // *****************************************************************
        /// <summary>
        /// Creates a new source.
        /// </summary>
        /// <param name="name">The name of the source to create</param>
        /// <param name="environment">The environment for the source</param>
        /// <param name="encoding">The source encoding</param>
        /// <returns>Ok on successful creation</returns>
        // *****************************************************************
        [Route("source")]
        [HttpPost]
        public IActionResult CreateSource([FromBody]string name, [FromBody]string environment, [FromBody]string encoding)
        {
            if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(environment) || string.IsNullOrEmpty(encoding))
            {
                return BadRequest();
            }

            if (!AllowedSourceEncoding.Contains(environment))
            {
                return BadRequest($"{environment} is not a valid environment.");
            }

            if (!AllowedSourceEncoding.Contains(encoding))
            {
                return BadRequest($"{encoding} is not a valid encoding.");
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

        // *****************************************************************
        /// <summary>
        /// Updates the given source.
        /// </summary>
        /// <param name="sourceId">The id of the source to update.</param>
        /// <param name="name">The name of the source</param>
        /// <param name="environment">The environment of the source</param>
        /// <param name="encoding">The encoding of the source</param>
        /// <returns>Ok if the source is successfully updated</returns>
        // *****************************************************************
        [Route("source/{sourceId}")]
        [HttpPost]
        public IActionResult UpdateSource(string sourceId, [FromBody]string name, [FromBody]string environment, [FromBody]string encoding)
        {
            if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(environment) || string.IsNullOrEmpty(encoding))
            {
                return BadRequest();
            }

            if (!AllowedSourceEncoding.Contains(environment))
            {
                return BadRequest($"{environment} is not a valid environment.");
            }

            if (!AllowedSourceEncoding.Contains(encoding))
            {
                return BadRequest($"{encoding} is not a valid encoding.");
            }

            var sourceToUpdate = _database.Sources.Find(sourceId);

            if (sourceToUpdate == null)
            {
                return NotFound("Source could not be found.");
            }

            sourceToUpdate.Name = name;
            sourceToUpdate.Environment = environment;
            sourceToUpdate.Encoding = encoding;
            sourceToUpdate.Updated = DateTime.UtcNow;

            _database.SaveChanges();

            return Json(sourceToUpdate);
        }

        // *****************************************************************
        /// <summary>
        /// Deletes the specified source.
        /// </summary>
        /// <param name="sourceId">The id of the source to delete.</param>
        /// <returns>Ok if the source is successfully deleted.</returns>
        // *****************************************************************
        [Route("source/{sourceId}")]
        [HttpDelete]
        public IActionResult DeleteSource(string sourceId)
        {
            var source = _database.Sources.Find(sourceId);

            if (source == null)
            {
                return NotFound("Source could not be found.");
            }

            var messagesForSource = _database.Messages.Where(msg => msg.SourceId == sourceId).ToList();

            _database.Sources.Remove(source);

            _database.Messages.RemoveRange(messagesForSource);

            _database.SaveChanges();

            return Ok();
        }

        private static IReadOnlyList<string> AllowedSourceEnvironments = new List<string>
        {
            "staging", "development", "production"
        };

        private static IReadOnlyList<string> AllowedSourceEncoding = new List<string>
        {
            "utf8", "latin1"
        };
    }
}
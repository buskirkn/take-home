using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TakeHomeWebApp.Models
{
    [Table("message")]
    public class Message
    {
        [Key]
        [Column("id")]
        public string Id { get; set; }
        
        [Column("source_id")]
        public string SourceId { get; set; }

        [Column("message")]
        public string Content { get; set; }

        [Column("status")]
        public string Status { get; set; }

        [Column("created_at")]
        public DateTime Created { get; set; }

        [Column("updated_at")]
        public DateTime Updated { get; set; }

        [Column("deleted_at")]
        public DateTime? Deleted { get; set; }
    }
}

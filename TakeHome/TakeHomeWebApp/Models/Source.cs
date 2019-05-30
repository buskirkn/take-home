using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TakeHomeWebApp.Models
{
    [Table("source")]
    public class Source
    {
        [Key]
        [Column("id")]
        public string Id { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("environment")]
        public string Environment { get; set; }
        [Column("encoding")]
        public string Encoding { get; set; }
        [Column("created_at")]
        public DateTime Created { get; set; }
        [Column("updated_at")]
        public DateTime Updated { get; set; }
        [Column("deleted_at")]
        public DateTime? Deleted { get; set; }
    }
}

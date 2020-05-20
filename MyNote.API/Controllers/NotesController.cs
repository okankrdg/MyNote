using MyNote.API.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MyNote.API.Controllers
{
    public class NotesController : BaseApiController
    {
        [HttpGet]
        public IEnumerable<Note> List()
        {
            return db.Notes;
        }
    }
}

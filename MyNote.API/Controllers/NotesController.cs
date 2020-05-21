using Microsoft.AspNet.Identity;
using MyNote.API.Dtos;
using MyNote.API.Extensions;
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

    [Authorize]
    public class NotesController : BaseApiController
    {
        public string UserId => User.Identity.GetUserId();

        [HttpGet]
        public IEnumerable<NoteDto> List()
        {
            return db.Notes.Where(x => x.AuthorId == UserId).ToList().Select(x => x.ToNoteDto());
        }
        [HttpGet]
        public IHttpActionResult GetNote(int? id=null)
        {
            if (id==null)
            {
                return BadRequest();
            }
            var note = db.Notes.FirstOrDefault(x => x.Id == id && x.AuthorId == UserId);
            if (note==null)
            {
                return NotFound();
            }
            return Ok(note);
        }
        [HttpPost]
        public IHttpActionResult New(NewNoteDto dto)
        {
            if (dto == null)
            {
                return BadRequest();
            }
            if (ModelState.IsValid)
            {
                var note = new Note
                {
                    AuthorId = UserId,
                    Title = dto.Title,
                    Content = dto.Content,
                    CreationTime = DateTime.Now,
                    ModificationTime = DateTime.Now,

                };
                db.Notes.Add(note);
                db.SaveChanges();
                return CreatedAtRoute("DefaultApi", new { action="GetNote", id = note.Id }, note.ToNoteDto());
            }
            return BadRequest(ModelState);
        }
        [HttpPut]
        public IHttpActionResult Update(UpdateNoteDto dto, int? id = null)
        {
            if (id == null || dto == null || id != dto.Id )
            {
                return BadRequest();
            }
            var note = db.Notes.FirstOrDefault(x => x.Id == dto.Id && x.AuthorId == UserId);
            if (note == null)
            {
                return NotFound();
            }
            if (ModelState.IsValid)
            {
                note.Title = dto.Title;
                note.Content = dto.Content;
                note.ModificationTime = DateTime.Now;
                db.SaveChanges();
                return Ok(note);
            }
            return BadRequest(ModelState);
        }
        [HttpDelete]
        public IHttpActionResult Delete(int? id=null)
        {
            if (id == null)
            {
                return BadRequest();
            }
            var note = db.Notes.FirstOrDefault(x => x.Id == id && x.AuthorId == UserId);
            if (note == null)
            {
                return NotFound();
            }
            db.Notes.Remove(note);
            db.SaveChanges();
            return Ok(note.ToNoteDto());
        }
       
    }
}

﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MyNote.API.Dtos
{
    public class NewNoteDto
    {
        [Required(ErrorMessage ="{0} is required")]
        [StringLength(100,ErrorMessage ="{0} cannot be longer than {1} characters.")]
        [Display(Name ="Title")]
        public string Title { get; set; }
        public string Content { get; set; }
    }
}
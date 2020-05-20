namespace MyNote.API.Migrations
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using MyNote.API.Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<MyNote.API.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(MyNote.API.Models.ApplicationDbContext context)
        {
            var userName = "karadagokancan@gmail.com";
             //https://stackoverflow.com/questions/19280527/mvc-5-seed-users-and-roles


            if (!context.Users.Any(u => u.UserName == "karadagokancan@gmail.com"))
            {
                var store = new UserStore<ApplicationUser>(context);
                var manager = new UserManager<ApplicationUser>(store);
                var user = new ApplicationUser { UserName = userName, EmailConfirmed = true,Email=userName };

                manager.Create(user, "Password1.");
                for (int i = 1; i < 6; i++)
                {
                    context.Notes.Add(new Note
                    {
                        AuthorId = user.Id,
                        Title = "My First Note " + i, 
                        Content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra lectus nec est sollicitudin fermentum. Nunc eget nulla nisl. Donec sed magna et justo tincidunt semper. Maecenas varius finibus justo, nec consectetur tortor bibendum sed. Nunc dapibus ipsum ac auctor accumsan. Cras ut tristique felis.",
                        CreationTime = DateTime.Now,
                        ModificationTime = DateTime.Now
                    });
                }
             
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGeneration.Contracts.Messaging;
using Racha1school.Models;
using Racha1school.Service;

namespace Racha1school.Controllers
{
    public class LoginController : Controller
    {
        Register_AndLogin Re = new Register_AndLogin();
 
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Sigin(Login login)
        {
            try
            {
                if(ModelState.IsValid)
                {
                    if( Re.Log(login.name , login.password).Result)
                    {
                       HttpContext.Session.SetString("user", login.name);
                        HttpContext.Session.SetString("pass", login.password);
                        return RedirectToAction("Index" , "onepage");
                    }
                    return RedirectToAction("Index", "Login");
                }
            }
            catch(Exception e)
            {
                e.Message.ToString();
                return StatusCode(400);
            }
            return RedirectToAction("Index", "Login");
        }
        public IActionResult Search()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Resgister()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Resgister(Login login)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    Re.Act(login.name, login.password);
                }
                else
                {
                    return StatusCode(400);
                }
                return RedirectToAction("Index", "Login");
            }
            catch(Exception e)
            {
                e.Message.ToString();
                return StatusCode(400);
            }
           
        }

    }
}
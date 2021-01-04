using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
//using FireSharp.Interfaces;
//using FireSharp.Response;
//using FireSharp.Config;
using Racha1school.Models;
using Google.Cloud.Firestore;
using Google.Cloud.Firestore.V1;
using System.Threading.Channels;
using FireSharp.Config;
using FireSharp.Interfaces;
using FireSharp.Response;
using FireSharp;
using Microsoft.AspNetCore.Mvc;

namespace Racha1school.Service
{
    public class Register_AndLogin
    {
        //string path = AppDomain.CurrentDomain.BaseDirectory + @"racha-databaese-firebase-adminsdk-6ut1p-a7d9f6ef1f.json";

        IFirebaseConfig config = new FirebaseConfig
        {
            AuthSecret = "E3BI1kexntKVhzMdQLpuZ4ffzQMfdftxlVDep2Dd",
            BasePath = "https://racha-databaese-default-rtdb.firebaseio.com/"
        };
        IFirebaseClient client;

        public async void Act(string user , string pass)
        {
            try
            {
                client = new FirebaseClient(config);
                var log = new Login
                {
                    name = user,
                    password = pass
                };
                SetResponse res = await client.SetTaskAsync("register/" + user, log);
            }
            catch(Exception e)
            {
                e.Message.ToString();
            }
            
        }
        public async Task<bool> Log(string user , string pass)
        {
            try
            {
                client = new FirebaseClient(config);
                //var log = new Login
                //{
                //    name = user,
                //    password = pass
                //};
                FirebaseResponse res = await client.GetTaskAsync("register/" + user);
                Login stu = res.ResultAs<Login>();
                user = stu.name;
                pass = stu.password;
                if  (stu.name == user && stu.password == pass)
                {
                    return true;
                }
               
            }
            catch(Exception e)
            {
                e.Message.ToString();
                return false;         
            }
            return false;
        }

    }
}

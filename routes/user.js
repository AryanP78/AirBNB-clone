const express = require("express");
const router =express.Router();
const User = require("../models/user");
const flash = require("connect-flash");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");




router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup", async (req,res)=>{
    try{
    let {username, email,password}=req.body;
    const newUser = new User({email,username});
   const registerUser= await User.register(newUser,password);
   console.log(registerUser);

   req.logIn(registerUser,(err)=>{
    if(err){
        return next(err);
        
    }
    req.flash("success","user registered successfully!");
   res.redirect('/listings');
   })

   
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")

   }

})

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");

})

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect :"/login", failureFlash:true})
,async(req,res)=>{
    const username =req.body.username;
 req.flash("success", `Welcome back!  ${username}`);
 let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
})

router.get("/logout",(req,res , next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out!")
        res.redirect("/listings");
    })
})

module.exports=router;
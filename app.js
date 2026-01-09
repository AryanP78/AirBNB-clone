require("dotenv").config();

const express = require("express");
const app =express();
const mongoose = require("mongoose");
const path =require("path");
const methodOverride =require("method-override");
const ejsMate = require("ejs-mate");
const listingsRouter = require("./routes/listing.js");
const  reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js")
const session=require("express-session");
const flash=require("connect-flash");
//const MONGO_URL = "mongodb://127.0.0.1:27017/AirBNB"
const passport=require("passport")
const LocalStrategy=require("passport-local");
const User= require("./models/user.js")

const dbUrl = process.env.ATLASDB_URL;

mongoose.set("bufferCommands", false);
mongoose.set("strictQuery", false);


async function main() {
  try {
    await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB CONNECTED");

    app.listen(8080, () => {
      console.log("Server started on port 8080");
    });

  } catch (err) {
    console.error("❌ MongoDB connection error:");
    console.error(err);
  }
}

main();


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));



const sessionOptions ={
    secret:"my secret code",
    resave:false,
    saveUninitialized:true,
    cookie:{
       expires: Date.now() + 7*24*60*60*1000,
       maxage: 7*24*60*60*1000,
       httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser = req.user;
    next();
})

  
 app.use("/listings",listingsRouter);
 app.use("/listings/:id/reviews/",reviewsRouter);

 app.use("/",userRouter);



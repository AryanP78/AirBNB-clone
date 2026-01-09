const express = require("express");
const app =express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path =require("path");
const methodOverride =require("method-override");
const ejsMate = require("ejs-mate");
const Review =require("./models/review");
const {reviewSchema}= require("./schema");



const MONGO_URL = "mongodb://127.0.0.1:27017/AirBNB"

main().then(()=>{
    console.log("Connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    res.send("Hi ,i  am root");
})


 
//* REVIEWS 

//* Post Route

app.post("/listings/:id/reviews", async (req,res)=>{

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${listing.id}`);


})

// app.get("/testListing", async(req,res)=>{
//    let sampleListing =new Listing({
//     title: "my new Villa",
//     description: "By the Beach",
//     price:1200,
//     location: "hisar",
//     country:"India"
//    });

//    await sampleListing.save();

//    res.send("Working")
// })

app.listen(8080,()=>{
    console.log("Serever Started at 8080");
})
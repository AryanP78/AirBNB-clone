const express = require("express");
const router =express.Router();
const Listing = require("../models/listing");
const {reviewSchema}= require("../schema");
const {isLoggedin ,isOwner}= require("../middleware.js");
const ListingController = require("../controller/listing.js")
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });



router.route("/")
.get( ListingController.index)
//.post(isLoggedin,ListingController.createListing)
.post(isLoggedin, upload.single('listing[image]'), ListingController.createListing);




//& new route
router.get("/new",isLoggedin,ListingController.renderNewForm)

//search route
router.get("/search", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.redirect("/listings");
  }

  const listings = await Listing.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } }
    ]
  });
  if (listings.length === 0) {
    req.flash("error", `No listings found for "${query}"`);
    return res.redirect("/listings");
  }
  res.render("listings/index.ejs", { allListings: listings });
});

router.route("/:id")
.get(ListingController.showListing) //& show route
.put(isLoggedin ,isOwner , ListingController.updateListing)//*update route
.delete(isLoggedin,isOwner,ListingController.deleteListing)//delete route






//* edit route

router.get("/:id/edit",isLoggedin,isOwner,ListingController.editListing)






//* render edit route

router.get("/listings/:id/edit",async (req,res)=>{

    let {id} = req.params;
     const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//*edit route

router.put("/listings/:id", async (req,res)=>{
    let {id} =req.params;
   await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
   res.redirect(`/listings/${id}`);

})

//delete route

router.delete("/listings/:id",ListingController.deleteListing)





module.exports=router;

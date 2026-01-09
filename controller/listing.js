const Listing = require("../models/listing")

module.exports.index =async(req,res)=>{
 const allListings =   await   Listing.find({});
 res.render("listings/index.ejs",{allListings});   
}

module.exports.renderNewForm=(req,res)=>{
    
    res.render("listings/new.ejs")}

module.exports.showListing=async(req,res)=>{
    let {id} = req.params;
     const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        }})
        .populate("owner");

     if(!listing){
        req.flash("error","this listing was deleted!");
       return res.redirect("/listings");
     }
     console.log(listing);
    res.render("listings/show.ejs",{listing})
}

module.exports.createListing=async (req,res)=>{
  
   let newListing = new Listing(req.body.listing);
   newListing.owner=req.user._id;

     // If a file was uploaded via multer/cloudinary, attach its info
     if (req.file) {
         const file = req.file;
         newListing.image = {
             filename: file.filename || file.originalname || "listingimage",
             url:
                 file.path || file.location || file.secure_url || file.url || "",
         };
     }

   await newListing.save();
   req.flash("success","new Listisng Created Successfully!")
   res.redirect("/listings");

}

module.exports.editListing=async (req,res)=>{

    let {id} = req.params;
     const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing=async (req,res)=>{
    let {id} =req.params;
       await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
   req.flash("success","Listing Updated!");
   res.redirect(`/listings/${id}`);

}

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
     
    let deletedList =await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
}
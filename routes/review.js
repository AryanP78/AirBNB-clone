const express = require("express");
const router =express.Router({mergeParams:true});
const Listing = require("../models/listing");
const {reviewSchema}= require("../schema");
const Review = require("../models/review");
const { isLoggedin,isReviewAuthor } = require("../middleware");
const reviewController = require("../controller/review")




router.post("/", reviewController.createReview)

//& review delete route

router.delete("/:reviewId" , isLoggedin, isReviewAuthor,reviewController.destroyReview)

module.exports=router;
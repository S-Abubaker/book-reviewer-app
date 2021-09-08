const express = require("express");
const { ensureAuth } = require("../middleware/auth.js");

const Review = require("../models/Review.js");
const router = express.Router();

// add page
router.get("/add", ensureAuth, (req, res) => {
  res.render("reviews/add");
});

// show all reviews
router.get("/", ensureAuth, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("reviews/index", { reviews });
  } catch (error) {
    console.log(error.message);
    res.render("error/500");
  }
});

// get single review
router.get("/:id", ensureAuth, async (req, res) => {
    try {
        let review = await Review.findById(req.params.id)
            .populate('user')
            .lean()

        if(!review) {
            return res.render('error/404')
        }
        
        res.render('reviews/singleReview', { review })
    } catch (error) {
        console.log(error.message)
        return res.render('error/404')
    }
  });

// get user reviews
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const reviews = await Review.find({user: req.params.userId})
      .populate('user')
      .lean()
    
        res.render('reviews/userReviews',{ 
          reviews,
          name: req.user.firstName,  
        })
  } catch (error) {
    console.error(error.message)
    res.render('error/500')
  }
});

// post request to db reviews
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Review.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error.message);
    res.render("error/500");
  }
});

// edit page
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
    }).lean();

    if (!review) {
      return res.render("error/404");
    }

    if (review.user != req.user.id) {
      res.redirect("/reviews");
    } else {
      res.render("reviews/edit", { review });
    }
  } catch (error) {
    console.log(error.message);
    return res.render("error/500");
  }
});

// update review
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let review = await Review.findById(req.params.id).lean();

    if (!review) {
      return res.render("error/404");
    }

    if (review.user != req.user.id) {
      res.redirect("/reviews");
    } else {
      review = await Review.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect("/dashboard");
    }
  } catch (error) {
    console.log(error.message);
    return res.render("error/500");
  }
});

// delete review
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Review.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error.message);
    return res.render("error/500");
  }
});

module.exports = router;

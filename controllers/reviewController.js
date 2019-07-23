const mongoose = require('mongoose'); 
const Review = mongoose.model('Review');


//                              ADD 
// -------------------------------------------------------
exports.addReview = async (req, res) => {
    req.body.author = req.user._id; 
    req.body.project = req.params.id; 
    const newReview = new Review(req.body);
    await newReview.save();
    res.send("has been created");
}; 

exports.getReviews = async (req, res) => {
  const reviews = await Review.find();
 res.json({reviews: reviews});

};

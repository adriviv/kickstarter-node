const mongoose = require('mongoose'); // have access to database
const Review = mongoose.model('Review');


//                              ADD 
// -------------------------------------------------------
exports.addReview = async (req, res) => {
    // res.json(req.body); 
    // // when console.log See only text and rating. We want all params from the model so we add them mannualy 
    req.body.author = req.user._id; // save this review in the user 
    req.body.project = req.params.id; // save this review in the store
    // res.json(req.body); 
    const newReview = new Review(req.body);
    await newReview.save();
    res.send("has been created");
}; 

exports.getReviews = async (req, res) => {
  const reviews = await Review.find();
 res.json({reviews: reviews});

};
// exports.getProjects = async (req, res) => {
//     // res.json({ it: 'Worked'})
//     const projects = await Project.find();
//     res.json({projects: projects});
// };
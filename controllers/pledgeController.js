const mongoose = require('mongoose'); // have access to database
const Pledge = mongoose.model('Pledge');

exports.addPledge = async (req, res) => {
    req.body.author = req.user._id; // save this review in the user 
    req.body.project = req.params.id; // save this review in the store
    const newPledge= new Pledge(req.body);
    await newPledge.save();
    res.send("has been created");
};



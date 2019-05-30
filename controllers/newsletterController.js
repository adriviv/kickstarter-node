const mongoose = require('mongoose'); // have access to database
const Newsletter = mongoose.model('Newsletter');

exports.subscribe = async (req, res) => {
    const newsletter = new Newsletter(req.body);
    await newsletter.save();
    // res.json({ status: 'created'});
    res.send("has been created");
};


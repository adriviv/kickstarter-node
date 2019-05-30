const mongoose = require('mongoose'); // have access to database
const Newsletter = mongoose.model('Newsletter');
const mail = require('../handlers/mail')

exports.subscribe = async (req, res) => {
    const newsletter = new Newsletter(req.body);
    await newsletter.save();
    const user = await Newsletter.findOne({email: req.body.email});
    await mail.send({
        user: user,
        subject: 'Your Inscription to the newsletter',
        filename: '_newsletterRegister',
        category: 'newsletter',
    });
    res.send("has been created");
};


const mongoose = require ('mongoose');
mongoose.Promise = global.Promise;
const validator = require('validator');

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String, 
        unique: true,
        lowercase: true, 
        trim: true, 
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: 'Please Supply an email address'
    },
    first_name: {
        type: String,
        required: 'Please supply a first name',
        trim: true
    },
    last_name: {
        type: String,
        required: 'Please supply a last name',
        trim: true
    },
    userId: String,
    gravatar: String
});


module.exports = mongoose.model('Newsletter', newsletterSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

//SPECIFIC SETUP 
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
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
    resetPasswordToken: String, 
    resetPasswordExpires: Date,
    hearts: [
        { type: mongoose.Schema.ObjectId, ref: 'Store'}
      ]
},

{
    toJSON: { virtuals: true}, // allow you see with pre=h.dump(store) all the virtual JSON and virtual Objects
    toObject: {virtuals: true},
  });


// REGISTER 
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);



// AVATAR
userSchema.virtual('gravatar').get(function(){
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=200`; // ?s=200 is the size of the avatar
  });
  
module.exports = mongoose.model('User', userSchema);


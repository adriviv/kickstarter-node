const passport = require('passport'); // for crypted passeword
const crypto = require('crypto'); // for crypted token 
const mongoose = require('mongoose'); // have access to database
const User = mongoose.model('User');
const promisify = require('es6-promisify');
// const mail = require('../handlers/mail'); // To send mail


// Automatic login.
exports.login = passport.authenticate('local', { // coudl be authenticate('facebook')
    failureRedirect: '/login',
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    successFlash: 'You are Loged in !'
});
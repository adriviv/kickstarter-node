const passport = require('passport'); // for crypted passeword
const crypto = require('crypto'); // for crypted token 
const mongoose = require('mongoose'); // have access to database
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail'); // To send mail


//                           LOGIN 
// -------------------------------------------------------
exports.login = (req, res) => {
    res.send(req.user);
};

//                         LOGOUT
// ------------------------------------------------------
exports.logout = (req, res) => {
    req.logout();
    res.json({You: "are disconected"});    // res.redirect('/');
};


//=====================================================================
//                  FORGOT PASSWORD / UPDATE PASSEWORD
//=====================================================================

//                      1 - SEND EXPIRED TOKEN 
// -------------------------------------------------------
exports.forgot = async (req, res) => {
        // 1 check if the email exist 
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        res.send('error', "The email doesn't exist");
    }

     // 2 set reset tokens and expiry on their account
     user.resetPasswordToken = crypto.randomBytes(20).toString('hex'); // need to define resetPasswordToken in User Model
     user.resetPasswordExpires = Date.now() + 36000; // 1hour from now // need to define resetPasswordExpires in User Model
     await user.save(); 
     // Need to add both field to the schema

     const resetURL = `http://localhost:8080/account/reset/${user.resetPasswordToken}`;

     await mail.send({
        user: user, // can be written user, car on se repette 
        subject: 'Password Reset',
        resetURL: resetURL, 
        filename: 'password-reset',
        category: 'email',
    })

    res.send('you received an email')
 
};


//                      2 - VERIFY THE TOKEN
// -------------------------------------------------------

exports.reset = async (req, res) => {
    // res.json(req.params); // to be sure there is the token
     const user = await User.findOne({
         resetPasswordToken: req.params.token,
         resetPasswordExpires: { $lt: Date.now() } //$gt is greatter than Now 
     });
     if (!user) {
         res.json('Password reset is invalid or has been expired');
     }
     // if there is a user , show the reset the password form 

     res.json('you will be redirect');
 };


//            3- CHECK IF THE BOTH NEW PASSWORD MATCH 
// -------------------------------------------------------
exports.confirmedPasswords = (req, res, next) => {
    if (req.body.password === req.body.password_confirm) {
        next();
        return;
    }
    res.send('Password do not match');
};
 

//                  4 - UPDATE PASSWORD 
// -------------------------------------------------------
exports.update = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $lt: Date.now() } //$gt is greatter than Now 
    });
    if (!user) {
        res.send('Password resed is invalid or has been expired');
    };
    const setPassword = promisify(user.setPassword, user);
    await setPassword(req.body.password);
    user.resetPasswordToken = undefined;  // on let mes à undifined car si succès et reset password on supprime ces deux bails
    user.resetPasswordExpires = undefined; 
    const updatedUser = await user.save();

    await req.login(updatedUser); // pour les automatic login // thanks to passport.js
    res.send('Your password has been updated');
  
};

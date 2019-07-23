const passport = require('passport'); // for crypted passeword
const crypto = require('crypto'); // for crypted token 
const mongoose = require('mongoose'); // have access to database
const User = mongoose.model('User');
const promisify = require('es6-promisify');

//LOGIN
exports.login = (req, res) => {
    res.send(req.user);
};


//LOGOUT
exports.logout = (req, res) => {
    req.logout();
    res.json({You: "are disconected"});  
};

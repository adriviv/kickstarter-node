const mongoose = require('mongoose');
const User = mongoose.model('User');

const promisify = require('es6-promisify');

// ==================================================
//                  REGISTER 
// ===================================================

// VALIDATE DATA IN THE FORM 
exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('first_name', 'You must supply a first name!').notEmpty();
    req.checkBody('last_name', 'You must supply a last name!').notEmpty();
    req.checkBody('email', 'That Email is not valid!').isEmail();
    req.sanitizeBody('email').normalizeEmail({
      gmail_remove_dots: false,
      remove_extension: false,
      gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
    req.checkBody('password_confirm', 'Confirmed Password cannot be blank!').notEmpty();
    req.checkBody('password_confirm', 'Oops! Your passwords do not match').equals(req.body.password);
    const errors = req.validationErrors();
    if (errors) {
      console.log('error', errors.map(err => err.msg));
      res.status(500).send({ error: "boo:(" });
      return; 
    } 
    next(); 
}; 

exports.register = async (req, res, next) => {
};

  
  // CREATE A NEW USER 
  exports.register = async (req, res) => {

    const user = new User({email: req.body.email, first_name: req.body.first_name, last_name: req.body.last_name });
    const register = promisify(User.register, User);
    await register(user, req.body.password);
    // res.json('it worked');
    next();
  };




  

const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const passport = require('passport'); // for crypted passeword

const projectController = require('../controllers/projectController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const pledgeController = require('../controllers/pledgeController');
const favoriteController = require('../controllers/favoriteController');

//===============================================
//                      STORE CRUD 
//===============================================
//index
router.get('/', catchErrors(projectController.getProjects));
router.get('/projects', catchErrors(projectController.getProjects));

//SHOW 
router.get('/show/:slug', catchErrors(projectController.showProject));

// ADD
router.post('/add', 
    catchErrors(projectController.addProject)
);

// UPDATE
router.post('/add/:slug', 
    catchErrors(projectController.updateProject)
);


//===============================================
//                   TAGS  
//===============================================
//INDEX
router.get('/tags/undefined', catchErrors(projectController.getProjectsByTag));

//SHOW
router.get('/tags/:tag', catchErrors(projectController.getProjectsByTag));

//===============================================
//                   LOGIN / REGISTER
//===============================================
// REGISTER
router.post('/register',
 userController.validateRegister, // 2- Check & validates all the form data
 userController.register, 
 passport.authenticate('local'), authController.login
 );
       
 // LOGIN
router.post('/login', passport.authenticate('local'), authController.login);


 //LOG OUT = authController
 router.get('/logout', authController.logout);

module.exports = router;


//===============================================
//                  REVIEWS
//===============================================
router.post('/show/:id/addreview', catchErrors(reviewController.addReview)
);

router.get('/show/:id/getReviews', catchErrors(reviewController.getReviews)
);


//===============================================
//                  PLEDGE
//===============================================
router.post('/show/:id/pledge', catchErrors(pledgeController.addPledge));


//===============================================
//                  Dashboard
//===============================================
router.post('/dashboard/:id', catchErrors(projectController.getProjectDashboard));

//===============================================
//                 SEARCH BAR
//===============================================
router.post('/searchProject', catchErrors(projectController.searchProjects));


//===============================================
//                FAVORITES
//===============================================
router.post('/api/stores/:id/heart', catchErrors(projectController.heartStore ));
const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');

const projectController = require('../controllers/projectController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

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
router.post('/register',
 userController.validateRegister, // 2- Check & validates all the form data
 userController.register,
 authController.login);        // 3 - registrer the user 


//  ); // // LOGIN  = userController + authController
// router.get('/login', userController.loginForm); 
// router.post('/login', authController.login);

// // REGISTRER = userController + authController
// router.get('/register', userController.registerForm); // 1-  create a register Form 

// router.post('/register',
// userController.validateRegister, // 2- Check & validates all the form data
// userController.register,        // 3 - registrer the user 
// authController.login           // 4- automatic login the user 
// ); 


// //LOG OUT = authController
// router.get('/logout', authController.logout);

module.exports = router;

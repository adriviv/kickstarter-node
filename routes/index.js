const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');

const projectController = require('../controllers/projectController');

// All the routes
// router.get('/', projectController.homePage);

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




// For static page can be done here: 
// ==> router.get('/', (req, res) => {
//     res.render('index');
// })

module.exports = router;

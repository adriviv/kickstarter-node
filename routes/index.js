const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');

const projectController = require('../controllers/projectController');


//                            PROJECTS 
//==================================================
//INDEX
router.get('/', catchErrors(projectController.getProjects));
router.get('/projects', catchErrors(projectController.getProjects));

// SHOW
router.get('/project/:slug', catchErrors(projectController.showProjectBySlug))


// ADD
router.post('/add', 
    catchErrors(projectController.createProject)
);

//UPDATE
router.post('/add/:id', catchErrors(projectController.updateProject));



module.exports = router;

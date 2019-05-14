const mongoose = require('mongoose');
const Project = mongoose.model('Project');


// upload images setups
// =====================================
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    // 1- first store the image in the tempoprary memory
     storage: multer.memoryStorage(),
    // 2- What kind of file is ok  
    fileFilter(req, file, next){
        const isPhoto = file.mimetype.startsWith('image/') ;// here all image format. 'image/jpeg' say only jpeg
        if(isPhoto) {
            next(null, true);
        } else {
             next({ message: 'That type of file is not allowed'}, false);
        }
    }
 };
// =====================================



// =====================================
//                  PROJECTS 
// =====================================
//INDEX
exports.getProjects = async (req, res) => {
    // res.json({ it: 'Worked'})
    const projects = await Project.find();
    res.json({projects: projects});
};

//SHOW
exports.showProjectBySlug = async (req, res, next) => {
     res.json(req.params);
    // const project = await Project.findOne({ slug: req.params.slug});
    // if (!project) return next();
    // res.json(project);

};

// CREATE
exports.createProject = async (req, res) => {
    // console.log(req.body)
    const project = new Project(req.body);
    await project.save();
    res.json({ status: 'created'});
};

// UPDATE
exports.updadeProject = async (req, res) => {

};



const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const User = mongoose.model('User');

// // upload images setups
// // =====================================
// const multer = require('multer');
// const jimp = require('jimp');
// const uuid = require('uuid');

// const multerOptions = {
//     // 1- first store the image in the tempoprary memory
//      storage: multer.memoryStorage(),
//     // 2- What kind of file is ok  
//     fileFilter(req, file, next){
//         const isPhoto = file.mimetype.startsWith('image/') ;// here all image format. 'image/jpeg' say only jpeg
//         if(isPhoto) {
//             next(null, true);
//         } else {
//              next({ message: 'That type of file is not allowed'}, false);
//         }
//     }
//  };
// // =====================================


//=================================================
//                      PROJECT CRUD 
//=================================================
//INDEX
exports.getProjects = async (req, res) => {
    // res.json({ it: 'Worked'})
    const projects = await Project.find().populate('author projects');
    // let sum = await (this.pledge).reduce((sum, x) => sum + x);

    res.json({projects: projects});
};

//SHOW
exports.showProject = async (req, res) => {
    //  res.json(req.params);
     const project = await Project.findOne({ _id: req.params.slug }).populate('author projects');
     res.json(project);
};

// CREATE
exports.addProject = async (req, res) => {
    req.body.author = req.user._id; // make the reference to the user that has created the store. 
    const project = new Project(req.body);
    await project.save();
    res.json({ status: 'created'});
};

//UPDATE
exports.updateProject = async (req, res) => {
    //console.log(req.body)
    const project = await Project.findOneAndUpdate({ slug: req.params.id}, req.body, {
        new: true, // return the new store instead of the old one
        runValidators: true // run les validators du models
     }).exec();
     res.json({ status: 'updated' });
};


//=================================================
//                     TAGS
//=================================================
exports.getProjectsByTag = async (req, res) => {
    //res.json({it: "work"});
    // console.log(req.params)
    const tag = req.params.tag;
    const tagQuery = tag || {$exists: true}; // when no tags specify , show all 
    const tagsPromise = Project.getTagsList();
    const projectsPromise = Project.find({ tags: tagQuery});
    const [tags, projects] = await Promise.all([tagsPromise, projectsPromise]); // We do 2 queries and wait for both finish to go to next step 
    res.json({ tags, title: 'Tags', tag, projects});
 };



//=================================================
//                     USER DASHBOARD
//=================================================
exports.getProjectDashboard = async (req, res) => {
        console.log(req.params)
        const project = await Project.find({ author: req.params.id });
        res.json(project);
}; 


//=================================================
//                     SEARCH BAR
//=================================================
exports.searchProjects = async (req, res) => {
     const top = req.body.searchKeyword
    if (top.length >= 3){
        const project = await Project.find(
            { name: { '$regex' : req.body.searchKeyword, '$options' : 'i' } } ||
            { description: { '$regex' : req.body.searchKeyword, '$options' : 'i' } } 
            ).populate('author projects');
        res.json(project);
    } else {
        res.json()
    } 
}; 


//=================================================
//                     ADD TO FAVORITES
//=================================================
exports.heartStore = async (req, res) => {
    // 1 - list all the hearts id 
    const hearts = req.user.hearts.map(obj => obj.toString()); 
    // 2 -  check if the heart is already in the array : if it is we remove, otherwise we add 
    const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet' ; // MongoDb method => $pull = rm / push = add / BUT bc we want to be unique we usse $addToSet
    const user = await User
    .findByIdAndUpdate(req.user._id,
        { [operator]: { hearts: req.params.id }},
        { new: true }
    );
    res.json(user); // when click on the heart should add one store in the list of heart , if already favorites shoud remove one 
    // to check the heart color active or not ==> cf storeCard.pug ligne 9 - 13
    // to make the hart stay red or white without reload the page => CF public/javascript/heart.js 
};
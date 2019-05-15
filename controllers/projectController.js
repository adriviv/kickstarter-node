const mongoose = require('mongoose');
const Project = mongoose.model('Project');


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
    const projects = await Project.find();
    res.json({projects: projects});
};

//SHOW
exports.showProject = async (req, res) => {
    //  res.json(req.params);
     const project = await Project.findOne({ _id: req.params.slug });
     res.json(project);
};

// CREATE
exports.addProject = async (req, res) => {
    console.log(req.params)
    const project = new Project(req.body);
    console.log('1')
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



// //=========================================================================.
// exports.getStoresByTag = async (req, res) => {
//     // res.send('it works') // test if the routes is working 
//     const tag = req.params.tag;
//     const tagQuery = tag || {$exists: true}; // when no tags specify , show all 

//     const tagsPromise = Store.getTagsList(); // create our ow method get TagsList in Store Model to fin tags 
//     const storesPromise = Store.find({ tags: tagQuery});
//     const [tags, stores] = await Promise.all([tagsPromise, storesPromise]); // We do 2 queries and wait for both finish to go to next step 
//     // res.json(stores); // intermediary step to see info of store we have
//     // res.json(tags); // intermediary step to see info of tags

//      res.render('tag', { tags, title: 'Tags', tag, stores})
// };
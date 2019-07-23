const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const User = mongoose.model('User');


//=================================================
//                      PROJECT CRUD 
//=================================================
//INDEX
exports.getProjects = async (req, res) => {
    const projects = await Project.find().sort({ created: 'desc' }).populate('author projects');
    res.json({projects: projects});
};

//SHOW
exports.showProject = async (req, res) => {
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
    const project = await Project.findOneAndUpdate({ slug: req.params.id}, req.body, {
        new: true,
        runValidators: true
     }).exec();
     res.json({ status: 'updated' });
};


//=================================================
//                     TAGS
//=================================================
exports.getProjectsByTag = async (req, res) => {
    const tag = req.params.tag;
    const tagQuery = tag || {$exists: true}; 
    const tagsPromise = Project.getTagsList();
    const projectsPromise = Project.find({ tags: tagQuery});
    const [tags, projects] = await Promise.all([tagsPromise, projectsPromise]); 
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
    res.json(user); 
};

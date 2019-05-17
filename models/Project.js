const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

// SCHEMA
const projectSchema = new mongoose.Schema({
name: {
    type: String, 
    trim: true, 
    required: 'Please enter a project name!'
},
slug: String, 
description: {
    type: String, 
    trim: true
}, 
created: {
    type: Date, 
    default: Date.now
},
author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
},
photo: String, 
tags: [String]
});

//====================================================================
//                                      TAGS
//====================================================================
// Our OWN FUnction  to find Tags
projectSchema.statics.getTagsList = function() { // statics make our own method work
    return this.aggregate([ //Agregate is like findById for many parameters for Mongo
        // to know the diff agregate operators check MongoDb doc
        { $unwind: '$tags'},
        { $group: { _id: '$tags', count: { $sum: 1 } } }, // group everything based on the tag field  and create a new field count that sum +1 each time
        { $sort: { count: -1 } }// sort by most popular (1 is ascending, -1 is descending)
    ]);
};


module.exports = mongoose.model('Project', projectSchema);
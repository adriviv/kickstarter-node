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

photo: String, 
tags: [String]
});

module.exports = mongoose.model('Project', projectSchema);
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
pledgeObjective: {
    type: Number,
    required: 'You must supply an objective'
},
expireAt: {
    type: Date,
    validate: [ function(v) {
        return (v - new Date()) <= 2628000000;
    }, 'Cannot expire more than 60 seconds in the future.' ],
    default: function() {
        return new Date(new Date().valueOf() + 2628000000);
    }
},
photo: String, 
tags: [String],
},
{
toJSON: { virtuals: true},
toObject: {virtuals: true},
});

//====================================================================
//                                      TAGS
//====================================================================

projectSchema.statics.getTagsList = function() { 
    return this.aggregate([
        { $unwind: '$tags'},
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
};



//====================================================================
//                                    PLEDGE + REVIEWS AUTOPOULTATE
//====================================================================

projectSchema.virtual('pledges', {
    ref: 'Pledge',  
    localField: '_id', 
    foreignField: 'project' 
});

projectSchema.virtual('reviews', {
    ref: 'Review', 
    localField: '_id', 
    foreignField: 'project'
});

function autopopulate(next) {
    this.populate('pledges');
    this.populate('reviews');
    next();
    };


projectSchema.pre('find', autopopulate);
projectSchema.pre('findOne', autopopulate);



projectSchema.virtual('sumOfPledges').get(function () { 
    Array.prototype.sum = function (prop) {
        var total = 0
        for ( var i = 0, _len = this.length; i < _len; i++ ) {
            total += this[i][prop]
        }
        return total
    }
    return this.pledges.sum("pledge")
});


module.exports = mongoose.model('Project', projectSchema);

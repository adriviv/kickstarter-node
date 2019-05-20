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
tags: [String],
},
{
toJSON: { virtuals: true}, // allow you see with pre=h.dump(store) all the virtual JSON and virtual Objects
toObject: {virtuals: true},
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



//====================================================================
//                                    PLEDGE + REVIEWS AUTOPOULTATE
//====================================================================
// //find reviews where the stores _id property === reviews store property
projectSchema.virtual('pledges', {
// Tell to go off to an other model and make a query
    ref: 'Pledge',  // what model to link
    localField: '_id', // witch field on the store
    foreignField: 'project' // witch fields on the review
});

projectSchema.virtual('reviews', {
// Tell to go off to an other model and make a query
    ref: 'Review',  // what model to link
    localField: '_id', // witch field on the store
    foreignField: 'project' // witch fields on the review
});
    
function autopopulate(next) {
    this.populate('pledges');
    this.populate('reviews');
    next();
    };


projectSchema.pre('find', autopopulate);
projectSchema.pre('findOne', autopopulate);



projectSchema.virtual('sumOfPledges').get(function () {
    // const pledges = this.pledges 
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
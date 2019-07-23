const mongoose = require ('mongoose');
mongoose.Promise = global.Promise;

const pledgeSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author!'
    },
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: 'You must supply a project!'
    },
    pledge: {
        type: Number, 
        required: 'Your pledge must have a text!'
    },

});


function autopopulate(next) {
    this.populate('author');
    next();
}

pledgeSchema.pre('find', autopopulate);
pledgeSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Pledge', pledgeSchema);

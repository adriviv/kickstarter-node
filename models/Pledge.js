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

// EACH OF AUTHOR INFORMATION WILL BE ACCESSIBLE thanks to that
//=======================================================
// when the author is queried , it automaticcaly autopopulate for us that we need information abot the author
// c'est pour transformer le author qui est 5362C3jhc4444YY4 en username, avatar etc .. 
function autopopulate(next) {
    this.populate('author');
    next();
}

pledgeSchema.pre('find', autopopulate);
pledgeSchema.pre('findOne', autopopulate);
//=======================================================



// Then go to sart.js to require it. 

module.exports = mongoose.model('Pledge', pledgeSchema);

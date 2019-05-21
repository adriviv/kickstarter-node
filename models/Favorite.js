const mongoose = require ('mongoose');
mongoose.Promise = global.Promise;

const favoriteSchema = new mongoose.Schema({
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
    favorite: {
        type: Number,
        required: 'Your review must have a text!'
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

favoriteSchema.pre('find', autopopulate);
favoriteSchema.pre('findOne', autopopulate);
//=======================================================


// Then go to sart.js to require it. 

module.exports = mongoose.model('Favorite', favoriteSchema);

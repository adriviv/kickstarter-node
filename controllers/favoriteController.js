const mongoose = require('mongoose'); // have access to database
const Favorite = mongoose.model('Favorite');



//UPDATE
exports.favorites = async (req, res) => {
    //console.log(req.body)

   console.log('2')
    const favorite = await Favorite
    .findByIdAndUpdate(req.user._id,
        { [operator]: { favorite: req.body.favorite }},
        { new: true }
    );
    res.json(favorite)
};
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postText : { 
        type: String ,
        required : true,
    },
    image : { 
        type: String, 
        required: true 
    },
    createdBy : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },
    board: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Board' 
    }, 
    likes: [
        {
             type: mongoose.Schema.Types.ObjectId, 
             ref: 'User' 
        
        }],
    comments: [
        { type: mongoose.Schema.Types.ObjectId, 
            ref: 'Comment' }],
    tags: [{ type: String }], 
}, { 
    timestamps: true 
});


module.exports = mongoose.model('Post', postSchema);
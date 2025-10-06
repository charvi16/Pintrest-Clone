const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  fullname: String,
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true },  
  instagram: String,                         
  gender: { type: String, enum: ['male', 'female', 'other'] },
  dp: {
    data: Buffer,
    contentType: String
  },                              
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

userSchema.plugin(plm, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const plm = require("passport-local-mongoose")

// Define the schema for the user
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    email: {
        type: String,
        required: true,
        unique: true
    },
    profileImage: {
        type: String,
        required: false // Assuming profile picture is stored as a URL or File Path
    },
    fullname: {
        type: String,
        required: true
    },
    boards: {
        type: Array,
        default: []
    }
});

userSchema.plugin(plm);
// Create the user model
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

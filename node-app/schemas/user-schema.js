const sha256 = require('sha256');

const mongoose = require("mongoose")
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name of the user is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email required for sign-up/sign-in"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password required to sign-up/sign-in"],
        trim: true
    }
});

userSchema.pre("save", function(next){
    const user = this;
    if(!user.isModified || !user.isNew) {
        next();
    } else {
        user.password = sha256(user.password);
        next();
    }
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel
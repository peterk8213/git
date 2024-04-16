const { required } = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,'Please provide name'],
        minlength: [3, 'Name must be at least 3 characters'],
        maxlength: [50, 'name cannot be more than 50 characters']
    },
    email:{
        type: String,
        required:[true,'Please provide email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Invalid Email'],

        unique: true,

    },
    password:{
        type: String,
        required:[true,'Please provide password'],
        minlength:6,
    }
})

UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

UserSchema.methods.createJWT  = function(){
    return jwt.sign({userId:this._id,name:this.name}, process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRATION})
}

UserSchema.methods.comparePassword = async function (candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch;
};

module.exports = mongoose.model('User', UserSchema)
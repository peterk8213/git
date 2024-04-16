 const { required } = require('joi');
const mongoose = require('mongoose')

 const JobSchema = new mongoose.Schema({
    company:{
        type: String,
        required: [true, "please Provide company name"],
        maxlength: 50
    },
    position:{
        type: String,
        required: [true, "please Provide position"],
        maxlength: 100
    },
    status:{
        type: String,
        enum:['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy:{
        type: mongoose.Types.ObjectId
    }
 },{timestamps: true})


 // export the Schema

 module.exports = mongoose.model('Job', JobSchema);

const Job = require('../models/Job');
const {StatuCodes, StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')


const getAllJobs = async (req,res)=>{
    const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs,count:jobs.length})
}
 
const getJob = async (req,res)=>{
    const {user:{userId}, params:{id:jobId}} = req;
    const job = await Job.findOne({_id:req.params.jobId,createdBy:req.user.userId});
     if(!job){
        throw new NotFoundError("No Job with id "+ req.params.jobId)
    };
     
    res.status(StatusCodes.OK).json({job});
}
const createJob = async (req,res)=>{
    // adds the userId to the request body of the job object
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}
const deleteJob = async (req,res)=>{
    // delete job from database
    const job = await Job.findByIdAndRemove({_id:req.params.jobId});
    if(!job){
        throw new NotFoundError(`No job with id ${req.params.jobId}`);
    }
    res.status(StatusCodes.OK).json({message:"Job deleted successfully", job});
}

// const deleteAllJobs = async (req,res)=>{
//     const job = await Job.findByIdAndDelete({createdBy:req.user.userId})
//     if(!job){
//         throw new NotFoundError(`no jobs found for ${req.user.name}`);
//     }
//     res.status(StatusCodes.OK).json({n:job.deletedCount || 0,Message:"Deleted!"})
// }


const updatejob = async (req,res)=>{
    const{
        body: {company,position},
        user:{userId},
        params:{id:jobId}
    } = req;

    if(company === "" || position === ''){
        throw new BadRequestError("Please provide at least one field to be updated");
    }
    const job = await Job.findOneAndUpdate({_id:req.params.jobId,createdBy:req.user.userId},req.body,{new:true, runValidators: true});

    if(!job){
        throw new NotFoundError(`No job with id ${req.params.jobId}`);
    }
    res.status(StatusCodes.OK).json(job);

}

module.exports = {getAllJobs,getJob,updatejob,deleteJob,createJob};
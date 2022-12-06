const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAlljobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userID }).sort("createdAt");
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

const getJob = async (req, res) => {
  const userID = req.user.userID;
  const jobID = req.params.id;
  // const {user:{userID}, params:{id: jobsID}} = req

  const job = await Job.findOne({
    _id: jobID,
    createdBy: userID,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobID}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const userID = req.user.userID;
  const jobID = req.params.id;

  const { company, position } = req.body;

  if (company === "" || position === "") {
    throw new BadRequestError("Please provide both company and position");
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobID, createdBy: userID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!job) {
    throw new BadRequestError(`No job with id ${jobID}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const jobID = req.params.id;
  const userID = req.user.userID;

  const job = await Job.findOneAndDelete({ _id: jobID, createdBy: userID });
  if (!job) {
    throw new BadRequestError(`No job with id ${jobID}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

module.exports = {
  getAlljobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};

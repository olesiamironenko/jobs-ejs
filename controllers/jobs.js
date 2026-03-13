const Job = require("../models/Job");
const parseValidationErrs = require("../utils/parseValidationErrs");
const csrf = require("host-csrf");

const csrfMiddleware = csrf.csrf();

// build job data from request body
function buildJobAttributes(req) {
  const { companyName = "", positionName = "", status } = req.body;
  return {
    companyName: companyName.trim(),
    positionName: positionName.trim(),
    status: status || "pending"
  };
}

// find job by id and make sure it belongs to the logged in user, otherwise redirect
async function findOwenedJobOrRedirect(req, res, jobId) {
  const job = await Job.findOne({ _id: jobId, createdBy: req.user.id });
  if (!job) {
    req.flash("error", "Job not found.");
    res.redirect("/jobs");
    return null;
  }
  return job;
}

// controllers for each route handler
// GET /jobs (display all the job listings belonging to this user)
const jobsIndex = async (req, res, next) => {
  try {
    csrf.refreshToken(req, res);

    const jobs = await Job
      .find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });
    res.render("jobs", { jobs });
  } catch (err) { 
    next(err) 
  };
}

// GET /jobs/new (Put up the form to create a new entry)
const jobsNewShow = (req, res) => {
  csrf.refreshToken(req, res);
  res.render("job", { job: null });
}

// POST /jobs (Add a new job listing)
const jobsCreate = async (req, res, next) => {
  try {
    const attrs = buildJobAttributes(req);
    await Job.create({
      ...attrs,
      createdBy: req.user.id
    });
    req.flash("info", "Job created.");
    res.redirect("/jobs");
  } catch (e) {
    if (e?.name === "ValidationError") {
      parseValidationErrs(e, req);
      csrf.refreshToken(req, res);

      return res.status(400).render("job", { 
        job: buildJobAttributes(req), 
        errors: req.flash("error") });
    }
    return next(e);
  }
}

const jobsEditShow = async (req, res, next) => {
  try {
    csrf.refreshToken(req, res);
    const job = await findOwenedJobOrRedirect(req, res, req.params.id);
    if (!job) return;
    res.render("job", { job });
  } catch (e) {
    return next(e);
  }
}

const jobsUpdate = async (req, res, next) => {
  try {
    const job = await findOwenedJobOrRedirect(req, res, req.params.id);
    if (!job) return;

    const attrs = buildJobAttributes(req);
    Object.assign(job, attrs);
    await job.save();

    req.flash("info", "Job updated.");
    res.redirect("/jobs");
  } catch (e) {
    if (e?.name === "ValidationError") {
      parseValidationErrs(e, req);
      csrf.refreshToken(req, res);

      const job = {
        _id: req.params.id,
        ...buildJobAttributes(req)
      };

      return res.status(400).render("job", { job, errors: req.flash("error") });
    }
    return next(e);
  }
}

const jobsDelete = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });

    if (!job) {
      req.flash("error", "Job not found."); 
      return res.redirect("/jobs");
    }

    req.flash("info", "Job deleted.");
    res.redirect("/jobs");
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  jobsIndex,
  jobsNewShow,
  jobsCreate,
  jobsEditShow,
  jobsUpdate,
  jobsDelete
}
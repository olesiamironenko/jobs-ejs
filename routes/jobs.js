const express = require("express");
const router = express.Router();
const csrf = require("host-csrf");

const csrfMiddleware = csrf.csrf();

const { 
  jobsIndex, 
  jobsNewShow, 
  jobsCreate, 
  jobsEditShow, 
  jobsUpdate,
  jobsDelete
 } = require("../controllers/jobs");

router.get("/", jobsIndex)
router.get("/new", jobsNewShow)
router.get("/edit/:id", jobsEditShow)

router.post("/", csrfMiddleware, jobsCreate);
router.post("/update/:id", csrfMiddleware, jobsUpdate);
router.post("/delete/:id", csrfMiddleware, jobsDelete);

module.exports = router;
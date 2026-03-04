const express = require("express");
const passport = require("passport");
const csrf = require("host-csrf");

const router = express.Router();

const { 
  logonShow,
  registerShow,
  registerDo,
  logoff,
} = require("../controllers/sessionController");

const csrfMiddleware = csrf.csrf();

router.route("/register").get(registerShow).post(csrfMiddleware, registerDo);
router
  .route("/logon")
  .get(logonShow)
  .post(
    csrfMiddleware,
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/sessions/logon",
      failureFlash: true,
    })
  );
router.route("/logoff").post(csrfMiddleware, logoff);

module.exports = router;
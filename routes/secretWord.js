const express = require("express");
const router = express.Router();

const csrf = require("host-csrf");
const csrfMiddleware = csrf.csrf();

router.get("/", (req, res) => {
  csrf.refreshToken(req, res);
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }
  res.render("secretWord", { secretWord: req.session.secretWord });
});

router.post("/", csrfMiddleware, (req, res) => {
  const word = (req.body.secretWord || "").toUpperCase();

  if (!word) {
    req.flash("error", "Secret word can't be empty!");
    return res.redirect("/secretWord");
  }

  if (word.startsWith("P")) {
    req.flash("error", "That word won't work!");
    req.flash("error", "You can't use words that starts with 'P'!");
  } else {
    req.session.secretWord = req.body.secretWord;
    req.flash("info", "Secret word was changed.");
  }
  return res.redirect("/secretWord");
});

module.exports = router;
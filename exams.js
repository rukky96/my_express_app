const express = require("express");

const router = express.Router();

router.get("/", function(req, res){
    res.send("This is the Exams Page");
});

router.get("/biology", function(req, res){
    res.send("This is the biology exams page");
});

module.exports = router;
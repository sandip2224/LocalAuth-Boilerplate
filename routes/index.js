const express = require('express')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const router = express.Router()

// Welcome page
router.get("/", forwardAuthenticated, (req, res) => {
    res.render("welcome")
})

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        user: req.user.name
    })
})



module.exports = router
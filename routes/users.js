const express = require('express')
const validator = require('validator')
const bcrypt = require('bcrypt')
const passport = require('passport')
const router = express.Router()

const userModel = require("../models/User")

router.get("/login", (req, res) => {
    res.render("login")
})

router.get("/register", (req, res) => {
    res.render("register")
})

router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = []

    // Check all required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields" })
    }
    // Check if passwords match
    if (validator.equals(password, password2) === false) {
        errors.push({ msg: "Passwords do not match" })
    }
    // Check pass length
    if (validator.isLength(password, { min: 6 }) === false) {
        errors.push({ msg: "Password should be atleast 6 characters" })
    }

    if (validator.isEmail(email) === false) {
        errors.push({ msg: "Email is not valid" })
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else { // Validation passed
        userModel.findOne({ email: email })
            .then(user => {
                if (user) {
                    // User already exists
                    errors.push({ msg: "Email is already in use!!" })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                }
                else {
                    // User not found
                    bcrypt.hash(password, 10, (err, hash) => {
                        const newUser = new userModel({
                            name: name,
                            email: email,
                            password: hash
                        })
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in')
                                res.redirect("/users/login")
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    });
                }
            })
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
})

module.exports = router
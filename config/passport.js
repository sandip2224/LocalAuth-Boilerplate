const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userModel = require('../models/User')

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match user
            userModel.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'That email is not registered!' })
                    }
                    // Match passswords
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (err) throw err
                        if (result) return done(null, user)
                        else return done(null, false, { message: 'Password incorrect!' })
                    });
                })
                .catch(err => {
                    console.error(err)
                })

        })
    )
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        userModel.findById(id, (err, user) => done(err, user))
    })
}
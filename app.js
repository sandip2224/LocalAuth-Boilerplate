const express = require('express')
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
require('dotenv').config({ path: './config/config.env' })

require('./config/passport')(passport)
const connectDB = require('./config/db')
const app = express()

// Mongoose Setup
connectDB()

// EJS setup
app.use(expressLayouts)
app.set('view engine', 'ejs')

// BodyParser
app.use(express.urlencoded({ extended: false }))

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash middleware
app.use(flash())

// Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

// Routes
app.use('/', require("./routes/index"))
app.use('/users', require("./routes/users"))

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

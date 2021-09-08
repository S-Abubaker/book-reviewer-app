const express = require('express')
const { ensureAuth, ensureGuest } = require('../middleware/auth.js')

const Review = require('../models/Review.js')
const router = express.Router();

// login page
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// home page
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user.id }).lean()
        res.render('homepage', {
            name: req.user.firstName,
            reviews
        })
    } catch (error) {
        console.error(err)
        res.render('error/500')
    }
    
})

module.exports = router
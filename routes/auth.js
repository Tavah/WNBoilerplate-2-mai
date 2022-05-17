const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc GOOGLE OAuth2
// @route GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile']}))

// @desc OAuth2 Callback
// @route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard')
})

// @desc User Logout
// @route /auth/logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router
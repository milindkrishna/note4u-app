const express = require('express');
const Router = express.Router();

const passport = require('passport');

var GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/User')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    proxy: true
  },

  async function(accessToken, refreshToken, profile, done) {
    // we can check the profile when someone signup with below log
    //console.log(profile);

    const newUser = {
      googleId: profile.id,
      displayName: profile.displayName,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      profileImage: profile.photos[0].value
    }

    try {
      // existing user then login directly
      let user = await User.findOne({googleId: profile.id})

      if(user){
        done(null,user)
      } else {
        // non existing user then signup and login
        user = await User.create(newUser)
        done(null,user);
      }

    } catch (error) {
      console.log(error);
    }
  }
));

// Google Login Route

Router.get('/auth/google',
  // just add email to the scope
  passport.authenticate('google', { scope: ['email','profile'] }));

Router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login-failure',
    successRedirect: '/dashboard'
  }),

);


// Route if something went wrong
Router.get('/login-failure',(req,res) => {
  res.send('Something went wrong.....')
})


// Destroy user session (logout)
Router.get('/logout',(req,res)=> {
  req.session.destroy(error => {
    if(error){
      console.log(error);
      res.send('Error Logging Out')
    } else {
      res.redirect('/')
    }
    
  })
})


// persists user data after successful authentication
passport.serializeUser(function(user,done){
  done(null,user.id);
})


// retrieve user data from session
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});



module.exports = Router;

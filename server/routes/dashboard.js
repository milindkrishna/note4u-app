const express = require('express');
const Router = express.Router();

// we use the checkauth.js with isLoggedIn over here
const {isLoggedIn} = require('../middleware/checkauth')
const dashboardcontroller = require('../controllers/dashboardcontroller');

// dashboard route with controller
Router.get('/dashboard',isLoggedIn,dashboardcontroller.dashboard);

// dashboard route to get specific note using id and update inside that note using put method
Router.get('/dashboard/item/:id',isLoggedIn,dashboardcontroller.dashboardViewNote);
Router.put('/dashboard/item/:id',isLoggedIn,dashboardcontroller.dashboardUpdateNote);

// delete the dashboard 
Router.delete('/dashboard/item-delete/:id', isLoggedIn, dashboardcontroller.dashboardDeleteNote);

// add the note and submit the note
Router.get('/dashboard/add', isLoggedIn, dashboardcontroller.dashboardAddNote);
Router.post('/dashboard/add', isLoggedIn, dashboardcontroller.dashboardAddNoteSubmit);

// search the note and submit the search route
Router.get('/dashboard/search', isLoggedIn, dashboardcontroller.dashboardSearch);
Router.post('/dashboard/search', isLoggedIn, dashboardcontroller.dashboardSearchSubmit);


module.exports = Router;
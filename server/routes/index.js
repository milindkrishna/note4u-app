const express = require('express');
const Router = express.Router();
const mainController = require('../controllers/maincontrollers');

Router.get('/',mainController.homepage)
Router.get('/about',mainController.about)
Router.get('/faq',mainController.faq)
module.exports = Router;
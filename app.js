require('dotenv').config();

const express = require('express');
const expresslayouts = require('express-ejs-layouts');
// used to use put method
const methodOverride = require('method-override')
const connectdb = require('./server/config/db');

// help store sessions in our database (express-session)
const session = require('express-session');
// authentication middleware for nodejs
const passport = require('passport');
// store session for connect and express
const MongoStore = require('connect-mongo');



const app = express();
const PORT = process.env.PORT || 5000;

// creating a session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    // cookie: { maxAge: new Date ( Date.now() + (3600000) ) }
    // formulae -> Date.now() - days * 24 * 60 * 60 * 1000

}));

// initializing passport and session
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(methodOverride("_method"));

// connect to database
connectdb();

// static files
app.use(express.static('public'));

// template engine
app.use(expresslayouts);
app.set('layout','./layouts/main');
app.set('view engine','ejs');



// auth route
app.use('/',require('./server/routes/auth'))

// main routes
app.use('/',require('./server/routes/index'));

// dashboard route
app.use('/',require('./server/routes/dashboard'));

// handle 404 error page route
app.use('*',function(req,res){
    res.status(404).send('<div style="text-align: center; background: #BED9F7; padding: 200px; margin: 50px"><div style="width: 500px; margin: 0 auto; color: #12296C; font-size: 80px; font-family: "Lucida Console", "Courier New", monospace;">404 | OOPS! PAGE NOT FOUND</div></div>');
    // if(req.user){
    //     res.status(404).render('404',{
    //         user:req.user
    //     });
    // } else {
    //     res.render('404', { user: null });
    //   }
    
});

app.listen(PORT,() => {
    console.log(`App listening to port ${PORT}`);
})

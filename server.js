// Load in env variables and set them in process.env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require("express")
const app = express();
const bcrypt = require('bcrypt') //hashes users pws
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.static('public'));

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/node-proud");
const nameSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String
});

//this names the collection
let volunteer = mongoose.model("Volunteer", nameSchema);

// route that posts names to MongoDB
app.post("/addname", (req, res) => {
  let myData = new volunteer(req.body);
  myData.save()
   .then(item => {
     res.status(204).send("Thank you for showing interest!") //TODO: Modal
    })
   .catch(err => {
     res.status(400).send("oops something went wrong.") //TODO: Make into a modal
   });
});


// Gets the json data from mongodb
app.get("/signups", (req, res) => {
  volunteer.find({}, function(err, foundData) {
    if(err){
      res.send('Oops, something went wrong!');
      next();
    }
    res.json(foundData);
  });
});


const initializePassport = require('./passport-config')
initializePassport(
  passport, 
  email =>  users.find(user => user.email === email),
  id => users.find(user => user.id === id)
  )

//stores in local variable //in memory DO NOT USE IN PRODUCTION
const users = []; 

// Set view engine
app.set("view-engine", "ejs")
//this allows us to get info from forms 
app.use(express.urlencoded({ extended: false }))
// flash
app.use(flash())
// session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, // should I resave sesh variables?
  saveUninitialized: false //do you want to save empty val in session?
}))
// Passport 
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// ROUTE set up 
app.get('/welcome', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name });
});
  
// Set ROUTES for login
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});
// POST method for login
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  sucessRedirect: '/welcome', 
  failureRedirect: '/login',
  failureFlash: true
}), (req, res) => {
  res.redirect('/welcome'); 
})
// Set ROUTES for register
app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs');
});

// POST to the route named "/register" (this is entire app for registering users)
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register');
  } 
  console.log(users)
  //every time we save our app and it reloads this var users will be reset to an empty array. Everytime you make a change you're going to have to readd our user
})

// LOGOUT
app.delete('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
});

// Middleware func FOR PROTECTING ROUTES
function checkAuthenticated(req, res, next) { 
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login');
};

// function that keeps an authenticated user from going back to login page or register
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next()
};

// PORT
app.listen(3000, ()=> {
  console.log('listening on port 3000!');
}); 

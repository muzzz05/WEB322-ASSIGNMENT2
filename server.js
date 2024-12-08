/********************************************************************************
* WEB322 – Assignment 06
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Muzammil Khan Student ID: 173013228 Date: 05th December 2024
*
* Published URL: https://vercel.com/muzammil-khans-projects-f1041360/web-322-assignment-2/6h2G5njCK6JQ111hYf5c7h8Sh1c7 <--- Same link, used for the previous assignments
*
********************************************************************************/

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const projects = require('./modules/projects');
const clientSessions = require('client-sessions');
const authData = require('./modules/auth-service');
require('dotenv').config();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// MongoDB Connection
mongoose.connect('mongodb+srv://makhan118:O5qIU4vmt54J9qMx@cluster0.k6hsk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit process if connection fails
  });

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.static('public')); // Serve static files
app.use(clientSessions({
  cookieName: 'session',
  secret: 'web322_assignment6_secret',
  duration: 2 * 60 * 60 * 1000, // 2 hours
  activeDuration: 1000 * 60 * 5, // 5-minute extension
}));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ensure login middleware
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

// Routes
app.get('/', (req, res) => res.render('home', { page: '/' }));
app.get('/about', (req, res) => res.render('about', { page: '/about' }));

app.get('/projects/limited', async (req, res, next) => {
  try {
    const projectsList = await projects.getAllProjects();
    res.json(projectsList.slice(0, 3));
  } catch (err) {
    next(err);
  }
});

app.get('/solutions/projects', async (req, res, next) => {
  try {
    const projectsList = req.query.sector
      ? await projects.getProjectsBySector(req.query.sector)
      : await projects.getAllProjects();
    res.render('projects', { projects: projectsList });
  } catch (err) {
    next(err);
  }
});

app.get('/solutions/projects/:id', async (req, res, next) => {
  try {
    const project = await projects.getProjectById(req.params.id);
    res.render('project', { project });
  } catch (err) {
    next(err);
  }
});

app.get('/solutions/addProject', async (req, res, next) => {
  try {
    const sectors = await projects.getAllSectors();
    res.render('addProject', { sectors });
  } catch (err) {
    next(err);
  }
});

app.post('/solutions/addProject', async (req, res, next) => {
  try {
    await projects.addProject(req.body);
    res.redirect('/solutions/projects');
  } catch (err) {
    next(err);
  }
});

app.get('/solutions/editProject/:id', async (req, res, next) => {
  try {
    const project = await projects.getProjectById(req.params.id);
    const sectors = await projects.getAllSectors();
    res.render('editProject', { project, sectors });
  } catch (err) {
    next(err);
  }
});

app.post('/solutions/editProject', async (req, res, next) => {
  try {
    await projects.editProject(req.body.id, req.body);
    res.redirect('/solutions/projects');
  } catch (err) {
    next(err);
  }
});

app.get('/solutions/deleteProject/:id', async (req, res, next) => {
  try {
    await projects.deleteProject(req.params.id);
    res.redirect('/solutions/projects');
  } catch (err) {
    next(err);
  }
});

app.get('/register', (req, res) => res.render('register', { errorMessage: "", successMessage: "", userName: "" }));

app.post('/register', async (req, res, next) => {
  try {
    await authData.registerUser(req.body);
    res.render('register', { errorMessage: "", successMessage: "User created", userName: "" });
  } catch (err) {
    next(err);
  }
});

app.get('/login', (req, res) => res.render('login', { errorMessage: "", userName: "" }));

app.post('/login', async (req, res, next) => {
  try {
    req.body.userAgent = req.get('User-Agent');
    const user = await authData.checkUser(req.body);
    req.session.user = { userName: user.userName, email: user.email, loginHistory: user.loginHistory };
    res.redirect('/solutions/projects');
  } catch (err) {
    next(err);
  }
});

app.get('/logout', (req, res) => {
  req.session.reset();
  res.redirect('/');
});

app.get('/userHistory', ensureLogin, (req, res) => res.render('userHistory'));

// 404 for unknown routes
app.use((req, res) => res.status(404).render('404', { message: 'Page not found.' }));

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { message: err.message || 'An unexpected error occurred.' });
});

// Initialize Projects and Auth
projects.initialize()
  .then(authData.initialize)
  .then(() => app.listen(HTTP_PORT, () => console.log(`Server running on port ${HTTP_PORT}`)))
  .catch((err) => console.error(`Unable to start server: ${err}`));

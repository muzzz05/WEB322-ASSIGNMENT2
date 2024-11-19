/********************************************************************************
* WEB322 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Muzammil Khan Student ID: 173013228 Date: 18th November 2024
*
* Published URL: https://vercel.com/muzammil-khans-projects-f1041360/web-322-assignment-2/6h2G5njCK6JQ111hYf5c7h8Sh1c7 <--- Same link, used for the previous assignments
*
********************************************************************************/

const express = require('express');
const path = require('path');
const projects = require('./modules/projects'); // Import projects module

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.static('public')); // Serve static files

// Home Route
app.get('/', (req, res) => {
  res.render('home', { page: '/' });
});

// About Page
app.get('/about', (req, res) => {
  res.render('about', { page: '/about' });
});

app.get('/projects/limited', async (req, res) => {
  try {
    const projectsList = await projects.getAllProjects();
    const limitedProjects = projectsList.slice(0, 3); // Select the first 3 projects
    res.json(limitedProjects); // Send as JSON
  } catch (err) {
    res.status(500).json({ error: `Error fetching projects: ${err.message}` });
  }
});


// Render All Projects Page
app.get('/solutions/projects', async (req, res) => {
  try {
    const { sector } = req.query;
    const projectsList = sector
      ? await projects.getProjectsBySector(sector)
      : await projects.getAllProjects();
    res.render('projects', { projects: projectsList });
  } catch (err) {
    res.render('500', { message: `Error fetching projects: ${err.message}` });
  }
});

// Render Individual Project Page
app.get('/solutions/projects/:id', async (req, res) => {
  try {
    const project = await projects.getProjectById(req.params.id);
    res.render('project', { project });
  } catch (err) {
    res.render('500', { message: `Error fetching project: ${err.message}` });
  }
});

// Render Add Project Form
app.get('/solutions/addProject', async (req, res) => {
  try {
    const sectors = await projects.getAllSectors(); // Fetch sectors
    res.render('addProject', { sectors }); // Pass sectors to view
  } catch (err) {
    res.render('500', { message: `Error loading form: ${err.message}` });
  }
});

// Handle Add Project Form Submission
app.post('/solutions/addProject', async (req, res) => {
  try {
    await projects.addProject(req.body); // Add project to database
    res.redirect('/solutions/projects'); // Redirect to projects page
  } catch (err) {
    res.render('500', { message: `Error adding project: ${err.message}` });
  }
});

app.get('/solutions/editProject/:id', async (req, res) => {
  try {
    const project = await projects.getProjectById(req.params.id);
    const sectors = await projects.getAllSectors();
    res.render('editProject', { project, sectors });
  } catch (err) {
    res.render('500', { message: `Error loading project for editing: ${err.message}` });
  }
});

app.post('/solutions/editProject', async (req, res) => {
  try {
    await projects.editProject(req.body.id, req.body);
    res.redirect('/solutions/projects');
  } catch (err) {
    res.render('500', { message: `I am sorry but we have encountered the follwing error: ${err.message}` });
  }
});

app.get('/solutions/deleteProject/:id', async (req, res) => {
  try {
    await projects.deleteProject(req.params.id);
    res.redirect('/solutions/projects');
  } catch (err) {
    res.render('500', { message: `Error deleting project: ${err.message}` });
  }
});



// 404 for Unknown Routes
app.use((req, res) => {
  res.render('404', { message: 'Page not found.' });
});

// Start Server
const HTTP_PORT = process.env.PORT || 8080;
app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});

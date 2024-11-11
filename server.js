/********************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Muzammil Khan Student ID: 173013228 Date: 11th November 2024
*
* Published URL: https://vercel.com/muzammil-khans-projects-f1041360/web-322-assignment-2/6h2G5njCK6JQ111hYf5c7h8Sh1c7 <--- Same link, used for the previous assignments
*
********************************************************************************/

const express = require('express');
const path = require('path');
const app = express();
const projectData = require('./data/projectData.json');
const sectorData = require('./data/sectorData.json');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static('public'));

// Home Route
app.get('/', (req, res) => {
  res.render('home', { page: '/' });
});

// About Page
app.get('/about', (req, res) => {
  res.render('about', { page: '/about' });
});

// Limited Projects for Homepage
app.get('/projects/limited', (req, res) => {
  const limitedProjects = projectData.slice(0, 3);
  res.json(limitedProjects);
});

// All Sectors for Dropdown
app.get('/sectors', (req, res) => {
  const sectors = [...new Set(sectorData.map(s => s.sector_name))];
  res.json(sectors);
});

// Render All Projects Page
app.get('/solutions/projects', (req, res) => {
  const { sector } = req.query;
  const filteredProjects = sector ? projectData.filter(p => p.sector.toLowerCase() === sector.toLowerCase()) : projectData;

  if (filteredProjects.length > 0) {
    res.render('projects', { projects: filteredProjects });
  } else {
    res.render('404');
  }
});

// Render Individual Project Page
app.get('/solutions/projects/:id', (req, res) => {
  const project = projectData.find(p => p.id == req.params.id);

  if (project) {
    res.render('project', { project });
  } else {
    res.render('404');
  }
});

// 404 for Unknown Routes
app.use((req, res) => {
  res.render('404');
});

// Start Server
const HTTP_PORT = process.env.PORT || 8080;
app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});

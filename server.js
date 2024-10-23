/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Muzammil Khan Student ID: 173013228 Date: 20th October 2024
*
* Published URL: https://web-322-assignment-2.vercel.app/ <-- Using the same vercel link previously used for assignmnet 2.
********************************************************************************/

const express = require('express');
const app = express();
const path = require('path');
const projectData = require('./data/projectData.json');
const sectorData = require('./data/sectorData.json');

// Serve static files
app.use(express.static('public'));

// Serve Home Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/home.html'));
});

// Serve About Page
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/about.html'));
});

// Serve limited projects for homepage
app.get('/projects/limited', (req, res) => {
  const limitedProjects = projectData.slice(0, 3);  // Limit to 3 projects for homepage
  res.json(limitedProjects);
});

// Serve all sectors for dropdown
app.get('/sectors', (req, res) => {
  const sectors = [...new Set(sectorData.map(s => s.sector_name))];  // Get unique sectors
  res.json(sectors);
});

// Serve projects based on sector or all projects
app.get('/solutions/projects', (req, res) => {
  const { sector } = req.query;
  if (sector) {
    const filteredProjects = projectData.filter(p => p.sector.toLowerCase() === sector.toLowerCase());
    if (filteredProjects.length > 0) {
      res.json(filteredProjects);
    } else {
      res.status(404).send('No projects found for this sector.');
    }
  } else {
    res.json(projectData);
  }
});

// Serve individual project by ID
app.get('/solutions/projects/:id', (req, res) => {
  const project = projectData.find(p => p.id == req.params.id);
  if (project) {
    res.json(project);
  } else {
    res.status(404).send('Project not found.');
  }
});

// Serve 404 error page for unknown routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views/404.html'));
});

// Start the server
const HTTP_PORT = process.env.PORT || 8080;
app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});

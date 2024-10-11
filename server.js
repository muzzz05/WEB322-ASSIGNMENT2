/********************************************************************************
*  WEB322 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Muzammil Khan Student ID: 173013228 Date: 2nd October 2024
*
********************************************************************************/
// Import necessary modules
const express = require('express');
const projectData = require('./modules/projects');

// Create the Express app
const app = express();

// Initialize the project data before starting the server
projectData.initialize().then(() => {
    // Start the server once the projects array has been successfully built
    app.listen(8080, () => console.log('Server running on port 8080'));
}).catch((err) => {
    console.error(err);
});

// GET "/" route to send assignment details
app.get('/', (req, res) => {
    res.send('Assignment 2: Muzammil Khan - 173013228');
});

// GET "/solutions/projects" to respond with all the projects
app.get('/solutions/projects', (req, res) => {
    projectData.getAllProjects().then(data => res.json(data)).catch(err => res.status(500).send(err));
});

// GET "/solutions/projects/id-demo" to demonstrate getProjectById
app.get('/solutions/projects/id-demo', (req, res) => {
    projectData.getProjectById(7).then(data => res.json(data)).catch(err => res.status(404).send(err));
});

// GET "/solutions/projects/sector-demo" to demonstrate getProjectsBySector
app.get('/solutions/projects/sector-demo', (req, res) => {
    projectData.getProjectsBySector('agriculture').then(data => res.json(data)).catch(err => res.status(404).send(err));
});
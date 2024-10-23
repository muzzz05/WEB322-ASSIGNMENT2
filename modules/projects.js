// Import the data from JSON files
const projectData = require("../data/projectData.json");
const sectorData = require("../data/sectorData.json");

// Prepare to store processed projects
let projects = [];

// Function to initialize the projects array by combining project data with sector information
function initialize() {
    return new Promise((resolve, reject) => {
        try {
            // Combine each project with its respective sector name
            projectData.forEach(project => {
                const sector = sectorData.find(s => s.id === project.sector_id);
                
                // If a matching sector is found, combine the project with its sector name
                if (sector) {
                    projects.push({ ...project, sector: sector.sector_name });
                }
            });
            resolve();  // Successful initialization
        } catch (error) {
            reject("Initialization failed: " + error);
        }
    });
}

// Function to return all projects
function getAllProjects() {
    return new Promise((resolve, reject) => {
        if (projects.length > 0) {
            resolve(projects);
        } else {
            reject("No projects available");
        }
    });
}

// Function to return a project by ID
function getProjectById(id) {
    return new Promise((resolve, reject) => {
        const project = projects.find(p => p.id === parseInt(id, 10));  // Ensure ID is treated as a number
        if (project) {
            resolve(project);
        } else {
            reject(`No project was found with id: ${id}`);
        }
    });
}

// Function to return projects by sector
function getProjectsBySector(sector) {
    return new Promise((resolve, reject) => {
        const result = projects.filter(p => p.sector.toLowerCase() === sector.toLowerCase());
        if (result.length > 0) {
            resolve(result);
        } else {
            reject(`No projects were found for the sector: ${sector}`);
        }
    });
}

// Export all the functions
module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector };
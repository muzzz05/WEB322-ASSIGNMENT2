// Import the data from JSON files
const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

// Prepare to store processed projects
let projects = [];

// Function to initialize the projects array
function initialize() {
    return new Promise((resolve, reject) => {
        try {
            projectData.forEach(project => {
                const sector = sectorData.find(s => s.id === project.sector_id).sector_name;
                projects.push({ ...project, sector });
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
        const project = projects.find(p => p.id === id);
        if (project) {
            resolve(project);
        } else {
            reject(`No project was found with with id: ${id}`);
        }
    });
}

// Function to return projects by sector
function getProjectsBySector(sector) {
    return new Promise((resolve, reject) => {
        const result = projects.filter(p => p.sector.toLowerCase().includes(sector.toLowerCase()));
        if (result.length > 0) {
            resolve(result);
        } else {
            reject(`No projects were found for the sector: ${sector}`);
        }
    });
}

// Export all the functions
module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector };

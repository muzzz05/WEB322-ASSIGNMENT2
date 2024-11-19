require('pg');
const Sequelize = require('sequelize');

// Set up Sequelize to connect to the PostgreSQL database
let sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', '5ynRlGsitJc2', {
  host: 'ep-black-credit-a5ercolw.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection is successful');
  })
  .catch((err) => {
    console.log('Connection is unsuccessful:', err);
  });

// Define Sector model
const Sector = sequelize.define('Sector', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  sector_name: { type: Sequelize.STRING },
}, {
  createdAt: false,
  updatedAt: false,
});

// Define Project model
const Project = sequelize.define('Project', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: Sequelize.STRING },
  feature_img_url: { type: Sequelize.STRING },
  summary_short: { type: Sequelize.TEXT },
  intro_short: { type: Sequelize.TEXT },
  impact: { type: Sequelize.TEXT },
  original_source_url: { type: Sequelize.STRING },
}, {
  createdAt: false,
  updatedAt: false,
});

// Define relationships
Project.belongsTo(Sector, { foreignKey: 'sector_id' });

// Function to initialize the database
function initialize() {
  return sequelize.sync()
    .then(() => {
      console.log('Connected to Database successfully');
    })
    .catch((err) => {
      return Promise.reject(`Connection to Database failed: ${err}`);
    });
}

// Function to return all projects
function getAllProjects() {
  return Project.findAll({ include: [Sector] })
    .then((projects) => {
      if (projects.length > 0) {
        return projects;
      } else {
        throw new Error('No projects available');
      }
    })
    .catch((err) => Promise.reject(err));
}

// Function to return a project by ID
function getProjectById(projectId) {
  return Project.findOne({ include: [Sector], where: { id: projectId } })
    .then((project) => {
      if (project) {
        return project;
      } else {
        throw new Error('Unable to find requested project');
      }
    })
    .catch((err) => Promise.reject(err));
}

// Function to return projects by sector
function getProjectsBySector(sector) {
  return Project.findAll({
    include: [Sector],
    where: {
      '$Sector.sector_name$': {
        [Sequelize.Op.iLike]: `%${sector}%`,
      },
    },
  })
    .then((projects) => {
      if (projects.length > 0) {
        return projects;
      } else {
        throw new Error('Unable to find requested projects');
      }
    })
    .catch((err) => Promise.reject(err));
}

// Function to add a new project
function addProject(projectData) {
  return Project.create(projectData)
    .then(() => Promise.resolve())
    .catch((err) => {
      const errorMsg = err.errors?.[0]?.message || 'An error occurred while adding the project.';
      return Promise.reject(errorMsg);
    });
}

// Function to get all sectors
function getAllSectors() {
  return Sector.findAll()
    .then((sectors) => {
      if (sectors.length > 0) {
        return sectors;
      } else {
        throw new Error('No sectors available');
      }
    })
    .catch((err) => Promise.reject(err));
}

function editProject(id, projectData) {
    return Project.update(projectData, { where: { id } })
      .then(() => Promise.resolve())
      .catch((err) => {
        const errorMsg = err.errors?.[0]?.message || 'An error occurred while updating the project.';
        return Promise.reject(errorMsg);
      });
  }

  function deleteProject(id) {
    return Project.destroy({ where: { id } })
      .then(() => Promise.resolve())
      .catch((err) => {
        const errorMsg = err.errors?.[0]?.message || 'An error occurred while deleting the project.';
        return Promise.reject(errorMsg);
      });
  }
  
  
// Exporting all the functions...
  module.exports = {
    initialize,
    getAllProjects,
    getProjectById,
    getProjectsBySector,
    addProject,
    getAllSectors,
    editProject,
    deleteProject,
  };
  
  
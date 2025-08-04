const Project = require('../models/projectmodel');
const { sendSuccess, sendError } = require('../utils/response');

exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    sendSuccess(res, 'Project created successfully', project, 201);
  } catch (err) {
    sendError(res, 'Project creation failed', err.message, 400);
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    sendSuccess(res, 'Projects fetched successfully', projects, 200);
  } catch (err) {
    sendError(res, 'Failed to fetch projects', err.message, 500);
  }
};

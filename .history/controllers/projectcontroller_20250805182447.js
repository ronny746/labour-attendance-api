const Project = require('../models/projectmodel');

const User = require('../models/usermodel');
const { sendSuccess, sendError } = require('../utils/response');

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    sendSuccess(res, 'Project created successfully', project, 201);
  } catch (err) {
    sendError(res, 'Project creation failed', err.message, 400);
  }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(req.user);
    // Step 1: Find user by token ID
    const user = await User.findById(userId);
    if (!user || !user.mobile) {
      return sendError(res, 'Invalid user or mobile not found', null, 400);
    }

    // Step 2: Get projects where hajriMobile = user's mobile
    const projects = await Project.find({ hajriMobile: user.mobile })
      .sort({ createdAt: -1 });

    sendSuccess(res, 'Projects fetched successfully', projects, 200);
  } catch (err) {
    sendError(res, 'Failed to fetch projects', err.message, 500);
  }
};

// Get single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 'Project not found', null, 404);
    sendSuccess(res, 'Project fetched successfully', project, 200);
  } catch (err) {
    sendError(res, 'Failed to fetch project', err.message, 500);
  }
};

// Update project by ID
exports.updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return sendError(res, 'Project not found', null, 404);
    sendSuccess(res, 'Project updated successfully', updated, 200);
  } catch (err) {
    sendError(res, 'Failed to update project', err.message, 400);
  }
};

// Delete project by ID
exports.deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return sendError(res, 'Project not found', null, 404);
    sendSuccess(res, 'Project deleted successfully', deleted, 200);
  } catch (err) {
    sendError(res, 'Failed to delete project', err.message, 400);
  }
};

const Project = require('../models/projectmodel');
const User = require('../models/usermodel');
const { sendSuccess, sendError } = require('../utils/response');

// ✅ Create a new project
exports.createProject = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.mobile) {
      return sendError(res, 'Invalid user or mobile not found', null, 400);
    }

    const project = new Project({
      ...req.body,
      hajriMobile: user.mobile // attach master’s mobile to project
    });

    await project.save();
    sendSuccess(res, 'Project created successfully', project, 201);
  } catch (err) {
    sendError(res, 'Project creation failed', err.message, 400);
  }
};

// ✅ Get all projects created by the logged-in hajri master
exports.getAllProjects = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.mobile) {
      return sendError(res, 'Invalid user or mobile not found', null, 400);
    }

    const projects = await Project.find({ hajriMobile: user.mobile })
      .sort({ createdAt: -1 });

    sendSuccess(res, 'Projects fetched successfully', projects, 200);
  } catch (err) {
    sendError(res, 'Failed to fetch projects', err.message, 500);
  }
};

// ✅ Get single project by ID if owned
exports.getProjectById = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const project = await Project.findOne({
      _id: req.params.id,
      hajriMobile: user.mobile
    });

    if (!project) return sendError(res, 'Project not found', null, 404);
    sendSuccess(res, 'Project fetched successfully', project, 200);
  } catch (err) {
    sendError(res, 'Failed to fetch project', err.message, 500);
  }
};

// ✅ Update project by ID if owned
exports.updateProject = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const updated = await Project.findOneAndUpdate(
      { _id: req.params.id, hajriMobile: user.mobile },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) return sendError(res, 'Project not found or unauthorized', null, 404);
    sendSuccess(res, 'Project updated successfully', updated, 200);
  } catch (err) {
    sendError(res, 'Failed to update project', err.message, 400);
  }
};

// ✅ Delete project by ID if owned
exports.deleteProject = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const deleted = await Project.findOneAndDelete({
      _id: req.params.id,
      hajriMobile: user.mobile
    });

    if (!deleted) return sendError(res, 'Project not found or unauthorized', null, 404);
    sendSuccess(res, 'Project deleted successfully', deleted, 200);
  } catch (err) {
    sendError(res, 'Failed to delete project', err.message, 400);
  }
};

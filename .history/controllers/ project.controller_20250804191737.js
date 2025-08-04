const Project = require('../models/project.model');
const { sendSuccess, sendError } = require('../utils/response');

exports.createProject = async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        sendSuccess(res, 'Project created successfully', project, 201);
    } catch (err) {
        sendError(res, 'Project creation failed', err.message);
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const Labour = require('../models/labour.model');

exports.addLabour = async (req, res) => {
  try {
    const labour = new Labour(req.body);
    await labour.save();
    res.status(201).json(labour);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLaboursByProject = async (req, res) => {
  try {
    const labours = await Labour.find({ projectId: req.params.projectId });
    res.json(labours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

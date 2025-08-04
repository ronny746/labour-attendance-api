const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const projectRoutes = require('./routes/project.routes');
const labourRoutes = require('./routes/labour.routes');
const attendanceRoutes = require('./routes/attendanceroutes');
const authRoutes = require('./routes/authroutes');

const app = express();

// Middleware
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/labours', labourRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Labour Attendance API is running' });
});

module.exports = app;

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const tourRoutes = require('./routes/tourRoutes');
const guideRoutes = require('./routes/guideRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const classRoutes = require('./routes/classRoutes');
const groupSupervisorRoutes = require('./routes/groupSupervisorRoutes'); // New import
const fairRoutes = require('./routes/fairRoutes');
const announcementsRoutes = require('./routes/announcementsRoutes');
const schoolRoutes = require("./routes/schoolRoutes");

const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors()); 

mongoose.connect('mongodb://localhost:27017/tourDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/auth', authRoutes);
app.use('/tours', tourRoutes);
app.use('/guides', guideRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/group-supervisor', groupSupervisorRoutes); // New route
app.use('/class', classRoutes);
app.use('/fairs', fairRoutes);
app.use('/schools', schoolRoutes);
app.use('/announcements', announcementsRoutes);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/user', userRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
const School = require('../models/School');

exports.getSchools = async (req, res) => {
  try {
    const schools = await School.find();
    const transformedSchools = schools.map(school => ({
      ...school.toObject(), 
      name: school.KurumAdi
    }));

    res.status(200).json({ schools: transformedSchools });
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

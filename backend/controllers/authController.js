// /server/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });

    // If no user is found by username, try to find by email
    if (!user) {
      user = await User.findOne({ email: username });
    }
    
    if (!user) {
      console.log("no user");
      return res.status(400).json({ message: 'Invalid credentials' });
    }



    // Check if the password matches
    const isMatch = password == user.password;
    if (!isMatch) {
      console.log("no password match");

      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log("new token created with");

    // Create JWT token and send response
    const payload = {
      user: {
        id: user._id,
        userType: user.userType,
      },
    };

    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });
    console.log("new token created with" , user._id , user.userType);
    res.status(200).json({ token, userType: user.userType});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { username, email, password } = req.body;  
  console.log(username);
  console.log(email);
  console.log(password);
  try {
    const user = await User.findOne({ username, email});  

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (password) {
      console.log('Old Password:', user.password); // Log the old password
      user.password = password;
      console.log('New Password:', user.password);
    }

    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error:', error);  // Log the actual error message
    res.status(500).json({ error: 'Error updating password' });
  }
};

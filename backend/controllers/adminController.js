const User = require('../models/User');

exports.createUser = async (req, res) => {
  const { username, email, password, userType } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create and hash password before saving
    user = new User({
      username,
      email,
      password, // This will be hashed by the pre-save hook in the User model
      userType,
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      userId: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating user' });
  }
};


// ... previous code
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('+password'); 
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

exports.updateUserInfo = async (req, res) => {
  console.log("Updating user...");
  console.log("Received data:", req.body);

  const userId = req.params.id;
  const updates = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.username = updates.username || user.username;
    user.email = updates.email || user.email;
    user.userType = updates.userType || user.userType;
    user.score = updates.score || user.score;

    if (updates.password && updates.password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(updates.password, salt);
    }

    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: 'Error updating user' });
  }
};



exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};


exports.getUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    else
    {
      res.status(200).json({ user });
    }
  }catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
};
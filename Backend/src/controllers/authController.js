const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/db');

// POST /auth/signup  — Normal users only
const signup = async (req, res) => {
  const { name, email, password, address } = req.body;

  // Validations
  if (!name || name.length < 20 || name.length > 60)
    return res.status(400).json({ message: 'Name must be 20–60 characters' });

  if (!address || address.length > 400)
    return res.status(400).json({ message: 'Address max 400 characters' });

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  if (!passwordRegex.test(password))
    return res.status(400).json({ message: 'Password: 8-16 chars, 1 uppercase, 1 special character' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ message: 'Invalid email format' });

  try {
    // Check if email already exists
    const [existing] = await sequelize.query(
      `SELECT id FROM users WHERE email = $1`,
      { bind: [email], type: sequelize.QueryTypes.SELECT }
    );
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await sequelize.query(
      `INSERT INTO users (name, email, password, address, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'user', NOW(), NOW())`,
      { bind: [name, email, hashedPassword, address] }
    );

    return res.status(201).json({ message: 'Account created successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /auth/login  — All roles
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const [user] = await sequelize.query(
      `SELECT * FROM users WHERE email = $1`,
      { bind: [email], type: sequelize.QueryTypes.SELECT }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PATCH /auth/change-password  — All authenticated users
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  if (!passwordRegex.test(newPassword))
    return res.status(400).json({ message: 'New password: 8-16 chars, 1 uppercase, 1 special character' });

  try {
    const [user] = await sequelize.query(
      `SELECT * FROM users WHERE id = $1`,
      { bind: [req.user.id], type: sequelize.QueryTypes.SELECT }
    );

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await sequelize.query(
      `UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2`,
      { bind: [hashed, req.user.id] }
    );

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { signup, login, changePassword };
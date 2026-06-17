const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

// GET /admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const [
      [usersCount],
      [storesCount],
      [ratingsCount],
      roles,
      [storesCoverage],
      topStores
    ] = await Promise.all([
      sequelize.query(`SELECT COUNT(*) FROM users`, { type: sequelize.QueryTypes.SELECT }),
      sequelize.query(`SELECT COUNT(*) FROM stores`, { type: sequelize.QueryTypes.SELECT }),
      sequelize.query(`SELECT COUNT(*) FROM ratings`, { type: sequelize.QueryTypes.SELECT }),
      sequelize.query(`SELECT role, COUNT(*) AS count FROM users GROUP BY role`, { type: sequelize.QueryTypes.SELECT }),
      sequelize.query(`SELECT COUNT(*) AS total, COUNT(owner_id) AS assigned FROM stores`, { type: sequelize.QueryTypes.SELECT }),
      sequelize.query(
        `SELECT s.id, s.name, 
                ROUND(AVG(r.rating), 2) AS average_rating, 
                COUNT(r.id) AS total_ratings
         FROM stores s
         JOIN ratings r ON r.store_id = s.id
         GROUP BY s.id
         ORDER BY average_rating DESC, total_ratings DESC
         LIMIT 5`,
        { type: sequelize.QueryTypes.SELECT }
      )
    ]);

    // Parse role counts
    const roleBreakdown = { admin: 0, store_owner: 0, user: 0 };
    roles.forEach(r => {
      roleBreakdown[r.role] = parseInt(r.count);
    });

    const totalStoresCount = parseInt(storesCoverage.total);
    const assignedStoresCount = parseInt(storesCoverage.assigned);
    const percentage = totalStoresCount > 0 ? parseFloat(((assignedStoresCount / totalStoresCount) * 100).toFixed(1)) : 0;

    return res.status(200).json({
      totalUsers:   parseInt(usersCount.count),
      totalStores:  totalStoresCount,
      totalRatings: parseInt(ratingsCount.count),
      roleBreakdown,
      storeCoverage: {
        total: totalStoresCount,
        assigned: assignedStoresCount,
        percentage
      },
      topStores
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /admin/users  — Add any user (admin, user, store_owner)
const addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || name.length < 20 || name.length > 60)
    return res.status(400).json({ message: 'Name must be 20–60 characters' });

  if (!address || address.length > 400)
    return res.status(400).json({ message: 'Address max 400 characters' });

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  if (!passwordRegex.test(password))
    return res.status(400).json({ message: 'Password: 8-16 chars, 1 uppercase, 1 special character' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ message: 'Invalid email' });

  if (!['admin', 'user', 'store_owner'].includes(role))
    return res.status(400).json({ message: 'Invalid role' });

  try {
    const [existing] = await sequelize.query(
      `SELECT id FROM users WHERE email = $1`,
      { bind: [email], type: sequelize.QueryTypes.SELECT }
    );
    if (existing) return res.status(409).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    await sequelize.query(
      `INSERT INTO users (name, email, password, address, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      { bind: [name, email, hashed, address, role] }
    );

    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /admin/users?name=&email=&address=&role=&sortBy=&order=
const getUsers = async (req, res) => {
  const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;

  const allowedSort = ['name', 'email', 'address', 'role'];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : 'name';
  const sortOrder  = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  let conditions = [`role != 'admin' OR role = 'admin'`]; // base: get all
  let binds = [];
  let i = 1;

  // Reset to proper filter
  conditions = [];
  if (name)    { conditions.push(`name ILIKE $${i++}`);    binds.push(`%${name}%`); }
  if (email)   { conditions.push(`email ILIKE $${i++}`);   binds.push(`%${email}%`); }
  if (address) { conditions.push(`address ILIKE $${i++}`); binds.push(`%${address}%`); }
  if (role)    { conditions.push(`role = $${i++}`);        binds.push(role); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const users = await sequelize.query(
      `SELECT id, name, email, address, role, is_suspended FROM users ${where} ORDER BY ${sortColumn} ${sortOrder}`,
      { bind: binds, type: sequelize.QueryTypes.SELECT }
    );
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /admin/users/:id
const getUserById = async (req, res) => {
  try {
    const [user] = await sequelize.query(
      `SELECT id, name, email, address, role, is_suspended FROM users WHERE id = $1`,
      { bind: [req.params.id], type: sequelize.QueryTypes.SELECT }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    // If store owner, attach their store's average rating
    if (user.role === 'store_owner') {
      const [store] = await sequelize.query(
        `SELECT s.id, s.name, ROUND(AVG(r.rating), 2) AS average_rating
         FROM stores s
         LEFT JOIN ratings r ON r.store_id = s.id
         WHERE s.owner_id = $1
         GROUP BY s.id`,
        { bind: [user.id], type: sequelize.QueryTypes.SELECT }
      );
      user.store = store || null;
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /admin/stores
const addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;

  if (!name || name.length < 20 || name.length > 60)
    return res.status(400).json({ message: 'Store name must be 20–60 characters' });

  if (!address || address.length > 400)
    return res.status(400).json({ message: 'Address max 400 characters' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ message: 'Invalid email' });

  try {
    // Validate owner exists and is a store_owner
    if (owner_id) {
      const [owner] = await sequelize.query(
        `SELECT id FROM users WHERE id = $1 AND role = 'store_owner'`,
        { bind: [owner_id], type: sequelize.QueryTypes.SELECT }
      );
      if (!owner) return res.status(400).json({ message: 'Owner must be a store_owner role user' });
    }

    const [existing] = await sequelize.query(
      `SELECT id FROM stores WHERE email = $1`,
      { bind: [email], type: sequelize.QueryTypes.SELECT }
    );
    if (existing) return res.status(409).json({ message: 'Store email already exists' });

    await sequelize.query(
      `INSERT INTO stores (name, email, address, owner_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      { bind: [name, email, address, owner_id || null] }
    );

    return res.status(201).json({ message: 'Store created successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /admin/stores?name=&email=&address=&sortBy=&order=
const getStores = async (req, res) => {
  const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;

  const allowedSort = ['name', 'email', 'address', 'average_rating'];
  const sortColumn  = allowedSort.includes(sortBy) ? sortBy : 'name';
  const sortOrder   = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  let conditions = [];
  let binds = [];
  let i = 1;

  if (name)    { conditions.push(`s.name ILIKE $${i++}`);    binds.push(`%${name}%`); }
  if (email)   { conditions.push(`s.email ILIKE $${i++}`);   binds.push(`%${email}%`); }
  if (address) { conditions.push(`s.address ILIKE $${i++}`); binds.push(`%${address}%`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const stores = await sequelize.query(
      `SELECT s.id, s.name, s.email, s.address, s.owner_id, u.name AS owner_name,
              ROUND(AVG(r.rating), 2) AS average_rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       LEFT JOIN users u ON s.owner_id = u.id
       ${where}
       GROUP BY s.id, u.name
       ORDER BY ${sortColumn === 'average_rating' ? 'average_rating' : `s.${sortColumn}`} ${sortOrder}`,
      { bind: binds, type: sequelize.QueryTypes.SELECT }
    );
    return res.status(200).json(stores);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /admin/users/:id  — Update any user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, address, role, is_suspended, password } = req.body;

  if (!name || name.length < 20 || name.length > 60)
    return res.status(400).json({ message: 'Name must be 20–60 characters' });

  if (!address || address.length > 400)
    return res.status(400).json({ message: 'Address max 400 characters' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ message: 'Invalid email format' });

  if (!['admin', 'user', 'store_owner'].includes(role))
    return res.status(400).json({ message: 'Invalid role' });

  try {
    const [userExists] = await sequelize.query(
      `SELECT id FROM users WHERE id = $1`,
      { bind: [id], type: sequelize.QueryTypes.SELECT }
    );
    if (!userExists) return res.status(404).json({ message: 'User not found' });

    const [existing] = await sequelize.query(
      `SELECT id FROM users WHERE email = $1 AND id != $2`,
      { bind: [email, id], type: sequelize.QueryTypes.SELECT }
    );
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    let query = `UPDATE users SET name = $1, email = $2, address = $3, role = $4, is_suspended = $5`;
    let binds = [name, email, address, role, !!is_suspended];

    if (password) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
      if (!passwordRegex.test(password))
        return res.status(400).json({ message: 'Password: 8-16 chars, 1 uppercase, 1 special character' });
      
      const hashedPassword = await bcrypt.hash(password, 10);
      query += `, password = $6, updated_at = NOW() WHERE id = $7`;
      binds.push(hashedPassword, id);
    } else {
      query += `, updated_at = NOW() WHERE id = $6`;
      binds.push(id);
    }

    await sequelize.query(query, { bind: binds });
    return res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /admin/users/:id  — Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [userExists] = await sequelize.query(
      `SELECT id FROM users WHERE id = $1`,
      { bind: [id], type: sequelize.QueryTypes.SELECT }
    );
    if (!userExists) return res.status(404).json({ message: 'User not found' });

    await sequelize.query(
      `DELETE FROM users WHERE id = $1`,
      { bind: [id] }
    );

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /admin/stores/:id  — Update a store
const updateStore = async (req, res) => {
  const { id } = req.params;
  const { name, email, address, owner_id } = req.body;

  if (!name || name.length < 20 || name.length > 60)
    return res.status(400).json({ message: 'Store name must be 20–60 characters' });

  if (!address || address.length > 400)
    return res.status(400).json({ message: 'Address max 400 characters' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ message: 'Invalid email' });

  try {
    const [storeExists] = await sequelize.query(
      `SELECT id FROM stores WHERE id = $1`,
      { bind: [id], type: sequelize.QueryTypes.SELECT }
    );
    if (!storeExists) return res.status(404).json({ message: 'Store not found' });

    if (owner_id) {
      const [owner] = await sequelize.query(
        `SELECT id FROM users WHERE id = $1 AND role = 'store_owner'`,
        { bind: [owner_id], type: sequelize.QueryTypes.SELECT }
      );
      if (!owner) return res.status(400).json({ message: 'Owner must be a store_owner role user' });
    }

    const [existing] = await sequelize.query(
      `SELECT id FROM stores WHERE email = $1 AND id != $2`,
      { bind: [email, id], type: sequelize.QueryTypes.SELECT }
    );
    if (existing) return res.status(409).json({ message: 'Store email already exists' });

    await sequelize.query(
      `UPDATE stores SET name = $1, email = $2, address = $3, owner_id = $4, updated_at = NOW() WHERE id = $5`,
      { bind: [name, email, address, owner_id || null, id] }
    );

    return res.status(200).json({ message: 'Store updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /admin/stores/:id  — Delete a store
const deleteStore = async (req, res) => {
  const { id } = req.params;
  try {
    const [storeExists] = await sequelize.query(
      `SELECT id FROM stores WHERE id = $1`,
      { bind: [id], type: sequelize.QueryTypes.SELECT }
    );
    if (!storeExists) return res.status(404).json({ message: 'Store not found' });

    await sequelize.query(
      `DELETE FROM stores WHERE id = $1`,
      { bind: [id] }
    );

    return res.status(200).json({ message: 'Store deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getDashboard,
  addUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addStore,
  getStores,
  updateStore,
  deleteStore
};
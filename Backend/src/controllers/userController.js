const sequelize = require('../config/db');

// GET /user/stores?name=&address=&sortBy=&order=
const getStores = async (req, res) => {
  const { name, address, sortBy = 'name', order = 'ASC' } = req.query;

  const allowedSort = ['name', 'address', 'average_rating'];
  const sortColumn  = allowedSort.includes(sortBy) ? sortBy : 'name';
  const sortOrder   = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  let conditions = [];
  let binds = [req.user.id];
  let i = 2;

  if (name)    { conditions.push(`s.name ILIKE $${i++}`);    binds.push(`%${name}%`); }
  if (address) { conditions.push(`s.address ILIKE $${i++}`); binds.push(`%${address}%`); }

  const where = conditions.length ? `AND ${conditions.join(' AND ')}` : '';

  try {
    const stores = await sequelize.query(
      `SELECT
         s.id,
         s.name,
         s.address,
         ROUND(AVG(r.rating), 2)                          AS average_rating,
         MAX(CASE WHEN r.user_id = $1 THEN r.rating END)  AS user_rating,
         MAX(CASE WHEN r.user_id = $1 THEN r.id END)      AS user_rating_id
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE 1=1 ${where}
       GROUP BY s.id
       ORDER BY ${sortColumn === 'average_rating' ? 'average_rating' : `s.${sortColumn}`} ${sortOrder}`,
      { bind: binds, type: sequelize.QueryTypes.SELECT }
    );
    return res.status(200).json(stores);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /user/ratings  — Submit a rating
const submitRating = async (req, res) => {
  const { store_id, rating } = req.body;

  if (!store_id) return res.status(400).json({ message: 'store_id is required' });
  if (!rating || rating < 1 || rating > 5)
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });

  try {
    // Check store exists
    const [store] = await sequelize.query(
      `SELECT id FROM stores WHERE id = $1`,
      { bind: [store_id], type: sequelize.QueryTypes.SELECT }
    );
    if (!store) return res.status(404).json({ message: 'Store not found' });

    // Check if already rated
    const [existing] = await sequelize.query(
      `SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2`,
      { bind: [req.user.id, store_id], type: sequelize.QueryTypes.SELECT }
    );
    if (existing) return res.status(409).json({ message: 'You have already rated this store. Use update instead.' });

    await sequelize.query(
      `INSERT INTO ratings (user_id, store_id, rating, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())`,
      { bind: [req.user.id, store_id, rating] }
    );

    return res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PATCH /user/ratings/:id  — Update a rating
const updateRating = async (req, res) => {
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5)
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });

  try {
    // Make sure this rating belongs to the logged-in user
    const [existing] = await sequelize.query(
      `SELECT id FROM ratings WHERE id = $1 AND user_id = $2`,
      { bind: [req.params.id, req.user.id], type: sequelize.QueryTypes.SELECT }
    );
    if (!existing) return res.status(404).json({ message: 'Rating not found or not yours' });

    await sequelize.query(
      `UPDATE ratings SET rating = $1, updated_at = NOW() WHERE id = $2`,
      { bind: [rating, req.params.id] }
    );

    return res.status(200).json({ message: 'Rating updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getStores, submitRating, updateRating };
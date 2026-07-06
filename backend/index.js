const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
// 1. Create a new contact entry
app.post('/api/contacts', async (req, res) => {
  try {
    const { fullName, company, role, phone, email, services } = req.body;

    // Validate inputs
    if (!fullName || !email) {
      return res.status(400).json({ error: 'fullName and email are required fields.' });
    }

    const servicesStr = JSON.stringify(services || {});

    const queryStr = `
      INSERT INTO contacts (fullName, company, role, phone, email, services)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(queryStr, [
      fullName,
      company || '',
      role || '',
      phone || '',
      email,
      servicesStr
    ]);

    return res.status(201).json({
      id: result.insertId,
      message: 'Contact registered successfully.'
    });
  } catch (error) {
    console.error('Error in POST /api/contacts:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. Fetch all contact entries
app.get('/api/contacts', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
    
    // Parse services JSON for each row
    const contacts = rows.map(row => {
      let parsedServices = {};
      try {
        parsedServices = typeof row.services === 'string' ? JSON.parse(row.services) : row.services;
      } catch (e) {
        console.error('Failed to parse services JSON:', e);
      }
      return {
        ...row,
        services: parsedServices
      };
    });

    return res.json(contacts);
  } catch (error) {
    console.error('Error in GET /api/contacts:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3. Delete a contact entry
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM contacts WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact entry not found.' });
    }

    return res.json({ message: 'Contact entry deleted successfully.' });
  } catch (error) {
    console.error('Error in DELETE /api/contacts:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Express Backend running on http://localhost:${PORT}`);
});

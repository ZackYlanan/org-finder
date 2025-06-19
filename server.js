const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('DAA-HomePage-main')); // Serve your frontend from this folder
app.use(express.json());

const organizations = require('./organizations.json');

app.get('/organizations', (req, res) => {
  let result = [...organizations];

  const { search, classification, department } = req.query;

  // Search by name
  if (search) {
    result = result.filter(org =>
      org.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter by classification
  if (classification) {
    result = result.filter(org => org.classification === classification);
  }

  // Filter by department
  if (department) {
    result = result.filter(org => org.department === department);
  }

  // No backend sorting, all sorting will be done on the script.js
  res.json(result);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

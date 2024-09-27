// Server for Task 4
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// File path to the JSON data
const usersFilePath = path.join(__dirname, 'uniqueUsers.json');

// Helper function to read users from the JSON file
function readUsersFromFile() {
  const data = fs.readFileSync(usersFilePath);
  return JSON.parse(data).uniqueUsers;
}

// Endpoint to get unique users
app.get('/uniqueUsers', (req, res) => {
  try {
    const users = readUsersFromFile();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to get users ordered by department and designation
app.get('/orderedUsers', (req, res) => {
  try {
    const users = readUsersFromFile();
    const orderedUsers = users.sort((a, b) => {
      if (a.department === b.department) {
        return a.designation.localeCompare(b.designation);
      }
      return a.department.localeCompare(b.department);
    });
    res.json(orderedUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to add a new user
app.post('/addUser', (req, res) => {
  const { name, surname, department, designation, id } = req.body;
  try {
    const users = readUsersFromFile();
    users.push({ name, surname, department, designation, id });
    fs.writeFileSync(usersFilePath, JSON.stringify({ uniqueUsers: users }, null, 2));
    res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint to update an existing user
app.put('/updateUser', (req, res) => {
  const { id, name, surname, department, designation } = req.body;
  try {
    const users = readUsersFromFile();
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    users[userIndex] = { id, name, surname, department, designation };
    fs.writeFileSync(usersFilePath, JSON.stringify({ uniqueUsers: users }, null, 2));
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

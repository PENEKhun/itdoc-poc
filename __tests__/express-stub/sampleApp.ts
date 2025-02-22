const express = require('express');
const app = express();

app.post('/signup', function(req, res) {
  const { username, password } = req.body;

  // validate username
  if (!username) {
    return res.status(400).json( {
      error: 'username is required'
    });
  }

  // validate password
  if (!password) {
    return res.status(400).json( {
      error: 'password is required'
    });
  }
  if (password.length < 8) {
    return res.status(400).json( {
      error: 'password must be at least 8 characters'
    });
  }

  return res.status(201);
});

export default app;

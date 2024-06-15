const express = require('express');
const app = express();
const port = 3000;

app.use(express.static(__dirname + '/public'));
// Require the upload middleware
const upload = require('./handleUpload');
const path = require("path");

app.get('/', function(req, res){
    res.sendFile(__dirname + 'index.html');
});

// Set up a route for file uploads
app.post('/uploads', upload.single('file'), (req, res) => {
  // Handle the uploaded file
  res.json({ message: 'File uploaded successfully!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
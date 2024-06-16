const express = require('express');
const fs = require('node:fs');
const app = express();
const port = 3000;

app.use(express.static(__dirname + '/public'));
// Require the upload middleware
const upload = require('./handleUpload');
//file reader
const data = require('./formatFileData');

app.get('/', function(req, res){
    res.sendFile(__dirname + 'index.html');
});

// Set up a route for file uploads
app.post('/uploads', upload.single('file'), (req, res) => {
    let formattedData = data.readFile(req.file.path);
    //console.log(formattedData.data);
  // Handle the uploaded file
  res.json({ formattedData });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
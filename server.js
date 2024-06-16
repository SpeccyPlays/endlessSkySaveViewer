const express = require('express');
const path = require('path');
const multer = require('multer');
const { formatData } = require('./formatFileData');

const app = express();
const port = 3000;

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Set up a route for file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    const filePath = req.file.path;
    formatData(filePath, res);
  } else {
    res.status(400).json({ response: { success: false, errors: ['No file uploaded'] } });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

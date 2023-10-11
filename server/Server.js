const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const docxConverter = require('docx-pdf'); // Import the 'docx-pdf' library
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/convert', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const inputFilePath = req.file.path;
  const outputFilePath = inputFilePath + '.pdf'; // Destination PDF file path

  docxConverter(inputFilePath, outputFilePath, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Conversion failed' });
    }

    res.download(outputFilePath, 'output.pdf', (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'File download failed' });
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

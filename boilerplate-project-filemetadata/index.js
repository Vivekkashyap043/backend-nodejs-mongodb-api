var express = require('express');
var cors = require('cors');
var multer = require('multer');
require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Multer setup
const upload = multer({ dest: 'uploads/' });

// Route for file upload
app.post('/api/fileanalyse',  upload.single('upfile'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const { originalname, mimetype, size } = req.file;
  res.json({
    name: originalname,
    type: mimetype,
    size: size
  });
});




const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});

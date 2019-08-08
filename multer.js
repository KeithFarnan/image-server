const multer = require('multer');
const mkdirp = require('mkdirp');
const { User } = require('./models/user');
const { validate } = require('./models/event');

// more detailed way of storing files not just destination
const storage = multer.diskStorage({
  destination: async function(req, file, callback) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send('invalid user');

    const eventTitle = await req.body.eventTitle;
    if (!eventTitle) return res.status(400).send('invalid eventTitle');

    const dir = `uploads/${user.name}/${eventTitle}`;
    mkdirp(dir, err => {
      if (err) console.error(err);
      else callback(null, dir);
    });
  },
  filename: async function(req, file, callback) {
    callback(
      null,
      // new Date().toISOString() +
      req.body.eventDate +
        '-' +
        req.body.eventTitle +
        '.' +
        file.originalname.split('.').pop()
    );
  }
});
// types of files to upload
const filefilter = (req, file, cb) => {
  // true saves the file, false does not
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// defining where and how the files are stored
const upload = multer({
  // this uses the storage config we have set above
  storage: storage,
  limits: {
    // limiting filesize to 8mb
    fileSize: 1024 * 1024 * 8
  },
  // uses the file filter set above
  fileFilter: filefilter
});

module.exports.upload = upload;

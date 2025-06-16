const multer = require("multer");

const path = require("path");

const fs = require("fs");

const uploadFile = (req, res) => {
  const uploadDir = path.join(__dirname, "../uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },

    filename: function (req, file, cb) {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

      const ext = path.extname(file.originalname);

      cb(null, file.fieldname + "-" + uniqueName + ext);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;

    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  };

  const upload = multer({ storage, fileFilter }).single("file");

  upload(req, res, function (err) {
    if (err) {
      return res
        .status(500)
        .json({ success: false, error: "Upload error", detail: err.message });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const fileUrl = `${process.env.localhost_api}/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,

      message: "File uploaded successfully",

      url: fileUrl,
    });
  });
};

module.exports = {
  uploadFile,
};

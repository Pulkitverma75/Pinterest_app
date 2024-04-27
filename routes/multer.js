const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads') //Destination folder for our uploads
    },
    filename: function (req, file, cb) {
        const uniquefilename = uuidv4(); //Generating a unique ID using UUID
        cb(null, uniquefilename + path.extname(file.originalname)); //use the uniqufilename to upload the file    
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
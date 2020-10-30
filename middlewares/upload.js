//dependencies
const multer = require("multer");

//only allow for csv files to be uploaded -----not working
// const csvFilter = (req, file, cb) => {
//   if (file.mimetype ==="text/csv") {
//     cb(null, true);
//   } else {
//     cb("Please upload only csv file.", false);
//   }
// };

//send the file to a location on the server and give a unique name (timestamp-sequences-originalFilename.csv)
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, `${Date.now()}-sequences-${file.originalname}`);
  },
});

//function to upload the file
//var uploadFile = multer({ storage: storage, fileFilter: csvFilter });
var uploadFile = multer({ storage: storage});

module.exports = uploadFile;
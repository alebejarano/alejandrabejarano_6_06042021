const multer = require('multer');

const MIME_TYPES = {
    //allows to translate a MIME TYPE into an extension
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
};

//What to save and how to save our files
const storage = multer.diskStorage({
    //the options:
    destination: (req, file, callback) => {
        callback(null, 'images')
        //our callback receives 2 arguments: first is an errror, if there is, the second is the folder in which we want to save the file
    }, 
    filename: (req, file, callback) => {
        // give the full file name: name + extension
        const name = file.originalname.split(' ').join('_');
        //to deal with the white space and to be replace by _
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name, + Date.now() + '.' + extension);
        //we add the date to avoid overwritten files
    }
});

module.exports = multer({storage: storage}).single('image');
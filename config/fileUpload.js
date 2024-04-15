import cloudinaryPackage from 'cloudinary';
import multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary';


const cloudinary = cloudinaryPackage.v2;


// Config Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_KEY_SECRET
})

// Create Storage engine for multer
const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormat: ['jpeg', 'png', 'jpg'],
    params: {
        folder: 'Ecommerce-api',
    }
});

// Init multer with storage engine
const upload = multer({
    storage,
});

export default upload;

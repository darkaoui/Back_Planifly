import express from 'express'
const router = express.Router()
import { signUser } from '../controllers/userController.js'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination:(req, file, callback) => callback(null,path.join(__dirname,'../download')),
    filename: (req, file, callback) => {
        const filename = `${Date.now()}${Math.round(Math.random()*1000000)}.${file.originalname.split('.').pop()}`
        callback(null,filename)
    }
})

const upload = multer({storage})

router.route('/').post(upload.fields([{name:'idCard',maxCount:1},{name:"pilotLicense",maxCount:1}]),signUser)

export default router
import multer from "multer"

const upload = multer({
    //We will temporarily storing the resume as we are not storing the resume into the database
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB is the file size limit
    }
})


export default upload
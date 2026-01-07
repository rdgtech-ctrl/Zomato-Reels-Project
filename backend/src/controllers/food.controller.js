const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const { v4: uuid } = require("uuid")

async function createFood(req, res) {
    try {
        console.log("Food Partner:", req.foodPartner);
        console.log("Body:", req.body)
        console.log("File:", req.file)

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            })
        }

        console.log("File buffer:", req.file.buffer);
        
        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

        console.log("Upload result:", fileUploadResult)

        res.status(201).json({
            message: "Food item created",
            data: fileUploadResult
        })
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Error creating food",
            error: error.message
        })
    }
}

module.exports = {
    createFood
}
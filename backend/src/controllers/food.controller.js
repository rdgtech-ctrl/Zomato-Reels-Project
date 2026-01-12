const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const { v4: uuid } = require("uuid")

async function createFood(req, res) {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                message: "Video file is required"
            })
        }

        // Check if required fields exist
        if (!req.body.name || !req.body.description) {
            return res.status(400).json({
                message: "Name and description are required"
            })
        }

        // Upload file to ImageKit
        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

        // Create food item in database
        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodPartner: req.foodPartner._id
        })

        res.status(201).json({
            message: "Food created successfully",
            food: foodItem
        })
    } catch (error) {
        console.error("Error creating food:", error);
        res.status(500).json({
            message: "Error creating food",
            error: error.message
        })
    }
}

async function getFoodItems(req,res){
    const foodItems = await foodModel.find({})
    res.status(200).json({
        message:"Food Items fetched successfully.",
        foodItems
    })
}
module.exports = {
    createFood,
    getFoodItems
}
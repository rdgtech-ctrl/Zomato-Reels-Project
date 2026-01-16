const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model')
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

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({})
    res.status(200).json({
        message: "Food Items fetched successfully.",
        foodItems
    })
}

async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })
    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })
        return res.status(200).json({
            message: "Food unliked successfully"
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "Food like successfully",
        like
    })

}

async function saveFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        return res.status(200).json({
            message: "Food unsaved successfully"
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })
    res.status(201).json({
        message: "Food saved successfully",
        save
    })
}

async function getSaveFood(req, res) {
    const user = req.user;
    const saveFoods = await saveModel.find({ user: user._id })
        .populate('food');

    res.status(200).json({
        message:"Save foods fetched successfully",
        savedFoods
    });
}

module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood
}
const express = require('express');
const foodController = require("../controllers/food.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router();
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
})


/*GET /api/food/  [public]*/
router.get('/', foodController.getFoodItems)

/*POST /api/food/  [protected]*/
router.post('/',
    authMiddleware.authFoodPartnerMiddleware, upload.single("video"),
    foodController.createFood)


module.exports = router
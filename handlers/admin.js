const Admin = require('../models/admin');
const FoodCategory = require('../models/food-category'); 

exports.getAdmin = (req, res, next) => {
    return res.json({
        message: 'getting admins'
    });
}

exports.createFoodCategory = async (req, res, next) => {
    console.log(req.body)
    const category = await FoodCategory.findOne({ where: { food_name: req.body.food_name}});
    if (category) {
        const error = new Error('Food name already exist');
        error.statusCode = 422;
        error.message = 'Food name already exist in the main Category'
        throw error 
    }
    const newCategory = await FoodCategory.create({
        food_name: req.body.food_name,
        food_class: req.body.food_class
    });
    const savedCategory = await newCategory.save();
    if (!savedCategory) {
        const error = new Error('Server Side error');
        error.statusCode = 500;
        error.message = 'Cannot save new food Category to db'
        throw error 
    }
    return res.status(201).json({
        status: "Successful",
        message: "Created a new Food Category",
        data: newCategory
    });
}
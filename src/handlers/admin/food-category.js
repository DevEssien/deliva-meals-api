const FoodCategory = require('../../models/food-category'); 
const AppError = require('../error/error');

const cloudinary = require('../../utils/cloudinary')


exports.getFoodCategory = async (req, res, next) => {
    try {
        const categories = await FoodCategory.findAll();
        if (!categories) return next(new AppError('No Category exist', 404));
        
        return res.status(200).json({
            status: 'success',
            message: 'getting food category',
            data: { categories }
        });
        
    } catch (error) {
        next(error)
    }
}


exports.createFoodCategory = async (req, res, next) => {
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

exports.addFoodCategoryImage = async (req, res, next) => {
    if (!req.file) {
        const error = new Error('Invalid Input!');
        error.statusCode = 422;
        error.message = 'No image file uploaded'
        throw error;
    }  
    try {
        const category = await FoodCategory.findOne({ where: { id: req.params.id}});
        if (!category) {
            const error = new Error('Not Found!');
            error.statusCode = 404;
            error.message = 'Category not found'
            throw error;
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        category.secure_image_url = result.secure_url
        category.image_public_id = result.public_id
        const savedCategory = await category.save();
        if (!savedCategory) {
            const error = new Error('Server side error!');
            error.statusCode = 500;
            error.message = 'Something went wrong'
            throw error;
        }
        return res.status(201).json({
            category
        });
    } catch(error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

}

exports.updateFoodCategory = async (req, res, next) => {
    try {
        const category = await FoodCategory.findOne({ where: { id: req.params.id}});
        if (!category) {
            const error = new Error('Not found!');
            error.statusCode = 422;
            error.message = 'Food Category could not be found'
            throw error 
        }
        category.food_name = req.body.food_name;
        category.food_class = req.body.food_class
        const updatedCategory = await category.save();
        if (!updatedCategory) {
            const error = new Error('Server Side error');
            error.statusCode = 500;
            error.message = 'Cannot update the food Category in the db'
            throw error 
        }
        return res.status(201).json({
            status: "Successful",
            message: "Updated an existing Food Category",
            data: updatedCategory
        });
    } catch(error) {
        console.log(error);
        next(error)
    }
}

exports.deleteFoodCategory = async (req, res, next) => {
    try {
        const deletedCategory = await FoodCategory.destroy({ where: { id: req.params.id}});
        console.log('delete', deletedCategory)
        if (!deletedCategory) {
            const error = new Error('Server side error!');
            error.statusCode = 500;
            error.message = 'Food Category could not be deleted due to unmatched id'
            throw error 
        }
        return res.status(201).json({
            status: "Successful",
            message: "deleted an existing Food Category",
            data: {
                items_deleted: deletedCategory
            }
        });
    } catch(error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500
        }
        next(error);
    }
}
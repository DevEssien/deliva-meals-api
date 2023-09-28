const FoodCategory = require('../../models/Food-Category'); 
const AppError = require('../error/error');
const { clearImage } = require('../../utils/helperFunctions')

const cloudinary = require('../../utils/cloudinary')


exports.getFoodCategory = async (req, res, next) => {
    try {
        const categories = await FoodCategory.findAll();
        if (!categories) return next(new AppError('No Food Category exist', 404));

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
    const category = await FoodCategory.findOne({ where: { food_name: req.body.food_name.toLowerCase() }});
    if (category) return next(new AppError('Food Caterory already exist', 422)); 

    const newCategory = await FoodCategory.create({
        food_name: req.body.food_name.toLowerCase(),
        food_class: req.body.food_class.toLowerCase()
    });
  
    return res.status(201).json({
        status: "success",
        message: "Created a new Food Category",
        data: { newCategory }
    });
}

exports.addFoodCategoryImage = async (req, res, next) => {
    if (!req.file) return next(new AppError('No image file uploaded', 422)); 
    try {
        const category = await FoodCategory.findOne({ where: { id: req.params?.categoryId}});
        if (!category) return next(new AppError('Food Category not found', 404));
       
        const result = await cloudinary.uploader.upload(req.file.path);
        if (!result) return next(new AppError('getaddrinfo EAI_AGAIN api.cloudinary.com', -3001));

        category.secure_image_url = result.secure_url;
        category.image_public_id = result.public_id;

        clearImage(req.file.filename);  

        const savedCategory = await category.save();
        if (!savedCategory) return next(new AppError('Unable to save Food Category to db', 500));
      
        return res.status(201).json({
            status: 'success',
            message: 'Food Category Image uploaded',
            data: { category }
        });
    } catch(error) {
        next(error);
    }

}

exports.delFoodCategoryImage = async (req, res, next) => {
    try {
        const category = await FoodCategory.findOne({ where: { id: req.params?.categoryId}});
        if (!category) return next(new AppError('Food Category not found', 404));

        if (!category.image_public_id) return next(new AppError('Category has no image public id', 404))
       
        await cloudinary.uploader.destroy(category.image_public_id, async (error, result) => {
            if (error) return next(new AppError('Poor network', 400)); 

            category.image_public_id = ''
            category.secure_image_url = ''
            await category.save()

            return res.status(200).json({
                status: "success",
                message: "deleted image file from cloudinary",
                data: {
                    cloudinaryResult: {
                        result: await result
                    },
                },
            });
        });
    } catch (error) {
        next(error)
    }
} 

exports.updateFoodCategory = async (req, res, next) => {
    const reqObject = req.body;
    try {
        const category = await FoodCategory.findOne({ where: { id: req.params?.categoryId}});
        if (!category) return next(new AppError('Food Category could not be found', 404));

        for (const field in reqObject) {
            category[field] = reqObject[`${field}`].toLowerCase()
        }
        const updatedCategory = await category.save();

        if (!updatedCategory) return next(new AppError('Unable to update the food Category in the db', 500))
    
        return res.status(201).json({
            status: "success",
            message: "Updated an existing Food Category",
            data: { updatedCategory }
        });
    } catch(error) {
        next(error)
    }
}

exports.deleteFoodCategory = async (req, res, next) => {
    try {
        const category = await FoodCategory.findOne({ where: { id: req.params?.categoryId} });
        if (!category) return next(new AppError('Food Category could not be found', 404));

        const deletedCategory = await FoodCategory.destroy({ where: { id: category?.id }});
        if (!deletedCategory) return next(new AppError('Food Category could not be deleted due to unmatched id', 401));

        if (!category.image_public_id) return res.status(200).json({
            status: "success",
            message: "deleted an existing Food Category",
            data: {
                items_deleted: deletedCategory,
            },
        }); 

        await cloudinary.uploader.destroy(category.image_public_id, async (error, result) => {
            if (error) return next(new AppError('Poor network', 400)); 

            return res.status(200).json({
                status: "success",
                message: "deleted an existing Food Category and image file from cloudinary",
                data: {
                    items_deleted: deletedCategory,
                    cloudinaryResult: {
                        result: await result
                    },
                },
            });
        });
    } catch(error) {
        next(error);
    }
}
const AppError = require('../error/error');
const FoodCategory = require('../../models/food-category');
const SubFood = require('../../models/sub-food');
const cloudinary = require('../../utils/cloudinary');

exports.getSubFood = async (req, res, next) => {
    try {
        const subFoods = await SubFood.findAll();
        if (!subFoods) return next(new AppError('No sub food found', 404));

        return res.status(200).json({
            status: 'success',
            message: 'getting all sub foods',
            data: { subFoods }
        });
        
    } catch (error) {
        next(error)
    }
}

exports.createSubFood= async (req, res, next) => {
    try {
        let newCategory;
        const category = await FoodCategory.findOne({where: { food_name: req.body.category_name.toLowerCase()}})
        if (!category) {
            newCategory = await FoodCategory.create({
                food_name: req.body.category_name.toLowerCase(),
                food_class: ''
            });
            const savedCategory = await newCategory.save();
            if (!savedCategory) return(new AppError('Unable to save new food category to db', 500));
        }
    
        const subFood = await SubFood.findOne({ where: { food_name: req.body.food_name.toLowerCase()}});
        if (subFood) return next(new AppError('Sub food name already exist', 422));
      
        const newSubFood = await SubFood.create({
            food_name: req.body.food_name.toLowerCase(),
            description: req.body.description.toLowerCase(),
            price: req.body.price,
            preparation_duration: req.body.preparation_duration.toLowerCase(),
            calory_amount: req.body.calory_amount,
            CategoryId: category.id,
        });
    
        return res.status(201).json({
            status: "success",
            message: "New sub Food created",
            data: {
                newSubFood,
                createdCategory: newCategory
            }
        });

        
    } catch(error) {
        next(error);
    }
}

exports.updateSubFood= async (req, res, next) => {
    const reqObject = req.body;
    try {
        const subFood = await SubFood.findOne({ where: { id: req.params?.id}});
        if (!subFood) return next(new AppError('Sub Food could not be found', 422))
        
        for (const field in reqObject) {
            if (typeof reqObject[`${field}`] === 'string' || reqObject[`${field}`] instanceof String) {
                subFood[field] = reqObject[`${field}`].toLowerCase()
            } else {
                subFood[field] = reqObject[`${field}`];
            }
        }

        const updatedSubFood = await subFood.save();
        if (!updatedSubFood) return next(new AppError('Unable to update the sub food', 500))

        return res.status(201).json({
            status: "success",
            message: "Updated an existing Food Category",
            data: { updatedSubFood }
        });
    } catch(error) {
        console.log(error);
        next(error)
    }
}

exports.addSubFoodImage = async (req, res, next) => {
    if (!req.file) {
        const error = new Error('Invalid Input!');
        error.statusCode = 422;
        error.message = 'No image file uploaded'
        throw error;
    }  
    try {
        const subFood = await SubFood.findOne({ where: { id: req.params.id}});
        if (!subFood) {
            const error = new Error('Not Found!');
            error.statusCode = 404;
            error.message = 'Sub Food not found'
            throw error;
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        if (!result) {
            const error = new Error('EAI_AGAIN');
            error.statusCode = -3001;
            error.message = 'getaddrinfo EAI_AGAIN api.cloudinary.com'
            throw error;
        }
        subFood.secure_image_url = result.secure_url
        subFood.image_public_id = result.public_id

        const savedSubFood = await subFood.save();
        if (!savedSubFood) {
            const error = new Error('Server side error!');
            error.statusCode = 500;
            error.message = 'Something went wrong'
            throw error;
        }
        return res.status(201).json({
            subFood
        });
    } catch(error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

}

exports.deleteSubFoodImage = async (req, res, next) => {
    try {
        const subFood = await SubFood.findOne({ where: { image_public_id: req.params.publicId}});
        if (!subFood) {
            const error = new Error('Not Found!');
            error.statusCode = 404;
            error.message = 'No subfood found with the public id'
            throw error;
        }
        await cloudinary.uploader.destroy(subFood.image_public_id, async (err, result) => {
            if (!err) {
                subFood.secure_image_url = '';
                subFood.image_public_id = '';
                const savedSubFood = await subFood.save();
                if (!savedSubFood) {
                    const error = new Error('Server side error!');
                    error.statusCode = 500;
                    error.message = 'Something went wrong'
                    throw error;
                }
                res.status(200).json({
                    status: 'Successful',
                    message: 'Deleted image from cloudinary',
                    data: {
                        result: await result,
                        subFood
                    }
                });
            }
            const error = new Error('Network error');
            error.statusCode = 500;
            error.message = 'Could not delete image from cloudinary due to poor network';
            throw error;
        });
    } catch(error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.deleteSubFood= async (req, res, next) => {
    try {
        const deletedCategory = await SubFood.destroy({ where: { id: req.params.id}});
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

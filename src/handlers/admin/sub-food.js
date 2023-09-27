const AppError = require('../error/error');
const FoodCategory = require('../../models/food-category');
const SubFood = require('../../models/sub-food');
const cloudinary = require('../../utils/cloudinary');
const { clearImage } = require('../../utils/helperFunctions')

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
    if (!req.file) return next(new AppError('No image file uploaded', 422)); 
    
    try {
        const subFood = await SubFood.findOne({ where: { id: req.params.id}});
        if (!subFood) return next(new AppError('sub food category not found', 404));

        const result = await cloudinary.uploader.upload(req.file.path);

        if (!result) return next(new AppError('getaddrinfo EAI_AGAIN api.cloudinary.com', -3001));

        subFood.secure_image_url = result.secure_url;
        subFood.image_public_id = result.public_id;

        clearImage(req.file.filename);  

        const savedSubFood = await subFood.save();
        if (!savedSubFood) return next(new AppError('server side error', 500)) 
       
        return res.status(201).json({
            status: 'success',
            message: 'sub food image uploaded to cloudinary',
            data: { subFood }
        });
    } catch(error) {
        next(error);
    }

}

exports.deleteSubFoodImage = async (req, res, next) => {
    try {
        const subFood = await SubFood.findOne({ where: { image_public_id: req.params.publicId}});
        if (!subFood) return next(new AppError('No subfood found with the public id', 404));
      
        await cloudinary.uploader.destroy(subFood.image_public_id, async (err, result) => {
            if (!err) {

                subFood.secure_image_url = '';
                subFood.image_public_id = '';
                await subFood.save();
               
                return res.status(200).json({
                    status: 'success',
                    message: 'Deleted image from cloudinary',
                    data: {
                        result: await result,
                        subFood
                    }
                });
            }
            return next(new AppError('Could not delete image from cloudinary due to poor network', 404));
        });
    } catch(error) {
        next(error);
    }
}

exports.deleteSubFood= async (req, res, next) => {
    try {
        const subFood = await SubFood.findOne({ where: { id: req.params?.id} });
        if (!subFood) return next(new AppError('Sub Food could not be found', 404));

        const deletedSubFood = await subFood.destroy({ where: { id: req.params?.id}});
        if (!deletedSubFood) return next(new AppError('Sub Food could not be deleted', 500))

        if (!subFood.image_public_id) return res.status(200).json({
            status: "success",
            message: "deleted an existing sub Food Category",
            data: {
                items_deleted: deletedSubFood,
            },
        }); 

        await cloudinary.uploader.destroy(subFood.image_public_id, async (error, result) => {
            if (error) return next(new AppError('Poor network', 400)); 

            return res.status(200).json({
                status: "success",
                message: "deleted an existing Sub Food Category and image file from cloudinary",
                data: {
                    items_deleted: deletedSubFood,
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
        
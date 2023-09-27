const path = require('path'); 
const fs = require('fs');
const FoodCategory = require('../../models/food-category');
const SubFood = require('../../models/sub-food');
const cloudinary = require('../../utils/cloudinary');

exports.getSubFood = async (req, res, next) => {
    const subFoods = await SubFood.findAll()
    return res.json({
        message: 'getting all sub foods',
        subFoods
    });
}

exports.createSubFood= async (req, res, next) => {
    try {
        let newCategory;
        const category = await FoodCategory.findOne({where: { food_name: req.body.category_name}})
        if (!category) {
            newCategory = await FoodCategory.create({
                food_name: req.body.category_name,
                food_class: ''
            });
            const savedCategory = await newCategory.save();
            if (!savedCategory) {
                const error = new Error('Server Side error');
                error.statusCode = 500;
                error.message = 'Cannot save new food Category to db'
                throw error 
            }
        }
        try {
            const subFood = await SubFood.findOne({ where: { food_name: req.body.food_name}});
            if (subFood) {
                const error = new Error('Sub Food name already exist');
                error.statusCode = 422;
                error.message = 'Food name already exist in the main subFood'
                throw error 
            }
            const newSubFood = await SubFood.create({
                food_name: req.body.food_name,
                rating: req.body.rating,
                description: req.body.description,
                price: req.body.price,
                preparation_time: req.body.preparation_time,
                calory_amount: req.body.calory_amount,
                CategoryId: category.id,
            });
            const savedSubFood = await newSubFood.save();
            if (!savedSubFood) {
                const error = new Error('Server Side error');
                error.statusCode = 500;
                error.message = 'Cannot save new sub food to db'
                throw error 
            }
            return res.status(201).json({
                status: "Successful",
                message: "Created a new sub Food",
                data: {
                    newSubFood,
                    createdCategory: newCategory
                }
            });

        } catch(error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    } catch(error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.updateSubFood= async (req, res, next) => {
    try {
        const category = await SubFood.findOne({ where: { id: req.params.id}});
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

// const clearImage = async(filePath) => {
//     const filePath = path.join(__dirname, "..", filePath);
//     await fs.unlink(filePath, (err) => {
//         if (!err) {
//             console.log('deleted the file');
//         }
//         console.log('error ', err)
//     })
// }
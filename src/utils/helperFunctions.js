const path = require('path');
const fs = require('fs');

exports.clearImage = async (fileName) => {
    const filePath = path.join(__dirname,  '..', 'images', fileName);
    await fs.unlink(filePath, (error) => {
        if (error) {
            console.log('error ', error)
        } else {
            console.log('Image file deleted');
        }
    });
}
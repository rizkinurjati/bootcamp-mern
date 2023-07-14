const Images = require('../../api/v1/images/model');
const { NotFoundError } = require('../../errors');

const createImages = async (req) => {
    const result = await Images.create({
        name: req.file
        ? `uploads/${req.file.filename}`
        : 'upload/avatar/default.png',
    });

    return result;
};

const checkingImage = async (id) => {
    const result = await Images.findOne({ _id: id });
    console.log(result);

    if(!result) throw new NotFoundError(`Tidak ada gambar dengan id: ${id}`);

    return result;
}
module.exports = {
    createImages,
    checkingImage,
};
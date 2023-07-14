const mongoose = require('mongoose');
const { model, Schema } = mongoose;

let CategorySchema = Schema(
    {
        name: {
            type: String,
            minlength: [3, 'panjang nama kategori minimal 3 karakter'],
            maxlength: [20, 'panjang nama kategori maksimal 20 karakter'],
            required: [true, 'nama kategori harus diisi!'],
        },
        organizer: {
            type: mongoose.Types.ObjectId,
            ref:'Organizer',
            required: true,
        },
    },
    {timestamps:true}
);

module.exports = model('Category', CategorySchema);
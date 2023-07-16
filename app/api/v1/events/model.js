const mongoose = require('mongoose');

const ticketCategoriesSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, 'Tipe tiket harus di isi'],

    },
    price: {
        type: Number,
        default: 0,
    },
    stock: {
        type: Number,
        default: 0,
    },
    statusTicketCategories: {
        type: String,
        enum: [true, false],
        default: true,
    },
    expired: {
        type:Date,
    },
});

const EventSchema = new mongoose.Schema({
    title: {
        type:String,
        requried: [true, 'Judul harus diisi'],
        minlength: 3,
        maxlength: 50,
    },
    about: {
        type:String,
    },
    date: {
        type:Date,
    },
    tagline: {
        type:String,
        required: [true, 'Tagline harus diisi'],
    },
    venueName: {
        type:String,
        required: [true, 'Tempat acara harus diisi'],
    },
    keyPoint: {
        type:[String],

    },
    statusEvent: {
        type:String,
        enum: ['Draft','Published'],
        default: 'Draft'
    },
    tickets: {
        type:[ticketCategoriesSchema],
        required:true
    },
    image: {
        type: mongoose.Types.ObjectId,
        ref:'Image',
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref:'Category',
        required: true,
    },
    talent: {
        type: mongoose.Types.ObjectId,
        ref:'Talent',
        required: true,
    },
    organizer: {
        type: mongoose.Types.ObjectId,
        ref: 'Organizer',
        required: true,
      },
},
{ timestamps: true}
);

module.exports = mongoose.model('Event', EventSchema);
const Events = require('../../api/v1/events/model');
const { checkingImage } = require('./images');
const { checkingCategories } = require('./categories');
const { checkingTalents } = require('./talents');
const { BadRequestError, NotFoundError } = require('../../errors');

const getAllEvents = async (req) => {
    const { keyword, category, talent, status } = req.query;
    let condition = { organizer: req.user.organizer };

    if(keyword) {
        condition = { ...condition, title: { $regex: keyword, $options: 'i' }};

    }
    if(category) {
        condition = { ...condition, category: category };
        
    }
    if(talent) {
        condition = { ...condition, talent: talent};
        
    }
    if (['Draft', 'Published'].includes(status)) {
        condition = {
          ...condition,
          statusEvent: status,
        };
      }
    const result = await Events.find(condition)
    .populate({ path:'image' , select:' _id name '})
    .populate({
        path: 'category',
        select: '_id name',
    })
    .populate({
        path:'talent',
        select: '_id name role image',
        populate: { path:'image', select:'_id name'},
    });

    return result;
};

const createEvents = async (req) => {
    const {
        title,
        about,
        date,
        tagline,
        venueName,
        keyPoint,
        statusEvent,
        tickets,
        image,
        category,
        talent,
    } = req.body;

    await checkingImage(image);
    await checkingCategories(category)
    await checkingTalents(talent);

    const check = await Events.findOne({ title });
    if(check) throw new BadRequestError('judul event sudah ada');

    const result = await Events.create({
        title,
        about,
        date,
        tagline,
        venueName,
        keyPoint,
        statusEvent,
        tickets,
        image,
        category,
        talent,
        organizer: req.user.organizer,
    })

    return result;
};

const getOneEvents = async (req) => {
    const { id } = req.params;

    const result = await Events.findOne({ 
        _id: id,
        organizer: req.user.organizer,
     })
    .populate({ path:'image' , select:' _id name '})
    .populate({
        path: 'category',
        select: '_id name'
    })
    .populate({
        path:'talent',
        select: '_id name role image',
        populate: { path:'image', select:'_id name'}
    });

    if (!result) throw new NotFoundError(`Tidak ada Event dengan id : ${id}`);
    return result;
};

const updateEvents = async (req) => {
    const { id } = req.params;
    const {
        title,
        about,
        date,
        tagline,
        venueName,
        keyPoint,
        statusEvent,
        tickets,
        image,
        category,
        talent,
    } = req.body;

    await checkingImage(image);
    await checkingCategories(category);
    await checkingTalents(talent);
 
    const checkEvent = await Events.findOne({
        _id : id
    });
    if(!checkEvent) throw new NotFoundError(`Tidak ada event dengan id: ${id}`);

    const check = await Events.findOne({ 
        title,
        organizer: req.user.organizer,
        _id: { $ne: id } 
    });
    
    if(check) throw new BadRequestError(`nama event sudah ada`);

    const result = await Events.findByIdAndUpdate(
        { _id:id }, 
        {
            title,
            about,
            date,
            tagline,
            venueName,
            keyPoint,
            statusEvent,
            tickets,
            image,
            category,
            talent,
            organizer: req.user.organizer,
        }, 
        { new:true, runValidators: true}
    );
    return result;
};

const deleteEvents = async (req) => {
    const { id } = req.params;
    const result = await Events.findOne({ 
        _id: id,
        organizer: req.user.organizer,
    });
    if(!result) throw new NotFoundError(`Tidak ada event dengan id : ${id}`);

    await result.deleteOne();
    return result;

};

const changeStatusEvents = async (req) => {
    const { id } = req.params;
    const { statusEvent } = req.body;
  
    if (!['Draft', 'Published'].includes(statusEvent)) {
      throw new BadRequestError('Status harus Draft atau Published');
    }
  
    // cari event berdasarkan field id
    const checkEvent = await Events.findOne({
      _id: id,
      organizer: req.user.organizer,
    });
  
    // jika id result false / null maka akan menampilkan error `Tidak ada acara dengan id` yang dikirim client
    if (!checkEvent)
      throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);
  
    checkEvent.statusEvent = statusEvent; //rubah status event di model dengan event yang di kirim body
  
    await checkEvent.save();
  
    return checkEvent;
  };

module.exports = {
    getAllEvents,
    createEvents,
    getOneEvents,
    updateEvents,
    deleteEvents,
    changeStatusEvents,
};

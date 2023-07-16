const Participant = require('../../api/v1/participants/model');
const Events = require('../../api/v1/events/model');
const Orders = require('../../api/v1/orders/model');
const Payments = require('../../api/v1/payments/model');

const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require('../../errors');
const { createTokenParticipant, createJWT } = require('../../utils');

const { otpMail } = require('../mail');
const { invoiceMail } = require('../mail');

const signupParticipant = async (req) => {
  const { firstName, lastName, email, password, role } = req.body;

  // jika email dan status tidak aktif
  let result = await Participant.findOne({
    email,
    status: 'tidak aktif',
  });

  if (result) {
    result.firstName = firstName;
    result.lastName = lastName;
    result.role = role;
    result.email = email;
    result.password = password;
    result.otp = Math.floor(Math.random() * 9999);
    await result.save();
  } else {
    result = await Participant.create({
      firstName,
      lastName,
      email,
      password,
      role,
      otp: Math.floor(Math.random() * 9999), //data otp di kirim ke views/email/otp.html
    });
  }
  await otpMail(email, result); //otpMail mengirim data email dan result untuk di services email

  delete result._doc.password;
  delete result._doc.otp;

  return result;
};

const activateParticipant = async (req) => {
  const { otp, email } = req.body;
  const check = await Participant.findOne({
    email,
  });//cek email participant yang akan mengaktifasi

  if (!check) throw new NotFoundError('Partisipan belum terdaftar');//error email participant 

  if (check && check.otp !== otp) throw new BadRequestError('Kode otp salah');//error kode otp

  const result = await Participant.findByIdAndUpdate(
    check._id,
    {
      status: 'aktif',
    },
    { new: true }
  ); //jika ada maka script update akan running dan status akun akan di aktifkan

  delete result._doc.password; //password tidak akan tampil di server

  return result;
};

const signinParticipant = async (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const result = await Participant.findOne({ email: email });

  if (!result) {
    throw new UnauthorizedError('Invalid Credentials');
  }

  if (result.status === 'tidak aktif') {
    throw new UnauthorizedError('Akun anda belum aktif');
  }

  const isPasswordCorrect = await result.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid Credentials');
  }

  const token = createJWT({ payload: createTokenParticipant(result) });

  return token;
};

const getAllEvents = async (req) => {
  const result = await Events.find({ statusEvent: 'Published' })
    .populate('category')
    .populate('image')
    .select('_id title date tickets venueName');

  return result;
};

const getOneEvent = async (req) => {
  const { id } = req.params;
  const result = await Events.findOne({ _id: id })
    .populate('category')
    .populate({ path: 'talent', populate: 'image' })
    .populate('image');

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

  return result;
};

const getAllOrders = async (req) => {
  console.log(req.participant);
  const result = await Orders.find({ participant: req.participant.id });
  return result;
};

/**
 * Tugas Send email invoice
 * TODO: Ambil data email dari personal detail
 *  */
const checkoutOrder = async (req) => {
  const { event, personalDetail, payment, tickets } = req.body;
  const checkingEvent = await Events.findOne({ _id: event }); //masukin data id event
  if (!checkingEvent) {
    throw new NotFoundError('Tidak ada acara dengan id : ' + event);
  }

  const checkingPayment = await Payments.findOne({ _id: payment });

  if (!checkingPayment) {
    throw new NotFoundError(
      'Tidak ada metode pembayaran dengan id :' + payment
    );
  }

  let totalPay = 0, //variable total payment
    totalOrderTicket = 0; //variable total tiket
  await tickets.forEach((tic) => { //lopping tiket untuk cek
    checkingEvent.tickets.forEach((ticket) => { //looping ticket di checking event
      if (tic.ticketCategories.type === ticket.type) { // jika tiket category sama dengan tipe tiket yang di pesan
        if (tic.sumTicket > ticket.stock) { // jika jumlah tiket yang di pesan lebih besar dari stock muncul error
          throw new NotFoundError('Stock event tidak mencukupi');
        } else {
          ticket.stock -= tic.sumTicket; // jika ticket ada maka stock akan di kurangi jumlah tiket yang dipesan

          totalOrderTicket += tic.sumTicket; //total order ticket dari semua tiket di tambah jumlah tiket yang tipenya sama
          totalPay += tic.ticketCategories.price * tic.sumTicket; //total pembayaran default 0 di tambah harga tiket dikali jumlah yang di pesan
        }
      }
    });
  });
  await checkingEvent.save();

  const historyEvent = { // history event di daat dari checking event yang di atas
    title: checkingEvent.title,
    date: checkingEvent.date,
    about: checkingEvent.about,
    tagline: checkingEvent.tagline,
    keyPoint: checkingEvent.keyPoint,
    venueName: checkingEvent.venueName,
    tickets: tickets,
    image: checkingEvent.image,
    category: checkingEvent.category,
    talent: checkingEvent.talent,
    organizer: checkingEvent.organizer,
  };

  const result = new Orders({
    date: new Date(),
    personalDetail: personalDetail,
    totalPay,
    totalOrderTicket,
    orderItems: tickets,
    participant: req.participant.id,
    event,
    historyEvent,
    payment,
  });
  await result.save();
  await invoiceMail(personalDetail.email, result);

  return result;
};

const getAllPaymentByOrganizer = async (req) => {
  const { organizer } = req.params;

  const result = await Payments.find({ organizer: organizer });

  return result;
};

module.exports = {
  signupParticipant,
  activateParticipant,
  signinParticipant,
  getAllEvents,
  getOneEvent,
  getAllOrders,
  checkoutOrder,
  getAllPaymentByOrganizer,
};

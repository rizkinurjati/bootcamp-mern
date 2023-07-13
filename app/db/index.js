// (1) import package mongoose
const mongoose = require('mongoose');

//(2) kita import konfigurasi terkait monggoDB dari app/config/index.js
const { urlDb } =  require('../config');

//(3) Connect ke mongoDB dengan menggunakan konfigurasi yang teah kita import 
mongoose.connect(urlDb);

//(4) Simpan koneksi ke dalam constant db
const db = mongoose.connection;

//(5) Export db supaya bisa di gunakan file lain yang membutuhkan
module.exports = db;
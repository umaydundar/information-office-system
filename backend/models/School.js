const mongoose = require('mongoose');

// Define the schema for the school data
const schoolSchema = new mongoose.Schema({
  Adres: {
    type: String,
    required: true
  },
  AdresKodu: {
    type: String,
    required: true
  },
  Fax: {
    type: String,
    default: ""
  },
  KurumAdi: {
    type: String,
    required: true
  },
  Telefon: {
    type: String,
    required: true
  },
  IlAdi: {
    type: String,
    required: true
  },
  IlceAdi: {
    type: String,
    required: true
  }
});

const School = mongoose.model('School', schoolSchema);

module.exports = School;
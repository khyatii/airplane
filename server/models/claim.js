const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const claimSchema = new Schema({
  userMoney: Number,
  collaborator: {
    money: Number,
    promoCode: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
  },
  companyMoney: Number,
  username: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  claimType: {
    type: String,
    enum: [ "Delay less than 3 hours", "Delay greater than 3 hours", "Cancellation", "Overbooking"],
    default: "Other",
    required: true
  },
  airline: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Airline'
  },
  airports: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Airport'
  }],
  incidentAirport: String,
  year: Number,
  description: String,
  companyClaim: {
    originalName: String,
    secureUrl: String,
    mimeType: String
  },
  flightTicketOrReservation: {
    originalName: String,
    secureUrl: String,
    mimeType: String
  },
  boardingPass: {
    originalName: String,
    secureUrl: String,
    mimeType: String
  },
  status: {type: String, enum:["Pending", "ClaimCompany", "ClaimAdmin1", "ClaimAdmin2", "WaitingPayment1", "WaitingPayment2", "Court", "CourtPayment", "PaymentDone", "Rejected"], default:"Pending"}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Claim = mongoose.model('Claim', claimSchema);
module.exports = Claim;

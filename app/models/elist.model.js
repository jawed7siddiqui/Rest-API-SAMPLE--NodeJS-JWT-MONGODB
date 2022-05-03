const mongoose = require("mongoose");

const Elist = mongoose.model(
  "Elist",
  new mongoose.Schema({
    messageId: String,
    inReplyTo: String,
    references: String,
    conversionId: String,
    answer: String,
    ticketId: String,
    from: String,
    to: String,
    subject: String,
    msg: String,
    date: Date,
    status: String,
    cid: String,
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  })
);
 
//Update New field in existing model/collection

// Elist.updateMany(
//   {}, 
//   {$set: {status:'Pending' }},
//   {multi:true}, 
//     function(err, numberAffected){  
//       console.log(numberAffected);
//     });



module.exports = Elist;

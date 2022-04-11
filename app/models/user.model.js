const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    password: String,
    address: String,
    city: String,
    state: String,
    phone: String,
    status: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

//Update New field in existing model/collection

User.updateMany(
  {}, 
  {$set: {firstname : '',lastname : '',status:'Pending' }},
  {multi:true}, 
    function(err, numberAffected){  
      console.log(numberAffected);
    });

    // mongoose.set('toJSON', {  //make id instead of _id
    //   virtuals: true,
    //   versionKey:false,
    //   transform: function (doc, ret) {   delete ret._id  }
    // });

module.exports = User;

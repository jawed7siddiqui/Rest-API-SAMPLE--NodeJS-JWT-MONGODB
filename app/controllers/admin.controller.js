const db = require("../models");
const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {

  User.find(function (err, User) {
    if (err) return console.error(err);
    console.log(User);
    var data = {
      total:50,
      users:User,
    }
    res.json(data);
  }).sort({username: -1});
  // res.status(200).send("User Content.");
};

exports.userDetail = (req, res) => {

  User.findById({_id: req.params.id},function (err, User) {
    if (err) return console.error(err);
    console.log(User);
    res.json(User);
  });
  // res.status(200).send("User Content.");
};

exports.userStatus = (req, res) => {
     var isActive = '';
    if(req.body.status == 'Pending'){
        isActive = 'Active';
    }else{
        isActive = 'Pending';

    }
    User.findOneAndUpdate({_id: req.body.id},{ status: isActive }, { upsert: true },function (err, result) {
      if (err) return console.error(err);
      console.log(result);

      res.json(result);
    });
    // res.status(200).send("User Content.");
  };


// Contact.updateOne({
//     phone: request.phone
// }, { status: request.status }, { upsert: true });


exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

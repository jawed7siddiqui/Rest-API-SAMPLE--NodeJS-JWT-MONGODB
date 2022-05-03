var helpers = require("./helpers");
const db = require("../models");
const User = db.user;
const Email = db.email;
const Elist = db.elist;



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
  });
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

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.imapEmail = (req, res) => {

   helpers.imapEmail(req,res);
    

    }

  exports.emailList = (req, res) => {

 

      Elist.find(function (err, data) {
        if (err) return console.error(err);
        res.status(200).json(data);
      
      }).select('from to subject date messageId inReplyTo references conversionId ticketId').sort({date: -1});     

        
     }


     exports.conversions = (req, res) => {

      var filter = { conversionId:req.query.conversionId } 

      Email.find(filter,function (err, data) {
        if (err) return console.error(err);
        res.status(200).json(data);
      
      }).select('from to subject date messageId inReplyTo references conversionId ticketId').sort({date: -1});     

        
     }


  //   const data = new Imap({
  //     from: 44,
  //     subject: 44,
  //     msg: 66,
  
  //   });
  
  //   data.save(function(err,result){
  //     if (err){ console.log(err); }
  //     else{ console.log(result) }
  //  });

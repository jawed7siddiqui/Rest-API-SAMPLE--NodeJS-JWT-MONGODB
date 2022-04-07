const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    phone: req.body.phone,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          User.findOne({
            username: req.body.username
          })
            .populate("roles", "-__v")
            .exec((err, user) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
            })

          var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
          });
          res.status(200).send(
            {  
              "message": "User was registered successfully!",
              "userData":{

            username: req.body.username,
            email: req.body.email,         
            role: 'client',         
            "ability": [
              {
                "action": "read",
                "subject": "ACL" //for client access
            },
            {
                "action": "read",
                "subject": "Auth"
            }
              // {
              //   "action": "manage", //for admin access
              //   "subject": "all"
              // }
            ],
            "extras": {
              "eCommerceCartItemsCount": 5
            }       
           },
            accessToken: token,
            refreshToken: token,
        });

        //  res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      
      var role = '';
      if(authorities[0] == 'ROLE_USER'){
         role = 'client';
      }

      if(authorities[0] == 'ROLE_ADMIN'){
        role = 'admin';
     }

     if(authorities[0] == 'ROLE_MOD'){ //moderator
      role = 'mod';
     }

      res.status(200).send(
        {
          "userData":{
        id: user._id,
        username: user.username,
        email: user.email,
        // role: authorities[0],
        role: role, 
        "ability": [
          {
            "action": "read",
            "subject": "ACL" //for client access
        },
        {
            "action": "read",
            "subject": "Auth"
        }
          // {
          //   "action": "manage", //for admin access
          //   "subject": "all"
          // }
        ],
        "extras": {
          "eCommerceCartItemsCount": 5
        }       
       },
        accessToken: token,
        refreshToken: token,
    });
    });
};

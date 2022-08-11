const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Login_session = db.login_session;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 2, default user role
        console.log("printing out a user");
        console.log("user");
        user.setRoles([2]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.register_login = (req,res) => {
  //updating a new login
  // console.log(req)
  Login_session.update(
    {username: req.body.username},
  {
    where: {
      id: 1
    }
  }).then(res.status(200).send({message: "updated current login to new user"}))
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  // console.log("printing res")
  // console.log(res)
}

// exports.register_login = (req, res) => {
//   //updating a new login
//   console.log(req)
//   // Login_session.update(
//   //   { username: "new user" },
//   //   {
//   //     where: {
//   //       id: 1
//   //     }
//   //   });

//   const item = Login_session.update(
//     {id: 1,
//       username: "111111",
//       logindate: "2022-08-09 17:22:56",
//       comment: "this is updated",
//       createdAt: "2022-08-09 17:22:56",
//       updatedAt: "2022-08-09 17:22:56"
//     },
//     {
//       where: {
//         id: 1
//       }
//     }).then(login => {
//       console.log("printing login");
//       console.log(login);
//     }

//     );
//   console.log("printing res")
//   console.log(res)
//   console.log("printing item")
//   console.log(item)
//   return { item, created: false };
// };

// exports.register_login = (req, res) => {
//   //updating a new login
//   console.log(req.body)
//   console.log("printing res")
//   console.log(res)
//   // Login_session.update(
//   //   { username: "new user" },
//   //   {
//   //     where: {
//   //       id: 1
//   //     }
//   //   });

//   Login_session.create({
//     id: 2,
//     username: "111111",
//     logindate: "2022-08-09 17:22:56",
//     comment: "this is updated",
//     createdAt: "2022-08-09 17:22:56",
//     updatedAt: "2022-08-09 17:22:56"
//   })

// };


// exports.register_login = (req,res) => {
//   //updating a new login
//   console.log(req)
//   Login_session.update(
//     {username: "new user"},
//   {
//     where: {
//       id: 1
//     }
//   }).then(login => {
//     {
//       // user role = 2, default user role
//       console.log("printing out a login");
//       console.log(login);
//       login.setUsername(["asdf"]).then(() => {
//         res.send({ message: "User registered successfully!" });
//       });
//     }
//   })
    
// };

//This one is a good one
// exports.register_login = (req, res) => {
//   //updating a new login
//   Login_session.update({ username: "new user" },
//     {
//       where: {
//         id: 1
//       }
//     }).then(
//       res.status(200).send({
//         username: "new user",
//         id: 1
//       })
//       )
//     .catch(err => {
//       res.status(500).send({ message: err.message });
//     });
// };

// exports.register_login =
//   //updating a new login
//   await Login_session.update({ username: "new user" },
//     {
//       where: {
//         id: 1
//       }
//     }).then(
//       res.status(200).send({
//         username: "new user",
//         id: 1
//       })
//     )
//     .catch(err => {
//       res.status(500).send({ message: err.message });
//     });


// exports.register_login = (req,res) => {
//   const _id = 1;

//   //updating a new login
//   Login_session.update(req.body,{
//     where: {id: _id}
//     })
//     .then(num => {
//       if (num == 1){
//         res.send({
//           message : "Tutorial was updated successfully."
//         });
//       }else{
//         res.send({
//           message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
//         });
//       }
//     })
      
//     .catch(err => {
//       res.status(500).send({ message: err.message + id });
//     });
// }


// exports.register_login = (req, res) => {
//   // Validate request
//   if (!req.body.title) {
//     res.status(400).send({
//       message: "Content can not be empty!"
//     });
//     return;
//   }
//   // Create a Tutorial
//   let now = nodeDate.format(new Date(), 'YYYY-MM-DD, hh:mm:ss a');
//   //2022 - 08 - 09 17: 22: 56.000000
//   console.log(now);

//   const login_session = {
//     id: 1,
//     logindate: now
//   };
//   // Save Tutorial in the database
//   Login_session.update(login_session)
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while updating the login session."
//       });
//     });
// };


exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
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
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });

      // Add current_login query here, this is after role is retrieved
      // console.log(username); this command made the thing crash
      // first I need to create a model for current login
      // then i need to create a function which updates the model using a parameter. Follow the code for roles.
      


    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

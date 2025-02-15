exports.signup = 
function(req, res){
    // Save User to Database
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })
        .then(function(user) {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then(function(roles) {
                    //setRoles is automatically generated by Sequelize
                    user.setRoles(roles).then( function() {
                        res.send({ message: "User registered successfully!" });
                    });
                });
            } else {
                // user role = 2, default user role
                user.setRoles([2]).then(() => {
                    res.send({ message: "User registered successfully!" });
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};
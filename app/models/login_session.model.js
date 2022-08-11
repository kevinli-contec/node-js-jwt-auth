module.exports = (sequelize, Sequelize) => {
    const Login_session = sequelize.define("current_logins", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING(45)
        },
        // logindate: {
        //     type: Sequelize.DATE
        // },
        comments: {
            type: Sequelize.TEXT('tiny')
        }
    });

    return Login_session;
};

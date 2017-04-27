var Sequelize = require('sequelize');

var sequelize = new Sequelize('postgres://ninecoupon:ninecoupon@127.0.0.1:5432/ninecoupon', {
    logging: true,
    define: {
        freezeTableName: true,
        underscored: true

    },
    dialect:'postgres'
});

exports.sequelize = sequelize;

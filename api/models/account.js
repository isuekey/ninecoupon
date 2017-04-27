var Sequelize = require('sequelize');
var sequelize = require('../../config/database/sequelize').sequelize;

var Account = sequelize.define('t_account', {
    name:{
        type:Sequelize.text
    }
});

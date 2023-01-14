const Sequelize = require('sequelize')

const connection = new Sequelize('projeto','root','admin',{

    host: 'localhost',
    dialect:'mysql'
})

module.exports = connection
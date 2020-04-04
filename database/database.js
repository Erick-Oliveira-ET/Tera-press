const Sequelize = require('sequelize');

const connection = new Sequelize('terapress', 'root', 'Ericktomaz12',{
  host: 'localhost',
  dialect:'mysql',
  timezone: "-3:00" //Seta a timezone que quiser. Por padrão usa a universal.
});

module.exports = connection;

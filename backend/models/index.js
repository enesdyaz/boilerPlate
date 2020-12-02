const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);



//------------------------------------------------//
// ADD MODELS 
//------------------------------------------------//

db.User = require('./User') (sequelize, Sequelize)  
// db.Image = require('./Image') (sequelize, Sequelize)  
db.Post = require('./Post')(sequelize, Sequelize)  
db.Comment = require('./Comment')(sequelize, Sequelize)  
// db.Hashtag = require('./hashtag')(sequelize, Sequelize)  


// db.MainFormContent = require('./MainFormContent')(sequelize, Sequelize)
// db.Database = require('./Database')(sequelize, Sequelize)




Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


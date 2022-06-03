const { app } = require('./app');

// Models
const { initModels } = require('./models/initModels');

// Utils
const { db } = require('./utils/database');

// Authenticate database credentials
db.authenticate()
  .then(() => console.log('---Database authenticated---'))
  .catch(err => console.log(err));

// Establish models relations
initModels();

// Sync sequelize models
db.sync() //{ force: true }
  .then(() => console.log('---Database synced---'))
  .catch(err => console.log(err));

//spin up server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Express app running on port: ${PORT}`);
});

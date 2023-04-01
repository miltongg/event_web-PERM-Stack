import app from "./app";
import {sequelize} from "./database/database";

import './models/User';

async function main() {
  try {
    await sequelize.authenticate();
    console.log("Db Connected");
    await sequelize.sync();
    app.listen(app.get('port'));
    console.log('Server running on port:', app.get('port'));
  } catch (error) {
    console.log('Unable to connect to the database:', error)
  }
  
}

main();
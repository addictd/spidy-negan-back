var mysql = require('mysql');
import config from '../config';


var connection = mysql.createConnection({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME
});
connection.connect(function (err) {
  if (err) {
    console.error('[DB NOT CONNECTED]: ' + err.stack);
    return;
  }
  console.log('[DB CONNECTED] with id:', connection.threadId, 'and port:',config.DB_PORT );
});


export default connection;

var debug = require('debug')('my-application');
const config = require("../../config");
import '../db';
import {http} from '../socket';


http.listen(config.PORT, function () {
  console.log('[Server_started]: ', config.PORT);
  // debug('[Debug_server]: ' + server.address().port);
});

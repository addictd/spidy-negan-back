
var debug = require('debug')('my-application');
var app = require('../app');
const config = require("../../config");
import '../db';

app.set('port', config.PORT);

var server = app.listen(config.PORT, function () {
  console.log('Server running on port: ', server.address().port);
  debug('Express server listening on port ' + server.address().port);
});

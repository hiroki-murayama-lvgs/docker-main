import * as util from './util';

let rowArray = []

util.loadSheet().then(() => {

  rowArray = util.rowArray;

}).then(() => {

  const connection = util.connectionMysql();
  return connection;

}).then((connection) => {

  util.insertMysql(connection, rowArray);

});



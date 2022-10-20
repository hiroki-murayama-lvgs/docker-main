require('dotenv').config();
import { GoogleSpreadsheet } from 'google-spreadsheet';
import * as mysql from 'promise-mysql';

export let rowArray = []

/* GCP経由でGSからデータを取得、配列rowArrayに収納 */
export async function loadSheet() {
  const ss = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
  const credentials = require('./credentials.json');
  await ss.useServiceAccountAuth(credentials);
  await ss.loadInfo();
  const lessonSheet = await ss.sheetsById[0];
  const sheetRows = await lessonSheet.getRows();
  
  for( let i = 0; i < sheetRows.length; ) {
    rowArray.push(sheetRows[i++]._rowData);
  }
};

/* MySQLに接続 */
export async function connectionMysql() {
  const connection = await mysql.createConnection({
    host: 'db',
    user: 'docker',
    password: 'secret',
    database: 'typescript',
    multipleStatements: true
  });
  return connection;
}

/* 配列を展開してMySQLに挿入 */
export function insertMysql(connection, array) {
  for ( let i = 0; i < array.length; i++ ) {
    let insertName = array[i][1];
    let insertAge = array[i][2];
    const TABLE_NAME = 'sample';
    const sql = 'INSERT INTO ' + TABLE_NAME + ' SET ?';
    let inserts = {name: insertName, age: insertAge};
    let result = connection.query(sql, inserts);
  }
  const res = connection.query('SELECT * FROM sample;');
  connection.end();
  res.then((res) => {
    console.log(res);
  });
};
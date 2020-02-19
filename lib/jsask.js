const connection = require("../config/connection");

class JsAsk {
 constructor() {
  this.command = "";
 }

 insert(insertParams) {
  this.command = `INSERT INTO ${connection.escapeId(insertParams.table)} (`
   + insertParams.fields.map(field => connection.escapeId(field)).toString() + ")\n";
  if (insertParams.values) {
   if (insertParams.values.length > 0) {
    this.command += " VALUES (" + insertParams.values.map(value => connection.escape(value)).toString() + ")\n";
   }
  }

  return this;
 }

 select(fields) {
  this.command += "SELECT "
   + fields.map(field => {
    if (typeof field !== "object") {
     return connection.escapeId(field);
    } else {
     return connection.escapeId(field.name) + " AS " + connection.escapeId(field.alias);
    }
   }).toString() + "\n";

  return this;
 }

 selectValues(values) {
  this.command += "SELECT "
   + values.map(value => {
    if (typeof value !== "object") {
     return connection.escape(value);
    } else {
     return connection.escape(value.value) + " AS " + connection.escapeId(value.alias);
    }
   }).toString() + "\n";

  return this;
 }

 from(table) {
  this.command += "FROM ";
  if (typeof table !== "object") {
   this.command += connection.escapeId(table);
  } else {
   this.command += connection.escapeId(table.name) + " AS " + connection.escapeId(table.alias);
  }
  this.command += "\n";

  return this;
 }

 go(cb) {
  const query = connection.query(this.command, (err, result) => {
   console.log(query.sql);
   if (err) {
    return cb(err);
   }
   cb(null, result);
  });
 }
}

module.exports = JsAsk;
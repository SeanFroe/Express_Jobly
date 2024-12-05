const { BadRequestError } = require("../expressError");

// PART 1: add documentation to sqlForPartialUpdate

// This generates an SQL query fragment for a partial update of a database record.
// uses the UPDATE statement in sql to update the database
// uses parameters "dataToUpdate" as an object representing the fields to update and their new values
// i.e {firstName: "Sean", age: 34}
// uses parameter "jsToSql" as a mapping object that translates JS-style field names into SQL column names
// i.e  { firstName: "first_name", lastName: "last_name" }

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };

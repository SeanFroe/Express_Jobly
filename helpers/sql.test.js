//***************************************** PART 1.2 sql.test.js ************************************ */

"use strict";

const { sqlForPartialUpdate } = require("../helpers/sql");

//************************************************ TESTS ********************************************* */

describe("createSql", function () {
  test("works: basic input", function () {
    const dataToUpdate = { firstName: "Aliya", age: 32 };
    const jsToSql = { firstName: "first_name", age: "age" };

    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: '"first_name"=$1, "age"=$2',
      values: ["Aliya", 32],
    });
  });

  test("works: no jsToSql mapping", function () {
    const dataToUpdate = { firstName: "Aliya", age: 32 };

    const result = sqlForPartialUpdate(dataToUpdate, {});

    expect(result).toEqual({
      setCols: '"firstName"=$1, "age"=$2',
      values: ["Aliya", 32],
    });
  });

  test("throws error with no data", function () {
    expect(() => sqlForPartialUpdate({}, {})).toThrow("No data");
  });

  test("ignores extra jsToSql keys", function () {
    const dataToUpdate = { firstName: "Aliya" };
    const jsToSql = { firstName: "first_name", age: "age" };

    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: '"first_name"=$1',
      values: ["Aliya"],
    });
  });

  test("works with unmapped fields", function () {
    const dataToUpdate = { firstName: "Aliya", favoriteColor: "blue" };
    const jsToSql = { firstName: "first_name" };

    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: '"first_name"=$1, "favoriteColor"=$2',
      values: ["Aliya", "blue"],
    });
  });

  test("handles special characters", function () {
    const dataToUpdate = { firstName: "Aliya's", age: 30 };
    const jsToSql = { firstName: "first_name" };

    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: '"first_name"=$1, "age"=$2',
      values: ["Aliya's", 30],
    });
  });
  test("works with single key", function () {
    const dataToUpdate = { firstName: "Aliya" };
    const jsToSql = { firstName: "first_name" };

    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: '"first_name"=$1',
      values: ["Aliya"],
    });
  });

  test("works with complex mapping", function () {
    const dataToUpdate = { firstName: "Aliya", lastName: "Jones", age: 30 };
    const jsToSql = { firstName: "first_name", lastName: "last_name" };

    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: '"first_name"=$1, "last_name"=$2, "age"=$3',
      values: ["Aliya", "Jones", 30],
    });
  });

  test("works with different types of data", function () {
    const dataToUpdate = {
      firstName: "Aliya",
      age: 30,
      isAdmin: true,
    };
    const jsToSql = { firstName: "first_name" };

    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: '"first_name"=$1, "age"=$2, "isAdmin"=$3',
      values: ["Aliya", 30, true],
    });
  });
});

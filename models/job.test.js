"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", () => {
  const newJob = {
    id: 200,
    title: "New",
    salary: 10000,
    equity: "1",
    companyHandle: "c1",
  };

  test("works", async () => {
    let job = await Job.create(newJob);
    expect(job).toEqual(newJob);

    const results = await db.query(
      `SELECT id, title, salary, equity, company_handle
        FROM jobs
        WHERE id = 200 `
    );
    expect(results.rows).toEqual([
      {
        id: 200,
        title: "New",
        salary: 10000,
        equity: "1",
        company_handle: "c1",
      },
    ]);
  });
});
/***************************************** GET */

describe("get", () => {
  test("works", async () => {
    const job = await Job.get(1);
    expect(job).toEqual({
      id: 1,
      title: "C1",
      salary: 50000,
      equity: "0.1",
      companyHandle: "c1",
    });
  });

  test("not found if no such job", async () => {
    try {
      await Job.get(9999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

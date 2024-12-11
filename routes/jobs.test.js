"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");
const { NotFoundError } = require("../expressError");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /companies */

describe("GET /jobs", () => {
  test("ok for anon", async () => {
    const resp = await request(app).get("/jobs");
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      companies: [
        {
          id: expect.any(Number),
          title: "C1",
          salary: 50000,
          equity: "0.1",
          companyHandle: "c1",
        },
        {
          id: expect.any(Number),
          title: "C2",
          salary: 40000,
          equity: "0.5",
          companyHandle: "c2",
        },
        {
          id: expect.any(Number),
          title: "C3",
          salary: 30000,
          equity: "0.5",
          companyHandle: "c3",
        },
      ],
    });
  });

  test("not found if no such job", async () => {
    try {
      await Jobs.get(-1); // Pass an invalid ID to trigger NotFoundError
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

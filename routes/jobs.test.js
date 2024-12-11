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
  testJobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
  test("ok for admin", async function () {
    const resp = await request(app)
      .post(`/jobs`)
      .send({
        companyHandle: "c1",
        title: "J-new",
        salary: 10,
        equity: "0.2",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "J-new",
        salary: 10,
        equity: "0.2",
        companyHandle: "c1",
      },
    });
  });

  test("unauth for users", async function () {
    const resp = await request(app)
      .post(`/jobs`)
      .send({
        companyHandle: "c1",
        title: "J-new",
        salary: 10,
        equity: "0.2",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post(`/jobs`)
      .send({
        companyHandle: "c1",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post(`/jobs`)
      .send({
        companyHandle: "c1",
        title: "J-new",
        salary: "not-a-number",
        equity: "0.2",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});
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

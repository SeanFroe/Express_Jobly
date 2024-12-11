"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const {
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
} = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Jobs = require("../models/job");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/jobNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/** GET /  =>
 *   { jobs: [ { id, title, salary, equity, companyHandle }, ...] }
 *
 * Can filter on provided search filters: will add in later
 *
 *
 * Authorization required: none
 */
router.get("/", async function (req, res, next) {
  //   const q = req.query;

  //arrives as string from querystring. we want them as ints.
  // if (q.minSalary !== undefined) q.minSalary = parseInt(q.minSalary);
  // if (q.maxSalary !== undefined) q.maxSalary = parseInt(q.maxSalary);
  try {
    // const validator = jsonschema.validate(q, companySearchSchema);
    // if (!validator.valid) {
    //   const errs = validator.errors.map((e) => e.stack);
    //   throw new BadRequestError(errs);

    const jobs = await Jobs.get();
    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});

/** GET /[handle]  =>  { company }
 *
 *  Company is { handle, name, description, numEmployees, logoUrl, jobs }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: none
 */

// router.get("/:handle", async function (req, res, next) {
//   try {
//     const company = await Company.get(req.params.handle);
//     return res.json({ company });
//   } catch (err) {
//     return next(err);
//   }
// });

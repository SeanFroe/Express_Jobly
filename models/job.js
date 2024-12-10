"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for Jobs. */
class Job {
  /** Create a Job (from data), update db, return new job data.
   *
   * data should be { id, title, salary, equity, companyHandle }
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({ id, title, salary, equity, companyHandle }) {
    // Check if the companyHandle exists
    const companyCheck = await db.query(
      `SELECT handle
      FROM companies
      WHERE handle = $1`,
      [companyHandle]
    );

    if (!companyCheck.rows[0]) {
      throw new BadRequestError(`Invalid company_handle: ${companyHandle}`);
    }
    //Check for duplicate job ID
    const duplicateCheck = await db.query(
      `SELECT id
             FROM jobs
             WHERE id = $1`,
      [id]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate job: ${id}`);
    // Insert new job
    const result = await db.query(
      `INSERT INTO jobs
             (id, title, salary, equity, company_handle)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
      [id, title, salary, equity, companyHandle]
    );
    const job = result.rows[0];

    return job;
  }

  /** Given a job id, return data about a job.
   *
   * Returns { id, title, salary, equity, company_handle AS companyHandle}
   *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const jobRes = await db.query(
      `SELECT id,
                title,
                salary,
                equity,
                company_handle AS "companyHandle"
          FROM jobs
          WHERE id = $1`,
      [id]
    );

    const job = jobRes.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }
}

module.exports = Job;

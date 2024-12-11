"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for Jobs. */
class Job {
  /** Create a Job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, companyHandle }
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create(data) {
    // Check if the companyHandle exists
    const jobRes = await db.query(
      `INSERT INTO jobs (title,
                             salary,
                             equity,
                             company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
      [data.title, data.salary, data.equity, data.companyHandle]
    );

    const job = jobRes.rows[0];

    return job;
  }

  /** Given a job id, return data about a job.
   *
   * Returns { id, title, salary, equity, company_handle AS companyHandle}
   *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id = null) {
    if (id) {
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

      if (!job) throw new NotFoundError(`No job with id: ${id}`);
      return job;
    }

    // Fetch all jobs if no ID is provided
    const jobRes = await db.query(
      `SELECT id,
              title,
              salary,
              equity,
              company_handle AS "companyHandle"
        FROM jobs
        ORDER BY title`
    );

    return jobRes.rows;
  }
}

module.exports = Job;

const express = require("express");
const router = express.Router();
const jobsDB = require("../models/job");

router.get("/", async (req, res) => {
  try {
    const foundJobs = await jobsDB.findAll({ where: { username: req.user } });
    return res.send(foundJobs || []);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  const {
    company,
    link,
    location,
    application,
    assessment,
    interview,
    rejection,
    notes,
  } = req.body;
  if (!company) {
    return res.status(400).json({ message: "The company name is required." });
  }
  try {
    await jobsDB.create({
      username: req.user,
      company: company,
      link: link,
      location: location,
      application: application,
      assessment: assessment,
      interview: interview,
      rejection: rejection,
      notes: notes,
    });
    return res.status(201).json({ success: "New job created." });
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.put("/", async (req, res) => {
  const {
    id,
    company,
    link,
    location,
    application,
    assessment,
    interview,
    rejection,
    notes,
  } = req.body;
  if (!id) {
    return res.status(400).json({ message: "The job ID is required." });
  }
  try {
    const updated = await jobsDB.update(
      {
        company: company,
        link: link,
        location: location,
        application: application,
        assessment: assessment,
        interview: interview,
        rejection: rejection,
        notes: notes,
      },
      { where: { username: req.user, id: id } }
    );
    if (updated[0] > 0) {
      return res.sendStatus(205);
    } else {
      return res
        .status(400)
        .json({ message: "Could not find the job application." });
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.delete("/", async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({ message: "The job ID is required." });
  }
  try {
    const updated = await jobsDB.destroy({
      where: { username: req.user, id: req.body.id },
    });
    if (updated > 0) {
      return res.sendStatus(205);
    } else {
      return res
        .status(400)
        .json({ message: "Could not find the job application." });
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;

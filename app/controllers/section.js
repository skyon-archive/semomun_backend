const db = require("../models/index");
const Workbook = db.workbooks;
const Section = db.sections;
const View = db.views;
const Problem = db.problems;
const Op = db.Sequelize.Op;

const path = require('path');
const fs = require('fs');

exports.get = async (req, res) => {
  try {
    const views = await View.findAll({
        where: { 
            sid: req.params.sid,
        },
        raw: true,
    });
    await Promise.all(views.map(async (view) => {
        view["problems"] = await Problem.findAll({ 
            where: { 
                vid: view["vid"],
            },
            raw: true,
        });
    }));
    res.send(views);
  } catch(err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Section."
        });
  }
}
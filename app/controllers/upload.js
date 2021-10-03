const yaml = require("js-yaml");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const db = require("../models/index");
const Workbook = db.workbooks;
const Section = db.sections;
const View = db.views;
const Problem = db.problems;
const Op = db.Sequelize.Op;

exports.upload = async (req, res) => {
  try {
    const doc = yaml.load(fs.readFileSync("./config_example.yaml", "utf8"));
    var workbook = doc["workbook"];
    workbook["image"] = uuidv4();
    const wid = (await Workbook.create(workbook)).wid;
    var sections = doc["sections"];
    const size = sections.length;
    for (var i = 0; i < size; i++) {
      var section = sections[i];
      section["wid"] = wid;
      section["image"] = uuidv4();
      var views = section["views"];
      delete section["views"];
      const sid = (await Section.create(section)).sid;

      var cur = 0;
      await Promise.all(
        views.map(async (view) => {
          view["sid"] = sid;
          var problems = view["problems"];
          var cnt = problems.length;
          view["index_start"] = cur + 1;
          view["index_end"] = cur + cnt;
          cur += cnt;
          for (var j = 0; j < cnt; j++) {
            var problem = problems[j];
            if (problem["icon_index"] != view["index_start"] + j) {
              console.log("fuck");
            }
            problem["sid"] = sid;
            console.log(problem);
            await Problem.create(problem);
          }
        })
      );

      const vids = (await View.bulkCreate(views)).map(
        (view) => view.dataValues.vid
      );
    }
    res.send("done");
  } catch (e) {
    console.log(e);
  }
};

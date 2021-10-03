const yaml = require("js-yaml");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const db = require("../models/index");
const resize = require("sharp/lib/resize");
const Workbook = db.workbooks;
const Section = db.sections;
const View = db.views;
const Problem = db.problems;
const Op = db.Sequelize.Op;

function resizer(src, folder, file, width) {
  const tmpdir = require("os").homedir() + "/tmp";
  fs.readFile(src, (err, data) => {
    sharp(data)
      .resize({ width: width })
      .toFormat("jpeg")
      .toFile(
        tmpdir +
          "/public/images/" +
          folder +
          "/" +
          width +
          "x" +
          width +
          "/" +
          file
      );
  });
}

exports.upload = async (req, res) => {
  try {
    const tmpdir = require("os").homedir() + "/tmp";
    const dir = tmpdir + "/file";
    const doc = yaml.load(fs.readFileSync("./config_example.yaml", "utf8"));
    var workbook = doc["workbook"];
    if (workbook["bookcover"] != undefined) {
      const imagedir = dir + "/" + workbook["bookcover"];
      workbook["bookcover"] = uuidv4();
      resizer(imagedir, "bookcover", workbook["bookcover"], 256);
      resizer(imagedir, "bookcover", workbook["bookcover"], 128);
      resizer(imagedir, "bookcover", workbook["bookcover"], 64);
    }
    const wid = (await Workbook.create(workbook)).wid;
    var sections = doc["sections"];
    const size = sections.length;
    for (var i = 0; i < size; i++) {
      var section = sections[i];
      section["wid"] = wid;
      if (section["sectioncover"] != undefined) {
        const imagedir = dir + "/" + section["sectioncover"];
        section["sectioncover"] = uuidv4();
        resizer(imagedir, "sectioncover", section["sectioncover"], 256);
        resizer(imagedir, "sectioncover", section["sectioncover"], 128);
        resizer(imagedir, "sectioncover", section["sectioncover"], 64);
      }
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
          if (view["material"] != undefined) {
            const imagedir = dir + "/" + view["material"];
            view["material"] = uuidv4();
            resizer(imagedir, "material", view["material"], 256);
            resizer(imagedir, "material", view["material"], 128);
            resizer(imagedir, "material", view["material"], 64);
          }
          cur += cnt;
          for (var j = 0; j < cnt; j++) {
            var problem = problems[j];
            if (problem["icon_index"] != view["index_start"] + j) {
              console.log("fuck");
            }
            problem["sid"] = sid;
            if (problem["content"] != undefined) {
              const imagedir = dir + "/" + problem["content"];
              problem["content"] = uuidv4();
              resizer(imagedir, "content", problem["content"], 256);
              resizer(imagedir, "content", problem["content"], 128);
              resizer(imagedir, "content", problem["content"], 64);
            }
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

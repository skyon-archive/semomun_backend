const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { v4: uuidv4 } = require('uuid');
const {
  sequelize,
  Items,
  Workbooks,
  Sections,
  Views,
  Problems,
  Tags,
  WorkbookTags,
  WorkbookGroups,
} = require('../models/index');
const { BadRequest, Forbidden } = require('../errors');
const { getPresignedPost, checkFileExist, deleteFile } = require('../services/s3');
const { updateSectionSize } = require('../migrations/migrateWorkbooks');

const validateGroupConfig = async (groupConfig) => {
  const workbookgroupFields = [
    'type',
    'title',
    'groupCover',
    'isGroupOnlyPurchasable',
    'workbooks',
  ];

  workbookgroupFields.forEach((field) => {
    if (!(field in groupConfig.workbookgroup)) {
      throw new BadRequest(`workbookgroup.${field} 필드 없음`);
    }
  });

  const workbook = await WorkbookGroups.findOne({
    where: { title: groupConfig.workbookgroup.title },
  });
  if (workbook) throw new BadRequest(`title 중복: ${workbook.title}`);
};

const valdiateConfig = async (config) => {
  const workbookFields = [
    'title',
    'detail',
    'date',
    'author',
    'originalPrice', // 판매 원가 - 온라인
    'price', // 판매 할인 가격(실 거래가) - 온라인
    'paperbookPrice', // 종이책 원가 - 오프라인
    'bookcover',
    'publishCompany',
    'publishMan',
    'continental', // Tag
    'country', // Tag
    'bigcategory', // Tag
    'middlecategory', // Tag
    'smallcategory', // Tag
    'grade', // Tag
  ];
  const workbookIntFields = ['price', 'originalPrice', 'paperbookPrice'];
  const sectionFields = ['index', 'title', 'detail', 'sectioncover'];
  const problemFields = ['icon_index', 'icon_name', 'type', 'content'];
  const problemIntFields = ['icon_index', 'type', 'subproblemCnt'];

  workbookFields.forEach((field) => {
    if (!(field in config.workbook)) {
      throw new BadRequest(`workbook.${field} 필드 없음`);
    }
  });
  if (!config.workbook.date.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
    throw new BadRequest('workbook.date 형식 틀림');
  }
  workbookIntFields.forEach((field) => {
    if (!Number.isInteger(config.workbook[field])) {
      throw new BadRequest(`workbook.${field} 정수 아님`);
    }
  });

  if (!Array.isArray(config.sections)) throw new BadRequest('sections 형식 틀림');
  config.sections.forEach((section) => {
    sectionFields.forEach((field) => {
      if (!(field in section)) {
        throw new BadRequest(`section.${field} 필드 없음`);
      }
    });
    if (!Number.isInteger(section.index)) {
      throw new BadRequest('section.index 정수 아님');
    }
    const views = section.views ?? [];
    if (!Array.isArray(views)) throw new BadRequest('views 형식 틀림');
    views.forEach((view) => {
      if (!Number.isInteger(view.form)) throw new BadRequest('view.form 정수 아님');
      const problems = view.problems ?? [];
      problems.forEach((problem) => {
        problemFields.forEach((field) => {
          if (!(field in problem)) {
            throw new BadRequest(`problem.${field} 필드 없음`);
          }
        });
        problemIntFields.forEach((field) => {
          if (problem[field] && !Number.isInteger(problem[field])) {
            throw new BadRequest(`problem.${field} 정수 아님`);
          }
        });
        if (problem.score && typeof problem.score !== 'number') {
          throw new BadRequest('problem.score 수 아님');
        }
      });
    });
  });

  const workbook = await Workbooks.findOne({
    where: { title: config.workbook.title },
  });
  if (workbook) throw new BadRequest(`title 중복: ${workbook.title}`);
};

exports.readGroupConfig = async (req, res) => {
  let filePath;
  try {
    filePath = path.join(__dirname, '../../', req.file.path);

    const { role } = req;
    if (role !== 'ADMIN') throw new Forbidden('');
    const groupConfig = yaml.load(fs.readFileSync(filePath));

    validateGroupConfig(groupConfig);
    const filename = groupConfig.workbookgroup.title;
    const groupCoverUUID = uuidv4();
    const preSignedUrl = await getPresignedPost('groupCover', groupCoverUUID);
    groupConfig.workbookgroup.groupCover = groupCoverUUID;
    fs.writeFileSync(filePath, JSON.stringify(groupConfig));
    res.status(200).json({ preSignedUrl, filename, key: path.basename(filePath) });
  } catch (err) {
    if (filePath) fs.rmSync(filePath);
    if (err instanceof BadRequest) res.status(400).send(err.message);
    else if (err instanceof Forbidden) res.status(403).send(err.message);
    else {
      console.log(err);
      res.status(500).send();
    }
  }
};

exports.confirmWorkbookGroup = async (req, res) => {
  try {
    const { key } = req.body;
    const { role } = req;
    if (role !== 'ADMIN') throw new Forbidden('');

    const filePath = path.join(__dirname, '../../uploads', key);
    if (!fs.existsSync(filePath)) {
      throw new BadRequest(`옳지 않은 key ${key}`);
    }

    const { workbookgroup } = JSON.parse(fs.readFileSync(filePath));
    await checkFileExist('groupCover', workbookgroup.groupCover); // S3 Check

    const dbGroup = await WorkbookGroups.create({
      type: workbookgroup.type,
      title: workbookgroup.title,
      detail: workbookgroup.detail === undefined ? '' : workbookgroup.detail,
      groupCover: workbookgroup.groupCover,
      isGroupOnlyPurchasable: workbookgroup.isGroupOnlyPurchasable,
    });

    const wgid = dbGroup.wgid;
    const nonExistBooks = [];
    const changeParents = [];
    const titles = workbookgroup.workbooks.map((title) => title.title);
    await Promise.all(
      titles.map(async (title) => {
        const result = await Workbooks.findOne({ where: { title } });
        if (result !== null) {
          const resultData = result.get({ plain: true });
          if (resultData.wgid !== null) changeParents.push(title);
          await result.update(wgid); // 참조
        } else nonExistBooks.push(title);
      })
    );
    if (filePath) fs.rmSync(filePath);
    res.status(200).json({ nonExistBooks, changeParents });
  } catch (err) {
    if (err instanceof BadRequest) res.status(400).send(err.message);
    else if (err instanceof Forbidden) res.status(403).send(err.message);
    else {
      console.log(err);
      res.status(500).send();
    }
  }
};

exports.readConfig = async (req, res) => {
  let filePath;
  try {
    filePath = path.join(__dirname, '../../', req.file.path);

    const { role } = req;
    if (role !== 'ADMIN') throw new Forbidden('');
    const config = yaml.load(fs.readFileSync(filePath));

    await valdiateConfig(config);

    const posts = [];
    const bookcoverUuid = uuidv4();
    posts.push({
      post: await getPresignedPost('bookcover', bookcoverUuid),
      filename: config.workbook.bookcover,
    });
    config.workbook.bookcover = bookcoverUuid;

    await Promise.all(
      config.sections.map(async (section) => {
        const sectionUuid = uuidv4();
        posts.push({
          post: await getPresignedPost('sectioncover', sectionUuid),
          filename: section.sectioncover,
        });
        section.sectioncover = sectionUuid;
        await Promise.all(
          section.views.map(async (view) => {
            if (view.material) {
              const materialUuid = uuidv4();
              posts.push({
                post: await getPresignedPost('passage', materialUuid),
                filename: view.material,
              });
              view.material = materialUuid;
            }
            await Promise.all(
              view.problems.map(async (problem) => {
                const contentUuid = uuidv4();
                posts.push({
                  post: await getPresignedPost('content', contentUuid),
                  filename: problem.content,
                });
                problem.content = contentUuid;
                if (problem.explanation) {
                  const explanationUuid = uuidv4();
                  posts.push({
                    post: await getPresignedPost('explanation', explanationUuid),
                    filename: problem.explanation,
                  });
                  problem.explanation = explanationUuid;
                }
              })
            );
          })
        );
      })
    );

    fs.writeFileSync(filePath, JSON.stringify(config));
    res.json({ posts, key: path.basename(filePath) });
  } catch (err) {
    if (filePath) fs.rmSync(filePath);
    if (err instanceof BadRequest) res.status(400).send(err.message);
    else if (err instanceof Forbidden) res.status(403).send(err.message);
    else {
      console.log(err);
      res.status(500).send();
    }
  }
};

exports.confirmWorkbook = async (req, res) => {
  try {
    const { key } = req.body;
    const { role } = req;
    if (role !== 'ADMIN') throw new Forbidden('');

    const filePath = path.join(__dirname, '../../uploads', key);
    if (!fs.existsSync(filePath)) {
      throw new BadRequest(`옳지 않은 key ${key}`);
    }
    const { workbook, sections } = JSON.parse(fs.readFileSync(filePath));

    await checkFileExist('bookcover', workbook.bookcover);
    await Promise.all(
      sections.map(async (section) => {
        await checkFileExist('sectioncover', section.sectioncover);
        section.views.map(async (view) => {
          if (view.material) await checkFileExist('passage', view.material);
          await Promise.all(
            view.problems.map(async (problem) => {
              await checkFileExist('content', problem.content);
              if (problem.explanation) await checkFileExist('explanation', problem.explanation);
            })
          );
        });
      })
    );

    const dbItem = await Items.create({
      type: 'workbook',
      sales: 0,
      price: workbook.price,
      originalPrice: workbook.originalPrice,
    });

    const m = workbook.date.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    const dbWorkbook = await Workbooks.create({
      id: dbItem.id,
      title: workbook.title,
      detail: workbook.detail,
      isbn: workbook.isbn === '없음' || !workbook.isbn ? '' : workbook.isbn,
      author: workbook.author,
      date: `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')} 09:00:00`,
      publishMan: workbook.publishMan,
      publishCompany: workbook.publishCompany,
      paperbookPrice: workbook.paperbookPrice, // originalPrice: workbook.originalPrice,
      bookcover: workbook.bookcover,
      subject: workbook.subject, // New
      area: workbook.area, // New
      standardDeviation: workbook.standardDeviation, // New
      averageScore: workbook.averageScore, // New
      cutoff: workbook.cutoff, // New
    });

    const tagNames = [
      workbook.continental,
      workbook.country,
      workbook.bigcategory,
      workbook.middlecategory,
      workbook.smallcategory,
      workbook.grade,
    ];
    let dbTags;
    await sequelize.transaction(async (transaction) => {
      const oldDbTags = await Tags.findAll({
        where: { name: tagNames },
        transaction,
      });
      const dbTagNames = oldDbTags.map((tag) => tag.name);
      const missingTags = tagNames.filter((tag) => !dbTagNames.includes(tag));
      const newDbTags = await Tags.bulkCreate(
        missingTags.map((name) => ({ name })),
        { transaction }
      );
      dbTags = oldDbTags.concat(newDbTags);
    });
    await WorkbookTags.bulkCreate(dbTags.map(({ tid }) => ({ tid, wid: dbWorkbook.wid })));

    await Promise.all(
      sections.map(async ({ views, cutoff, ...section }) => {
        const dbSection = await Sections.create({
          wid: dbWorkbook.wid,
          size: 0,
          cutoff: cutoff ?? {},
          ...section,
        });
        await Promise.all(
          views.map(async ({ problems, material, ...view }, idx) => {
            const dbView = await Views.create({
              sid: dbSection.sid,
              index: idx + 1,
              passage: material,
              ...view,
            });
            problems.sort((a, b) => a.icon_index < b.icon_index);
            await Problems.bulkCreate(
              problems.map((problem, idx) => ({
                vid: dbView.vid,
                index: idx + 1,
                btType: isNaN(parseInt(problem.icon_name)) ? problem.icon_name : '문',
                btName: problem.icon_name,
                type: problem.type,
                answer: problem.answer,
                content: problem.content,
                explanation: problem.explanation,
                score: problem.score,
                subproblemCnt: problem.subproblemCnt,
              }))
            );
          })
        );
      })
    );

    await updateSectionSize([dbWorkbook.wid]);

    if (filePath) fs.rmSync(filePath);
    res.json({});
  } catch (err) {
    if (err instanceof BadRequest) res.status(400).send(err.message);
    else if (err instanceof Forbidden) res.status(403).send(err.message);
    else {
      console.log(err);
      res.status(500).send();
    }
  }
};

exports.updateBookcover = async (req, res) => {
  try {
    const { title } = req.body;
    const { role } = req;
    if (role !== 'ADMIN') throw new Forbidden('');

    console.log(title);
    const workbook = await Workbooks.findOne({ where: { title, type: '' } });
    if (!workbook) return res.status(204).send();
    else {
      const section = await Sections.findOne({ where: { wid: workbook.wid } });

      await deleteFile('bookcover', workbook.bookcover);
      await deleteFile('sectioncover', section.sectioncover);

      const bookcover = uuidv4();
      await workbook.update({ bookcover });
      const bookcoverPost = await getPresignedPost('bookcover', bookcover);
      const sectioncover = uuidv4();
      await section.update({ sectioncover });
      const sectioncoverPost = await getPresignedPost('sectioncover', sectioncover);
      res.json({ bookcoverPost, sectioncoverPost });
    }
  } catch (err) {
    if (err instanceof Forbidden) res.status(403).send(err.message);
    else {
      console.log(err);
      res.status(500).send();
    }
  }
};

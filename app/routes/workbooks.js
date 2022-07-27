const { authJwt } = require('../middleware/auth')
const {
  fetchWorkbook,
  fetchWorkbooks,
  solveWorkbook,
  getPurchasedWorkbooks,
  getBestsellers
} = require('../controllers/workbook')

module.exports = (app) => {
  const router = require('express').Router()

  router.put('/solve', authJwt, solveWorkbook)
  router.get('/purchased', authJwt, getPurchasedWorkbooks)
  router.get('/bestseller', getBestsellers)
  router.get('/:wid', authJwt, fetchWorkbook)
   /**
   * @swagger
   * paths:
   *  /workbooks:
   *    get:
   *      summary: "워크북(도서) 전체 조회 API입니다.(관상용 입니다!!!)"
   *      description: "**Query Params:** page, limit, tids[], keyword, cid"
   *      tags: [Workbooks]
   *      parameters:
   *        - in: query
   *          name: page
   *          schema:
   *            type: integer
   *            default: 1
   *          description: Page Number(offset, for pagination)
   *        - in: query
   *          name: limit
   *          schema:
   *            type: integer
   *            default: 25
   *          description: Limit maximum EA(for pagination)
   *      responses:
   *        "200":
   *          description: 성공, 도서 전체 개수와 데이터 반환
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  count:
   *                    type: integer
   *                    example: 100
   *                  workbooks:
   *                    type: object
   *                    properties:
   *                      wid:
   *                        type: integer
   *                        example: 38
   *                      id:
   *                        type: integer
   *                        example: 39
   *                      wgid:
   *                        type: integer
   *                        nullable: true
   *                      title:
   *                        type: string
   *                        example: "책의 제목"
   *                      detail:
   *                        type: string
   *                        example: "책의 디테일"
   *                      isbn:
   *                        type: string
   *                        example: "책의 고유 번호?"
   *                      author:
   *                        type: string
   *                        example: "저자"
   */
  router.get('/', fetchWorkbooks)

  app.use('/workbooks', router)
}

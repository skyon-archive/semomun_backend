module.exports = (app) => {
  app.get('/', (req, res) => {
    res.json({ message: 'Semomun API.', latestVersion: '2.0.1' })
  })
  require('./workbookGroups')(app) // 교재 그룹
  require('./workbooks')(app) // 교재
  require('./sections')(app) // 페이지?
  require('./upload')(app) // 업로드
  require('./info')(app) // 정보?
  require('./auth')(app) // 인증
  require('./user')(app) // 유저
  require('./s3')(app) // S3
  require('./sms')(app) // 문자
  require('./tags')(app) // 태그
  require('./pay')(app) // 결제
  require('./submissions')(app) // 문제 - 유저(답과 필기를 갖고 있음)
  require('./viewSubmissions')(app) // 유저 - 뷰(뷰에 대한 필기만 갖고 있음)
  require('./notices')(app) // 공지
  require('./banners')(app) // 배너
  require('./popups')(app) // 팝업
  require('./errorReports')(app) // 에러 리포트
  require('./status')(app) // 상태
  require('./result')(app) // 채점 및 성적
  require('./admin')(app) // 콘솔 어드민 전용
}

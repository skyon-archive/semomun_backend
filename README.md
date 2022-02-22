# Semomun API

Semomun API의 명세와 조건, 참고사항 및 예외들을 정리해 작성한 문서입니다.

위 문장에서 '예외들'은 실제로 프로그램에서 예외를 던져야 한다는 의미로 쓴 것은 아닙니다. 주로 사용자가 잘못된 입력을 넣었을 때, 버그나 취약점이 발생할 수 있고 프로그래머가 자칫 넘기기 쉬울 수 있는 부분들을 뜻합니다. 별도의 처리를 하라고 명시되어 있지 않다면 따로 무언가를 하지 않는 것을 권장합니다.

만약 주어진 입력이 잘못된 쿼리라고 판단된 경우, HTTP 상태 코드는 400 Bad Request 여야 합니다. 또한 **각 엔드포인트에 명시된 값을 반환** 하며, 쿼리를 실행하기 전, 파싱 도중에 즉시 응답을 완료하여야 합니다. 즉, 파싱 외의 추가적인 성능 소모가 없어야 합니다.

만약 주어진 입력이 존재하지 않는 요소를 참조한다고 판단된 경우, HTTP 상태 코드는 **404 Not Found** 여야 합니다. 또한 **각 엔드포인트에 명시된 값을 반환** 하며, 쿼리에 대한 결과를 만들기 전, 입력에 따른 요소를 가져오는 도중에 즉시 응답을 완료하여야 합니다. 즉, 파싱 및 값 참조 외에 추가적인 성능 소모가 없어야 합니다.

본 문서에서 산술 평균, 조화 평균, 절사 평균, 혹은 중위값 등이 아닌 그냥 '평균'이란 단어가 나온다면, 아직 어떤 기준을 사용할지 명확히 정해지지 않았다는 것이므로 생략하고 보시면 됩니다.

## 문법

정상적인 경우 HTTP 상태 코드는 200 OK로 응답해야 하지만, 사용자의 요청에 따라 다른 코드로 응답해야 할 수 있습니다. 목록 중간중간에 그래야 하는 상황들을 명시해 두었으며, 각 상태 코드의 의미는 다음과 같습니다.

- 200 OK: 정상적으로 요청이 실행되었고, 서버가 적절한 응답을 돌려줄 수 있습니다.
- 400 Bad Request: 사용자가 사이트에서 정상적으로는 제출할 수 없는 요청을 한 경우입니다.
  - 달리 말해, 프론트 개발자 역시 **해당 경우를 제출할 수 없도록 처리**해야 합니다.
- 401 Unauthorized: 사용자가 로그인 없이 요청을 한 경우입니다.
- 403 Forbidden: 사용자에게 권한이 허락되지 않은 요청을 한 경우입니다.
- 404 Not Found: 요청은 올바르지만, 서버에 사용자가 찾는 것이 존재하지 않는 경우입니다.
- 409 Conflict: 요청은 올바르지만, 서버에 이미 사용자가 추가하려는 것이 존재해 추가가 불가능한 경우입니다.
- 422 Unprocessable Entity: 요청은 올바르지만, 해당 요청은 서버에서 처리할 수 없음(혹은, 처리하지 않을 것임)을 뜻합니다.
- 429 Too Many Requests: 사용자에게 주어진 요청량을 초과한 경우입니다.
- 500 Internal Server Error: 요청은 올바르지만, 서버에서 해당 요청을 처리하는데 실패한 경우입니다.

## 자료형

```sql
-- 사용자 --
CREATE TABLE `Users` (
    `uid` INT NOT NULL AUTO_INCREMENT,                                             /* 식별자                          */
    `username` VARCHAR(256) NOT NULL,                                              /* 아이디                          */
    `name` VARCHAR(256) NOT NULL,                                                  /* 실명                          */
    `email` VARCHAR(256) NOT NULL,                                                 /* 이메일                         */
    `gender` VARCHAR(32) NOT NULL,                                                 /* 성별                          */
    `birth` TIMESTAMP NOT NULL,                                                    /* 생년월일 ex. 82-10-2302-3319    */
    `phone` VARCHAR(32) NOT NULL,                                                  /* 전화번호, 국가코드 포함            */
    `degree` VARCHAR(256) NOT NULL,                                                /* 학력                           */
    `degreeStatus` VARCHAR(32) NOT NULL,                                           /* 재학 상태                       */
    `credit` INT NOT NULL,                                                         /* 보유 캐시, 종속성 관리 필요        */
    `auth` INT NOT NULL,                                                           /* 유저 권한                       */
    -- 결제 수단, 계정 연동 등은 테이블 따로 만들거나 redis로 --
    PRIMARY KEY (`uid`)
);

-- 상품 (세모문에서 판매하는 모든 물품의 상위 스키마) --
CREATE TABLE `Items` (
    `id` INT NOT NULL AUTO_INCREMENT,                                              /* 식별자                          */
    `type` VARCHAR(32) NOT NULL,                                                   /* 유형                            */
    `price` INT NOT NULL,                                                          /* 판매가                          */
    `sales` INT NOT NULL,                                                          /* 판매량, 종속성 관리 필요          */
    PRIMARY KEY (`id`)
);

-- 문제집 --
CREATE TABLE `Workbooks` (
    `id` INT NOT NULL,                                                             /* 상품 식별자                      */
    `wid` INT NOT NULL AUTO_INCREMENT,                                             /* 식별자                          */
    `title` VARCHAR(256) NOT NULL,                                                 /* 제목                            */
    `detail` VARCHAR(4096) NOT NULL,                                               /* 설명                            */
    `isbn` VARCHAR(32) NOT NULL,                                                   /* ISBN, 한국에선 부가기호도 있음        */
    `author` VARCHAR(32) NOT NULL,                                                 /* 저자                            */
    `date` TIMESTAMP NOT NULL,                                                     /* 발행일                          */
    `publishMan` VARCHAR(32) NOT NULL,                                             /* 발행인                          */
    `publishCompany` VARCHAR(32) NOT NULL,                                         /* 출판사                          */
    `originalPrice` VARCHAR(32) NOT NULL,                                          /* 정가                            */
    `bookcover` CHAR(36) NOT NULL,                                                 /* 표지 파일 식별자, uuid            */
    PRIMARY KEY (`wid`),
    FOREIGN KEY (`id`) REFERENCES `Items` (`id`) ON UPDATE CASCADE
);

-- 섹션 (문제집의 각 단원) --
CREATE TABLE `Sections` (
    `wid` INT NOT NULL,                                                             /* 문제집                          */
    `sid` INT NOT NULL AUTO_INCREMENT,                                              /* 식별자                          */
    `index` INT NOT NULL,                                                           /* 섹션 번호                        */
    `title` VARCHAR(256) NOT NULL,                                                  /* 제목                            */
    `detail` VARCHAR(4096) NOT NULL,                                               /* 설명                            */
    `cutoff` JSON NOT NULL,                                                         /* 등급컷                           */
    `sectioncover` CHAR(36) NOT NULL,                                               /* 표지 파일 식별자, uuid           */
    `size` INT NOT NULL,                                                             /* 다운로드 파일 크기, 종속성 관리 필요 */
    `audio` CHAR(36),                                                               /* 음성파일, uuid                    */
    `audioDetail` JSON,                                                             /* 음성파일에 대한 각 view timestamp 등  */
    PRIMARY KEY (`sid`),
    FOREIGN KEY (`wid`) REFERENCES `Workbooks` (`wid`) ON UPDATE CASCADE
);

-- 뷰 (섹션의 각 페이지) --
CREATE TABLE `Views` (
    `sid` INT NOT NULL,                                                             /* 섹션                            */
    `vid` INT NOT NULL AUTO_INCREMENT,                                              /* 식별자                           */
    `index` INT NOT NULL,                                                           /* 페이지 번호                      */
    `form` INT NOT NULL,                                                            /* 유형                            */
    `passage` CHAR(36),                                                             /* 지문 파일 식별자, uuid           */
    `attachment` CHAR(36),                                                          /* 자료 식별자, uuid               */
    PRIMARY KEY (`vid`),
    FOREIGN KEY (`sid`) REFERENCES `Sections` (`sid`) ON UPDATE CASCADE
);

-- 문제 --
CREATE TABLE `Problems` (
    `vid` INT NOT NULL,                                                             /* 뷰                             */
    `pid` INT NOT NULL AUTO_INCREMENT,                                              /* 식별자                          */
    `index` INT NOT NULL,                                                           /* 페이지 내에서의! 문제 번호         */
    `labelType` VARCHAR(32) NOT NULL,                                               /* 아이콘에 표시될 이름              */
    `labelNum` VARCHAR(32) NOT NULL,                                                /* 문제집 내에서 문제의 번호            */
    `type` INT NOT NULL,                                                            /* 유형                            */
    `answer` VARCHAR(256) NOT NULL,                                                 /* 정답                            */
    `content` CHAR(36) NOT NULL,                                                    /* 문제 파일 식별자, uuid           */
    `explanation` CHAR(36),                                                         /* 해설 파일 식별자, uuid           */ 
    PRIMARY KEY (`pid`),
    FOREIGN KEY (`vid`) REFERENCES `Views` (`vid`) ON UPDATE CASCADE
);

-- 제출 기록 --
CREATE TABLE `Submissions` (
    `identifier` INT NOT NULL AUTO_INCREMENT,
    `uid` INT NOT NULL,                                                            /* 유저                           */
    `pid` INT NOT NULL,                                                            /* 문제                           */
    `elapsed` INT NOT NULL,                                                        /* 소요 시간                       */
    `answer` VARCHAR(256),                                                         /* 유저가 제출한 답                 */
    `note` BLOB NOT NULL,                                                          /* 필기                            */
    -- 중복 제출 가능하게 해야함 --
    PRIMARY KEY (`identifier` ),
    FOREIGN KEY (`uid`) REFERENCES `Users` (`uid`) ON UPDATE CASCADE,
    FOREIGN KEY (`pid`) REFERENCES `Problems` (`pid`) ON UPDATE CASCADE
);

-- 태그 --
CREATE TABLE `Tags` (
    `tid` INT NOT NULL AUTO_INCREMENT,                                             /* 식별자                          */
    `name` VARCHAR(32) NOT NULL,                                                   /* 이름                           */
    PRIMARY KEY (`tid`)
);

-- 문제집 별 태그 --
CREATE TABLE `WorkbookTags` (
    `wid` INT NOT NULL,                                                            /* 문제집                         */
    `tid` INT NOT NULL,                                                            /* 태그                           */
    PRIMARY KEY (`wid`, `tid`),
    FOREIGN KEY (`wid`) REFERENCES `Workbooks` (`wid`) ON UPDATE CASCADE,
    FOREIGN KEY (`tid`) REFERENCES `Tags` (`tid`) ON UPDATE CASCADE
);

-- 나의 태그 (관심 태그) -- 
CREATE TABLE `FavoriteTags` (
    `uid` INT NOT NULL,                                                            /* 유저                          */
    `tid` INT NOT NULL,                                                            /* 태그                          */
    PRIMARY KEY (`uid`, `tid`),
    FOREIGN KEY (`uid`) REFERENCES `Users` (`uid`) ON UPDATE CASCADE,
    FOREIGN KEY (`tid`) REFERENCES `Tags` (`tid`) ON UPDATE CASCADE
)

-- 주문 내역 (캐시 사용 내역) --
CREATE TABLE `OrderHistory` (
    `ohid` INT NOT NULL AUTO_INCREMENT,
    `id` INT NOT NULL,                                                             /* 구매품목                         */
    `uid` INT NOT NULL,                                                            /* 유저                            */
    `payment` INT NOT NULL,                                                        /* 총 지불금액                       */
    PRIMARY KEY (`ohid`),
    FOREIGN KEY (`id`) REFERENCES `Items` (`id`) ON UPDATE CASCADE,
    FOREIGN KEY (`uid`) REFERENCES `Users` (`uid`) ON UPDATE CASCADE
);

-- 캐시 충전 내역 --
CREATE TABLE `ChargeHistory` (
    `chid` INT NOT NULL AUTO_INCREMENT,                                            /* 주문번호, 논의 필요                */
    `uid` INT NOT NULL,                                                            /* 유저                            */
    `amount` INT NOT NULL,                                                         /* 충전량                           */
    `type` VARCHAR(32) NOT NULL,                                                   /* 이벤트, 쿠폰, 결제, 등등            */
    PRIMARY KEY (`chid`),
    FOREIGN KEY (`uid`) REFERENCES `Users` (`uid`) ON UPDATE CASCADE
);

-- 학습 기록 --
CREATE TABLE `WorkbookHistory` (
    `whid` INT NOT NULL AUTO_INCREMENT,
    `wid` INT NOT NULL,                                                            /* 문제집                         */
    `uid` INT NOT NULL,                                                            /* 유저                           */
    `type` VARCHAR(32) NOT NULL,                                                   /* start, end, download 등등      */
    -- type == `start` 를 이용해서 최근에 이용한 문제집 판별 --
    -- type == `purchased` 를 이용해서 문제집 별 구매 추이 등 판별 --
    -- type == `cart` 를 이용해서 장바구니에 담긴 상품 목록 알 수 있음 --
    PRIMARY KEY (`whid`),
    FOREIGN KEY (`wid`) REFERENCES `Workbooks` (`wid`) ON UPDATE CASCADE,
    FOREIGN KEY (`uid`) REFERENCES `Users` (`uid`) ON UPDATE CASCADE
);
```


### 사용자 User

- uid(기본키): 사용자의 고유 번호입니다. 4바이트의 음이 아닌 정수입니다.

  - 각 사용자는 가입한 순서대로 번호를 부여받습니다. 처음 가입한 사용자는 1번입니다.

- auth: 사용자의 권한 수준입니다. 4바이트의 음수가 아닌 정수입니다.

  - 가능한 값은 증가순으로 `USER(1)`, `ADMIN(100)` 입니다.

- username: 사용자의 닉네임입니다. 32바이트 이하의 문자열입니다.

  - 기본적으로 한글, 영어, 숫자만 허용되며 중복될 수 없습니다.

- email: 사용자의 이메일입니다. 256바이트 이하의 문자열입니다.

- password: 사용자의 비밀번호입니다. 256바이트 이하의 Argon2id 해시입니다.

- settings: 사용자의 개인 설정입니다. 65536바이트 이하의 JSON 문자열입니다.

- profile_image: 사용자의 프로필 사진입니다. 4바이트의 음이 아닌 정수입니다.
  - 해당 값이 i일 경우 DB의 `/tmp/profile/i.png`에 해당하는 문제 이미지가 존재해야 합니다.

### 학습내역 History

다음 경우에 프론트는 해당 정보를 DB에 전송해야 합니다.

1. 사용자가 어플리케이션을 시작할 때

2. 사용자가 학습공간에서 빠져나올 때

- uid(기본키): 사용자의 uid입니다.

- date(기본키): 사용자가 학습한 날짜입니다. 4바이트의 음이 아닌 정수입니다.

- study_time: 그 날 공부한 시간(초)입니다. 4바이트의 음이 아닌 정수입니다.

### 문제 Problem

- pid(기본키): 문제의 고유 번호입니다. 4바이트의 음이 아닌 정수입니다.

  - 각 문제는 등록된 순서대로 번호를 부여받습니다. 처음 등록된 문제는 1번입니다.

- sid(외래키): 문제가 속한 섹션의 sid입니다.

  - 뷰어의 sid와 일치해야 합니다.

- icon_index: 문제에 대응되는 하단 아이콘의 순서입니다. 4바이트의 음이 아닌 정수입니다.

  - i번째 아이콘을 터치하면 icon_index가 i인 문제가 표시되어야 합니다.

- icon_name: 문제에 대응되는 하단 아이콘의 이름입니다. 4바이트의 문자열입니다.

  - 아이콘 안에 표시될 글자로 가능한 것은 숫자, 심(화), 개(념) 등이 있습니다.

- type: 문제의 속성입니다. 1바이트의 음이 아닌 정수입니다.

  - 0은 `채점 불가`, 1은 `주관식`, 1 초과의 $x$는 `선지가 x개인 객관식`을 의미합니다.

- answer: 문제의 정답입니다. 256바이트 이하의 가변 길이 문자열입니다.

  - 정답이 여럿 존재할 경우 구분자 (,) 를 이용해서 구분합니다.

- content: 문제의 내용입니다. 256바이트 이하의 가변 길이 문자열입니다.

  - 해당 값이 i일 경우 DB의 `/images/content/i` 에 해당하는 문제 이미지가 존재해야 합니다.

- explanation: 문제의 해설입니다. 256바이트 이하의 가변 길이 문자열입니다.

  - 해당 값이 i일 경우 DB의 `/images/explanation/i` 에 해당하는 문제 이미지가 존재해야 합니다.
  - 해설이 존재하지 않을 경우 null입니다.

- attempt_total: 문제에 답이 제출된 총 횟수입니다.

  - 각 사용자의 첫 제출만 반영합니다.

- attempt_correct: 문제에 정답이 제출된 총 횟수입니다.

  - 각 사용자의 첫 제출만 반영합니다.

- rate: 문제의 외부 정답률입니다. 1바이트의 정수입니다.

  - 기본적으로 0에서 100사이의 값을 갖습니다. 외부 정답률 통계가 존재하지 않을 경우 null입니다.
  - 세모문 내에서의 제출과는 관계가 없는 값입니다.

- elapsed_total: 각 사용자가 첫 제출을 하기까지 걸린 시간(초)의 합입니다. 4바이트의 음이 아닌 정수입니다.

### 제출 Submission (사용자 - 문제 관계)

다음 경우에 프론트는 해당 정보를 DB에 전송해야 합니다.

1. 사용자가 학습공간에서 `제출` 버튼을 누를 경우

현재는 사용자가 **모든 문제에 답을 입력**해야만 `제출`이 가능합니다.

- uid(기본키): 제출한 사용자의 uid입니다.
- pid(기본키): 제출된 문제의 pid입니다.
- elapsed: 사용자의 첫 제출까지 걸린 시간(초)입니다.
- recent_time: 사용자가 가장 최근에 제출한 시각입니다.
- user_answer: 사용자가 가장 최근에 제출한 답입니다.
- correct: 사용자 제출의 정답 여부입니다.
- note: 사용자의 필기 내용입니다. 65536바이트 이하의 가변 길이 이진 문자열입니다.
  - 기본적으로 `ios PencilKit`으로 작성한 필기를 저장하게 됩니다.

### 뷰어 View

- vid(기본키): 뷰어의 고유 번호입니다. 4바이트의 음이 아닌 정수입니다.
- sid(외래키): 문제가 속한 섹션의 sid입니다.
- index_start: 뷰어에 포함될 문제의 시작 인덱스입니다. 4바이트의 음이 아닌 정수입니다.
- index_end: 뷰어에 포함될 문제의 끝 인덱스입니다. 4바이트의 음이 아닌 정수입니다.

  - 각 뷰어의 시작 인덱스부터 끝 인덱스까지의 모든 문제는 한 화면에 표시되어야 합니다.

- material: 뷰어의 자료로 쓰일 이미지 정보입니다. 256바이트 이하의 가변 길이 문자열입니다.

  - 해당 값이 i일 경우 DB의 `/images/material/i` 에 해당하는 뷰어 이미지가 존재해야 합니다.

- record: 뷰어의 자료로 쓰일 음성 정보입니다. 256바이트 이하의 가변 길이 문자열입니다.

  - 해당 값이 i일 경우 DB의 `/sounds/record/i` 에 해당하는 음성 파일이 존재해야 합니다.

- form: 뷰어의 형태입니다. 1바이트의 음이 아닌 정수입니다.
  - 0일 경우 material이 null임을 시사합니다.
  - 1일 경우 `세로선`, 2일 경우 `가로선`을 기준으로 자료와 문제가 구분된 형태여야 합니다.

### 섹션 Section

- sid(기본키): 섹션의 고유 번호입니다. 4바이트의 음이 아닌 정수입니다.

  - 각 섹션은 추가된 순서대로 번호를 부여받습니다. 처음 추가된 섹션은 1번입니다.

- wid(외래키): 섹션이 속한 문제집의 wid입니다.

- index: 섹션의 순서입니다. 4바이트의 음이 아닌 정수입니다.

- title: 섹션의 제목입니다. 256바이트 이하의 문자열입니다.

- detail: 섹션의 정보입니다. 65536바이트 이하의 문자열입니다.

- sectioncover: 섹션의 표지 이미지입니다. 256바이트 이하의 가변 길이 문자열입니다.

  - 해당 값이 i일 경우 DB의 `/images/section/AxA/i` 에 해당하는 AxA 크기의 표지 이미지가 존재해야 합니다.

- cutoff: 섹션의 등급 컷 관련 정보입니다. 65536바이트 이하의 JSON 문자열입니다.

### 성적표 Report (사용자 - 섹션 관계)

다음 경우에 프론트는 해당 정보를 DB에 전송해야 합니다.

1. 사용자가 `제출`한 문제집의 category가 `수능 모의고사`일 경우

- uid(기본키): 제출한 사용자의 uid입니다.

- sid(기본키): 제출된 섹션의 sid입니다.

- grade: 사용자의 모의고사 등급입니다.

  - 프론트는 섹션의 cutoff와 채점 결과를 바탕으로 이를 계산해야 합니다.

- elapsed: 사용자가 모의고사를 마치는 데 소요된 시간(초)입니다.

- subject: 섹션이 소속된 과목입니다.
  - 섹션이 속한 문제집의 subject와 일치해야 합니다.

### 문제집 Workbook

- wid(기본키): 문제집의 고유 번호입니다. 4바이트의 음이 아닌 정수입니다.

  - 각 문제집은 추가된 순서대로 번호를 부여받습니다. 처음 추가된 문제집은 1번입니다.

- title: 문제집의 이름입니다. 256바이트 이하의 문자열입니다.

- year: 문제집의 출판연도입니다. 1바이트의 음이 아닌 정수입니다.
- month: 문제집이 출판된 달입니다. 1바이트의 음이 아닌 정수입니다.
  - 1에서 12 사이의 값을 가져야 합니다.
- price: 문제집의 판매 가격(원)입니다. 4바이트의 음이 아닌 정수입니다.
- detail: 문제집의 정보입니다. 65536바이트 이하의 문자열입니다.
- bookcover: 문제집의 표지 이미지입니다. 256바이트 이하의 가변 길이 문자열입니다.
  - 해당 값이 i일 경우 DB의 `/images/workbook/AxA/i` 에 해당하는 AxA 크기의 표지 이미지가 존재해야 합니다.
- sales: 문제집의 판매량입니다. 4파이트의 음이 아닌 정수입니다.
- publisher: 문제집의 출판사입니다. 256바이트 이하의 문자열입니다.
- category: 문제집의 유형입니다. 256바이트 이하의 문자열입니다.
- subject: 문제집의 주제입니다. 256바이트 이하의 문자열입니다.

- grade: 문제집이 대상으로 하는 학년입니다. 1바이트의 음이 아닌 정수입니다.
  - 0에서 13 사이의 값을 가져야 합니다. 0은 대상 학년이 특정되지 않은 경우입니다.

문제집 정보 입력 예시는 다음과 같습니다.

```
ex1) title = 2022년 9월 국어 모의평가, category = 수능 모의고사, subject = 국어

ex2) title = BLACKLABEL 블랙라벨 미적분 (2021년용), category = 내신, subject = 수학

ex3) title = 2021 시나공 정보처리기사 실기, category = 자격증, subject = 국가기술자격

ex4) title = 해커스 토익 실전 1000제 1 LISTENING 문제집, category = 자격증, subject = 토익
```



## 목록

Semomun에서 사용자의 입력은 다음 세 가지 중 하나의 형태로 들어옵니다.

1. 주소에서 /로 구분된 단어들 중 :로 시작하는 것

- 예시: `GET /dragon/:dragon_id/likes/:category` 에서 `dragon_id` 와 `category` 는 1번에 해당하는 입력입니다.

2. HTTP 메서드가 GET / DELETE: 주소에서 ? 뒤에 오는 것들, 즉 query string

- 예시: `GET /snake/:snake_id/:snake_type?start=5&limit=60` 에서 `start` 와 `limit` 는 2번에 해당하는 입력입니다.

3. HTTP 메서드가 POST / PUT: HTTP Body. JSON 형태

- 예시: `POST /write/:post_id` 주소로 body가 `{"title":"asdf","content":"asdf"}` 인 요청이 들어왔을 때 `title` 과 `content` 는 3번에 해당하는 입력입니다.

1번은 제목(주소)에 명시적으로 적혀 있습니다. 2번과 3번은 제목에 적기엔 너무 많거나 지저분해져 생략합니다. 즉, 1번에 해당하지 않는 입력은 2번 혹은 3번으로 들어온다고 생각해 주세요. 또한 HTTP 규칙 상 각 요청에서 1번 형태가 아닌 입력은 반드시 2번이나 3번 중 하나의 형태로만 들어옵니다.

3번에 해당하는 경우(즉, HTTP 메서드가 POST / PUT인 경우), 특별한 말이 없는 경우 요청의 **Content-Type** 헤더는 반드시 **application/json**이어야 합니다. **아니라면, 상태 코드는 400이며 빈 문자열을 반환하여야 합니다**.

요청으로 들어온 값들이 명세에 위배된다면, 상태 코드는 400이며 빈 문자열을 반환해야 합니다.

특별한 말이 없는 경우, 성공 시 반환값은 JSON 객체이며 실패 시 반환값은 빈 문자열 혹은 오류 코드입니다. JSON 객체에서 각 값이 명확해 설명할 필요가 없을 경우(주로 해당 값이 DB에 동일한 이름으로 존재하는 경우) 다음과 같이 설명을 생략합니다.

- { id, level, title, source, solves }

실제 반환값의 예시로는 `{"id":1,"level":2,"title":"X","source":"Y","solves":3}` 이 가능합니다. 각 값에 대해 추가적인 설명이 필요할 경우, 다음처럼 작성합니다.

- { a, b }
  - a: 이 값은 항상 1입니다.
  - b: 다음과 같은 객체의 배열입니다.
    - { c }

실제 반환값의 예시로는 `{"a":1,"b":[{"c":2},{"c":3}]}` 이 가능합니다.

### GET /workbooks (workbook.js - fetch_workbooks)

요청한 사용자가 해당 문제의 열람 권한이 있는 문제들 중, 주어진 조건에 맞는 문제의 목록을 반환합니다.

- query: 문제 검색 쿼리입니다. 다음과 같은 url query가 가능합니다.

  - { s(ubject), c(ategory), g(rade), y(ear), m(onth) }

- ~~sort: 문제를 정렬할 기준입니다.~~

- page: 페이지의 번호입니다.

정렬 기준은 다음과 같습니다. 

- ~~lexicographical (사전순)~~

성공 시 반환값은 JSON이며, 다음과 같은 객체입니다.

- { count, workbooks }
  - count: 주어진 조건에 맞는 문제집의 개수입니다. sort 혹은 page에 영향을 받지 **않습니다**.
  - workbooks: 문제집 정보들을 sort에 따라 정렬했을 때, [25 * (page - 1), 25 * page) 구간 배열입니다. 문제집 정보는 다음과 같은 객체입니다.
    - { wid, title, bookcover }



### POST /register (register.js - create_user)

사용자의 정보를 받아 가입시킵니다

- info: 사용자 초기 정보입니다. 다음과 같은 객체입니다.
  - { name, nickname, gender, phone, school, major, majorDetail, favoriteCategory, graduationStatus }
- token: 사용자 식별 토큰입니다.

성공 시 반환값은 JSON이며, 빈 객체입니다.

실패 시 처리는 다음과 같습니다.

- 400 Bad Request: 토큰이 유효하지 않은 경우입니다.
- 409 Conflict: 이미 사용중인 닉네임인 경우입니다. 반환값은 `NICKNAME_NOT_AVAILABLE` 입니다.
- 409 Conflict: 이미 사용중인 전화번호인 경우입니다. 반환값은 `PHONE_NOT_AVAILABLE` 입니다.



### POST /register/auth (register.js - send_code)

사용자의 전화번호를 받고, ~~올바른 전화번호인지 확인한 후~~ 해당 번호로 인증 코드를 전송합니다.

~~IP와 전화번호 각각에 요청 횟수에 제한이 있으며, 둘 중 하나라도 요청 횟수가 5번을 초과한다면 즉시 429 상태 코드를 반환합니다.~~

해당 전화번호에 이미 인증 코드가 DB에 있는 경우(즉, 사용자가 인증을 재요청한 경우) 새로 생성한 인증 코드로 대체하고 다시 전송합니다.

인증 코드는 5분, 요청 횟수 제한은 생성되고 하루가 지나면 완전히 삭제됩니다.

- phone: 사용자의 전화번호입니다.

성공 시 반환값은 JSON이며, 빈 객체입니다.

실패 시 처리는 다음과 같습니다.

- ~~400 Bad Request: 사용할 수 없는 전화번호입니다. 반환값은 `PHONE_NOT_ALLOWED` 입니다.~~
- ~~409 Conflict: 이미 사용중인 전화번호인 경우입니다. 반환값은 `PHONE_NOT_AVAILABLE` 입니다~~.
- ~~429: 인증 요청 횟수가 제한을 초과한 경우입니다. 반환값은 `AUTHPHONE_QUOTA_EXCEEDED` 입니다.~~
- 500: 해당 이메일로 코드를 전송하는데 실패한 경우입니다. 반환값은 `AUTHPHONE_SEND_FAILED` 입니다.



### POST /register/verify (register.js - check_code)

사용자의 전화번호와 인증 코드를 받아 DB와 대조한 후 인증 여부를 판단합니다.

- { phone, code }

성공 시 반환값은 JSON이며, 빈 객체입니다.

실패 시 처리는 다음과 같습니다.

- 400 Bad Request: 해당 전화번호가 존재하지 않거나, `POST /register/auth` 를 통해 전송한 코드와 사용자의 입력이 일치하지 않는 경우입니다.



### GET /sections/:sid

요청한 사용자가 해당 섹션의 열람 권한이 있는 경우, 해당 섹션을 반환합니다.

성공 시 반환값은 JSON이며, 다음과 같은 객체입니다.

- { views }
  - views: 섹션에 포함된 뷰어의 배열입니다. 뷰어 정보는 다음과 같은 객체입니다.
    - { vid, index_start, index_end, material, form, problems }
      - problems: 뷰어에 포함된 문제의 배열입니다. 문제 정보는 다음과 같은 객체입니다.
        - { pid, icon_index, icon_name, type, answer, content, explanation, attempt_total, attempt_correct, rate, elapsed_total}



### GET /info/category

문제집이 속한 카테고리의 목록을 반환합니다.

정렬 기준은 현재는 무작위입니다.

성공 시 반환값은 JSON이며, 다음과 같은 객체입니다.

- { category }


### GET /info/buttons

문제집이 속한 카테고리의 버튼 정보를 반환합니다.

- c(ategory)

성공 시 반환값은 JSON이며, 다음과 같은 객체입니다.

- { queryButtons }
  - queryButtons: 카테고리의 버튼 정보입니다. 다음과 같은 객체입니다.
    - { title, queryParamKey, queryParamValues }
      - queryParamValues: 카테고리에 포함된 각 attr의 목록입니다.


### GET /info/major

회원 가입 시 요구되는 계열 및 전공의 목록입니다.

- { major }
  - major: 계열의 목록입니다. 각 계열은 다음과 같이 구성되어 있습니다.
    - { majorName: majorDetail }
      - majorDetail: 세부 전공의 목록입니다.

현재는 아래와 같은 json이 항상 반환됩니다.

```json
{ major: [{ '문과 계열': ['인문', '상경', '사회', '교육', '기타'] }, { '이과 계열': ['공학', '자연', '의약', '생활과학', '기타'] }, { 예체능계열: ['미술', '음악', '체육', '기타'] }] }
```

### GET /users/self

해당 요청을 한 사용자 본인의 정보를 반환합니다.

- { token }

성공 시 반환값은 JSON이며, 다음과 같은 객체입니다.

- { uid, name, nickName, gender, phone, school, major, majorDetail, favoriteCategory, graduationStatus, birthday, profileImage }

실패 시 처리는 다음과 같습니다.

- 404: 해당 사용자가 존재하지 않는 경우입니다. 반환값은 빈 문자열입니다.

### PUT /users/:uid

요청한 사용자가 ~~admin에 속하거나~~ 해당 사용자 본인일 경우, 해당 사용자의 정보를 변경합니다.

- { info, token }
  - info: 사용자가 변경할 정보입니다. 다음과 같은 정보를 변경할 수 있습니다.
    - { gender, school, major, majorDetail, favoriteCategory, graduationStatus, birthday }

성공 시 반환값은 JSON이며, 빈 객체입니다.

실패 시 처리는 다음과 같습니다.

- ~~401: 인증되지 않은 사용자인 경우입니다. 반환값은 빈 문자열입니다.~~
- 403: 요청한 사용자가 admin이 아니며 해당 user도 아닌 경우입니다. 반환값은 빈 문자열입니다.
- 404: 해당 사용자가 존재하지 않는 경우입니다. 반환값은 빈 문자열입니다.

### PUT /sections/:sid/submit


# Semomun API

Semomun API의 명세와 조건, 참고사항 및 예외들을 정리해 작성한 문서입니다.

위 문장에서 '예외들'은 실제로 프로그램에서 예외를 던져야 한다는 의미로 쓴 것은 아닙니다. 주로 사용자가 잘못된 입력을 넣었을 때, 버그나 취약점이 발생할 수 있고 프로그래머가 자칫 넘기기 쉬울 수 있는 부분들을 뜻합니다.

해당 문서에서 ~~취소선~~이 그어진 API는 1.0 버전으로부터의 migration이 아직 이루어지지 않았음을 의미합니다. 따라서 정상적으로 동작하지 않을 수 있고, 추후에 수정되거나 삭제될 예정입니다.


## 문법

### Status code

정상적인 경우 HTTP 상태 코드는 200 OK로 응답해야 하지만, 사용자의 요청에 따라 다른 코드로 응답해야 할 수 있습니다. 목록 중간중간에 그래야 하는 상황들을 명시해 두었으며, 각 상태 코드의 의미는 다음과 같습니다.

- 200 OK: 정상적으로 요청이 실행되었고, 서버가 적절한 응답을 돌려줄 수 있습니다.
- 400 Bad Request: 사용자가 사이트에서 정상적으로는 제출할 수 없는 요청을 한 경우입니다.
  - 달리 말해, 프론트 개발자 역시 **해당 경우를 제출할 수 없도록 처리**해야 합니다.
- 401 Unauthorized: 사용자가 로그인 없이 요청을 한 경우입니다. 주로 access token이 만료된 경우입니다.
- 403 Forbidden: 사용자에게 권한이 허락되지 않은 요청을 한 경우입니다.
- 404 Not Found: 요청은 올바르지만, 서버에 사용자가 찾는 것이 존재하지 않는 경우입니다.
- 409 Conflict: 요청은 올바르지만, 서버에 이미 사용자가 추가하려는 것이 존재해 추가가 불가능한 경우입니다.
- 422 Unprocessable Entity: 요청은 올바르지만, 해당 요청은 서버에서 처리할 수 없음(혹은, 처리하지 않을 것임)을 뜻합니다.
- 429 Too Many Requests: 사용자에게 주어진 요청량을 초과한 경우입니다.
- 500 Internal Server Error: 요청은 올바르지만, 서버에서 해당 요청을 처리하는데 실패한 경우입니다. 발생하지 않는 것이 이상적입니다.

### 합의된 사항들
- timestamp는 iso8601 형식으로 오갑니다.
  - 백엔드에서 프론트엔드로 보낼 때는 `"2022-02-28T17:03:34.000Z"`와 같은 형식입니다.
  - 프론트엔드에서 백엔드로 보낼 때는 `"2022-02-28T17:03:34Z"`와 같은 형식입니다.
- 전화번호는 `+82-10-1234-5678`와 같은 형식으로 국가번호를 포함합니다. db에도 이러한 형식으로 저장되고, 프론트엔드와 소통할 때도 항상 이 형식을 사용합니다.
  - 정규표현식: `/^\+\d{1,4}-\d{1,3}-\d{3,4}-\d{3,4}$/`
- 로그인 후 이루어지는 대부분의 (모든) api 호출에서 헤더에 access token을 담아주세요. key는 `Authorization`, value는 `Bearer eyJhbGciOiJIUzI1N`와 같은 형식의 값입니다.
- 하나의 request의 크기는 10MB 미만이어야 합니다.

## 자료형

```sql
-- 사용자 --
CREATE TABLE `Users` (
    `uid` INT NOT NULL AUTO_INCREMENT,                                             /* 식별자                          */
    `username` VARCHAR(256) NOT NULL,                                              /* 아이디                          */
    `credit` INT NOT NULL,                                                         /* 보유 캐시, 종속성 관리 필요        */
    `role` VARCHAR(32) NOT NULL DEFAULT 'USER',                                    /* USER 또는 ADMIN                 */
    `deleted` INT NOT NULL DEFAULT 0,                                              /* 탈퇴했는지 여부                   */
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`uid`)
);

-- 유저의 개인정보 --
CREATE TABLE `UserInfo` (
    `uid` INT NOT NULL,                                                            /* 식별자                          */
    `name` VARCHAR(256) NOT NULL,                                                  /* 실명                          */
    `email` VARCHAR(256) NOT NULL,                                                 /* 이메일                         */
    `address` VARCHAR(256) NOT NULL,                                               /* 주소                          */
    `addressDetail` VARCHAR(256) NOT NULL,                                         /* 상세 주소                      */
    `birth` DATETIME,                                                              /* 생일                          */
    `googleId` VARCHAR(256),                                                       /* 구글 소셜로그인 id                */
    `appleId` VARCHAR(256),                                                        /* 애플 소셜로그인 id                */
    `phone` VARCHAR(32) NOT NULL,                                                  /* 전화번호, 국가코드 포함            */
    `major` VARCHAR(32) NOT NULL,                                                  /* 계열                           */
    `majorDetail` VARCHAR(32) NOT NULL,                                            /* 전공                          */
    `school` VARCHAR(256) NOT NULL,                                                /* 학력                           */
    `graduationStatus` VARCHAR(32) NOT NULL,                                       /* 재학 상태                       */
    `marketing` INT NOT NULL,                                                      /* 마케팅정부 수신 동의               */
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`uid`) REFERENCES `Users` (`uid`),
    PRIMARY KEY (`uid`)
);

-- 상품 (세모문에서 판매하는 모든 물품의 상위 스키마) --
CREATE TABLE `Items` (
    `id` INT NOT NULL AUTO_INCREMENT,                                              /* 식별자                          */
    `type` VARCHAR(32) NOT NULL,                                                   /* 유형                            */
    `price` INT NOT NULL,                                                          /* 판매가                          */
    `sales` INT NOT NULL,                                                          /* 판매량, 종속성 관리 필요          */
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
    `date` DATETIME NOT NULL,                                                     /* 발행일                          */
    `publishMan` VARCHAR(32) NOT NULL,                                             /* 발행인                          */
    `publishCompany` VARCHAR(32) NOT NULL,                                         /* 출판사                          */
    `originalPrice` INT NOT NULL,                                                  /* 정가                            */
    `bookcover` CHAR(36) NOT NULL,                                                 /* 표지 파일 식별자, uuid            */
    `type` VARCHAR(32) NOT NULL DEFAULT '',                                        /* 권한 관련한 타입, ex. HIDDEN      */
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`wid`),
    FOREIGN KEY (`id`) REFERENCES `Items` (`id`)
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
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`sid`),
    FOREIGN KEY (`wid`) REFERENCES `Workbooks` (`wid`)
);

-- 뷰 (섹션의 각 페이지) --
CREATE TABLE `Views` (
    `sid` INT NOT NULL,                                                             /* 섹션                            */
    `vid` INT NOT NULL AUTO_INCREMENT,                                              /* 식별자                           */
    `index` INT NOT NULL,                                                           /* 페이지 번호                      */
    `form` INT NOT NULL,                                                            /* 유형                            */
    `passage` CHAR(36),                                                             /* 지문 파일 식별자, uuid           */
    `attachment` CHAR(36),                                                          /* 자료 식별자, uuid               */
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`vid`),
    FOREIGN KEY (`sid`) REFERENCES `Sections` (`sid`)
);

-- 문제 --
CREATE TABLE `Problems` (
    `vid` INT NOT NULL,                                                             /* 뷰                             */
    `pid` INT NOT NULL AUTO_INCREMENT,                                              /* 식별자                          */
    `index` INT NOT NULL,                                                           /* 페이지 내에서의! 문제 번호         */
    `btType` VARCHAR(32) NOT NULL,                                                  /* "문", "유", "개"와 같은 문제 타입  */
    `btName` VARCHAR(32) NOT NULL,                                                  /* 앱의 하단버튼(label)에서 보여줄 이름 */
    `type` INT NOT NULL,                                                            /* 유형                            */
    `answer` VARCHAR(256),                                                          /* 정답                            */
    `score` DOUBLE,                                                                 /* 배점                          */
    `content` CHAR(36) NOT NULL,                                                    /* 문제 파일 식별자, uuid           */
    `explanation` CHAR(36),                                                         /* 해설 파일 식별자, uuid           */ 
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`pid`),
    FOREIGN KEY (`vid`) REFERENCES `Views` (`vid`)
);

-- 제출 기록 --
CREATE TABLE `Submissions` (
    `sbid` INT NOT NULL AUTO_INCREMENT,
    `uid` INT NOT NULL,                                                            /* 유저                           */
    `pid` INT NOT NULL,
    `elapsed` INT,                                                        /* 소요 시간                       */
    `answer` VARCHAR(256),                                                         /* 유저가 제출한 답                 */
    `attempt` INT NOT NULL,                                                        /* 다시풀기 n회차                   */
    `note` MEDIUMBLOB,                                                          /* 필기                            */
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`sbid` ),
    FOREIGN KEY (`uid`) REFERENCES `Users` (`uid`),
    FOREIGN KEY (`pid`) REFERENCES `Problems` (`pid`)
);

-- Passage 필기 제출 기록 --
CREATE TABLE `ViewSubmissions` (
    `vsbid` INT NOT NULL AUTO_INCREMENT,
    `uid` INT NOT NULL,                                                            /* 유저                           */
    `vid` INT NOT NULL,                                                       /* pid 또는 vid                   */
    `attempt` INT NOT NULL,                                                        /* 다시풀기 n회차                   */
    `note` MEDIUMBLOB,                                                          /* 필기                            */
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`vsbid` ),
    FOREIGN KEY (`uid`) REFERENCES `Users` (`uid`),
    FOREIGN KEY (`vid`) REFERENCES `Problems` (`vid`)
);

-- 태그 --
CREATE TABLE `Tags` (
    `tid` INT NOT NULL AUTO_INCREMENT,                                             /* 식별자                          */
    `name` VARCHAR(32) NOT NULL,                                                   /* 이름                           */
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`tid`)
);

-- 문제집 별 태그 --
CREATE TABLE `WorkbookTags` (
    `wid` INT NOT NULL,                                                            /* 문제집                         */
    `tid` INT NOT NULL,                                                            /* 태그                           */
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`wid`, `tid`),
    FOREIGN KEY (`wid`) REFERENCES `Workbooks` (`wid`),
    FOREIGN KEY (`tid`) REFERENCES `Tags` (`tid`)
);

-- 나의 태그 (관심 태그) -- 
CREATE TABLE `FavoriteTags` (
    `uid` INT NOT NULL,                                                            /* 유저                          */
    `tid` INT NOT NULL,                                                            /* 태그                          */
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`uid`, `tid`),
    FOREIGN KEY (`uid`) REFERENCES `Users` (`uid`),
    FOREIGN KEY (`tid`) REFERENCES `Tags` (`tid`)
);

-- 캐시 이용 내역 --
CREATE TABLE `PayHistory` (
    `phid` INT NOT NULL AUTO_INCREMENT,                                            /* 주문번호                         */
    `id` INT,                                                                      /* 구매품목                         */
    `uid` INT NOT NULL,                                                            /* 유저                            */
    `amount` INT NOT NULL,                                                         /* 양수면 충전, 음수 또는 0이면 구매     */
    `balance` INT NOT NULL,                                                        /* 충전 또는 구매 후 남은 잔액          */
    `type` VARCHAR(32) NOT NULL,                                                   /* prefix가 charge 또는 order       */
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`phid`),
    FOREIGN KEY (`id`) REFERENCES `Items` (`id`),
    FOREIGN KEY (`uid`) REFERENCES `Users` (`uid`)
);

-- 학습 기록 --
CREATE TABLE `WorkbookHistory` (
    `whid` INT NOT NULL AUTO_INCREMENT,
    `wid` INT NOT NULL,                                                            /* 문제집                         */
    `uid` INT NOT NULL,                                                            /* 유저                           */
    `type` VARCHAR(32) NOT NULL,                                                   /* solve, cart 등등               */
    -- type == `solve` 를 이용해서 최근에 이용한 문제집 판별 --
    -- type == `cart` 를 이용해서 장바구니에 담긴 상품 목록 알 수 있음 --
    `datetime` DATETIME NOT NULL,                                                  /* 이벤트가 일어난 시각               */
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`whid`),
    FOREIGN KEY (`wid`) REFERENCES `Workbooks` (`wid`),
    FOREIGN KEY (`uid`) REFERENCES `Users` (`uid`)
);

-- 공지사항 --
CREATE TABLE `Notices` (
    `nid` INT NOT NULL AUTO_INCREMENT,                                             /* 식별자                          */
    `title` TINYTEXT NOT NULL,                                                     /* 제목                           */
    `text` TEXT NOT NULL,                                                         /* 내용                           */
    `image` VARCHAR(256),                                                          /* 이미지 url                       */
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`nid`)
);

-- 문제 오류 신고 --
CREATE TABLE `ErrorReports` (
    `erid` INT NOT NULL AUTO_INCREMENT,
    `pid` INT NOT NULL,
    `uid` INT NOT NULL,
    `content` TEXT NOT NULL,                                                       /* 내용                           */
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`erid`),
    FOREIGN KEY (`pid`) REFERENCES `Problems` (`pid`),
    FOREIGN KEY (`uid`) REFERENCES `Users` (`uid`)
);
```




## 목록

Semomun에서 사용자의 입력은 다음 네 가지 중 하나의 형태로 들어옵니다.

1. Path Parameter: 주소에서 /로 구분된 단어들 중 :로 시작하는 것
- 예시: `GET /dragon/:dragon_id/likes/:category` 에서 `dragon_id` 와 `category`

2. Query String: HTTP 메서드가 GET / DELETE: 주소에서 ? 뒤에 오는 것들
- 예시: `GET /snake/:snake_id/:snake_type?start=5&limit=60` 에서 `start` 와 `limit`

3. Request Body: HTTP 메서드가 POST / PUT인 경우에만 존재
- 예시: `POST /write/:post_id` 주소로 body가 `{"title":"asdf","content":"asdf"}` 인 요청이 들어왔을 때 `title` 과 `content`

4. Header: token과 같이 보안에 민감한 정보를 담음
- 예시: key가 `Authorization`, value가 `Bearer access-token1234`


3번(Request Body)에 해당하는 경우, 특별한 말이 없는 경우 요청의 **Content-Type** 헤더는 반드시 **application/json**이어야 합니다. 아니라면, 상태 코드는 400이며 빈 문자열을 반환하여야 합니다.

요청으로 들어온 값들이 명세에 위배된다면, 상태 코드는 400이며 빈 문자열을 반환해야 합니다.

특별한 말이 없는 경우, 성공 시 반환값은 JSON 객체이며 실패 시 반환값은 빈 문자열 혹은 오류 코드입니다.


### GET /workbooks?page=1&limit=25&tids[]=3&tids[]=4&keyword=국어 (workbook.js - fetchWorkbooks)

검색 조건과 맞는 문제집의 목록을 페이지네이션하여 반환합니다.
- page: 페이지네이션에서 몇 번째 페이지를 받아올지 입니다. 1-base이며, default는 1입니다. 
- limit: 한 페이지에 몇 개의 문제집을 넣을지입니다. default는 25입니다.
- tids: 검색하는 태그의 tid의 목록입니다. 일치하는 태그가 없더라도 검색 결과에 포함됩니다.
- keyword: 검색하는 문자열입니다. 해당 문자열이 `title`, `author`, `publishCompany` 중 하나 이상의 필드에 substring으로 포함되는 문제집들만이 검색 결과에 포함됩니다.

정렬 기준은 다음과 같습니다.
1. 일치하는 태그의 수에 대한 내림차순
2. wid에 대한 오름차순

성공 시 반환값은 JSON이며, 다음과 같은 객체입니다.

- { count, workbooks }
  - count: 주어진 조건에 맞는 문제집의 개수입니다. sort 혹은 page에 영향을 받지 않습니다.
  - workbooks: 문제집의 배열입니다. Workbooks 테이블에 들어있는 값들을 담고 있으며, 다른 테이블에 있는 값들은 담고 있지 않습니다. (ex. `price`, `sections`, `tags` 같은 필드는 없음.)
    - `matchTags` 필드는 해당 문제집에서 일치하는 태그의 개수입니다.

<details>
<summary>response 예시</summary>
<pre language="json"><code class="language-json">{
    "count": 4,
    "workbooks": [
        {
            "id": 4,
            "wid": 30,
            "title": "2013년도 국가직 9급 국어",
            "detail": "",
            "isbn": "",
            "author": "",
            "date": "2013-03-01T00:00:00.000Z",
            "publishMan": "",
            "publishCompany": "",
            "originalPrice": 0,
            "bookcover": "5ad2d320-5e36-4fa6-a417-ed5daa7b644a",
            "createdAt": "2022-03-16T18:23:04.000Z",
            "updatedAt": "2022-03-16T18:23:04.000Z",
            "matchTags": 2
        },
        {
            "id": 5,
            "wid": 169,
            "title": "2021년도 11월 고1 전국연합학력평가 국어영역",
            "detail": "",
            "isbn": "",
            "author": "",
            "date": "2021-11-01T00:00:00.000Z",
            "publishMan": "",
            "publishCompany": "교육청",
            "originalPrice": 0,
            "bookcover": "c87adefe-315b-4333-9e1d-bd921189293c",
            "createdAt": "2022-03-29T14:53:58.000Z",
            "updatedAt": "2022-03-29T14:53:58.000Z",
            "matchTags": 1
        }
    ]
}
</code></pre></details>
<br/>

### GET /workbooks/:wid (workbook.js - fetchWorkbook)

wid가 주어진 값인 문제집을 반환합니다.

성공 시 아래 예시와 같은 형식의 json을 보냅니다. `GET /workbooks` api와 비교했을 때 `price`, `sales`, `sections`, `tags` 필드가 추가되었습니다.

<details>
<summary>response 예시</summary>
<pre language="json"><code class="language-json">{
    "id": 1,
    "wid": 1,
    "title": "title",
    "detail": "detail",
    "isbn": "isbn",
    "author": "author",
    "date": "2022-02-28T16:06:18.000Z",
    "publishMan": "publishMan",
    "publishCompany": "publishCompany",
    "originalPrice": 10000,
    "bookcover": "bookcover",
    "createdAt": "2022-02-28T16:06:36.000Z",
    "updatedAt": "2022-02-28T16:06:37.000Z",
    "price": 10000,
    "sales": 1,
    "sections": [
        {
            "wid": 1,
            "sid": 1,
            "index": 0,
            "title": "title",
            "detail": "detail",
            "cutoff": {},
            "sectioncover": "sectioncover",
            "size": 10000000,
            "audio": null,
            "audioDetail": null,
            "createdAt": "2022-02-28T16:07:00.000Z",
            "updatedAt": "2022-02-28T16:07:01.000Z"
        }
    ],
    "tags": [
        {
            "tid": 1,
            "name": "tag1",
            "createdAt": "2022-02-25T20:32:20.000Z",
            "updatedAt": "2022-02-25T20:32:22.000Z"
        }
    ]
}
</code></pre></details>

실패 시 처리는 다음과 같습니다.
- 404 Not Found: 해당 wid에 대한 문제집이 없는 경우입니다.


### GET /workbooks/recent/solve (workbooks.js - getRecentSolveWorkbooks)

푼 적이 있는 (`PUT /workbooks/solve` api 호출을 한 적이 있는) 문제집들을 가장 최근 푼 것 순으로 정렬하여 반환합니다.

성공 시 아래 예시와 같은 형식의 json을 보냅니다. `GET /workbooks` api와 비교했을 때, 가장 최근에 학습공간에 진입한 시각을 의미하는 `solve` 필드가 추가되었습니다.

<details>
<summary>response 예시</summary>
<pre language="json"><code class="language-json">[
    {
        "id": 1,
        "wid": 2,
        "title": "title",
        "detail": "detail",
        "isbn": "isbn",
        "author": "author",
        "date": "2022-03-06T19:12:11.000Z",
        "publishMan": "publishMan",
        "publishCompany": "publishCompany",
        "originalPrice": 10000,
        "bookcover": "uuid",
        "createdAt": "2022-03-06T19:12:24.000Z",
        "updatedAt": "2022-03-06T19:12:25.000Z",
        "solve": "2022-03-14T17:03:34.000Z"
    }
]
</code></pre></details>
<br/>

실패 시 처리는 아래와 같습니다.
- 401 Unauthorized: access token이 주어지지 않았거나 만료된 경우입니다.


### GET /workbooks/purchased?order=solve (workbooks.js - getPurchasedWorkbooks)

구매한 문제집들의 목록을 반환합니다.

성공 시 아래와 같은 형식의 json을 보냅니다.
- `[{ wid, solve, payHistory }]`
  - solve: 해당 문제집의 학습공간에 마지막으로 진입한 시각. 진입한 적이 없을 경우 null입니다.
  - payHistory: [{createdAt}]
    - 문제집을 구매한 시각

정렬 기준은 query string인 order의 값에 따라 아래와 같이 정해집니다.
- order == solve: solve에 대한 내림차순으로 정렬. payHistory 내부에서는 createdAt(구매 시각)에 대한 내림차순으로 정렬.
- order == purchase: 해당 문제집을 구입한 시각에 대한 내림차순으로 정렬
- 그 외: wid에 대한 오름차순으로 정렬. payHistory 내부에서는 createdAt(구매 시각)에 대한 내림차순으로 정렬.


<details>
<summary>response 예시</summary>
<pre language="json"><code class="language-json">[
    {
        "wid": 2,
        "solve": "2022-03-09T17:03:34.000Z",
        "payHistory": [
            {
                "createdAt": "2022-03-10T19:37:11.000Z"
            },
            {
                "createdAt": "2022-03-04T19:37:11.000Z"
            }
        ]
    },
    {
        "wid": 3,
        "solve": null,
        "payHistory": [
            {
                "createdAt": "2022-03-08T11:02:49.000Z"
            }
        ]
    }
]
</code></pre></details>
<br/>


### GET /workboks/bestseller (workbooks.js - getBestsellers)

베스트셀러인 문제집의 목록을 반환합니다. 정렬 기준은 인기 순으로 내림차순입니다. '베스트셀러'란 통계를 통해 나온 결론이 아닌, 어드민에서 직접 입력한 내용입니다.

<details>
<summary>response 예시</summary>
<pre language="json"><code class="language-json">[
    {
        "id": 1,
        "wid": 2,
        "title": "title",
        "detail": "detail",
        "isbn": "isbn",
        "author": "author",
        "date": "2022-03-06T19:12:11.000Z",
        "publishMan": "publishMan",
        "publishCompany": "publishCompany",
        "originalPrice": 10000,
        "bookcover": "uuid",
        "createdAt": "2022-03-06T19:12:24.000Z",
        "updatedAt": "2022-03-06T19:12:25.000Z"
    },
    {
        "id": 2,
        "wid": 4,
        "title": "2021년도 11월 고1 전국연합학력평가 국어영역",
        "detail": "",
        "isbn": "",
        "author": "",
        "date": "2022-03-06T19:12:11.000Z",
        "publishMan": "",
        "publishCompany": "교육청",
        "originalPrice": 10000,
        "bookcover": "c87adefe-315b-4333-9e1d-bd921189293c",
        "createdAt": "2022-03-06T19:12:24.000Z",
        "updatedAt": "2022-03-06T19:12:25.000Z"
    }
]
</code></pre></details>
<br/>


### PUT /workbooks/solve (workbooks.js - solveWorkbook)

특정 문제집의 학습공간에 진입했음을 기록합니다.

- { wid, datetime }
  - datetime: 문제집을 진입한 시각입니다.

<details>
<summary>request 예시</summary>
<pre language="json"><code class="language-json">{
    "wid": 2,
    "datetime": "2022-03-09T17:03:34Z"
}
</code></pre></details>
<br/>

성공 시 반환값은 빈 json입니다.

실패 시 처리는 다음과 같습니다.
- 401 Unauthorized: access token이 주어지지 않았거나 만료된 경우입니다.
- 400 Bad Request: request body의 형식이 옳지 않은 경우입니다.


### GET /sections/:sid (sections.js - fetchSection)

sid가 주어진 값인 섹션을 반환합니다.

성공 시 아래와 같은 형식의 json을 보냅니다.

<details>
<summary>response 예시</summary>
<pre language="json"><code class="language-json">{
    "wid": 1,
    "sid": 1,
    "index": 0,
    "title": "title",
    "detail": "detail",
    "cutoff": {},
    "sectioncover": "uuid",
    "size": 10000000,
    "audio": null,
    "audioDetail": null,
    "createdAt": "2022-02-28T17:40:26.000Z",
    "updatedAt": "2022-02-28T17:40:27.000Z",
    "views": [
        {
            "sid": 1,
            "vid": 1,
            "index": 0,
            "form": 0,
            "passage": "uuid",
            "attachment": "uuid",
            "createdAt": "2022-02-28T17:50:28.000Z",
            "updatedAt": "2022-02-28T17:50:29.000Z",
            "problems": [
                {
                    "vid": 1,
                    "pid": 1,
                    "index": 1,
                    "labelType": "문",
                    "labelNum": "1",
                    "type": 4,
                    "answer": "3",
                    "content": "uuid",
                    "explanation": "uuid",
                    "createdAt": "2022-02-28T17:54:17.000Z",
                    "updatedAt": "2022-02-28T17:54:18.000Z"
                }
            ]
        }
    ]
}
</code></pre></details>

실패 시 처리는 다음과 같습니다.
- 404 Not Found: 해당 wid에 대한 문제집이 없는 경우입니다.


### POST /submissions

유저가 문제를 풀고 필기한 내용을 제출합니다. 헤더에는 access token이 담겨있어야 합니다.

<details>
<summary>request 예시</summary>
<pre language="json"><code class="language-json">{
    "submissions": [
        {
            "pid": 721,
            "elapsed": 10,
            "answer": 5,
            "attempt": 1,
            "note": "blob"
        },
        {
            "pid": 722,
            "elapsed": 13,
            "answer": 4,
            "attempt": 1,
            "note": "blob"
        }
    ]
}
</code></pre></details>
<br/>


### POST /view-submissions

유저가 View의 passage에 필기한 내용을 제출합니다. 헤더에는 access token이 담겨있어야 합니다.

<details>
<summary>request 예시</summary>
<pre language="json"><code class="language-json">{
    "submissions": [
        {
            "vid": 680,
            "attempt": 1,
            "note": "blob"
        },
        {
            "vid": 681,
            "attempt": 1,
            "note": "blob"
        }
    ]
}
</code></pre></details>
<br/>


### GET /tags?order=popularity (tags.js - getTags)

모든 Tag를 정렬하여 반환합니다. `order`가 가질 수 있는 값은 `popularity`와 `name`입니다.
- `order=popularity`: 정렬 기준은 아래와 같습니다.
  1. 해당 태그를 FavoriteTag로 선택한 유저가 많을수록
  2. 해당 태그를 가지는 Workbook이 많을수록
  3. tid 순으로 오름차순
- `order=name`: name 순으로 오름차순
- 그 외: tid 순으로 오름차순

성공 시 아래와 같은 형식의 json을 보냅니다. count는 전체 Tag의 개수입니다. UserCount는 해당 태그를 FavoriteTag로 선택한 유저의 수이고, WorkbookCount는 해당 태그를 가지는 Workbook의 수입니다.

<details>
<summary>response 예시</summary>
<pre language="json"><code class="language-json">{
    "count": 2,
    "tags": [
        {
            "tid": 2,
            "name": "name2",
            "createdAt": "2022-03-04T06:41:51.000Z",
            "updatedAt": "2022-03-04T06:41:52.000Z",
            "UserCount": 0,
            "WorkbookCount": 1
        },
        {
            "tid": 1,
            "name": "name",
            "createdAt": "2022-03-04T06:41:51.000Z",
            "updatedAt": "2022-03-04T06:41:52.000Z",
            "UserCount": 0,
            "WorkbookCount": 0
        }
    ]
}
</code></pre></details>
<br/>


### GET /tags/self (tags.js - getMyTags)

로그인한 유저가 선택했던 태그를 반환합니다. 정렬 기준은 각 태그를 선택한 시점에 대한 오름차순입니다. response의 createdAt은 유저가 해당 태그를 선택한 시점입니다.

<details>
<summary>response 예시</summary>
<pre language="json"><code class="language-json">[
    {
        "tid": 1,
        "name": "name",
        "createdAt": "2022-04-07T16:49:43.000Z"
    },
    {
        "tid": 2,
        "name": "a",
        "createdAt": "2022-04-07T16:49:48.000Z"
    }
]
</code></pre></details>
<br/>


### PUT /tags/self (tags.js - updateMyTags)

유저가 관심있다 선택한 태그의 목록을 수정합니다. request body는 tid의 리스트입니다. 서버에서는 새로 추가되거나 삭제된 태그를 판별하여 db에 적용합니다.

<details>
<summary>request 예시</summary>
<pre language="json"><code class="language-json">[1, 3, 2]
</code></pre></details>
<br/>


### GET /pay?type=order&page=1&limit=25 (pay.js - getPayHistory)

로그인된 유저의 세모페이 이용내역을 페이지네이션하여 반환합니다. 정렬 순서는 최신순입니다.

Query String
- type: 값이 `order`일 경우 구매내역을 반환합니다. 그 외의 경우에는 전체 세모페이 이용내역(구매, 충전)을 반환합니다.
- page: 페이지네이션에서 몇 번째 페이지를 받을지입니다. 1-base이며 default value는 1입니다.
- limit: 페이지네이션에서 한 페이지에 몇 개의 PayHistory를 받을지입니다. default value는 25입니다.

Response
-  { count, history }
  - count: 총 구매목록의 길이입니다. 페이지네이션과는 관련 없는 전체 값입니다.
  - history: PayHistory의 list입니다.

<details>
<summary>response 예시</summary>
<pre language="json"><code class="language-json">{
    "count": 9,
    "history": [
        {
            "phid": 9,
            "uid": 1,
            "id": 1,
            "amount": 1000,
            "balance": 0,
            "type": "order",
            "createdAt": "2022-03-04T19:43:05.000Z",
            "updatedAt": "2022-03-04T19:43:05.000Z",
            "item": {
                "id": 1,
                "type": "workbook",
                "price": 1000,
                "sales": 22,
                "createdAt": "2022-03-03T21:23:16.000Z",
                "updatedAt": "2022-03-04T19:43:05.000Z",
                "workbook": {
                    "id": 1,
                    "wid": 1,
                    "title": "title",
                    "detail": "detail",
                    "isbn": "isbn",
                    "author": "author",
                    "date": "2022-03-04T16:39:44.000Z",
                    "publishMan": "publishMan",
                    "publishCompany": "publishCompany",
                    "originalPrice": 10000,
                    "bookcover": "50670920-68d0-47cd-be2e-cfe4e44be17c",
                    "createdAt": "2022-03-04T16:40:07.000Z",
                    "updatedAt": "2022-03-04T16:40:08.000Z"
                }
            }
        },
        {
            "phid": 7,
            "uid": 1,
            "id": 1,
            "amount": 1000,
            "balance": 1000,
            "type": "order",
            "createdAt": "2022-03-04T19:38:11.000Z",
            "updatedAt": "2022-03-04T19:38:11.000Z",
            "item": {
                "id": 1,
                "type": "workbook",
                "price": 1000,
                "sales": 22,
                "createdAt": "2022-03-03T21:23:16.000Z",
                "updatedAt": "2022-03-04T19:43:05.000Z",
                "workbook": {
                    "id": 1,
                    "wid": 1,
                    "title": "title",
                    "detail": "detail",
                    "isbn": "isbn",
                    "author": "author",
                    "date": "2022-03-04T16:39:44.000Z",
                    "publishMan": "publishMan",
                    "publishCompany": "publishCompany",
                    "originalPrice": 10000,
                    "bookcover": "50670920-68d0-47cd-be2e-cfe4e44be17c",
                    "createdAt": "2022-03-04T16:40:07.000Z",
                    "updatedAt": "2022-03-04T16:40:08.000Z"
                }
            }
        }
    ]
}
</code></pre></details>
<br/>

실패 시 처리는 다음과 같습니다.
- 401 Unauthorized: access token이 주어지지 않았거나 만료된 경우입니다.


### POST /pay/orders (pay.js - createOrders)

아이템(문제집 등)들을 세모페이를 이용해 구매합니다.

- { ids: [ id ] }
  - id: 구매하는 아이템의 id. (**wid 아님**)

<details>
<summary>request 예시</summary>
<pre language="json"><code class="language-json">{
    "ids": [1, 3, 1]
}
</code></pre></details>
<br/>

성공 시 남은 세모페이 잔액을 반환합니다.

<details>
<summary>response 예시</summary>
<pre language="json"><code class="language-json">{
    "balance": 7000
}
</code></pre></details>
<br/>

실패 시 처리는 다음과 같습니다.
- 401 Unauthorized: access token이 주어지지 않았거나 만료된 경우입니다.
- 400 Bad Request: 구매하려는 금액이 세모페이 잔액보다 많은 경우입니다. 반환값은 `NOT_ENOUGH_CREDIT`입니다.
- 400 Bad Request: request body의 형식이 틀린 경우입니다. 반환값은 `WRONG_BODY`입니다.
- 404 Not Found: 주어진 id의 Item이 존재하지 않는 경우입니다. 반환값은 `WRONG_ID`입니다.


### POST /auth/signup?expire=short (auth.js - createUser)

사용자의 정보를 받아 가입시킵니다

Query String
- expire: short로 주어질 경우 refresh token의 expire time이 3시간이 되고, 그 외의 경우(주어지지 않은 경우 포함)에는 30일입니다.

Request Body
- info: 사용자 초기 정보입니다. 다음과 같은 객체입니다.
  - `{ username, phone, school, major, majorDetail, favoriteTags, graduationStatus }`
  - username: 닉네임입니다. unique해야합니다.
  - phone: `+82-10-1234-5678`과 같은 형식입니다.
  - favoriteTags: `[1, 2]`와 같은 형식으로 tid들의 목록입니다.
- token: 사용자 식별 토큰입니다.
- type: 소셜로그인 타입입니다. 그 값은 "google" 또는 "apple"입니다.

<details>
<summary>request 예시</summary>
<pre language="json"><code class="language-json">{
    "info": {
        "username": "username",
        "phone": "+82-10-0000-0000",
        "school": "서울대학교",
        "major": "이과 계열",
        "majorDetail": "공학",
        "graduationStatus": "재학",
        "favoriteTags": [1, 4]
    },
    "token": "eyJhb...",
    "type": "google"
}
</code></pre>
</details>
<br/>

성공 시 반환값은 JSON이며, `{ "accessToken": "asdf", "refreshToken": "abcd" }`와 같이 access token과 refresh token을 담은 객체입니다.

실패 시 처리는 다음과 같습니다.

- 400 Bad Request: type이 "google" 또는 "apple"이 아닌 경우입니다. 반환값은 `WRONG_TYPE`입니다.
- 400 Bad Request: 해당 토큰으로 가입한 유저가 이미 존재하는 경우입니다. 반환값은 `USER_ALREADY_EXISTS`입니다.
- 400 Bad Request: 토큰이 유효하지 않은 경우입니다. 반환값은 `INVALID_TOKEN`입니다.
- 400 Bad Request: 유저 정보가 유효하지 않은 경우입니다. 에러 내역을 반환합니다.
- 409 Conflict: 이미 사용중인 username인 경우입니다. 반환값은 `USERNAME_NOT_AVAILABLE` 입니다.


### POST /auth/login?expire=short (auth.js - login)

google 또는 apple 토큰을 통해 로그인을 합니다.

Query String
- expire: short로 주어질 경우 refresh token의 expire time이 3시간이 되고, 그 외의 경우(주어지지 않은 경우 포함)에는 30일입니다.

Request Body
- token: google 또는 apple 토큰입니다.
- type: "google", "apple" 또는 "legacy"의 값입니다. "legacy"는 1.0에서 가입한 유저가 2.0에서 로그인을 하는 경우입니다.

성공 시 반환값은 JSON이며, `{ "accessToken": "asdf", "refreshToken": "abcd" }`와 같이 access token과 refresh token을 담은 객체입니다.

실패 시 처리는 다음과 같습니다.
- 400 Bad Request: type이 "google", "apple" 또는 "legacy"가 아닌 경우입니다. 반환값은 `WRONG_TYPE`입니다.
- 400 Bad Request: 토큰 파싱에 실패한 경우입니다.
- 400 Bad Request: 해당 토큰으로 가입한 유저가 없는 경우입니다. 반환값은 `USER_NOT_EXIST`입니다.


### GET /auth/refresh?expire=short (auth.js - refresh)

만료된 accessToken과 만료되지 않은 refreshToken을 통해 새로운 accessToken과 refreshToken을 생성합니다. 이전 refreshToken은 폐기됩니다.

Header
- authorization: `Bearer aaa.bbb.ccc.`
  - accessToken을 일반적인 Bearer token과 같은 형태로 담습니다.
- refresh: `rrr.bbb.ccc`

Query String
- expire: short로 주어질 경우 refresh token의 expire time이 3시간이 되고, 그 외의 경우(주어지지 않은 경우 포함)에는 30일입니다.

성공 시 반환값은 JSON이며, `{ "accessToken": "asdf", "refreshToken": "abcd" }`와 같이 access token과 refresh token을 담은 객체입니다.
accessToken과 refreshToken 모두 새로 생성된 값입니다.

실패 시 처리는 다음과 같습니다.
- 400 Bad Request: 토큰을 재발급해줄 수 없는 경우입니다. 반환값은 다음과 같습니다.
  - `access token missing`: refreshToken이 header에 주어지지 않은 경우입니다.
  - `refresh token expired`: refreshToken이 만료된 경우입니다. 유저에게 다시 로그인하기를 요청하면 됩니다.
  - `failed to decode refresh token`: refreshToken이 옳지 않은 경우입니다.
  - `access token missing`: header에 accessToken이 주어지지 않거나 그 형식 (`Bearer abcd`)이 옳지 않은 경우입니다.
  - `access token not expired`: accessToken이 만료되지 않은 경우입니다.
  - `failed to decode access token`: accessToken이 옳지 않은 경우입니다.
  - `access token and refresh token not match`: accessToken과 refreshToken의 쌍이 서버에서 알고 있는 것과 일치하지 않는 경우입니다. 간혹 서버 측에서 토큰 정보가 유실되어 해당 에러가 발생할 수 있습니다.


### POST /sms/code (sms.js - sendCode)

사용자의 전화번호를 받은 후 해당 번호로 인증 코드를 전송합니다.

같은 전화번호에 1시간 이내의 간격으로 요청을 보내는 것은 10회로 제한됩니다. 10회 초과 시 1시간이 경과할 때까지는 status code 429를 반환합니다.

인증 코드는 5분이 지나면 삭제됩니다.

- phone: 사용자의 전화번호입니다. string이며, 형식을 만족시켜야 합니다.

<details>
<summary>request 예시</summary>
<pre language="json"><code class="language-json">{
    "phone": "+82-10-1234-5678"
}
</code></pre></details>

성공 시 반환값은 JSON이며, 빈 객체입니다.

실패 시 처리는 다음과 같습니다.

- 400 Bad Request: phone 필드가 body에 주어지지 않은 경우입니다. 반환값은 `PHONE_MISSING`입니다.
- 400 Bad Request: phone 의 형식이 맞지 않은 경우입니다. 반환값은 `PHONE_WRONG_FORMAT`입니다.
- 429 Too Many Requests: 인증 요청 횟수가 제한을 초과한 경우입니다.


### POST /sms/code/verify (sms.js - verifyCode)

사용자의 전화번호와 인증 코드를 받아 올바른 인증 코드인지 확인합니다.

- { phone, code }

<details>
<summary>request 예시</summary>
<pre language="json"><code class="language-json">{
    "phone": "+82-10-1234-5678",
    "code": "123123"
}
</code></pre></details>

성공 시 반환값은 JSON이며, 아래의 두 경우 중 하나입니다.
- 옳은 코드: `{ result: true }`
- 틀린 코드: `{ result: false }`

실패 시 처리는 다음과 같습니다.
- 400 Bad Request: phone 필드가 body에 주어지지 않은 경우입니다. 반환값은 `PHONE_MISSING`입니다.
- 400 Bad Request: phone 의 형식이 맞지 않은 경우입니다. 반환값은 `PHONE_WRONG_FORMAT`입니다.


### GET /users/self

해당 요청을 한 사용자 본인의 정보를 반환합니다. 헤더의 Authorization 필드에 access token이 `Bearer aaaa`와 같은 형태로 주어져야 합니다.

성공 시 반환값은 JSON이며, 아래 예시와 같은 객체입니다.
- username: 닉네임
- name: 실제 이름 (결제에 이용되는 정보)

<details>
<summary>response 예시</summary>
<pre language="json"><code class="language-json">{
    "uid": 1,
    "username": "yujin",
    "credit": 97000,
    "createdAt": "2022-03-03T21:22:20.000Z",
    "updatedAt": "2022-04-09T07:31:23.000Z",
    "name": "임유진",
    "email": "email@gmail.com",
    "address": "",
    "addressDetail": "",
    "birth": "2001-01-01T00:00:00.000Z",
    "phone": "+82-10-1234-5678",
    "major": "이과 계열",
    "majorDetail": "의약",
    "school": "서울대학교",
    "graduationStatus": "재학",
    "marketing": 1
}
</code></pre></details>
<br/>

실패 시 처리는 다음과 같습니다.

- 404 Not Found: 해당되는 유저가 없는 경우입니다. 정상적으로 서버에서 발급받은 access token이라면, 해당 access token이 발급된 후 유저가 탈퇴한 경우일 것입니다.

### PUT /users/self

로그인된 유저가 자신의 정보를 수정합니다. 헤더의 Authorization 필드에 access token이 `Bearer aaaa`와 같은 형태로 주어져야 합니다.

body에는 아래와 같은 값들이 주어져야 합니다. 전부 optional하며, 옳지 않거나 변경할 수 없는 key 값들은 무시됩니다.

<details>
<summary>request 예시</summary>
<pre language="json"><code class="language-json">{
    "username": "yujin",
    "name": "임유진",
    "email": "email@gmail.com",
    "birth": "2001-01-01T00:00:00Z",
    "phone": "+82-10-1234-5678",
    "major": "이과 계열",
    "majorDetail": "의약",
    "address": "주소",
    "addressDetail": "상세주소",
    "school": "서울대학교",
    "graduationStatus": "재학",
    "marketing": 1
}
</code></pre></details>
<br/>

성공 시 반환값은 JSON이며, 빈 객체입니다.

실패 시 처리는 다음과 같습니다.
- 400 Bad Request: 주어진 유저 정보가 옳지 않은 경우입니다. 반환값은 빈 스트링 혹은 에러 메시지입니다.
- 409 Conflict: username을 수정하려 하였으나 다른 유저와 겹치는 경우입니다. 반환값은 `username not available`입니다.


### GET /users/username?username=username

해당 username을 사용할 수 있는지 확인합니다.

성공 시 반환값은 json이며, 사용할 수 있는 username의 경우에는 `{ "result": true }`를, 이미 사용된 username의 경우에는 `{ "result": false }`를 반환합니다.

실패 시 처리는 다음과 같습니다.
- 400 Bad Request: Query string으로 username이 주어지지 않은 경우입니다.


### DELETE /users/self

로그인된 유저가 탈퇴합니다. 유저의 정보가 영구 삭제되는 것은 아니지만, 기능 상으로는 삭제된 것과 같은 결과입니다. (soft-delete)


### GET /s3/presignedUrl?uuid=uuid&type=type
특정 uuid의 파일을 조회하기 위한 url을 조회합니다. url은 1시간(3600초)가 경과될 경우 expire됩니다. 해당 유저가 파일에 대한 열람 권한을 가지고 있지 않을 경우 status code 403을 반환합니다.

- uuid: 조회하고자 하는 파일의 uuid입니다. 파일 확장자 없이 36자의 string입니다.
- type: `bookcover`, `sectioncover`, `passage`, `explanation`, `content` 중 하나의 값입니다. 조회하고자 하는 파일의 종류를 나타냅니다.

반환값은 url string입니다. (**JSON 아님**)


### GET /notices
공지사항의 리스트를 받아옵니다. 정렬 기준은 createdAt에 대한 내림차순입니다.

<details>
<summary>response 예시</summary>
<pre language="json"><code class="language-json">[
    {
        "nid": 1,
        "title": "제목",
        "text": "내용",
        "image": null,
        "createdAt": "2022-04-07T08:09:57.000Z",
        "updatedAt": "2022-04-07T08:09:59.000Z"
    },
    {
        "nid": 2,
        "title": "서버 점검 공지",
        "text": "서버 점검이 있을 예정입니다~~",
        "image": null,
        "createdAt": "2022-04-07T08:09:57.000Z",
        "updatedAt": "2022-04-07T08:09:59.000Z"
    }
]
</code></pre></details>
<br/>


### GET /banners
앱의 배너에 띄울 정보를 가져옵니다.

- image: 배너 이미지의 url입니다. presignedUrl과 달리, 만료되지 않는 url입니다.
- url: 배너 이미지를 터치했을 때 연결되어야 하는 링크입니다.

<details>
<summary>response 예시</summary>
<pre language="json"><code class="language-json">[
    {
        "image": "https://semomun-data.s3.ap-northeast-2.amazonaws.com/banner/semopay.png",
        "url": "https://semomun.com/charge"
    },
    {
        "image": "https://semomun-data.s3.ap-northeast-2.amazonaws.com/banner/skyon.png",
        "url": "https://skyon.kr"
    },
    {
        "image": "https://semomun-data.s3.ap-northeast-2.amazonaws.com/banner/error.png",
        "url": "https://forms.gle/suXByYKEied6RcSd8"
    }
]
</code></pre></details>
<br/>


### GET /popups
팝업 공지로 띄울 이미지의 url을 가져옵니다. 그 반환값은 이미지의 url 또는 `null`입니다. url은 presignedUrl과 달리 만료되지 않습니다.

<details>
<summary>response 예시</summary>
예시 1
<pre language="json"><code class="language-json">https://semomun-data.s3.ap-northeast-2.amazonaws.com/banner/semopay.png
</code></pre>

예시 2
<pre language="json"><code class="language-json">null
</code></pre></details>
<br/>


### POST /error-reports
문제 오류를 제보합니다. access token을 필요로 합니다. 해당 내용은 db에 저장되며, 슬랙 메시지로도 보내집니다.

<details>
<summary>request 예시</summary>
<pre language="json"><code class="language-json">{
    "pid": 721,
    "content": "오타가 있어요"
}
</code></pre></details>
<br/>


### POST /upload/config
문제집 업로드를 위해서 우선 config.yaml을 서버에 제출하는 api입니다. `ADMIN` role을 가진 유저만이 사용할 수 있습니다.

request body에는 form-data 형식으로, key `config`에 config.yaml 파일을 보냅니다.

response body는 이미지 파일들을 올릴 presignedPost에 대한 정보를 보냅니다.
- urls: presignedPost에 대한 정보
    - url: presignedPost에 대한 정보
    - file: 해당 post에 올려야 하는 파일의 이름
- key: 업로드한 config.yaml의 키

<details>
<summary>response 예시</summary>
<pre language="json"><code class="language-json">{
    {
            "s3": {
                "url": "https://s3.ap-northeast-2.amazonaws.com/semomun-data",
                "fields": {
                    "key": "explanation/34806c51-bc7f-40a1-800d-c3c5a03f6663",
                    "bucket": "semomun-data",
                    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
                    "X-Amz-Credential": "AKIATGCVP2/20220503/ap-northeast-2/s3/aws4_request",
                    "X-Amz-Date": "20220503T091803Z",
                    "Policy": "eyJleHBpcmF0aW9uIjoiMjAyMi0wNS0wM",
                    "X-Amz-Signature": "edb2002037242f193a2592b"
                }
            },
            "file": "img_3090030.png"
        }
    ],
    "key": "894e6672921a51d11b9a6d7eddedd7af"
}
</code></pre></details>

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
    `birth` TIMESTAMP,
    `googleId` VARCHAR(256),                                                       /* 구글 소셜로그인 id                */
    `appleId` VARCHAR(256),                                                        /* 애플 소셜로그인 id                */
    `phone` VARCHAR(32) NOT NULL,                                                  /* 전화번호, 국가코드 포함            */
    `major` VARCHAR(32) NOT NULL,                                                  /* 계역                           */
    `majorDetail` VARCHAR(32) NOT NULL,                                            /* 전공                          */
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
    `note` MEDIUMBLOB NOT NULL,                                                          /* 필기                            */
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

요청한 사용자가 열람 권한을 가지고 있으며 검색 조건과 맞는 문제집의 목록을 반환합니다. 현재는 모든 문제집을 반환합니다.

성공 시 반환값은 JSON이며, 다음과 같은 객체입니다.

- { count, workbooks }
  - count: 주어진 조건에 맞는 문제집의 개수입니다. sort 혹은 page에 영향을 받지 **않습니다**.
  - workbooks: 문제집의 배열입니다.



### POST /auth/signup (auth.js - createUser)

사용자의 정보를 받아 가입시킵니다

- info: 사용자 초기 정보입니다. 다음과 같은 객체입니다.
  - `{ nickname, phone, school, major, majorDetail, favoriteTags, graduationStatus }`
  - phone: `+82-10-1234-5678`과 같은 형식입니다.
  - favoriteTags: `[1, 2]`와 같은 형식으로 tid들의 목록입니다.
- token: 사용자 식별 토큰입니다.
- type: 소셜로그인 타입입니다. 그 값은 "google" 또는 "apple"입니다.
<details>
<summary>example</summary>
<pre><code class="language-json">{
    "info": {
        "nickname": "nickname1",
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
- 400 Bad Request: 토큰이 유효하지 않은 경우입니다.
- 400 Bad Request: 유저 정보가 유효하지 않은 경우입니다. 에러 내역을 반환합니다.
- 409 Conflict: 이미 사용중인 닉네임인 경우입니다. 반환값은 `NICKNAME_NOT_AVAILABLE` 입니다.
- 409 Conflict: 이미 사용중인 전화번호인 경우입니다. 반환값은 `PHONE_NOT_AVAILABLE` 입니다.


### POST /auth/login (auth.js - login)

google 또는 apple 토큰을 통해 로그인을 합니다.
- token: google 또는 apple 토큰입니다.
- type: "google" 또는 "apple"의 값입니다.

성공 시 반환값은 JSON이며, `{ "accessToken": "asdf", "refreshToken": "abcd" }`와 같이 access token과 refresh token을 담은 객체입니다.

실패 시 처리는 다음과 같습니다.
- 400 Bad Request: type이 "google" 또는 "apple"이 아닌 경우입니다. 반환값은 `WRONG_TYPE`입니다.
- 400 Bad Request: 토큰 파싱에 실패한 경우입니다.
- 400 Bad Request: 해당 토큰으로 가입한 유저가 없는 경우입니다. 반환값은 `USER_NOT_EXIST`입니다.


### GET /auth/refresh (auth.js - refresh)

만료된 accessToken과 만료되지 않은 refreshToken을 통해 새로운 accessToken과 refreshToken을 생성합니다. 이전 refreshToken은 폐기됩니다.

**헤더**에 다음과 같은 값을 담아야 합니다.
- authorization: `Bearer aaa.bbb.ccc.`
  - accessToken을 일반적인 Bearer token과 같은 형태로 담습니다.
- refresh: `rrr.bbb.ccc`

성공 시 반환값은 JSON이며, `{ "accessToken": "asdf", "refreshToken": "abcd" }`와 같이 access token과 refresh token을 담은 객체입니다.
accessToken과 refreshToken 모두 새로 생성된 값입니다.

실패 시 처리는 다음과 같습니다.
- 400 Bad Request: 토큰이 주어지지 않았거나, 파싱에 실패했거나, 서버에서 알고 있는 값이 아니거나, accessToken이 만료되지 않았거나, refreshToken이 만료된 경우에 해당합니다. 정상적인 로직 상에서 (해커의 공격이 아닌) status code 400을 받았다면 그것은 refreshToken의 expire time인 30일이 경과하여 로그인이 풀린 것입니다.


### ~~POST /register/auth (register.js - send_code)~~

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



### ~~POST /register/verify (register.js - check_code)~~

사용자의 전화번호와 인증 코드를 받아 DB와 대조한 후 인증 여부를 판단합니다.

- { phone, code }

성공 시 반환값은 JSON이며, 빈 객체입니다.

실패 시 처리는 다음과 같습니다.

- 400 Bad Request: 해당 전화번호가 존재하지 않거나, `POST /register/auth` 를 통해 전송한 코드와 사용자의 입력이 일치하지 않는 경우입니다.



### GET /sections/:sid

요청한 사용자가 해당 섹션의 열람 권한이 있는 경우, 해당 섹션을 반환합니다.

성공 시 반환값은 JSON이며, 다음과 같은 객체입니다.

- [ view1, view2, ... ]: 섹션에 포함된 뷰의 배열입니다.


### ~~GET /info/category~~

문제집이 속한 카테고리의 목록을 반환합니다.

정렬 기준은 현재는 무작위입니다.

성공 시 반환값은 JSON이며, 다음과 같은 객체입니다.

- { category }


### ~~GET /info/buttons~~

문제집이 속한 카테고리의 버튼 정보를 반환합니다.

- c(ategory)

성공 시 반환값은 JSON이며, 다음과 같은 객체입니다.

- { queryButtons }
  - queryButtons: 카테고리의 버튼 정보입니다. 다음과 같은 객체입니다.
    - { title, queryParamKey, queryParamValues }
      - queryParamValues: 카테고리에 포함된 각 attr의 목록입니다.


### ~~GET /info/major~~

회원 가입 시 요구되는 계열 및 전공의 목록입니다.

- { major }
  - major: 계열의 목록입니다. 각 계열은 다음과 같이 구성되어 있습니다.
    - { majorName: majorDetail }
      - majorDetail: 세부 전공의 목록입니다.

현재는 아래와 같은 json이 항상 반환됩니다.

```json
{ major: [{ '문과 계열': ['인문', '상경', '사회', '교육', '기타'] }, { '이과 계열': ['공학', '자연', '의약', '생활과학', '기타'] }, { 예체능계열: ['미술', '음악', '체육', '기타'] }] }
```

### ~~GET /users/self~~

해당 요청을 한 사용자 본인의 정보를 반환합니다.

- { token }

성공 시 반환값은 JSON이며, 다음과 같은 객체입니다.

- { uid, name, nickName, gender, phone, school, major, majorDetail, favoriteCategory, graduationStatus, birthday, profileImage }

실패 시 처리는 다음과 같습니다.

- 404: 해당 사용자가 존재하지 않는 경우입니다. 반환값은 빈 문자열입니다.

### ~~PUT /users/:uid~~

요청한 사용자가 ~~admin에 속하거나~~ 해당 사용자 본인일 경우, 해당 사용자의 정보를 변경합니다.

- { info, token }
  - info: 사용자가 변경할 정보입니다. 다음과 같은 정보를 변경할 수 있습니다.
    - { gender, school, major, majorDetail, favoriteCategory, graduationStatus, birthday }

성공 시 반환값은 JSON이며, 빈 객체입니다.

실패 시 처리는 다음과 같습니다.

- ~~401: 인증되지 않은 사용자인 경우입니다. 반환값은 빈 문자열입니다.~~
- 403: 요청한 사용자가 admin이 아니며 해당 user도 아닌 경우입니다. 반환값은 빈 문자열입니다.
- 404: 해당 사용자가 존재하지 않는 경우입니다. 반환값은 빈 문자열입니다.

### ~~PUT /sections/:sid/submit~~


### GET /s3/presignedUrl?uuid=uuid&type=type
특정 uuid의 파일을 조회하기 위한 url을 조회합니다. url은 1시간(3600초)가 경과될 경우 expire됩니다. 해당 유저가 파일에 대한 열람 권한을 가지고 있지 않을 경우 status code 403을 반환합니다.

- uuid: 조회하고자 하는 파일의 uuid입니다. 파일 확장자 없이 36자의 string입니다.
- type: `bookcover`, `sectioncover`, `material`, `explanation`, `content` 중 하나의 값입니다. 조회하고자 하는 파일의 종류를 나타냅니다.

반환값은 url string입니다. (**JSON 아님**)


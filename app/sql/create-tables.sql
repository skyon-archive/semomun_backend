-- 사용자 --
CREATE TABLE `Users` (
    `uid` INT NOT NULL AUTO_INCREMENT,                                             /* 식별자                          */
    `username` VARCHAR(256) NOT NULL,                                              /* 아이디                          */
    `name` VARCHAR(256) NOT NULL,                                                  /* 실명                          */
    `email` VARCHAR(256) NOT NULL,                                                 /* 이메일                         */
    `gender` VARCHAR(32) NOT NULL,                                                 /* 성별                          */
    `birth` DATETIME,                                                              /* 생일                          */
    `googleId` VARCHAR(256),                                                       /* 구글 소셜로그인 id                */
    `appleId` VARCHAR(256),                                                        /* 애플 소셜로그인 id                */
    `phone` VARCHAR(32) NOT NULL,                                                  /* 전화번호, 국가코드 포함            */
    `major` VARCHAR(32) NOT NULL,                                                  /* 계역                           */
    `majorDetail` VARCHAR(32) NOT NULL,                                            /* 전공                          */
    `degree` VARCHAR(256) NOT NULL,                                                /* 학력                           */
    `degreeStatus` VARCHAR(32) NOT NULL,                                           /* 재학 상태                       */
    `credit` INT NOT NULL,                                                         /* 보유 캐시, 종속성 관리 필요        */
    `auth` INT NOT NULL,                                                           /* 유저 권한                       */
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (`username`),
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
)

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

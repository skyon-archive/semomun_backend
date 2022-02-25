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
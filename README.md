# 제덮 블로그
주로 개발 관련된 이야기를 적는 저의 개인 블로그입니다.  
웹사이트 주소: https://blog.jedeop.dev

# 구조
### 프론트엔드 ([/frontend](/frontend))
프론트엔드는 React로 이루어져 있습니다. SSR + Rehydration 방식을 사용합니다. Apollo를 이용해 백엔드 서버와 통신합니다.

### 백엔드 ([/backend](/backend))
백엔드는 Rust로 개발되었습니다. tide crate와 async-graphql crate를 사용해 GraphQL 방식으로 API를 제공합니다.

### 데이터베이스
PostgreSQL을 사용합니다.

### 웹서버 ([/proxy](/proxy))
웹서버는 Caddy를 사용합니다. 모든 HTTP 요청은 Caddy를 거쳐가며 요청 주소에 따라 프론트엔드나 백엔드로 reverse proxy 하거나 정적 파일을 제공하는 역할을 합니다.

# 실행하기
### 환경 변수 설정하기
프로젝트 루트의 `*.env.example` 파일들을 복사해 파일 이름을 `*.env`로 바꾸고 비어있는 환경 변수 값을 적당한 값으로 채워주세요. 
`docker-compose.yml` 또는 `prod.docker-compose.yml` 파일 안의 환경 변수도 적당한 값으로 바꿔주세요.  

### 개발용 서버 실행하기
다음 명령어로 개발용 서버를 열 수 있습니다. `https://localhost`에 개발용 서버가 열립니다.
```sh
docker-compose up -d
```

### 프로덕션용 서버 실행하기
다음 명령어로 프로덕션용 서버를 열 수 있습니다. GitHub Packages에서 이미지를 pull합니다.
SSL 인증서 발급을 위해 `80`, `443` 포트가 둘 다 열려 있어야 합니다.
```sh
docker-compose --file prod.docker-compose.yml up -d
```

# Shopping Mall Server

Node.js, Express, MongoDB를 사용한 쇼핑몰 백엔드 서버입니다.

## 기술 스택

- **Node.js** - JavaScript 런타임
- **Express.js** - 웹 프레임워크
- **MongoDB** - NoSQL 데이터베이스
- **Mongoose** - MongoDB ODM

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env` 파일을 생성하고 다음 내용을 추가하세요:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shopping-mall
JWT_SECRET=your-super-secret-jwt-key-here
CLIENT_URL=http://localhost:3000
```

### 3. MongoDB 실행
로컬 MongoDB가 실행 중인지 확인하세요. 또는 MongoDB Atlas를 사용할 수 있습니다.

### 4. 서버 실행
```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

## API 엔드포인트

### 기본
- `GET /` - 서버 상태 확인
- `GET /api/status` - API 상태 확인

### 향후 추가될 기능
- 사용자 인증 (회원가입, 로그인)
- 상품 관리 (CRUD)
- 주문 관리
- 장바구니 기능

## 프로젝트 구조

```
server/
├── config/
│   ├── config.js          # 설정 파일
│   └── database.js        # MongoDB 연결
├── models/
│   ├── User.js           # 사용자 모델
│   └── Product.js        # 상품 모델
├── routes/
│   └── api.js            # API 라우터
├── server.js             # 메인 서버 파일
├── package.json          # 의존성 및 스크립트
└── README.md             # 프로젝트 문서
```

## 보안 기능

- Helmet.js를 통한 보안 헤더 설정
- CORS 설정
- 요청 제한 (Rate Limiting)
- 입력 데이터 검증

## 개발 가이드

1. 새로운 기능을 추가할 때는 `routes/` 폴더에 라우터를 생성하세요.
2. 데이터 모델은 `models/` 폴더에 정의하세요.
3. 환경변수는 `config/config.js`에서 관리하세요.
4. 코드 스타일은 일관성을 유지하세요.

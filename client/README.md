# COS Shopping Mall

React와 Node.js 기반의 풀스택 이커머스 쇼핑몰 웹 애플리케이션입니다.

## 주요 기능

### 고객
- 상품 목록 및 상세 정보 조회
- 추천 상품 섹션
- 장바구니 관리
- 포트원 결제 시스템
- 주문 내역 및 상태 조회

### 관리자
- 상품 등록 / 수정 / 삭제
- 재고 관리
- 주문 관리 및 상태 변경
- 추천 상품 설정
- 대시보드

## 기술 스택

### Frontend
- React 18
- Vite
- React Router
- Context API

### Backend
- Node.js
- Express
- MongoDB / Mongoose
- JWT 인증

### 외부 서비스
- Cloudinary (이미지 호스팅)
- 포트원(PortOne) (결제)
- MongoDB Atlas (클라우드 DB)

## 설치 및 실행

### 1. 의존성 설치
```bash
# 클라이언트
cd client
npm install

# 서버
cd ../server
npm install
```

### 2. 환경 변수 설정
`server/.env` 및 `client/.env` 파일을 생성하고 필요한 환경 변수를 설정하세요.

### 3. 실행
```bash
# 서버 실행 (포트 5000)
cd server
npm run dev

# 클라이언트 실행 (포트 5173)
cd client
npm run dev
```

## 프로젝트 구조

```
shopping-mall/
├── client/              # React 프론트엔드
│   ├── src/
│   │   ├── components/ # 컴포넌트
│   │   ├── pages/      # 페이지
│   │   ├── contexts/   # Context API
│   │   ├── hooks/      # 커스텀 훅
│   │   └── styles/     # CSS
│   └── public/
│
└── server/             # Express 백엔드
    ├── config/        # 설정
    ├── controllers/   # 컨트롤러
    ├── models/        # Mongoose 모델
    ├── routes/        # API 라우트
    └── middleware/    # 미들웨어
```

## 라이선스

이 프로젝트는 개인 학습 및 포트폴리오 용도로 제작되었습니다.

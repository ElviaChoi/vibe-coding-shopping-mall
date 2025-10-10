# 🛍️ SHOPPING MALL

온라인 쇼핑몰 플랫폼 - React와 Node.js를 활용한 풀스택 웹 애플리케이션

## 📋 프로젝트 개요

현대적인 온라인 쇼핑몰 플랫폼으로, 사용자 친화적인 인터페이스와 관리자 기능을 제공합니다. 상품 관리, 주문 처리, 사용자 인증 등 전반적인 이커머스 기능을 구현했습니다.

## 🚀 주요 기능

### 👤 사용자 기능
- **회원가입/로그인** - JWT 기반 인증 시스템
- **상품 조회** - 카테고리별 상품 검색 및 필터링
- **장바구니** - 상품 추가/삭제 및 수량 조절
- **주문 관리** - 주문 생성, 조회, 상태 추적
- **프로필 관리** - 개인정보 및 주소 관리

### 👨‍💼 관리자 기능
- **상품 관리** - 상품 등록, 수정, 삭제
- **주문 관리** - 주문 상태 변경 및 처리
- **사용자 관리** - 회원 정보 조회 및 관리
- **이미지 업로드** - Cloudinary 연동

## 🛠️ 기술 스택

### Frontend
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-18.17.0-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

### External Services
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

## 📁 프로젝트 구조

```
shopping-mall/
├── client/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── hooks/          # 커스텀 훅
│   │   ├── contexts/       # React Context
│   │   ├── utils/          # 유틸리티 함수
│   │   └── styles/         # CSS 스타일
│   └── package.json
├── server/                 # Node.js 백엔드
│   ├── controllers/        # 컨트롤러
│   ├── models/            # 데이터베이스 모델
│   ├── routes/            # API 라우트
│   ├── middleware/        # 미들웨어
│   └── package.json
└── README.md
```

## 🚀 시작하기

### Prerequisites
- Node.js 18.17.0 이상
- MongoDB
- Cloudinary 계정 (이미지 업로드용)

### 설치 및 실행

1. **저장소 클론**
```bash
git clone https://github.com/ElviaChoi/vibe-coding-shopping-mall.git
cd shopping-mall
```

2. **백엔드 설정**
```bash
cd server
npm install
npm run dev
```

3. **프론트엔드 설정**
```bash
cd client
npm install
npm run dev
```

4. **환경 변수 설정**
```bash
# server/.env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# client/.env
VITE_API_URL=http://localhost:5000/api
```

## 📱 주요 페이지

- **메인 페이지** - 상품 소개 및 추천 상품
- **상품 목록** - 카테고리별 상품 조회
- **상품 상세** - 상품 정보 및 구매 옵션
- **장바구니** - 선택한 상품 관리
- **주문 페이지** - 결제 및 배송 정보 입력
- **관리자 대시보드** - 상품 및 주문 관리

## 🔧 개발 환경

- **개발 서버**: Vite Dev Server (포트 5173)
- **API 서버**: Express Server (포트 5000)
- **데이터베이스**: MongoDB
- **이미지 저장**: Cloudinary CDN

---

**개발자**: [최시영]  
**이메일**: elvia924@gmail.com  
**프로젝트 기간**: 2025년 09월 22일 ~ 2025년 10월 10일

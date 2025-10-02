require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const config = require('./config/config');
const apiRoutes = require('./routes/api');

const app = express();

connectDB();

app.use(helmet());

app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
});
app.use(limiter);

if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.json({
    message: 'Shopping Mall API 서버가 정상적으로 실행 중입니다.',
    version: '1.0.0',
    environment: config.NODE_ENV
  });
});

app.use('/api', apiRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '요청한 리소스를 찾을 수 없습니다.'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: config.NODE_ENV === 'development' ? err.message : '서버 내부 오류가 발생했습니다.'
  });
});

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`환경: ${config.NODE_ENV}`);
  console.log(`클라이언트 URL: ${config.CLIENT_URL}`);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const userRouter = require('./routers/userRouter');
const loanRouter = require('./routers/loanRouter');
const loanApplicationRouter = require('./routers/loanApplicationRouter');
require('dotenv').config();

const app = express();

app.disable('x-powered-by');

const allowedOrigin = process.env.ORIGIN_URL;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: allowedOrigin,
  methods: ['PUT', 'POST', 'DELETE', 'GET'],
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set strictQuery to false to suppress deprecation warning
mongoose.set('strictQuery', false);

const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected successfully');

    app.use('/', userRouter);
    app.use('/loans', loanRouter);
    app.use('/loanApplication', loanApplicationRouter);

    const port = process.env.PORT1 || 8080;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

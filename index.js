const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

// إعداد التطبيق
const app = express();
const port = process.env.PORT || 9000;

// اتصال بقاعدة بيانات MongoDB Atlas باستخدام متغير البيئة
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/local_database';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Atlas connected');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err.message);
  });

// تعريف نموذج السؤال
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  a: { type: String, required: true },
  b: { type: String, required: true },
  c: { type: String, required: true },
  d: { type: String, required: true },
  correct: { type: String, required: true }
});

const Question = mongoose.model('Question', questionSchema);

// إعداد استخدام الـ CORS و Body Parser
const corsOptions = {
  origin: 'https://quiz-ruddy-three.vercel.app', // أو النطاق الذي تستخدمه في التطبيق
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// واجهة برمجة التطبيقات (API) لإضافة سؤال
app.post('/questions', async (req, res) => {
  try {
    const { question, a, b, c, d, correct } = req.body;
    const newQuestion = new Question({ question, a, b, c, d, correct });
    await newQuestion.save();
    console.log('Question added successfully:', newQuestion);
    res.status(201).json(newQuestion); // إعادة حالة 201 للإنشاء
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ error: error.message });
  }
});

// واجهة برمجة التطبيقات (API) للحصول على الأسئلة
app.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// واجهة برمجة التطبيقات (API) لحذف جميع الأسئلة
app.delete('/questions', async (req, res) => {
  try {
    await Question.deleteMany({});
    res.status(200).send('All questions have been deleted.');
  } catch (error) {
    res.status(500).send('An error occurred while deleting questions.');
  }
});

// بدء الخادم
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
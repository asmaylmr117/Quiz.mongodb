const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // إصلاح الخطأ في كتابة "config"

// إعداد التطبيق
const app = express();
const port = process.env.PORT || 9000; // استخدم المنفذ من المتغيرات البيئية أو 9000 افتراضياً

// اتصال بقاعدة بيانات MongoDB Atlas باستخدام متغير البيئة
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/local_database';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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
app.use(cors());
app.use(bodyParser.json());

// واجهة برمجة التطبيقات (API) لإضافة سؤال
app.post('/questions', async (req, res) => {
  try {
    const { question, a, b, c, d, correct } = req.body;
    const newQuestion = new Question({ question, a, b, c, d, correct });
    await newQuestion.save();
    console.log('Question added successfully:', newQuestion);
    res.json(newQuestion);
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
  console.log(`Server is running on http://localhost:${port}`);
});

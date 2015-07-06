var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/* GET Authors page. */
router.get('/author', function(req, res) {
  res.render('author', { title: 'Autores' });
});

router.get('/quizzes/question', quizController.question);
router.get('/quizzes/answer', quizController.answer);

module.exports = router;

var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

/* GET Authors page. */
router.get('/author', function(req, res) {
  res.render('author', { title: 'Autores', errors: [] });
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);  // autoload :quizId


router.get('/quizzes',                      quizController.index);
router.get('/quizzes/:quizId(\\d+)',        quizController.show);
router.get('/quizzes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizzes/new',                  quizController.new);
router.post('/quizzes/create',              quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit',   quizController.edit);
router.put('/quizzes/:quizId(\\d+)',        quizController.update);
module.exports = router;

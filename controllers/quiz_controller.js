var models = require('../models/models.js');

// GET quizzes/question
exports.index = function( req, res) {
    models.Quiz.findAll().success(function(quizzes) {
        res.render('quizzes/index.ejs', { quizzes: quizzes });
    })
}

// GET quizzes/:id
exports.show = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) {
    res.render('quizzes/show', { quiz: quiz});
  })
};

// GET /quizzes/:id/answer
exports.answer = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) {
    if (req.query.respuesta === quiz.respuesta) {
      res.render('quizzes/answer', 
                 { quiz: quiz, respuesta: 'Correcto' });
    } else {
      res.render('quizzes/answer', 
                 { quiz: quiz, respuesta: 'Incorrecto'});
    }
  })
};

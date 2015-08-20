var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
    models.Quiz.find({
      where: {
          id: Number(quizId)
      },
      include: [{
          model: models.Comment
      }]
    }).then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET quizzes/question
exports.index = function( req, res) {
   if (req.query.search || "") {
       var searchText = req.query.search
       searchText = searchText.split(' ').join('%');
       models.Quiz.findAll({where: ["pregunta like ?", '%'+ searchText +'%']}).then(
           function(quizzes) {
               res.render('quizzes/index', { quizzes: quizzes, errors: []});
           }
       ).catch(function(error) { next(error);})
   }
   else {
       models.Quiz.findAll().then(
           function(quizzes) {
               res.render('quizzes/index', { quizzes: quizzes, errors: []});
           }
       ) //.catch(function(error) { next(error);})
   }
};

// GET quizzes/statistics
exports.stats = function(req, res) {
    models.Quiz.findAndCountAll({
        include: [{
            model: models.Comment
        }]
    }).then(
        function(quizzes) {
            // inicializamos
            var numquiz = quizzes.count;
            var numcomments = 0;
            var quiznocomments = 0;
            // recorremos y rellenamos quizzes
            for (var i = 0; i < numquiz; i++) {
                var quizcomments = quizzes.rows[i].toJSON().Comments.length;
                if ( quizcomments > 0) {
                    numcomments = numcomments + quizcomments;
                } else {
                    quiznocomments++;
                }
            }
            var avgcomment = numcomments / numquiz;
            // devolvemos la página
            res.render('quizzes/statistics', { numquiz: numquiz,
                                               numcomments: numcomments,
                                               quiznocomments: quiznocomments,
                                               avgcomment: avgcomment,
                                               errors: []});
        }
    )
};

// GET quizzes/:id
exports.show = function(req, res) {
  res.render('quizzes/show', { quiz: req.quiz, errors: []});
};

// GET /quizzes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render(
    'quizzes/answer',
    { quiz: req.quiz,
      respuesta: resultado,
      errors: []
    }
  );
};

// GET /quizzes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"}
  );

  res.render('quizzes/new', {quiz: quiz, errors: []});
};

// POST /quizzes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

// guarda en DB los campos pregunta y respuesta de quiz
quiz
.validate()
.then(
  function(err){
    if (err) {
      res.render('quizzes/new', {quiz: quiz, errors: err.errors});
    } else {
      quiz // save: guarda en DB campos pregunta y respuesta de quiz
      .save({fields: ["pregunta", "respuesta", "tema"]})
      .then( function(){ res.redirect('/quizzes')})
    }      // res.redirect: Redirección HTTP a lista de preguntas
  }
).catch(function(error){next(error)});
};

// GET /quizzes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz

  res.render('quizzes/edit', {quiz: quiz, errors: []});
};

// PUT /quizzes/:id
exports.update = function(req, res) {
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizzes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizzes');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  ).catch(function(error){next(error)});
};

// DELETE /quizzes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizzes');
  }).catch(function(error){next(error)});
};

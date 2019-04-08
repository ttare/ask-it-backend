module.exports = function({router, passport, controller, catchError}) {
  router.post('/login', catchError(controller.login));
  router.post('/signup', catchError(controller.signup));
};

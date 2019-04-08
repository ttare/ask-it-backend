module.exports = function({router, passport, controller, catchError}) {
  router.post('/',
    passport.isAuth(),
    catchError(controller.create)
  );

  router.post('/:id/likeOrDislike',
    passport.isAuth(),
    catchError(controller.likeOrDislike)
  );
};

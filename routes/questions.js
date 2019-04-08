module.exports = function ({router, passport, controller, catchError}) {

  router.get('/:page/:limit', passport.isAuth(true), catchError(controller.list));

  router.get('/my/:page/:limit', passport.isAuth(), catchError(controller.myList));

  router.get('/mostLiked', catchError(controller.mostLiked));

  router.post('/',
    passport.isAuth(),
    catchError(controller.create)
  );

  router.get('/:id', passport.isAuth(true), catchError(controller.details));

  router.post('/:id/likeOrDislike',
    passport.isAuth(),
    catchError(controller.likeOrDislike)
  );
};

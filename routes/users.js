module.exports = function ({router, passport, controller, catchError}) {
  router.get('/me',
    passport.isAuth(),
    catchError(controller.me)
  );

  router.post('/updatePassword',
    passport.isAuth(),
    catchError(controller.updatePassword)
  );

  router.get('/mostActive',
    catchError(controller.mostActive)
  );
}

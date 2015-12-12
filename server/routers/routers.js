var controllers = require('../controllers/controllers.js');
var verifyUser = require('../middleware/middleware').verifyUser;
var isLoggedIn = require('../middleware/middleware').isLoggedIn;

module.exports = function (router, passport) {

/*************************************
                     Login Routes
**************************************/
  router.post('/login', controllers.loginUser);
  router.post('/signup', controllers.signupUser);

/**************************************
                Facebook Routes
***************************************/
  router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
  router.get('/auth/facebook/callback',
     passport.authenticate('facebook', {
         successRedirect : '/',
         failureRedirect : '/'
     }));

/*************************************
                Github Routes
*************************************/
router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback',
   passport.authenticate('github', {
       successRedirect : '/',
       failureRedirect : '/'
   }));

/************************************
              Google Routes
*************************************/
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback',
   passport.authenticate('google', {
       successRedirect : '/',
       failureRedirect : '/'
   }));

router.get('/api/userData', function (req, res) {

    if (req.user === undefined) {
        // The user is not logged in
        res.json({});
    } else {
        res.json({
            username: req.user
        });
    }
});

/*************************************
                     User Routes
**************************************/

  router.get('/users/:id', controllers.getUserInfo);


  /*************************************
                       Package Routes
  **************************************/
  router.get('/packages', isLoggedIn, controllers.fetchPackages);
  router.post('/packages', isLoggedIn, controllers.savePackageEntry);


  //======Default Route=========
  router.get('/*', function (req, res) {
    res.sendStatus(404);
  });
};

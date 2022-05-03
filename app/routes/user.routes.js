const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  // app.get("/api/user/list", [authJwt.verifyToken], controller.userBoard);
  // app.get("/api/user/:id", [authJwt.verifyToken], controller.userDetail);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.get("/api/user/email/crawl", controller.imapEmail);
  app.get("/api/user/email/list", controller.emailList);
  app.get("/api/user/email/conversions", controller.conversions);



};


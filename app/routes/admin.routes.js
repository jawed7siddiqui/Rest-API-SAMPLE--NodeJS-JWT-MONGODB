const { authJwt } = require("../middlewares");
const controller = require("../controllers/admin.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);


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

  app.get("/api/admin/user/list", [authJwt.verifyToken, authJwt.isAdmin], controller.userBoard);
  app.get("/api/admin/user/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.userDetail);
  app.post("/api/admin/user/activation", [authJwt.verifyToken, authJwt.isAdmin], controller.userStatus);


};


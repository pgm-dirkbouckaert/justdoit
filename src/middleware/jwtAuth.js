import jwt from "jsonwebtoken";

export const jwtAuth = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.TOKEN_SALT);
    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.redirect("/login");
  }
};

export const isLoggedOut = (req, res, next) => {
  if (req.cookies.token) return res.redirect("/");
  next();
};

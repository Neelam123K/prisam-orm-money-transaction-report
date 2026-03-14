const jwt = require("jsonwebtoken")
const prisma = require("../prisma/client");

module.exports.auth_middleware = async function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });
        req.user = user;
        next();
    } catch (e){
        next();

    } 
}

module.exports.check = async function (req, res, next) {
  if (!req.user) {
    return res.status(404).json({ message: "User not authenticated" });
  }
  next();
};
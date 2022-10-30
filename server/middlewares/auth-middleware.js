const ApiError = require('../exceptions/api-error');
const tokenService = require('../services/token-service');

module.exports = async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader){
            throw ApiError.UnauthorizedError();
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if(!accessToken){
            throw ApiError.UnauthorizedError();
        }
        const userData = await tokenService.validateAccessToken(accessToken);
        if(!userData){
            throw ApiError.UnauthorizedError();
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
}
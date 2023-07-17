"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenCorrect = void 0;
const misc_1 = require("../helpers/misc");
const login_1 = require("../controllers/login");
function extractTokenFromHeader(header) {
    if (header == undefined) {
        return undefined;
    }
    const parts = header.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
        return parts[1];
    }
    return undefined;
}
const isTokenCorrect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    console.log({ authHeader, token });
    if (token != undefined) {
        // get token
        (0, misc_1.extractTokenContent)(token)
            .then((verified) => {
            console.log({ verified });
            let { id, email, time } = verified.data[0];
            login_1.AuthLogin.isUserLoggedIn(id, token)
                .then((success) => {
                if (success.statusCode == "LOGIN_SUCCESSFUL") {
                    req.user_id = id;
                    req.user_email = email;
                    req.user_token = token;
                    next();
                }
                else {
                    (0, misc_1.response)(res, success);
                    return;
                }
            })
                .catch((err) => {
                (0, misc_1.response)(res, err);
                return;
            });
        })
            .catch((err) => {
            console.log({ err });
            (0, misc_1.response)(res, err);
            return;
        });
    }
    else {
        let error = {
            data: [],
            message: "invalid login token.",
            status: 400,
            statusCode: "LOGIN_FAILED"
        };
        console.log({ error });
        (0, misc_1.response)(res, error);
        return;
    }
};
exports.isTokenCorrect = isTokenCorrect;

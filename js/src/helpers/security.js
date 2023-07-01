"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowOnlySpecificOrigins = exports.security = void 0;
const whitelist_1 = require("./whitelist");
const misc_1 = require("./misc");
const security = (app) => {
    app.use((req, res, next) => {
        req.body = Object.assign(Object.assign({}, req.query), req.body);
        /* console.log({
        from: req.baseUrl,
        headers: req.headers,
        hostname: req.hostname,
        httpVersion: req.httpVersion,
        path: req.path,
        query: req.query,
        secure: req.secure
        
        })
            */
        if (req.body.hasOwnProperty("start")) {
            req.body.start = Number(req.body.start);
        }
        if (req.body.hasOwnProperty("stop")) {
            req.body.stop = Number(req.body.stop);
        }
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        //: 
        next();
    });
};
exports.security = security;
const allowOnlySpecificOrigins = function (req, res, next) {
    let origin = req.protocol + '://' + req.get('host');
    // Check if the request is from an allowed domain
    if (!whitelist_1.whitelistOrigin.includes(origin)) {
        let error_res = {
            message: 'Origin is not allowed',
            data: [],
            status: 403,
            statusCode: 'ORIGIN_NOT_ALLOWED',
        };
        (0, misc_1.response)(res, error_res);
        ;
        // res.setHeader('Access-Control-Allow-Origin', origin);
    }
    else {
        next();
    }
};
exports.allowOnlySpecificOrigins = allowOnlySpecificOrigins;

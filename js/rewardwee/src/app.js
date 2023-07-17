"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const security_1 = require("./helpers/security");
const misc_1 = require("./helpers/misc");
const errorReporting_1 = require("./helpers/errorReporting");
//import bodyParser from 'body-parser';
const whitelist_1 = require("./helpers/whitelist");
const users_1 = __importDefault(require("./routes/users"));
//routes 
const app = (0, express_1.default)();
const corsOptions = {
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'token'
    ],
    origin: (origin, callback) => {
        // console.log({origin})
        if (whitelist_1.whitelistOrigin.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,POST,DELETE',
};
//app.use(cors(corsOptions));
app.use(express_1.default.json({ limit: '100mb', type: 'application/json' }));
app.use(express_1.default.urlencoded({ limit: '100mb', extended: true, parameterLimit: 100 }));
(0, security_1.security)(app);
app.use("/app/v1/auth", users_1.default);
app.use('*', (req, res, next) => {
    var fullURL = req.protocol + '://' + req.get('host') + req.originalUrl;
    let notFoundRes = {
        message: `${fullURL} page not found`,
        data: [],
        status: 404,
        statusCode: 'PAGE_NOT_FOUND',
    };
    (0, misc_1.response)(res, notFoundRes);
});
app.use((error, req, res, next) => {
    let errorLog = {
        msg: 'error found: ',
        stack: error.stack,
        status: 'STRONG',
        time: new Date().toDateString(),
    };
    (0, errorReporting_1.LogError)(errorLog);
    let error_res = {
        message: 'error detected, please try again.',
        data: [],
        status: 500,
        statusCode: 'UNKNOWN_ERROR',
    };
    (0, misc_1.response)(res, error_res);
});
process.on("uncaughtException", (error) => {
    let errorLog = {
        msg: 'error found: ',
        stack: error.stack,
        status: 'STRONG',
        time: new Date().toDateString(),
    };
    (0, errorReporting_1.LogError)(errorLog);
    return;
});
exports.default = app;

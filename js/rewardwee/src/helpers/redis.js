"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisDelete = exports.RedisGet = exports.RedisSet = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const errorReporting_1 = require("./errorReporting");
const getEnv_1 = require("./getEnv");
const redisPort = (0, getEnv_1.getEnv)("REDIS_PORT");
const redisHost = (0, getEnv_1.getEnv)("REDIS_HOST");
const redisPassword = (0, getEnv_1.getEnv)("REDIS_PASSWORD") || "";
// const redisConnect = new Redis(6379, 'localhost');
//const redisConnect = new Redis(redisPort, redisHost, {password: redisPassword});
const redisConnect = new ioredis_1.default(redisPort, redisHost);
//const redisConnect = new Redis(6379, 'localhost');
class RedisClient {
    constructor() {
        this.client = redisConnect;
        this.isConnected() ? console.log("redis already connected") : this.connect()
            .then(() => {
            console.log("redis connected at constructor");
        })
            .catch((err) => {
            console.log({ err });
            let error = {
                status: "STRONG",
                msg: `Redis client is not connected at constructor. Error: ${err.message}`,
                class: "RedisClient",
                time: new Date().toISOString()
            };
            (0, errorReporting_1.LogError)(error);
            return;
        });
    }
    // Connect to Redis database
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.client = redisConnect;
            }
            catch (err) {
                console.log({ err });
                let error = {
                    status: "STRONG",
                    msg: `Redis client is not connected at connect(()). Error: ${err.message}`,
                    class: "RedisClient",
                    time: new Date().toISOString()
                };
                console.log({ connect: this.client });
                (0, errorReporting_1.LogError)(error);
                return;
            }
            // Handle connection errors and reconnection
            this.client.on('error', (err) => {
                console.error('Redis connection error:', err);
            });
            this.client.on('connect', () => {
                console.log('Redis client connected');
            });
            this.client.on('close', () => {
                //  console.warn('Redis client closed');
            });
            this.client.on('reconnecting', () => {
                console.warn('Redis client is reconnecting');
                // reconnect automatically 
                this.isConnected() ? null : this.client.connect()
                    .then(() => { })
                    .catch(() => { });
            });
        });
    }
    // Check if Redis client is connected
    isConnected() {
        return this.client ? this.client.status === 'ready' : false;
    }
    // Save data to Redis database
    set(key, value, durationInSec = 600) {
        //this.client.connect()
        //await this.client.set(key, value);
        return new Promise((resolve, reject) => {
            try {
                if (!this.client) {
                    reject(false);
                    let error = {
                        status: "STRONG",
                        msg: "Redis client is not connected",
                        class: "RedisClient",
                        time: new Date().toISOString()
                    };
                    (0, errorReporting_1.LogError)(error);
                    return;
                }
                console.log({ connectedToSet: this.isConnected() });
                if (!this.isConnected() && this.client != null) {
                    this.client.connect()
                        .then(() => {
                        this.client ? this.client.set(key, JSON.stringify(value), 'EX', durationInSec, (err) => {
                            if (err) {
                                reject(false);
                            }
                            else {
                                // this.client ? this.client.quit() : null;
                                resolve(true);
                                return;
                            }
                        }) : null;
                    })
                        .catch((err) => {
                        let error = {
                            status: "STRONG",
                            msg: `Redis client is not connected, error: ${err.message}`,
                            class: "RedisClient",
                            time: new Date().toISOString()
                        };
                        (0, errorReporting_1.LogError)(error);
                        reject(false);
                        return;
                    });
                }
                else {
                    this.client.set(key, JSON.stringify(value), (err) => {
                        if (err) {
                            reject(false);
                        }
                        else {
                            //  this.client ? this.client.quit() : null;
                            resolve(true);
                        }
                    });
                }
            }
            catch (err) {
                resolve(false);
                console.log({ err });
                let error = {
                    status: "STRONG",
                    msg: `Redis client is not connected. Error: ${err.message}`,
                    class: "RedisClient",
                    time: new Date().toISOString()
                };
                (0, errorReporting_1.LogError)(error);
                return;
            }
        });
    }
    // Retrieve data from Redis database
    get(key) {
        return new Promise((resolve, reject) => {
            try {
                if (!this.client) {
                    reject(false);
                    let error = {
                        status: "STRONG",
                        msg: "Redis client is not connected",
                        class: "RedisClient",
                        time: new Date().toISOString()
                    };
                    (0, errorReporting_1.LogError)(error);
                    return;
                }
                if (!this.isConnected()) {
                    this.client.connect()
                        .then(() => {
                        this.client ? this.client.get(key, (err, reply) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                //  this.client ? this.client.quit() : null;
                                const value = JSON.parse(reply);
                                resolve(value);
                            }
                        }) : null;
                    })
                        .catch((err) => {
                        let error = {
                            status: "STRONG",
                            msg: `Redis client is not connected, error: ${err.message}`,
                            class: "RedisClient",
                            time: new Date().toISOString()
                        };
                        (0, errorReporting_1.LogError)(error);
                        reject(false);
                        return;
                    });
                }
                else {
                    this.client.get(key, (err, reply) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            //  this.client ? this.client.quit() : null;
                            const value = JSON.parse(reply);
                            resolve(value);
                        }
                    });
                }
            }
            catch (err) {
                resolve(null);
                let error = {
                    status: "STRONG",
                    msg: `Redis client is not connected, error: ${err.message}`,
                    class: "RedisClient",
                    time: new Date().toISOString()
                };
                (0, errorReporting_1.LogError)(error);
                return;
            }
        });
    }
    delete(key) {
        return new Promise((resolve, reject) => {
            try {
                if (!this.client) {
                    reject(false);
                    let error = {
                        status: "STRONG",
                        msg: "Redis client is not connected",
                        class: "RedisClient",
                        time: new Date().toISOString()
                    };
                    (0, errorReporting_1.LogError)(error);
                    return;
                }
                if (!this.isConnected()) {
                    this.client.connect()
                        .then(() => {
                        this.client ? this.client.del(key, (err, reply) => {
                            if (err) {
                                throw err;
                            }
                            else {
                                //  this.client ? this.client.quit() : null;
                                const value = JSON.parse(reply);
                                resolve(true);
                            }
                        }) : reject(false);
                    })
                        .catch((err) => {
                        let error = {
                            status: "STRONG",
                            msg: `Redis client is not connected, error: ${err.message}`,
                            class: "RedisClient",
                            time: new Date().toISOString()
                        };
                        (0, errorReporting_1.LogError)(error);
                        reject(false);
                        return;
                    });
                }
                else {
                    this.client.del(key, (err, reply) => {
                        if (err) {
                            let error = {
                                status: "STRONG",
                                msg: `Redis client is not connected, error: ${err.message}`,
                                class: "RedisClient",
                                time: new Date().toISOString()
                            };
                            (0, errorReporting_1.LogError)(error);
                            reject(false);
                            return;
                        }
                        else {
                            //  this.client ? this.client.quit() : null;
                            const value = JSON.parse(reply);
                            resolve(true);
                        }
                    });
                }
            }
            catch (err) {
                let error = {
                    status: "STRONG",
                    msg: `Redis client is not connected, error: ${err.message}`,
                    class: "RedisClient",
                    time: new Date().toISOString()
                };
                (0, errorReporting_1.LogError)(error);
                resolve(false);
                return;
            }
        });
    }
}
let redisClient = new RedisClient();
exports.RedisSet = redisClient.set.bind(redisClient);
exports.RedisGet = redisClient.get.bind(redisClient);
exports.RedisDelete = redisClient.delete.bind(redisClient);
/*
 setTimeout(() => {
  console.log("redis client is connected: ", redisClient.isConnected())

  set("Prince", "CHisomaga")
  .then((res) => {
      console.log({set_done: res})
  })
  .catch((err) => {
      console.log({setErr: err})
  })
  
  get("Prince")
  .then((res) => {
      console.log({prince:res})
  })
  .catch((err) => {
      console.log({getErr: err})
  })
  
  

  }, 1000);
 */
//export default RedisClient;

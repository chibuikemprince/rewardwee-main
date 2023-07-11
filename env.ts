

interface GeneralObject {
    [key: string]: any;
}


export const ENV: GeneralObject = {
    PORT: 7000,
    DB: "mongodb://127.0.0.1:27017/rewardwee",
    DB_PRODUCTION: "mongodb://127.0.0.1:27017/rewardwee",
    SERVICE_NAME: "auth",
    ENV: "development",
    JWT_SECRET: "1234%$%^&*222##$%^&&*()",
    REDIS_PORT: 6379,
    REDIS_HOST: "localhost",
    REDIS_PASSWORD: "",
};


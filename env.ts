

interface GeneralObject {
    [key: string]: any;
}


export const ENV: GeneralObject = {
    PORT: 4000,
    DB_PRODUCTION : "mongodb+srv://rewardwee:qmPhaVGPVggoroiv@cluster0.spyy1.gcp.mongodb.net/?retryWrites=true&w=majority",
   DB : "mongodb://127.0.0.1:27017/rewardwee",
    SERVICE_NAME: "auth",
    ENV: "development",
   
    REDIS_PORT: 6379,
    REDIS_HOST: "localhost",
    REDIS_PASSWORD: "",
    ACCOUNT_ACTIVATION_OTP_LENGTH: 7,
    OTP_LENGTH: 7,
    MAX_OTP_FAILURE: 5,
    OTP_RESEND_DURATION: 3,
    MAX_PASSWORD_TRIAL: 5
};


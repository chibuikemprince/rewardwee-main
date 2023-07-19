

interface GeneralObject {
    [key: string]: any;
}

export const ENV: GeneralObject = {
    PORT: 4000,
    DB_PRODUCTION : "mongodb+srv://rewardwee:8eyt7rIiCdx8KoAp@cluster0.f3bbtyf.mongodb.net/rewardwee?retryWrites=true&w=majority",
   DB : "mongodb://127.0.0.1:27017/rewardwee",
    SERVICE_NAME: "subscriptionplans",
    ENV: "development",
   
    REDIS_PORT: 17845,
    REDIS_HOST: "redis-17845.c8.us-east-1-4.ec2.cloud.redislabs.com:17845",
    REDIS_PASSWORD: "FjJ6byYvssqU8tsafO33o0AzWetvV6IR",
    
    SUBSCRIPTION_SUCCESSFUL: "d-fda47418ee0941f0838d11037bf5b283"
};


export const globalENVData : GeneralObject = {
    
    PORT: 7000,
    DB: "mongodb://127.0.0.1:27017/rewardwee",
    DB_PRODUCTION : "mongodb+srv://rewardwee:qmPhaVGPVggoroiv@cluster0.spyy1.gcp.mongodb.net/?retryWrites=true&w=majority",

    SERVICE_NAME: "auth",
    ENV: "development", 
    REDIS_PORT: 6379,
    REDIS_HOST: "localhost",
    REDIS_PASSWORD: "",
    ACCOUNT_ACTIVATION_EMAIL_TEMPLATE: "d-fda47418ee0941f0838d11037bf5b283",
    EMAIL_EVENTBUS_NAME: "arn:aws:events:us-east-1:352600133761:event-bus/testing",
    PASSWORD_RESET_TOKEN_EMAIL_TEMPLATE: "d-fda47418ee0941f0838d11037bf5b283",
    PASSWORD_RESET_SUCCESSFUL: "d-fda47418ee0941f0838d11037bf5b283",
    CHANGE_PASSWORD: "d-fda47418ee0941f0838d11037bf5b283",
    ACCOUNT_ACTIVATION_SUCCESS: "d-fda47418ee0941f0838d11037bf5b283",
    JWT_SECRET: "1234%$%^&seAAq22398077*22DDss2#DES#$%^&&*()AVDE"

}

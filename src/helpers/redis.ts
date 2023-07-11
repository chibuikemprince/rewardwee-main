
import Redis from 'ioredis';


import { ErrorDataType, LogError } from './errorReporting';
import { getEnv } from './getEnv';

const redisPort = getEnv("REDIS_PORT") as number ;
const redisHost = getEnv("REDIS_HOST") as string ;

const redisPassword = getEnv("REDIS_PASSWORD") as string || "";


// const redisConnect = new Redis(6379, 'localhost');

//const redisConnect = new Redis(redisPort, redisHost, {password: redisPassword});
const redisConnect = new Redis(redisPort, redisHost);
//const redisConnect = new Redis(6379, 'localhost');
class RedisClient {

  private client: Redis = redisConnect

  constructor( 
    ) { 
        this.isConnected() ? console.log("redis already connected") : this.connect( )
        .then(() => {
            console.log("redis connected at constructor")
        }
        ) 
        .catch((err: any) => {
            console.log({err})
            let error : ErrorDataType = {
                status: "STRONG",
                msg: `Redis client is not connected at constructor. Error: ${err.message}` ,
                class: "RedisClient",
                time: new Date().toISOString()
            }

LogError(error);
            return;

          });

    }

  // Connect to Redis database
  private async connect( 
  ): Promise<void> {

    try{
        
    this.client =    redisConnect  ;
    }
    catch(err: any){
        console.log({err})
        let error : ErrorDataType = {
            status: "STRONG",
            msg: `Redis client is not connected at connect(()). Error: ${err.message}` ,
            class: "RedisClient",
            time: new Date().toISOString()
        }

        console.log({connect: this.client})
LogError(error);
        return;


    }

    // Handle connection errors and reconnection
    this.client.on('error', (err: any) => {
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
      this.isConnected() ? null :  this.client.connect()
      .then(()=>{})
      .catch(()=> {})
  

    }) ;
  }
   
  // Check if Redis client is connected
  public isConnected(): boolean {
    return this.client ? this.client.status === 'ready' : false;
  }

  // Save data to Redis database
  public set(key: string, value: string, durationInSec: number = 600 ): Promise<boolean> {
 


    //this.client.connect()
     

    //await this.client.set(key, value);

    return new Promise(
      
      (resolve, reject) => {

        try{

          if (!this.client) {
            reject(false);

            let error : ErrorDataType = { 
                
                status: "STRONG",
                msg: "Redis client is not connected",
                class: "RedisClient",
                time: new Date().toISOString()
            }

LogError(error);

            return;

          } 

console.log({connectedToSet: this.isConnected() })


    if(!this.isConnected() && this.client != null ){
        this.client.connect()
        .then(() => {

            this.client ? this.client.set(key, JSON.stringify(value),
              'EX',	durationInSec,
             (err: any) => {
               
                if (err) {
                  reject(false);
                } else {
                    // this.client ? this.client.quit() : null;
                  
                  resolve(true);
                  return;
                }
              })  : null;



        })
        .catch((err : any) => {

            let error : ErrorDataType = {
                status: "STRONG",
                msg: `Redis client is not connected, error: ${err.message}` ,
                class: "RedisClient",
                time: new Date().toISOString()
            }

LogError(error);
            reject(false);
            return
        })


    }
else{

  
  
       this.client.set(key, JSON.stringify(value), (err: any) => {
        if (err) {
          reject(false);
        } else {
           //  this.client ? this.client.quit() : null;
          
          resolve(true);
        }
      });


}
   
        }
        catch(err: any){
            resolve(false); 
            console.log({err})
            let error : ErrorDataType = {
               
                status: "STRONG",
                msg: `Redis client is not connected. Error: ${err.message}` ,
                class: "RedisClient",
                time: new Date().toISOString()

        }

LogError(error);
            return;
            
      }


      
    
       } )
       







  }

  // Retrieve data from Redis database
  public  get(key: string): Promise<string | null> {


    return new Promise((resolve, reject) => {
  try{  
    if (!this.client) {
      reject(false);

      let error : ErrorDataType = { 
          
          status: "STRONG",
          msg: "Redis client is not connected",
          class: "RedisClient",
          time: new Date().toISOString()
      }

LogError(error);

      return;

    } 


if(!this.isConnected()){

  this.client.connect()
  .then(() => {


      this.client ? this.client.get(key, (err :any, reply: any) => {
  if (err) {
    reject(err);
  } else {
    //  this.client ? this.client.quit() : null;
    const value = JSON.parse(reply);
    resolve(value);
  }
}) : null;



  })
  .catch((err : any) => {

      let error : ErrorDataType = {
          status: "STRONG",
          msg: `Redis client is not connected, error: ${err.message}` ,
          class: "RedisClient",
          time: new Date().toISOString()
      }

LogError(error);
      reject(false);
      return
  })


}
else{


this.client.get(key, (err :any, reply: any) => {
  if (err) {
    reject(err);
  } else {
    //  this.client ? this.client.quit() : null;
    const value = JSON.parse(reply);
    resolve(value);
  }
});




}


  }
  catch(err : any){
      resolve(null);
      let error : ErrorDataType = {
        status: "STRONG",
        msg: `Redis client is not connected, error: ${err.message}` ,
        class: "RedisClient",
        time: new Date().toISOString()
    }

LogError(error);
      return;
  }

      
    
       })
       




 
   
  }

  public  delete(key: string): Promise<boolean> {

    return new Promise((resolve, reject) => {
      try{  
        if (!this.client) {
          reject(false);
    
          let error : ErrorDataType = { 
              
              status: "STRONG",
              msg: "Redis client is not connected",
              class: "RedisClient",
              time: new Date().toISOString()
          }
    
    LogError(error);
    
          return;
    
        } 
    
    
    if(!this.isConnected()){
    
      this.client.connect()
      .then(() => {
    
    
          this.client ? this.client.del(key, (err :any, reply: any) => {
      if (err) {
        throw err;
         
      } else {
        //  this.client ? this.client.quit() : null;
        const value = JSON.parse(reply);
        resolve(true);
      }
    }) : reject(false);
    
    
    
      })
      .catch((err : any) => {
    
          let error : ErrorDataType = {
              status: "STRONG",
              msg: `Redis client is not connected, error: ${err.message}` ,
              class: "RedisClient",
              time: new Date().toISOString()
          }
    
    LogError(error);
          reject(false);
          return
      })
    
    
    }
    else{
    
    
    this.client.del(key, (err :any, reply: any) => {
      if (err) {
        
        let error : ErrorDataType = {
          status: "STRONG",
          msg: `Redis client is not connected, error: ${err.message}` ,
          class: "RedisClient",
          time: new Date().toISOString()

  }

LogError(error);
reject(false);
return;

      } else {
        //  this.client ? this.client.quit() : null;
        const value = JSON.parse(reply);
        resolve(true);
      }
    });
    
    
    
    
    }
    
    
      }
      catch(err : any){
           let error : ErrorDataType = {
            status: "STRONG",
            msg: `Redis client is not connected, error: ${err.message}` ,
            class: "RedisClient",
            time: new Date().toISOString()
        }
    
    LogError(error);
    resolve(false);
         
          return;
      }
    
          
        
           })

          }
}

let redisClient =  new RedisClient();
 export const RedisSet = redisClient.set.bind(redisClient);
 export const  RedisGet = redisClient.get.bind(redisClient);
 export const  RedisDelete = redisClient.delete.bind(redisClient);
 
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



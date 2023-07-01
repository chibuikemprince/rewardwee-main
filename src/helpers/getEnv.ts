
import {ENV} from "../../env"

type env_val = string | number | undefined

export const getEnv = (key: string) :env_val  =>{

let val: env_val = ENV[key];
// console.log({key, val:process.env[key]})
    return val;
}  
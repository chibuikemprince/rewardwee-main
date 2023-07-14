import { getEnv } from "./getEnv";

const env = process.env;

const prodOrigin: any[] = [

];

const devOrigin: any[] = [
  `http://127.0.0.1:${process.env["PORT"]}`,
  `http://localhost:${process.env["PORT"]}`,
  'http://localhost:5004',
  'http://localhost:3001',
  'http://localhost:3000',
  'http://localhost:4000',
  'https://localhost:5004',
  'https://localhost:3001',
  'https://localhost:3000',
  'https://localhost:4000',
  '[::1]:3001',
  '[::1]:3000',
];

 let  mywhitelistOrigin = getEnv("ENV")=== 'production' ? prodOrigin : devOrigin;
 
 

export const whitelistOrigin = mywhitelistOrigin;
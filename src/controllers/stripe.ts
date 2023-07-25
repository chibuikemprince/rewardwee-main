 
import Stripe from 'stripe';
import { GeneralObject, RESPONSE_TYPE } from '../helpers/customTypes';
import { ErrorDataType, LogError } from '../helpers/errorReporting';
import { resolve } from 'path';

 

// Initialize the Stripe client with your API key
const stripe = new Stripe( 
  "sk_test_51K4mR1KZUXT1vXYdNJyK4T0LDN1qO87sDRHV43rg4CK4LbRf07WOzjzPXXCLHHHOpkroXOKDT1Gd6Oro6qEupWvc004m7bOOWY"
  ,
  {
   
     //@ts-ignore
    apiVersion: '2022-11-15',
  });




  stripe.customers.retrieve('cus_9s6XKzkNRiz8i3')
  .then((customerInfo: any) => {
  console.log({customerInfo})
  
  })
  .catch((error: any) => {
      
  
   console.log({error})
  return;
  })
  




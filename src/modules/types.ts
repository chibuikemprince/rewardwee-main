
import { SubscriptionPlan, CurrencyArray as CA} from "reward_service_store_schemas"
 

export type CurrencyType =   typeof CurrencyArray[number];

export const CurrencyArray  =  CA;



console.log({CurrencyArray})

export interface SubscriptionPlanType extends SubscriptionPlan {}


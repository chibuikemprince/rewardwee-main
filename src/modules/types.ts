
import { SubscriptionPlan, CurrencyArray as CA} from "reward_service_store_schemas"
 import { PaymentPlatforms } from "../../../rewardwee_database/src/types";

export type CurrencyType =   typeof CurrencyArray[number];
export type PaymentPlatformsType =   typeof PaymentPlatforms[number];

export const CurrencyArray  =  CA;



console.log({CurrencyArray})

export interface SubscriptionPlanType extends SubscriptionPlan {}






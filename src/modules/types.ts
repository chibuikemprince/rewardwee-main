
import { SubscriptionPlan, Currency  } from "../../../rewardwee_database/src/types/index"

export type CurrencyType =  keyof typeof Currency;
export const CurrencyArray: Currency[]  =  Object.values(Currency);

export interface SubscriptionPlanType extends SubscriptionPlan {}


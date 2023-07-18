import {AuthLoginClass} from "reward_service_global_auth_in";
import { UserLoginRecord } from "../databases/external"


export const authLogin = new AuthLoginClass(UserLoginRecord);
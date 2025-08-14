import { inject } from "inversify";
import { CORE_DI } from "../di/constants";

export const InjectHttpClient = () => inject(CORE_DI.HTTP_CLIENT);

import { inject } from "inversify";
import { CORE_DI } from "../di/constants";

export const InjectConfigService = () => inject(CORE_DI.CONFIG_SERVICE);

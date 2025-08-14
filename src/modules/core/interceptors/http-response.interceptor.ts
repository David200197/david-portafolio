import { AxiosResponse } from "axios";
import { Injectable } from "../decorators/Injectable";
import toast from "react-hot-toast";

@Injectable()
export class HttpResponseInterceptor {
  handle = (response: AxiosResponse<any, any>) => {
    const { status, config, data } = response;

    if (status >= 400) throw response;

    const modifyingMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
    if (modifyingMethods.has(config.method?.toUpperCase() ?? "")) {
      toast.success(data.message || "Operation carried out successfully");
    }

    return response;
  };
}

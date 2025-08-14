import { HttpClient } from "../models/HttpClient";
import axios, { AxiosInstance } from "axios";
import { InjectConfigService } from "../decorators/InjectConfigService";
import { ConfigService } from "./config-service";
import { Injectable } from "../decorators/Injectable";
import { HttpErrorInterceptor } from "../interceptors/http-error.interceptor";
import { HttpResponseInterceptor } from "../interceptors/http-response.interceptor";

@Injectable()
export class HttpClientAxios implements HttpClient {
  private readonly apiClient: AxiosInstance;
  constructor(
    @InjectConfigService()
    configService: ConfigService,
    httpResponseInterceptor: HttpResponseInterceptor,
    httpErrorInterceptor: HttpErrorInterceptor
  ) {
    this.apiClient = axios.create({
      baseURL: configService.get("NEXT_PUBLIC_API_URL"),
      headers: { "Content-Type": "application/json" },
    });
    this.apiClient.interceptors.response.use(
      httpResponseInterceptor.handle,
      httpErrorInterceptor.handle
    );
  }

  async get<Response>(path: string): Promise<Response> {
    const response = await this.apiClient.get(path);
    return response.data;
  }
  async post<Body, Response>(path: string, body: Body): Promise<Response> {
    const response = await this.apiClient.post(path, { body });
    return response.data;
  }
  async put<Body, Response>(path: string, body: Body): Promise<Response> {
    const response = await this.apiClient.put(path, { body });
    return response.data;
  }
  async patch<Body, Response>(path: string, body: Body): Promise<Response> {
    const response = await this.apiClient.patch(path, { body });
    return response.data;
  }
  async delete<Response>(path: string): Promise<Response> {
    const response = await this.apiClient.delete(path);
    return response.data;
  }
}

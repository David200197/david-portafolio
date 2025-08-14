export interface HttpClient {
  get<Response>(path: string): Promise<Response>;
  post<Body, Response>(path: string, body: Body): Promise<Response>;
  put<Body, Response>(path: string, body: Body): Promise<Response>;
  patch<Body, Response>(path: string, body: Body): Promise<Response>;
  delete<Response>(path: string): Promise<Response>;
}

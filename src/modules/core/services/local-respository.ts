import { Injectable } from "../decorators/Injectable";

@Injectable()
export class LocalRepository {
  async get<R>(lang: string, nameData: string): Promise<R> {
    const response = await import(
      `@/modules/core/data/${lang}/${nameData}.json`
    );
    return response.default;
  }
}

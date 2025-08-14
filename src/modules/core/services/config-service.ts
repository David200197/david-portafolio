import { z, infer as ZInfer } from "zod";
import { Injectable } from "../decorators/Injectable";
import { ZodValidator } from "./zod-validator";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string()//.url(),
});

type EnvSchema = ZInfer<typeof envSchema>;

@Injectable()
export class ConfigService {
  private readonly env: EnvSchema;

  constructor(private readonly zodValidator: ZodValidator) {
    this.env = this.zodValidator.validate("Env", envSchema, {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "--",
    });
  }

  get(key: keyof EnvSchema) {
    return this.env[key];
  }
}

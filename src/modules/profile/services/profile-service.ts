import { Injectable } from "@/modules/core/decorators/Injectable";
import { Profile } from "../entities/profile";
import { LocalRepository } from "@/modules/core/services/local-respository";
import { GetProfileResponseDTO } from "../dtos/GetProfileResponseDTO";

@Injectable()
export class ProfileService {
  constructor(private readonly localRepository: LocalRepository) {}

  async getProfile(lang: string) {
    const res = await this.localRepository.get<GetProfileResponseDTO>(
      lang,
      "profile"
    );
    return new Profile(res);
  }
}

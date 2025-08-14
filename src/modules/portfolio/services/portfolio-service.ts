import { Injectable } from "@/modules/core/decorators/Injectable";
import { particlesOptions } from "./options/particles";
import { ItemMenues } from "../entities/ItemMenues";
import { LocalRepository } from "@/modules/core/services/local-respository";
import { GetItemMenuDTO } from "../models/GetItemMenuDTO";

@Injectable()
export class PortfolioService {
  constructor(private readonly localRepository: LocalRepository) {}

  async getHomePageTitles(lang: string) {
    const response = await this.localRepository.get<{
      big: string;
      small: string;
    }>(lang, "page-title");

    return {
      big: response.big,
      small: response.small,
    };
  }

  async getItemMenus(lang: string): Promise<ItemMenues> {
    const itemMenu = await this.localRepository.get<GetItemMenuDTO[]>(
      lang,
      "item-menu"
    );
    return new ItemMenues(itemMenu);
  }

  getParticlesOptions() {
    return particlesOptions;
  }
}

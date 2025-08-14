import { Injectable } from "@/modules/core/decorators/Injectable";
import { BlogSection } from "../model/BlogSection";
import { LocalRepository } from "@/modules/core/services/local-respository";

@Injectable()
export class BlogService {
  constructor(private readonly localRepository: LocalRepository) {}

  async getBlogSection(lang: string): Promise<BlogSection> {
    return await this.localRepository.get<BlogSection>(lang, "blog-section");
  }
}

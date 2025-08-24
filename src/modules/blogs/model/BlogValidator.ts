import { BlogDataDTO, GetBlogDTO } from '../dto/GetBlogDTO'

export interface BlogValidator {
  validateDataBlogDto(data: BlogDataDTO): BlogDataDTO
  validateGetBlogDTO(data: GetBlogDTO): GetBlogDTO
  validateGetBlogsDTO(data: GetBlogDTO[]): GetBlogDTO[]
}

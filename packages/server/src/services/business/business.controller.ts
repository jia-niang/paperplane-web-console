import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'

import { Company } from '@/schema/company'
import { Workplace } from '@/schema/workplace'

import { BusinessService } from './business.service'

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  /** 创建公司 */
  @Post('/company')
  async addCompany(@Body() company: Company): Promise<Company> {
    return this.businessService.addCompany(company)
  }

  /** 根据 ID 获取公司 */
  @Get('/company/:id')
  @ApiOkResponse({ type: Company })
  async getCompanyById(@Param('id') id: string): Promise<Company> {
    return this.businessService.getCompanyById(id)
  }

  /** 列出所有公司 */
  @Get('/company')
  async listCompanies(): Promise<Company[]> {
    return this.businessService.listCompanies()
  }

  /** 更新公司信息 */
  @Put('/company/:id')
  async updateCompany(@Param('id') id: string, @Body() company: Company) {
    return this.businessService.updateCompany(id, company)
  }

  @Delete('/company/:id')
  async deleteCompany(@Param('id') id: string) {
    return this.businessService.deleteCompany(id)
  }

  @Post('/company/:companyId/workplace')
  async addWorkplaceToCompany(@Param('companyId') companyId: string, @Body() workplace: Workplace) {
    return this.businessService.addWorkplaceToCompany(companyId, workplace)
  }

  @Get('/company/:companyId/workplace')
  async listWorkCitiesOfCompany(@Param('companyId') companyId: string) {
    return this.businessService.listWorkCitiesOfCompany(companyId)
  }

  @Get('/company/:companyId/workplace/:workplaceId')
  async getWorkplaceOfCompanyById(@Param('companyId') companyId: string, @Param('workplaceId') workplaceId: string) {
    return this.businessService.getWorkplaceOfCompany(companyId, workplaceId)
  }

  @Put('/company/:companyId/workplace/:workplaceId')
  async updateWorkplaceOfCompany(
    @Param('companyId') companyId: string,
    @Param('workplaceId') workplaceId: string,
    @Body() workplace: Workplace
  ) {
    return this.businessService.updateWorkplaceOfCompany(companyId, workplaceId, workplace)
  }

  @Delete('/company/:companyId/workplace/:workplaceId')
  async deleteWorkplaceOfCompany(@Param('companyId') companyId: string, @Param('workplaceId') workplaceId: string) {
    return this.businessService.deleteWorkplaceOfCompany(companyId, workplaceId)
  }
}

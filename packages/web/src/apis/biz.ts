import { Company, Workplace } from '@repo/db'

import { client } from '@/utils/client'

export async function listAllCompaniesApi() {
  return client.get<Company[]>(`/business/company`)
}

export async function fetchCompanyByIdApi(id: string) {
  return client.get<Company>(`/business/company/${id}`)
}

export async function addCompanyApi(company: Partial<Company>) {
  return client.post<Company>(`/business/company`, company)
}

export async function editCompanyApi(company: Partial<Company>) {
  return client.put<Company>(`/business/company/${company.id}`, company)
}

export async function deleteCompanyApi(companyId: string) {
  return client.delete(`/business/company/${companyId}`)
}

export async function listWorkplacesByCompanyIdApi(companyId: string) {
  return client.get<Workplace>(`/business/company/${companyId}/workplace`)
}

export async function fetchWorkplaceByPathIdsApi(companyId: string, workplaceId: string) {
  return client.get<Workplace>(`/business/company/${companyId}/workplace/${workplaceId}`)
}

export async function addWorkplaceApi(companyId: string, workplace: Partial<Workplace>) {
  return client.post<Workplace>(`/business/company/${companyId}/workplace`, workplace)
}

export async function editWorkplaceApi(companyId: string, workplace: Partial<Workplace>) {
  return client.put<Workplace>(`/business/company/${companyId}/workplace/${workplace.id}`, workplace)
}

export async function deleteWorkplaceApi(companyId: string, workplaceId: string) {
  return client.delete(`/business/company/${companyId}/workplace/${workplaceId}`)
}

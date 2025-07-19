import { Company, CompanyWorkdayType, Role, Workplace } from '@repo/db'
import dayjs from 'dayjs'
import useSWR from 'swr'

import { provinces } from '@/utils/chinaDivision'
import { client } from '@/utils/client'

import { useAccess } from './userService'

export function useAllCompaniesSWR() {
  const isStaff = useAccess(Role.STAFF)

  return useSWR<Company[]>(() => (isStaff ? `/business/company` : null), client)
}

export function useCompanyByIdSWR(id?: string) {
  const isStaff = useAccess(Role.STAFF)

  return useSWR<Company>(() => (isStaff && id ? `/business/company/${id}` : null), client)
}

export function useWorkplacesByCompanyIdSWR(companyId?: string) {
  const isStaff = useAccess(Role.STAFF)

  return useSWR<Workplace[]>(() => (isStaff && companyId ? `/business/company/${companyId}/workplace` : null), client)
}

export function useWorkplaceByPathIdsSWR(companyId?: string, workplaceId?: string) {
  const isStaff = useAccess(Role.STAFF)

  return useSWR<Workplace>(
    () => (isStaff && companyId && workplaceId ? `/business/company/${companyId}/workplace/${workplaceId}` : null),
    client
  )
}

/** 将下班时间从字符串转为 timestamp */
export function offworkTimeString2Number(timeString: string) {
  return dayjs(`2000-01-01 ${timeString}`).valueOf() - dayjs(`2000-01-01 00:00:00`).valueOf()
}

/** 将下班时间从 timestamp 转为字符串 */
export function offworkTimeNumber2String(timeNumber: number) {
  return dayjs(dayjs(`2000-01-01 00:00:00`).valueOf() + timeNumber).format('HH:mm')
}

/** 将公司配置转为 FormData */
export function converCompany2FormData(company?: Company) {
  return (
    company &&
    ({ ...company, offworkTimeOfDay: offworkTimeNumber2String(company.offworkTimeOfDay!) } as unknown as Company)
  )
}

/** 将 FormData 转为公司配置 */
export function converFormData2Company<T extends Company>(company: T): T {
  return (
    company &&
    ({
      ...company,
      offworkTimeOfDay: offworkTimeString2Number(company.offworkTimeOfDay as any),
    } as T)
  )
}

export const oilPriceProvinces = provinces.map(t => ({
  label: t.name
    .replace('省', '')
    .replace('市', '')
    .replace('自治区', '')
    .replace('壮族', '')
    .replace('回族', '')
    .replace('维吾尔', ''),
  value: t.name,
}))

export const workdayTypeOptions = [
  { value: CompanyWorkdayType.DEFAULT, label: '默认' },
  { value: CompanyWorkdayType.ADD_SAT, label: '周六作为工作日' },
  { value: CompanyWorkdayType.ADD_SUN, label: '周日作为工作日' },
  { value: CompanyWorkdayType.ADD_WEEKEND, label: '周六、周日都作为工作日' },
]

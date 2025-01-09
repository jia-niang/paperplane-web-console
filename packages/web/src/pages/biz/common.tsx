import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'

export const BIZ_ADD_URL = 'new' as const

export type BizLockType = 'company' | 'workplace' | undefined

export const required = [{ required: true }]

export interface IBizFormProps {
  locked?: boolean
  onLockedChange?(isLocked?: boolean): void
  onFresh?(): Promise<any>
}

export function urlId(id?: string) {
  return id === BIZ_ADD_URL ? undefined : id
}

export function useBiz() {
  const { companyId, workplaceId } = useParams<{ companyId?: string; workplaceId?: string }>()
  const navigate = useNavigate()

  const isAddCompany = useMemo(() => companyId === BIZ_ADD_URL, [companyId])
  const isAddWorkplace = useMemo(() => workplaceId === BIZ_ADD_URL, [workplaceId])

  function toCompany(companyId: string | boolean) {
    if (companyId === true) {
      navigate(`/biz/company/${BIZ_ADD_URL}`)
    } else if (companyId === false) {
      navigate(`/biz`)
    } else {
      navigate(`/biz/company/${companyId}`)
    }
  }

  function toWorkplace(workplaceId: string | boolean) {
    if (workplaceId === true) {
      navigate(`/biz/company/${companyId}/workplace/${BIZ_ADD_URL}`)
    } else if (workplaceId === false) {
      navigate(`/biz/company/${companyId}`)
    } else {
      navigate(`/biz/company/${companyId}/workplace/${workplaceId}`)
    }
  }

  return { companyId, workplaceId, isAddCompany, isAddWorkplace, toCompany, toWorkplace }
}

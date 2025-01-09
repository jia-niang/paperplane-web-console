import { useNavigate, useParams } from 'react-router'
import { create } from 'zustand'

export const BIZ_ADD_URL = 'new' as const

export type BizLockType = 'company' | 'workplace' | null

export const required = [{ required: true }]

export interface IBizFormProps {
  onFresh?(): Promise<any>
}

export function urlId(id?: string) {
  return id === BIZ_ADD_URL ? undefined : id
}

interface ILockStore {
  lock: BizLockType
  setLock(lock: BizLockType): void
}

const useBizLock = create<ILockStore>()(set => ({
  lock: null,
  setLock: lock => void set({ lock }),
}))

export function useBiz() {
  const { lock, setLock } = useBizLock()
  const { companyId, workplaceId } = useParams<{ companyId?: string; workplaceId?: string }>()
  const navigate = useNavigate()

  const isAddCompany = companyId === BIZ_ADD_URL
  const isAddWorkplace = workplaceId === BIZ_ADD_URL

  function toCompany(companyId: string | boolean) {
    if (companyId === true) {
      setLock('company')
      navigate(`/biz/company/${BIZ_ADD_URL}`)
    } else if (companyId === false) {
      setLock(null)
      navigate(`/biz`)
    } else {
      navigate(`/biz/company/${companyId}`)
    }
  }

  function toWorkplace(workplaceId: string | boolean) {
    if (workplaceId === true) {
      setLock('workplace')
      navigate(`/biz/company/${companyId}/workplace/${BIZ_ADD_URL}`)
    } else if (workplaceId === false) {
      setLock(null)
      navigate(`/biz/company/${companyId}`)
    } else {
      navigate(`/biz/company/${companyId}/workplace/${workplaceId}`)
    }
  }

  return { lock, setLock, companyId, workplaceId, isAddCompany, isAddWorkplace, toCompany, toWorkplace }
}

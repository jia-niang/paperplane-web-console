import { useMemo, useState } from 'react'
import { AddIcon, City1Icon, MapLocationIcon, ViewListIcon } from 'tdesign-icons-react'
import { Button, Col, Loading, Row, Tree } from 'tdesign-react'

import PageLayout from '@/components/layout/PageLayout'
import Title from '@/components/text/Title'
import { useAllCompaniesSWR, useWorkplacesByCompanyIdSWR } from '@/services/bizService'

import { BizLockType, urlId, useBiz } from './common'
import CompanyForm from './forms/CompamyForm'
import WorkplaceForm from './forms/WorkplaceForm'

const ROOT_ID = '_root'
const empty: any[] = []

export default function BizPage(): RC {
  const { companyId, workplaceId, toCompany, toWorkplace } = useBiz()
  const [lock, setLock] = useState<BizLockType>()

  const { data: companyList, isLoading: companyListLoading, mutate: refreshCompanyList } = useAllCompaniesSWR()

  const {
    data: workplaceList,
    isLoading: workplaceListLoading,
    mutate: refreshWorkplaceList,
  } = useWorkplacesByCompanyIdSWR(urlId(companyId))

  const companiesTree = useMemo(
    () =>
      companyList
        ? [
            {
              label: <Title>所有公司：</Title>,
              value: ROOT_ID,
              children: companyList?.map(t => ({ label: t.company, value: t.id })),
            },
          ]
        : empty,
    [companyList]
  )

  const workplacesTree = useMemo(
    () =>
      workplaceList
        ? [{ label: `工作地点：`, value: ROOT_ID, children: workplaceList?.map(t => ({ label: t.city, value: t.id })) }]
        : empty,
    [workplaceList]
  )

  const addCompanyHandler = () => {
    toCompany(true)
  }

  const addWorkplaceHandler = () => {
    toWorkplace(true)
  }

  return (
    <PageLayout>
      <Row gutter={25}>
        <Col span={4}>
          <Loading loading={companyListLoading}>
            <Tree
              data={companiesTree}
              actived={[companyId as string]}
              className="mb-4"
              disabled={!!lock}
              onActive={([id]) => {
                if (![undefined, ROOT_ID, companyId].includes(id as string)) {
                  toCompany(id as string)
                }
              }}
              icon={node => (node.data.value === ROOT_ID ? <ViewListIcon /> : <City1Icon />)}
              activable
              line
              expandAll
            />
            <Button onClick={addCompanyHandler} disabled={!!lock} size="small" shape="round" icon={<AddIcon />}>
              新增公司
            </Button>
          </Loading>

          <Loading loading={workplaceListLoading}>
            <Tree
              data={workplacesTree}
              actived={[workplaceId as string]}
              className="mb-4 mt-12"
              disabled={!!lock}
              onActive={([id]) => {
                if (![undefined, ROOT_ID, workplaceId].includes(id as string)) {
                  toWorkplace(id as string)
                }
              }}
              icon={node => (node.data.value === ROOT_ID ? <City1Icon /> : <MapLocationIcon />)}
              activable
              line
              expandAll
            />
            <Button onClick={addWorkplaceHandler} disabled={!!lock} size="small" shape="round" icon={<AddIcon />}>
              新增工作地点
            </Button>
          </Loading>
        </Col>

        <Col span={4}>
          <CompanyForm
            locked={!!lock}
            onLockedChange={locked => void setLock(locked ? 'company' : undefined)}
            onFresh={() => refreshCompanyList()}
          />
        </Col>

        <Col span={4}>
          <WorkplaceForm
            locked={lock === 'workplace'}
            onLockedChange={locked => void setLock(locked ? 'workplace' : undefined)}
            onFresh={() => refreshWorkplaceList()}
          />
        </Col>
      </Row>
    </PageLayout>
  )
}

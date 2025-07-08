import { useMemo } from 'react'
import { Outlet } from 'react-router'
import { AddIcon, City1Icon, MapLocationIcon, ViewListIcon } from 'tdesign-icons-react'
import { Button, Col, Loading, Row, Tree } from 'tdesign-react'

import PageLayout from '@/components/layout/PageLayout'
import Title from '@/components/text/Title'
import { useAllCompaniesSWR, useWorkplacesByCompanyIdSWR } from '@/services/bizService'

import { urlId, useBiz } from './common'

const ROOT_ID = '_root'
const empty: any[] = []

export default function BizPage(): RC {
  const { lock, companyId, workplaceId, toCompany, toWorkplace } = useBiz()

  const { data: companyList, isLoading: companyListLoading } = useAllCompaniesSWR()
  const { data: workplaceList, isLoading: workplaceListLoading } = useWorkplacesByCompanyIdSWR(urlId(companyId))

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

  return (
    <PageLayout>
      <Row gutter={25}>
        <Col span={4}>
          <Loading loading={companyListLoading} delay={250}>
            <Tree
              data={companiesTree}
              actived={[companyId as string]}
              expanded={[ROOT_ID]}
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
            <Button
              className="mt-4"
              onClick={() => void toCompany(true)}
              disabled={!!lock}
              size="small"
              shape="round"
              icon={<AddIcon />}
            >
              新增公司
            </Button>
          </Loading>

          <Loading style={{ marginTop: '48px' }} loading={workplaceListLoading} delay={250}>
            <Tree
              data={workplacesTree}
              actived={[workplaceId as string]}
              disabled={!!lock}
              expanded={[ROOT_ID]}
              onActive={([id]) => {
                if (![undefined, ROOT_ID, workplaceId].includes(id as string)) {
                  toWorkplace(id as string)
                }
              }}
              empty={null}
              icon={node => (node.data.value === ROOT_ID ? <City1Icon /> : <MapLocationIcon />)}
              activable
              line
              expandAll
            />
            {urlId(companyId) ? (
              <Button
                className="mt-4"
                onClick={() => void toWorkplace(true)}
                disabled={!!lock}
                size="small"
                shape="round"
                icon={<AddIcon />}
              >
                新增工作地点
              </Button>
            ) : null}
          </Loading>
        </Col>

        <Outlet />
      </Row>
    </PageLayout>
  )
}

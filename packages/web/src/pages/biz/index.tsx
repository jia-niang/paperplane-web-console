import { Company, Workplace } from '@repo/db'
import { useEffect, useMemo, useState } from 'react'
import { AddIcon, City1Icon, CloseIcon, Edit1Icon, MapLocationIcon, ViewListIcon } from 'tdesign-icons-react'
import {
  Button,
  ButtonProps,
  Col,
  Form,
  Input,
  InputNumber,
  Loading,
  Popconfirm,
  Row,
  Select,
  Space,
  TimePicker,
  Tree,
  TreeProps,
} from 'tdesign-react'
import useForm from 'tdesign-react/es/form/hooks/useForm'

import {
  addCompanyApi,
  addWorkplaceApi,
  deleteCompanyApi,
  deleteWorkplaceApi,
  editCompanyApi,
  editWorkplaceApi,
} from '@/apis/biz'
import PageLayout from '@/components/layout/PageLayout'
import Title from '@/components/text/Title'
import {
  converCompany2FormData,
  converFormData2Company,
  oilPriceProvinces,
  useAllCompaniesSWR,
  useCompanyByIdSWR,
  useWorkplaceByPathIdsSWR,
  useWorkplacesByCompanyIdSWR,
} from '@/services/bizService'

const { FormItem } = Form

const ROOT_ID = '_root'
const empty: any[] = []
const required = [{ required: true }]
const disableTime = () => ({
  hour: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 22, 23, 24],
})
const defaultCompany = { offworkTimeOfDay: '18:00', salaryDate: 1 }

type StatusType = 'create' | 'edit' | 'view'
type ActionType = 'todo' | 'ok' | 'cancel'

function EditButton(props: ButtonProps) {
  return <Button theme="primary" size="small" shape="round" icon={<Edit1Icon />} {...props} />
}

function OkButton(props: ButtonProps) {
  return <Button theme="primary" size="small" shape="round" icon={<Edit1Icon />} {...props} />
}

function CancelButton(props: ButtonProps) {
  return <Button theme="danger" size="small" variant="outline" shape="round" icon={<CloseIcon />} {...props} />
}

export default function BizPage(): RC {
  const [companyForm] = useForm()
  const [workplaceForm] = useForm()

  const [companyStatus, setCompanyStatus] = useState<StatusType>('view')
  const [workplaceStatus, setWorkplaceStatus] = useState<StatusType>('view')

  const { data: companyList, isLoading: companyListLoading, mutate: refreshCompanyList } = useAllCompaniesSWR()
  const [companyId, setCompanyId] = useState<string>()
  const { data: company, isLoading: companyLoading, mutate: refreshCompany } = useCompanyByIdSWR(companyId)
  const companyFormData = useMemo(() => converCompany2FormData(company), [company])
  useEffect(() => void companyForm.reset(), [company, companyForm])

  const {
    data: workplaceList,
    isLoading: workplaceListLoading,
    mutate: refreshWorkplaceList,
  } = useWorkplacesByCompanyIdSWR(companyId)
  const [workplaceId, setWorkplaceId] = useState<string>()
  const {
    data: workplace,
    isLoading: workplaceLoading,
    mutate: refreshWorkplace,
  } = useWorkplaceByPathIdsSWR(companyId, workplaceId)
  useEffect(() => void workplaceForm.reset(), [workplace, workplaceForm])

  useEffect(() => {
    setWorkplaceId(undefined)
    setWorkplaceStatus('view')
  }, [companyId])

  const addCompany = async (type: ActionType) => {
    if (type === 'todo') {
      setCompanyId(undefined)
      setCompanyStatus('create')
      companyForm.reset({ type: 'empty' })
    } else if (type === 'ok') {
      if (await companyForm.validate()) {
        const formData = companyForm.getFieldsValue(true) as Company
        const result = await addCompanyApi(converFormData2Company(formData))
        await refreshCompanyList()
        setCompanyStatus('view')

        setCompanyId(result.id)
        companyForm.reset()
      }
    } else {
      setCompanyStatus('view')
      companyForm.reset({ type: 'empty' })
    }
  }

  const editCompany = async (type: ActionType) => {
    if (type === 'todo') {
      setCompanyStatus('edit')
    } else if (type === 'ok') {
      if (await companyForm.validate()) {
        const formData = companyForm.getFieldsValue(true) as Company
        const result = await editCompanyApi(converFormData2Company(formData))
        await refreshCompany(result)
        refreshCompanyList()

        companyForm.reset()
        setCompanyStatus('view')
      }
    } else {
      companyForm.reset()
      setCompanyStatus('view')
    }
  }

  const deleteCompany = async () => {
    await deleteCompanyApi(companyId!)
    setWorkplaceId(undefined)
    setCompanyId(undefined)
    refreshCompanyList()
  }

  const addWorkplace = async (type: ActionType) => {
    if (type === 'todo') {
      setWorkplaceId(undefined)
      setWorkplaceStatus('create')
      workplaceForm.reset({ type: 'empty' })
    } else if (type === 'ok') {
      if (await workplaceForm.validate()) {
        const formData = workplaceForm.getFieldsValue(true) as Workplace
        const result = await addWorkplaceApi(companyId!, formData)
        await refreshWorkplaceList()

        setWorkplaceId(result.id)
        setWorkplaceStatus('view')
        workplaceForm.reset()
      }
    } else {
      workplaceForm.reset({ type: 'empty' })
      setWorkplaceStatus('view')
    }
  }

  const editWorkplace = async (type: ActionType) => {
    if (type === 'todo') {
      setWorkplaceStatus('edit')
    } else if (type === 'ok') {
      if (await workplaceForm.validate()) {
        const formData = workplaceForm.getFieldsValue(true) as Workplace
        const result = await editWorkplaceApi(companyId!, formData)
        await refreshWorkplace(result)
        refreshWorkplaceList()

        workplaceForm.reset()
        setWorkplaceStatus('view')
      }
    } else {
      workplaceForm.reset()
      setWorkplaceStatus('view')
    }
  }

  const deleteWorkplace = async () => {
    await deleteWorkplaceApi(companyId!, workplaceId!)
    setWorkplaceId(undefined)
    refreshWorkplaceList()
  }

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
        ? [
            {
              label: company?.company,
              value: ROOT_ID,
              children: workplaceList?.map(t => ({ label: t.city, value: t.id })),
            },
          ]
        : empty,
    [workplaceList, company]
  )

  const renderCompanyIcon: TreeProps['icon'] = node => {
    return node.data.value === ROOT_ID ? <ViewListIcon /> : <City1Icon />
  }

  const renderWorkplaceIcon: TreeProps['icon'] = node => {
    return node.data.value === ROOT_ID ? <City1Icon /> : <MapLocationIcon />
  }

  return (
    <PageLayout>
      <Row gutter={25}>
        <Col span={4}>
          <Loading loading={companyListLoading}>
            <Tree
              data={companiesTree}
              disabled={companyStatus !== 'view' || workplaceStatus !== 'view'}
              actived={[companyId as string]}
              className="mb-4"
              onActive={([id]) => {
                if (![undefined, ROOT_ID, companyId].includes(id as string)) {
                  setWorkplaceId(undefined)
                  setCompanyId(id as string)
                }
              }}
              icon={renderCompanyIcon}
              activable
              line
              expandAll
            />
            <Button
              onClick={() => void addCompany('todo')}
              disabled={companyStatus !== 'view' || workplaceStatus !== 'view'}
              size="small"
              shape="round"
              icon={<AddIcon />}
            >
              新增公司
            </Button>
          </Loading>

          {company ? (
            <Loading loading={workplaceListLoading}>
              <Tree
                data={workplacesTree}
                disabled={companyStatus !== 'view' || workplaceStatus !== 'view'}
                actived={[workplaceId as string]}
                className="mb-4 mt-12"
                onActive={([id]) => {
                  if (![undefined, ROOT_ID, workplaceId].includes(id as string)) {
                    setWorkplaceId(id as string)
                  }
                }}
                icon={renderWorkplaceIcon}
                activable
                line
                expandAll
              />
              <Button
                onClick={() => void addWorkplace('todo')}
                disabled={companyStatus !== 'view' || workplaceStatus !== 'view'}
                size="small"
                shape="round"
                icon={<AddIcon />}
              >
                新增工作地点
              </Button>
            </Loading>
          ) : null}
        </Col>

        <Col span={4}>
          {companyId || companyStatus === 'create' ? (
            <Loading loading={companyLoading}>
              <Title>{companyStatus === 'create' ? `新建公司：` : `当前选中公司：`}</Title>

              <Form
                initialData={companyStatus === 'create' ? defaultCompany : companyFormData}
                form={companyForm}
                disabled={companyStatus === 'view'}
                resetType="initial"
                layout="vertical"
                labelAlign="top"
                className="mb-6"
                colon
              >
                {companyStatus !== 'create' ? (
                  <FormItem label="ID" name="id" rules={required}>
                    <Input disabled />
                  </FormItem>
                ) : null}

                <FormItem label="公司名" name="company" rules={required}>
                  <Input />
                </FormItem>

                <FormItem
                  label="发薪日"
                  name="salaryDate"
                  rules={required}
                  help={
                    <>
                      发薪日是几号就填写数字几
                      <br />
                      若从月末算，例如 “每月最后一天” 则填写 “-1”
                    </>
                  }
                >
                  <InputNumber max={28} min={-28} autoWidth />
                </FormItem>

                <FormItem label="下班时间" name="offworkTimeOfDay" rules={required}>
                  <TimePicker className="w-full" format="HH:mm" disableTime={disableTime} steps={[1, 5, 1]} />
                </FormItem>

                <FormItem label="股票代码" name="stockCode">
                  <Input />
                </FormItem>
              </Form>

              <Space>
                {companyStatus === 'view' ? (
                  <EditButton onClick={() => void editCompany('todo')} disabled={workplaceStatus !== 'view'}>
                    编辑
                  </EditButton>
                ) : companyStatus === 'edit' ? (
                  <>
                    <OkButton onClick={() => void editCompany('ok')}>完成编辑</OkButton>
                    <CancelButton onClick={() => void editCompany('cancel')}>放弃修改</CancelButton>
                  </>
                ) : (
                  <>
                    <OkButton onClick={() => void addCompany('ok')}>完成新建</OkButton>
                    <CancelButton onClick={() => void addCompany('cancel')}>放弃新建</CancelButton>
                  </>
                )}

                {companyStatus === 'view' ? (
                  <Popconfirm
                    onConfirm={deleteCompany}
                    content={
                      <>
                        确认删除此公司吗？
                        <br />
                        属于此公司的所有工作地点也会一并被删除。
                      </>
                    }
                    showArrow
                  >
                    <CancelButton disabled={workplaceStatus !== 'view'}>删除</CancelButton>
                  </Popconfirm>
                ) : null}
              </Space>
            </Loading>
          ) : null}
        </Col>

        <Col span={4}>
          {workplaceId || workplaceStatus === 'create' ? (
            <Loading loading={workplaceLoading}>
              <Title>{workplaceStatus === 'create' ? `新建工作地点：` : `当前选中工作地点：`}</Title>

              <Form
                initialData={workplace}
                form={workplaceForm}
                disabled={workplaceStatus === 'view'}
                className="mb-6"
                resetType="initial"
                layout="vertical"
                labelAlign="top"
                colon
              >
                {workplaceStatus !== 'create' ? (
                  <FormItem label="ID" name="id" rules={required}>
                    <Input disabled />
                  </FormItem>
                ) : null}

                <FormItem label="地点名" name="city" rules={required}>
                  <Input />
                </FormItem>

                <FormItem
                  label="天气代码"
                  name="weatherCode"
                  help={
                    <>
                      <a
                        className="text-[var(--brand-main)]"
                        href="https://juhe.oss-cn-hangzhou.aliyuncs.com/api_file/73/API73_cityList.xlsx"
                      >
                        点此下载
                      </a>{' '}
                      天气代码 Excel
                    </>
                  }
                >
                  <Input />
                </FormItem>

                <FormItem label="油价省份" name="oilpriceCode">
                  <Select options={oilPriceProvinces} />
                </FormItem>

                <FormItem label="地图经度" name="mapLongitude">
                  <Input />
                </FormItem>

                <FormItem label="地图纬度" name="mapLatitude">
                  <Input />
                </FormItem>
              </Form>

              <Space>
                {workplaceStatus === 'view' ? (
                  <EditButton onClick={() => void editWorkplace('todo')} disabled={companyStatus !== 'view'}>
                    编辑
                  </EditButton>
                ) : workplaceStatus === 'edit' ? (
                  <>
                    <OkButton onClick={() => void editWorkplace('ok')}>完成编辑</OkButton>
                    <CancelButton onClick={() => void editWorkplace('cancel')}>放弃修改</CancelButton>
                  </>
                ) : (
                  <>
                    <OkButton onClick={() => void addWorkplace('ok')}>完成新建</OkButton>
                    <CancelButton onClick={() => void addWorkplace('cancel')}>放弃新建</CancelButton>
                  </>
                )}

                {workplaceStatus === 'view' ? (
                  <Popconfirm onConfirm={deleteWorkplace} content="确认删除此工作地点吗？" showArrow>
                    <CancelButton disabled={companyStatus !== 'view'}>删除</CancelButton>
                  </Popconfirm>
                ) : null}
              </Space>
            </Loading>
          ) : null}
        </Col>
      </Row>
    </PageLayout>
  )
}

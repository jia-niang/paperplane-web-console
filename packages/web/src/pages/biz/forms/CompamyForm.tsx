import { Company, CompanyWorkdayType } from '@repo/db'
import { useEffect, useMemo } from 'react'
import { Outlet } from 'react-router'
import { mutate } from 'swr'
import {
  Col,
  Form,
  Input,
  InputNumber,
  Loading,
  Popconfirm,
  Select,
  Space,
  SubmitContext,
  TimePicker,
} from 'tdesign-react'

import { addCompanyApi, deleteCompanyApi, editCompanyApi } from '@/apis/biz'
import Title from '@/components/text/Title'
import {
  converCompany2FormData,
  converFormData2Company,
  useCompanyByIdSWR,
  workdayTypeOptions,
} from '@/services/bizService'
import { useCustomRoute } from '@/services/routerService'

import BizCancelButton from '../buttons/BizCancelButton'
import BizEditButton from '../buttons/BizEditButton'
import BizOkButton from '../buttons/BizOkButton'
import { required, useBiz, urlId } from '../common'

const { FormItem, useForm } = Form

const disableTime = () => ({
  hour: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 22, 23, 24],
})
const defaultCompany: Partial<Company> = {
  offworkTimeOfDay: '18:00' as unknown as number,
  salaryDate: 1,
  workdayOption: CompanyWorkdayType.DEFAULT,
}

export default function CompanyForm(): RC {
  const [form] = useForm()
  const { lock, setLock, companyId, isAddCompany, toCompany } = useBiz()

  const { data, isLoading, mutate: refresh } = useCompanyByIdSWR(urlId(companyId))
  const formData = useMemo(() => converCompany2FormData(data), [data])

  useEffect(() => void form.reset(), [companyId, form, data])

  const submitHandler = async (submit: SubmitContext) => {
    if (submit.validateResult !== true) {
      return
    }

    const formData = converFormData2Company(form.getFieldsValue(true) as Company)
    const api = isAddCompany ? addCompanyApi : editCompanyApi
    const result = await api(formData)

    mutate(`/business/company`)
    setLock(null)
    if (isAddCompany) {
      toCompany(result.id)
    } else {
      refresh(result)
      form.reset()
    }
  }

  useCustomRoute(`/biz/company/:companyId/*`, { breadcrumb: data?.company })

  if (!companyId) {
    return null
  }

  return (
    <>
      <Col span={4}>
        <Loading loading={isLoading}>
          <Title>{isAddCompany ? `新建公司：` : `当前选中公司：`}</Title>

          <Form
            initialData={isAddCompany ? defaultCompany : formData}
            form={form}
            onSubmit={submitHandler}
            disabled={lock !== 'company' && !isAddCompany}
            resetType="initial"
            layout="vertical"
            labelAlign="top"
            className="mb-6"
            colon
          >
            {!isAddCompany ? (
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

            <FormItem label="调整工作日" name="workdayOption" rules={required}>
              <Select options={workdayTypeOptions} />
            </FormItem>

            <FormItem label="下班时间" name="offworkTimeOfDay" rules={required}>
              <TimePicker className="w-full" format="HH:mm" disableTime={disableTime} steps={[1, 5, 1]} />
            </FormItem>

            <FormItem label="股票代码" name="stockCode">
              <Input />
            </FormItem>
          </Form>

          <Space>
            {!isAddCompany && lock !== 'company' ? (
              <>
                <BizEditButton onClick={() => void setLock('company')} disabled={!!lock}>
                  编辑
                </BizEditButton>
                <Popconfirm
                  onConfirm={async () => {
                    await deleteCompanyApi(companyId!)
                    await mutate(`/business/company`)
                    toCompany(false)
                  }}
                  content={
                    <>
                      确认删除此公司吗？
                      <br />
                      属于此公司的所有工作地点也会一并被删除。
                    </>
                  }
                  showArrow
                >
                  <>
                    <BizCancelButton disabled={!!lock}>删除</BizCancelButton>
                  </>
                </Popconfirm>
              </>
            ) : !isAddCompany && lock === 'company' ? (
              <>
                <BizOkButton onClick={() => void form.submit()}>完成编辑</BizOkButton>
                <BizCancelButton
                  onClick={() => {
                    setLock(null)
                    form.reset()
                  }}
                >
                  放弃修改
                </BizCancelButton>
              </>
            ) : (
              <>
                <BizOkButton onClick={() => void form.submit()}>完成新建</BizOkButton>
                <BizCancelButton onClick={() => void toCompany(false)}>放弃新建</BizCancelButton>
              </>
            )}
          </Space>
        </Loading>
      </Col>

      <Outlet />
    </>
  )
}

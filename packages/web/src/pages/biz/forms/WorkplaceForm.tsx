import { Workplace } from '@repo/db'
import { useEffect } from 'react'
import { mutate } from 'swr'
import { Col, Form, Input, Loading, Popconfirm, Select, Space, SubmitContext } from 'tdesign-react'

import { addWorkplaceApi, deleteWorkplaceApi, editWorkplaceApi } from '@/apis/biz'
import Title from '@/components/text/Title'
import { oilPriceProvinces, useWorkplaceByPathIdsSWR } from '@/services/bizService'
import { useCustomRoute } from '@/services/routerService'

import BizCancelButton from '../buttons/BizCancelButton'
import BizEditButton from '../buttons/BizEditButton'
import BizOkButton from '../buttons/BizOkButton'
import { required, urlId, useBiz } from '../common'

const { FormItem, useForm } = Form

const defaultWorkplace: Partial<Workplace> = {}

export default function WorkplaceForm(): RC {
  const [form] = useForm()
  const { lock, setLock, companyId, workplaceId, isAddWorkplace, toWorkplace } = useBiz()

  const { data, isLoading, mutate: refresh } = useWorkplaceByPathIdsSWR(companyId, urlId(workplaceId))

  useEffect(() => void form.reset(), [companyId, form, data])

  useCustomRoute(`/biz/company/:companyId/workplace/:workplaceId`, {
    breadcrumb: data?.city,
  })

  const submitHandler = async (submit: SubmitContext) => {
    if (submit.validateResult !== true) {
      return
    }

    const formData = form.getFieldsValue(true) as Workplace
    const api = isAddWorkplace ? addWorkplaceApi : editWorkplaceApi
    const result = await api(companyId!, formData)

    await mutate(`/business/company/${companyId}/workplace`)
    setLock(null)
    if (isAddWorkplace) {
      toWorkplace(result.id)
    } else {
      refresh(result)
      form.reset()
    }
  }

  if (!workplaceId) {
    return null
  }

  return (
    <Col span={4}>
      <Loading loading={isLoading}>
        <Title>{isAddWorkplace ? `新建工作地点：` : `当前选中工作地点：`}</Title>

        <Form
          initialData={isAddWorkplace ? defaultWorkplace : data}
          form={form}
          onSubmit={submitHandler}
          disabled={lock !== 'workplace' && !isAddWorkplace}
          className="mb-6"
          resetType="initial"
          layout="vertical"
          labelAlign="top"
          colon
        >
          {!isAddWorkplace ? (
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
          {!isAddWorkplace && lock !== 'workplace' ? (
            <>
              <BizEditButton onClick={() => void setLock('workplace')} disabled={!!lock}>
                编辑
              </BizEditButton>
              <Popconfirm
                onConfirm={async () => {
                  await deleteWorkplaceApi(companyId!, workplaceId!)
                  await mutate(`/business/company/${companyId}/workplace`)
                  toWorkplace(false)
                }}
                content="确认删除此工作地点吗？"
                showArrow
              >
                <BizCancelButton disabled={!!lock}>删除</BizCancelButton>
              </Popconfirm>
            </>
          ) : !isAddWorkplace && lock === 'workplace' ? (
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
              <BizCancelButton onClick={() => void toWorkplace(false)}>放弃新建</BizCancelButton>
            </>
          )}
        </Space>
      </Loading>
    </Col>
  )
}

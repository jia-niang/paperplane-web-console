import { Workplace } from '@repo/db'
import { useEffect, useState } from 'react'
import { Form, Input, Loading, Popconfirm, Select, Space, SubmitContext } from 'tdesign-react'

import { addWorkplaceApi, deleteWorkplaceApi, editWorkplaceApi } from '@/apis/biz'
import Title from '@/components/text/Title'
import { oilPriceProvinces, useWorkplaceByPathIdsSWR } from '@/services/bizService'

import BizCancelButton from '../buttons/BizCancelButton'
import BizEditButton from '../buttons/BizEditButton'
import BizOkButton from '../buttons/BizOkButton'
import { IBizFormProps, required, urlId, useBiz } from '../common'

const { FormItem, useForm } = Form

const defaultWorkplace: Partial<Workplace> = {}

export interface IWorkplaceFormProps extends IBizFormProps {}

export default function WorkplaceForm(props: IWorkplaceFormProps): RC {
  const { locked, onLockedChange, onFresh } = props

  const [form] = useForm()
  const { companyId, workplaceId, isAddWorkplace, toWorkplace } = useBiz()
  const [isEdit, setIsEdit] = useState(false)

  const { data, isLoading, mutate: refresh } = useWorkplaceByPathIdsSWR(companyId, urlId(workplaceId))

  useEffect(() => {
    form.reset()
  }, [companyId, form, data])

  useEffect(() => {
    if (isAddWorkplace) {
      onLockedChange?.(true)
    } else {
      onLockedChange?.(isEdit)
    }
  }, [isAddWorkplace, isEdit, onLockedChange])

  const submitHandler = async (submit: SubmitContext) => {
    if (submit.validateResult !== true) {
      return
    }

    const formData = form.getFieldsValue(true) as Workplace
    const api = isAddWorkplace ? addWorkplaceApi : editWorkplaceApi
    const result = await api(companyId!, formData)

    await onFresh?.()
    if (isAddWorkplace) {
      toWorkplace(result.id)
    } else {
      setIsEdit(false)
      refresh(result)
      form.reset()
    }
  }

  if (!workplaceId) {
    return null
  }

  return (
    <Loading loading={isLoading}>
      <Title>{isAddWorkplace ? `新建工作地点：` : `当前选中工作地点：`}</Title>

      <Form
        initialData={isAddWorkplace ? defaultWorkplace : data}
        form={form}
        onSubmit={submitHandler}
        disabled={!isEdit && !isAddWorkplace}
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
        {!isAddWorkplace && !isEdit ? (
          <>
            <BizEditButton onClick={() => void setIsEdit(true)} disabled={locked}>
              编辑
            </BizEditButton>
            <Popconfirm
              onConfirm={async () => {
                await deleteWorkplaceApi(companyId!, workplaceId!)
                await onFresh?.()
                toWorkplace(false)
              }}
              content="确认删除此工作地点吗？"
              showArrow
            >
              <BizCancelButton disabled={locked}>删除</BizCancelButton>
            </Popconfirm>
          </>
        ) : !isAddWorkplace && isEdit ? (
          <>
            <BizOkButton onClick={() => void form.submit()}>完成编辑</BizOkButton>
            <BizCancelButton
              onClick={() => {
                setIsEdit(false)
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
  )
}

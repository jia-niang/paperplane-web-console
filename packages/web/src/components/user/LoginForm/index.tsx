import { css } from '@emotion/react'
import { useState } from 'react'
import { LogoGithubIcon } from 'tdesign-icons-react'
import { Form, Input, Button, InputAdornment, notification, Space } from 'tdesign-react'

import { loginApi } from '@/apis/user'
import { usePageHeader } from '@/components/layout/MainLayout/usePageHeader'
import { useGiteaHref, useGitHubHref } from '@/services/userService'

const { FormItem } = Form

export default function LoginForm(): RC {
  const pageHeader = usePageHeader()

  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)

  const githubHref = useGitHubHref()
  const giteaHref = useGiteaHref()

  const submitMessageHandler = () => {
    const username = String(form.getFieldValue('name') || '').trim()
    const password = String(form.getFieldValue('password') || '').trim()

    if (!username || !password) {
      notification.error({ title: '输入有误', content: '请检查用户名或密码是否已完整输入' })
      return
    }

    setIsLoading(true)
    loginApi(username, password)
      .then(() => {
        notification.success({ title: '登录成功' })
        pageHeader.setToolbar(null)
        form.reset()
      })
      .catch(e => {
        notification.error({ title: '登录失败', content: e.message || '请检查用户名或密码是否存在错误' })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Form
      form={form}
      layout="inline"
      disabled={isLoading}
      onSubmit={submitMessageHandler}
      labelWidth="10px"
      css={css`
        padding: 10px 0;
        justify-content: center;
        .t-form__label {
          color: #fff;
        }
      `}
    >
      <FormItem name="name">
        <InputAdornment prepend="用户名">
          <Input placeholder="输入用户名" />
        </InputAdornment>
      </FormItem>

      <FormItem name="password">
        <InputAdornment prepend="密码">
          <Input placeholder="输入密码" type="password" />
        </InputAdornment>
      </FormItem>

      <FormItem className="justify-self-end">
        <Space>
          <Button onClick={() => void form.submit()} loading={isLoading} type="button" variant="base">
            {isLoading ? '登录中' : '登录账号'}
          </Button>
          <Button href={githubHref} icon={<LogoGithubIcon />} shape="circle" ghost></Button>
          <Button href={giteaHref} shape="round" ghost>
            Gitea
          </Button>
        </Space>
      </FormItem>
    </Form>
  )
}

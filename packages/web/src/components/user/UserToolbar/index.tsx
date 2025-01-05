import { Button, Dropdown, DropdownOption, Link, notification, Space, Tag } from 'tdesign-react'

import { logoutApi } from '@/apis/user'
import { usePageHeader } from '@/components/layout/MainLayout/usePageHeader'
import LoginForm from '@/components/user/LoginForm'
import { useCurrentUserSWR } from '@/services/currentUser'

const loginFormElement = <LoginForm />

export default function UserToolbar(props: IProps): RC {
  const { className, style } = props

  const pageHeader = usePageHeader()
  const { isLoading: pendingCurrentUser, data: currentUser } = useCurrentUserSWR()

  const dropdownClickHandler = (item: DropdownOption) => {
    if (item.value === 'logout') {
      logoutApi().then(() => {
        notification.success({ title: `已成功注销` })
      })
    }
  }

  const loginedToolbar = currentUser ? (
    <>
      <Dropdown placement="left" onClick={dropdownClickHandler} options={[{ value: 'logout', content: '注销' }]}>
        <Link size="large" theme="default">
          {currentUser.name}
        </Link>
      </Dropdown>
      <Tag theme="primary" shape="round">
        {currentUser.role}
      </Tag>
    </>
  ) : null

  return (
    <Space className={className} style={style}>
      {pendingCurrentUser ? (
        <Button variant="text" shape="round" size="medium" theme="default" loading>
          加载用户信息
        </Button>
      ) : currentUser ? (
        loginedToolbar
      ) : pageHeader.toolbar === loginFormElement ? (
        <Button
          onClick={() => void pageHeader.setToolbar(false)}
          variant="outline"
          shape="round"
          size="medium"
          theme="danger"
        >
          关闭登录界面
        </Button>
      ) : (
        <Button
          onClick={() => void pageHeader.setToolbar(loginFormElement)}
          variant="outline"
          shape="round"
          size="medium"
          theme="primary"
        >
          登录账号
        </Button>
      )}
    </Space>
  )
}

import { MessageRobotType, Role } from '@repo/db'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AddIcon, CaretDownSmallIcon, CaretRightSmallIcon, CloudIcon, LoadingIcon } from 'tdesign-icons-react'
import { Button, Collapse, Space, Tree } from 'tdesign-react'

import { fetchCompanyRobotByIdsApi, fetchUserRobotByIdApi, listCompanyRobotsByCompanyIdApi } from '@/apis/robots'
import dingtalkRobotIcon from '@/assets/icon/robot-icons/logo-dingtalk.svg'
import feishukRobotIcon from '@/assets/icon/robot-icons/logo-feishu.svg'
import wechatbizRobotIcon from '@/assets/icon/robot-icons/logo-wechatbiz.svg'
import { useAllCompaniesSWR } from '@/services/bizService'
import { RobotStorageType, useLocalRobots, useUserRobotsSWR } from '@/services/robotService'
import { useAccess, useCurrentUser } from '@/services/userService'

import { defaultRobot, MessageRobotFormData, robotEmitter, useRobotEditForm } from '../common'

import './RobotSelector.scss'

const empty: any[] = []

const { Panel: CollapsePanel } = Collapse

const nodeIcon = (node: any) =>
  ({
    [MessageRobotType.DINGTALK]: <img src={dingtalkRobotIcon} />,
    [MessageRobotType.FEISHU]: <img src={feishukRobotIcon} />,
    [MessageRobotType.WXBIZ]: <img src={wechatbizRobotIcon} />,
  })[node.data.type as MessageRobotType]

const companyIcon = (node: any) =>
  !node.data.isCompany ? (
    nodeIcon(node)
  ) : node.loading ? (
    <LoadingIcon />
  ) : node.expanded ? (
    <CaretDownSmallIcon />
  ) : (
    <CaretRightSmallIcon />
  )

export default function RobotSelector(): RC {
  const treeRef = useRef(null)
  const currentUser = useCurrentUser()
  const isStaff = useAccess(Role.STAFF)

  const [collapse, setCollapse] = useState<RobotStorageType>(() =>
    currentUser ? RobotStorageType.USER : RobotStorageType.LOCAL
  )
  const { lock, setRobot, isAddRobot, storageType, companyId, robotId, select, toAddForm } = useRobotEditForm()

  const menuLock = isAddRobot || lock

  const { localRobots } = useLocalRobots()
  const { data: userRobots } = useUserRobotsSWR()
  const { data: companyList } = useAllCompaniesSWR()

  useEffect(() => {
    if (isAddRobot) {
      setRobot(defaultRobot)
    } else if (storageType === RobotStorageType.LOCAL) {
      setRobot({ ...localRobots?.find(t => t.id === robotId), __storageType: RobotStorageType.LOCAL })
    } else if (storageType === RobotStorageType.USER) {
      fetchUserRobotByIdApi(robotId!).then(r => void setRobot({ ...r, __storageType: RobotStorageType.USER }))
    } else if (storageType === RobotStorageType.COMPANY) {
      fetchCompanyRobotByIdsApi(companyId!, robotId!)
        .then(r => ({ ...r, secret: r.secret || undefined }))
        .then(r => void setRobot({ ...r, __storageType: RobotStorageType.COMPANY, __companyId: companyId }))
    }
  }, [companyId, isAddRobot, localRobots, robotId, setRobot, storageType])

  const localTree = useMemo(
    () => localRobots?.map(r => ({ label: r.name, value: r.id, type: r.type })) || empty,
    [localRobots]
  )
  const userTree = useMemo(
    () => userRobots?.map(r => ({ label: r.name, value: r.id, type: r.type })) || empty,
    [userRobots]
  )

  const [companyTreeExpanded, setCompanyTreeExpanded] = useState(() => (companyId ? [companyId] : undefined))

  const [companyRobots, setCompanyRobots] = useState<Record<string, MessageRobotFormData[]>>({})
  const companyTree = useMemo(() => {
    return (
      companyList?.map(c => ({
        label: c.company,
        value: c.id,
        isCompany: true,
        children: companyRobots[c.id] || true,
      })) || empty
    )
  }, [companyList, companyRobots])

  async function loadCompanyRobots(companyId: string) {
    const result = await listCompanyRobotsByCompanyIdApi(companyId).then(res =>
      res.map(r => ({ label: r.name, value: r.id, type: r.type }))
    )
    setCompanyRobots(t => ({ ...t, [companyId]: result }))

    return result
  }

  // 修改公司机器人后，触发 "companyRefresh" 事件，触发刷新
  useEffect(() => {
    robotEmitter.on('companyRefresh', loadCompanyRobots)

    return () => void robotEmitter.off('companyRefresh', loadCompanyRobots)
  }, [])

  // 选中某个机器人后，触发 "mod" 事件，让侧边栏自动展开
  useEffect(() => {
    const collapseActionOnSelect = (e: {
      type: RobotStorageType
      companyId: string | null
      robotId: string | null
    }) => {
      setCollapse(e.type)
    }
    robotEmitter.on('select', collapseActionOnSelect)

    return () => void robotEmitter.off('select', collapseActionOnSelect)
  }, [])

  useEffect(() => {
    if (!isAddRobot) {
      setCollapse(storageType!)
    }
  }, [isAddRobot, storageType])

  useEffect(() => {
    if (!menuLock) {
      setCollapse(storageType!)
      if (storageType === RobotStorageType.COMPANY && !companyTree.find(t => t.id === companyId)) {
        setCompanyTreeExpanded(t => [...(t || empty), companyId])
      }
    }
  }, [companyId, companyTree, menuLock, storageType])

  return (
    <Space className="robot-page__selector mt-4 w-full" direction="vertical">
      <Button
        variant={isAddRobot ? 'outline' : 'base'}
        theme="primary"
        onClick={() => void toAddForm()}
        size="small"
        shape="round"
        icon={<AddIcon />}
      >
        新的机器人
      </Button>

      <Collapse
        value={[collapse]}
        disabled={!menuLock}
        onChange={newValue => {
          if (newValue.length > 0) {
            setCollapse(newValue[0] as RobotStorageType)
          }
        }}
        expandOnRowClick
        expandMutex
      >
        <CollapsePanel header="浏览器存储" value="local">
          <Tree
            data={localTree}
            icon={nodeIcon}
            empty={<div className="text-[var(--td-text-color-placeholder)]">没有机器人</div>}
            actived={storageType === RobotStorageType.LOCAL ? [robotId] : empty}
            onActive={([id]) => {
              if (id) {
                select(RobotStorageType.LOCAL, null, id as string)
              }
            }}
            disabled={!menuLock}
            activable
            line
          />
        </CollapsePanel>

        {currentUser ? (
          <CollapsePanel header="我的" value="user" headerRightContent={<CloudIcon />}>
            <Tree
              data={userTree}
              icon={nodeIcon}
              empty={<div className="text-[var(--td-text-color-placeholder)]">没有机器人</div>}
              actived={storageType === RobotStorageType.USER ? [robotId] : empty}
              onActive={([id]) => {
                if (id) {
                  select(RobotStorageType.USER, null, id as string)
                }
              }}
              disabled={!menuLock}
              activable
              line
            />
          </CollapsePanel>
        ) : null}

        {isStaff ? (
          <CollapsePanel header="公司" value="company" headerRightContent={<CloudIcon />}>
            <Tree
              data={companyTree}
              onActive={([id], { node }) => {
                if (!node.data.isCompany && id) {
                  select(RobotStorageType.COMPANY, node.getParent().value as string, id as string)
                }
              }}
              expanded={companyTreeExpanded}
              onExpand={ids => {
                if (menuLock) {
                  setCompanyTreeExpanded(ids as any)
                }
              }}
              actived={storageType === RobotStorageType.COMPANY ? [robotId] : empty}
              empty={<div className="text-[var(--td-text-color-placeholder)]">没有公司</div>}
              load={node => loadCompanyRobots(node.data.value as string)}
              icon={companyIcon}
              ref={treeRef}
              disabled={!menuLock}
              expandOnClickNode
              activable
              line
            />
          </CollapsePanel>
        ) : null}
      </Collapse>

      {currentUser ? null : (
        <div className="mt-2 text-[var(--td-text-color-placeholder)]">登录账号后，可以云端储存机器人配置。</div>
      )}
    </Space>
  )
}

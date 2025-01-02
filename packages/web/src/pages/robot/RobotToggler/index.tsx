import { IRobotTabConfig } from '..'

import { css } from '@emotion/react'
import { noop } from 'lodash-es'
import { Tabs, Tooltip } from 'tdesign-react'

const { TabPanel } = Tabs

export interface IRobotTogglerProps extends IProps {
  value: IRobotTabConfig
  onChange(newTab: IRobotTabConfig): void
  tabConfig: IRobotTabConfig[]
}

/** 消息机器人切换器 */
export default function RobotToggler(props: IRobotTogglerProps): RC {
  const { value, onChange = noop, tabConfig } = props

  return (
    <Tabs
      size="large"
      value={value.type}
      onChange={newTabType => void onChange(tabConfig.find(t => t.type === newTabType)!)}
      className="mb-[30px]"
      css={css`
        .t-tabs__nav-scroll {
          justify-content: center;
        }
      `}
    >
      {tabConfig.map(item => (
        <TabPanel
          value={item.type}
          key={item.type}
          label={
            <Tooltip content={item.name} showArrow>
              <img src={item.icon} alt={item.name} className="h-[40px] w-[40px]" />
            </Tooltip>
          }
        />
      ))}
    </Tabs>
  )
}

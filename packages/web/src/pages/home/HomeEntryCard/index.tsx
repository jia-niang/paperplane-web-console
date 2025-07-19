import { Role } from '@repo/db'
import Atropos from 'atropos/react'
import clsx from 'clsx'
import { useMemo } from 'react'
import { NavLink } from 'react-router'
import { KeyIcon } from 'tdesign-icons-react'

import { useAccess } from '@/services/userService'

export interface IHomeEntryCardProps extends IProps {
  iconImage: string
  bgImage?: string
  href: string
  role?: Role
}

export function HomeEntryCard(props: IHomeEntryCardProps) {
  const { iconImage, bgImage, href, role, className, style, children } = props

  const isAccess = useAccess(role)

  const roleComponent = useMemo(
    () =>
      role ? (
        <div className="absolute right-0 top-0 z-10 flex items-center rounded-[0px_8px_0px_8px] bg-[rgba(255,255,255,0.3)] px-3 py-1 text-[14px] text-white">
          <span
            className="mr-2 h-[6px] w-[6px] rounded-full"
            style={{ backgroundColor: `var(${isAccess ? '--td-success-color' : '--td-error-color'})` }}
          ></span>
          <KeyIcon size="16px" className="mr-1" />
          {role}
        </div>
      ) : null,
    [role, isAccess]
  )

  return (
    <NavLink
      className={clsx(className, 'text-decoration-none relative mb-[30px] mr-[30px] inline-block')}
      style={style}
      to={isAccess ? href : '/'}
    >
      {roleComponent}

      <Atropos
        shadow={false}
        duration={150}
        activeOffset={50}
        highlight={false}
        className="inline-flex h-[140px] w-[300px] select-none rounded-[8px] text-center font-serif text-[50px] text-white"
        innerClassName="inline-flex items-center justify-center px-[20px]"
        style={{ backgroundColor: `var(--brand-main)`, backgroundImage: `url(${bgImage})`, backgroundRepeat: 'repeat' }}
      >
        <img className="h-[70px] w-[70px]" src={iconImage} alt="" />
        {children}
      </Atropos>
    </NavLink>
  )
}

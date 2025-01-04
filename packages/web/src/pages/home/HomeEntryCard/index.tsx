import { css } from '@emotion/react'
import Atropos from 'atropos/react'
import clsx from 'clsx'
import { NavLink } from 'react-router'

export interface IHomeEntryCardProps extends IProps {
  iconImage: string
  bgImage?: string
  bgColor?: string
  href: string
}

export function HomeEntryCard(props: IHomeEntryCardProps) {
  const { iconImage, bgImage, bgColor, href, className, style, children } = props

  return (
    <NavLink
      className={clsx(className, 'text-decoration-none mb-[30px] mr-[30px] inline-block')}
      style={style}
      to={href}
    >
      <Atropos
        shadow={false}
        duration={150}
        activeOffset={50}
        highlight={false}
        className="inline-flex size-[50px] h-[140px] w-[300px] select-none rounded-[8px] text-center font-serif text-white"
        innerClassName="inline-flex items-center justify-center px-[20px]"
        css={css`
          background-color: ${bgColor};
          background-image: url(${bgImage});
          background-repeat: repeat;
        `}
      >
        <img className="h-[70px] w-[70px]" src={iconImage} alt="" />
        {children}
      </Atropos>
    </NavLink>
  )
}

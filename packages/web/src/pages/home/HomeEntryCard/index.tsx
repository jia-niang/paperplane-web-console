import { css } from '@emotion/react'
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
      className={clsx(
        className,
        'text-decoration-none mb-[30px] mr-[30px] inline-flex h-[140px] w-[300px] items-center justify-center rounded-[8px]'
      )}
      style={style}
      css={css`
        background-color: ${bgColor};
        background-image: url(${bgImage});
        background-repeat: repeat;
      `}
      to={href}
    >
      <img className="h-[70px] w-[70px]" src={iconImage} alt="" />

      {children}
    </NavLink>
  )
}

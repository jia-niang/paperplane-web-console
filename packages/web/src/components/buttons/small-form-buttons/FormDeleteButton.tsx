import { ButtonProps, Popconfirm, PopconfirmProps } from 'tdesign-react'

import FormCancelButton from './FormCancelButton'

export interface IFormDeleteButtonProps extends ButtonProps {
  onConfirm?: PopconfirmProps['onConfirm']
  content?: PopconfirmProps['content']
}

export default function FormDeleteButton(props: IFormDeleteButtonProps): RC {
  const { content, onConfirm, ...rest } = props
  return (
    <Popconfirm onConfirm={onConfirm} content={content} showArrow>
      <>
        <FormCancelButton {...rest}></FormCancelButton>
      </>
    </Popconfirm>
  )
}

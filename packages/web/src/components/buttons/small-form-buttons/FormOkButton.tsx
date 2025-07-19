import { CheckIcon } from 'tdesign-icons-react'
import { Button, ButtonProps } from 'tdesign-react'

export default function FormOkButton(props: ButtonProps) {
  return <Button theme="primary" size="small" shape="round" icon={<CheckIcon />} {...props} />
}

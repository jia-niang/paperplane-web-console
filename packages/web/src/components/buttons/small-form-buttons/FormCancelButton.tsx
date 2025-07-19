import { CloseIcon } from 'tdesign-icons-react'
import { Button, ButtonProps } from 'tdesign-react'

export default function FormCancelButton(props: ButtonProps) {
  return <Button theme="danger" size="small" variant="outline" shape="round" icon={<CloseIcon />} {...props} />
}

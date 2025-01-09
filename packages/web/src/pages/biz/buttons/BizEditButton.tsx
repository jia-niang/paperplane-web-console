import { Edit1Icon } from 'tdesign-icons-react'
import { Button, ButtonProps } from 'tdesign-react'

export default function BizEditButton(props: ButtonProps) {
  return <Button theme="primary" size="small" shape="round" icon={<Edit1Icon />} {...props} />
}

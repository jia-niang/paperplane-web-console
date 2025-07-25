import axios from 'axios'
import { useEffect, useState } from 'react'
import { Upload, UploadFile } from 'tdesign-react'

import { robotUploadPresignImageApi } from '@/apis/robots'
import { getFileExtension } from '@/utils/file'

export interface IUploadImageProps {
  value?: any
  onChange?(v: string): void
}

export default function UploadImage(props: IUploadImageProps): RC {
  const { value, onChange } = props

  const [files, setFiles] = useState<UploadFile[]>([])

  useEffect(() => {
    if (!value) {
      setFiles([])
    }
  }, [onChange, value])

  const uploadHandler = async (files: UploadFile | UploadFile[]) => {
    const file = Array.isArray(files) ? files[0] : files

    const { preSignUrl, publicUrl } = await robotUploadPresignImageApi(getFileExtension(file.name))

    return await axios
      .put(preSignUrl, file.raw, { headers: { 'Content-Type': file.type } })
      .then(() => {
        onChange?.(publicUrl)

        return { status: 'success' as const, response: { url: publicUrl } }
      })
      .catch(() => ({ status: 'fail' as const, error: '上传失败，请刷新后重试', response: {} }))
  }

  return (
    <Upload
      files={files}
      onChange={value => void setFiles(value)}
      requestMethod={uploadHandler}
      theme="image"
      tips="请选择单张图片文件上传"
      accept="image/*"
    />
  )
}

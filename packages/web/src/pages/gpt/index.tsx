import { css } from '@emotion/react'
import { useLocalStorageState } from 'ahooks'
import { SetState } from 'ahooks/lib/createUseStorageState'
import dayjs from 'dayjs'
import type hljs from 'highlight.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type ReactMarkdown from 'react-markdown'
import {
  InfoCircleIcon,
  Filter3Icon,
  CheckCircleIcon,
  LoadingIcon,
  ChatBubbleHelpIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ClearIcon,
  HistoryIcon,
} from 'tdesign-icons-react'
import { Button, Col, Popconfirm, Radio, Row, Space, Tabs, Tag, Textarea, Tooltip, notification } from 'tdesign-react'

import { gptMultipleChatApi } from '@/apis/ai'
import openAiIcon from '@/assets/icon/logo-openai.svg?no-inline'
import PageLayout from '@/components/layout/PageLayout'
import { useGptSetting } from '@/services/gptService'
import { SK_GPT_RECORDS } from '@/utils/clientStore'

import '@/styles/highlight.scss'

const { TabPanel } = Tabs

const ua = navigator.userAgent.toLowerCase()
const isMacOS = /macintosh|mac os x/i.test(ua)

const defaultRecords: GptRecord[] = []

interface GptRecord {
  question: string
  num: number
  answers: string[]
  timestamp: number
}

export default function GPTPage(): RC {
  const [isLoading, setIsLoading] = useState(false)
  const isSaveHistory = useGptSetting(setting => setting.saveHistory)

  const [cursor, setCursor] = useState(0)
  const [records, setRecords] = useLocalStorageState(SK_GPT_RECORDS, {
    defaultValue: defaultRecords,
    serializer: isSaveHistory ? undefined : () => '[]',
  }) as [GptRecord[], (value?: SetState<GptRecord[]> | undefined) => void]
  const record = useMemo(() => records[records.length - 1 - cursor], [cursor, records])
  const [tabIndex, setTabIndex] = useState(0)

  const [text, setText] = useState('')
  const [num, setNum] = useState(2)

  const [mdModule, setMdModule] = useState<{ default: typeof ReactMarkdown }>()
  const [hlModule, setHlModule] = useState<{ default: typeof hljs }>()
  const Markdown = useMemo(() => mdModule?.default, [mdModule])
  const highlight = useMemo(() => hlModule?.default, [hlModule?.default])

  useEffect(() => void setTabIndex(0), [cursor])

  useEffect(() => {
    import('react-markdown').then(setMdModule)
    import('highlight.js').then(setHlModule)
  }, [])

  const renderAnswer = useCallback(
    (children: string) => {
      return Markdown ? (
        <Markdown
          css={css`
            p {
              margin: 1em 0;

              &:first-of-type {
                margin-top: 0;
              }
              &:last-of-type {
                margin-bottom: 0;
              }
            }

            ul,
            ol {
              list-style: disc;
              margin-left: 20px;
              margin-bottom: 1em;

              li {
                margin: 0.5em 0;
              }
            }

            p > code,
            li > code {
              background: #f4f4f4;
              border-radius: 4px;
              padding: 2px 4px;
            }

            pre {
              border-radius: 6px;
              padding: 10px 12px;
              background: #f2f2f3;
              overflow-x: auto;

              &::-webkit-scrollbar {
                width: 8px;
                height: 8px;
                background-color: #f9f9f9;
                border-radius: 0 0 3px 3px;
              }
              &::-webkit-scrollbar-thumb {
                background-color: rgba(131, 128, 128, 0.3);
                border-radius: 0 0 3px 3px;
              }
              &::-webkit-scrollbar-track {
                background-color: transparent;
                border-radius: 0 0 3px 3px;
              }
            }
          `}
          children={children}
          components={
            highlight
              ? {
                  code: props => {
                    const { className, children } = props
                    const language = /language-(\w+)/.exec(className || '')?.[1]

                    if (!language) {
                      return <code {...props} />
                    }

                    const highlightedCode = highlight.highlight(language, String(children)).value

                    return (
                      <code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                    )
                  },
                }
              : undefined
          }
        />
      ) : (
        <div
          css={css`
            padding: 12px 0;
            font-size: 14px;
            line-height: 22px;
            white-space: pre-wrap;
          `}
        >
          {children}
        </div>
      )
    },
    [Markdown, highlight]
  )

  const submitText = (inputText: string) => {
    const text = inputText && inputText.trim()
    if (!text) {
      return
    }

    const timestamp = new Date().getTime()
    setIsLoading(true)

    gptMultipleChatApi(text, num)
      .then(answers => {
        const newRecord = { question: text, num, answers, timestamp }
        setRecords(r => (isSaveHistory ? [...(r || []), newRecord] : [newRecord]))
        setCursor(0)
        setTabIndex(0)
        setText('')

        if (Markdown && highlight) {
          setTimeout(() => {
            document.querySelectorAll<HTMLElement>('.pa-gpt__md pre code').forEach(highlight.highlightElement)
          }, 100)
        }
      })
      .finally(() => void setIsLoading(false))
  }

  return (
    <PageLayout css={{ paddingBottom: 48 }}>
      <Row gutter={12}>
        <Col span={10}>
          <Space css={{ width: '100%' }} size="small" direction="vertical">
            <div className="pa-text pa-vc">
              向 AI 提问
              <Tooltip content="提问/回答历史仅储存在浏览器缓存中，请及时保存">
                <InfoCircleIcon css={{ margin: '0 4px', color: 'var(--td-gray-color-5)' }} />
              </Tooltip>
              ：
            </div>

            <Textarea
              onChange={setText}
              value={text}
              onKeydown={(value, { e }) => {
                if (e.code === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  submitText(value)
                }
              }}
              placeholder="输入问题，例如：中国有多少个省"
              tips={`Enter 换行，${isMacOS ? 'Command' : 'Ctrl'} + Enter 发送`}
              maxlength={200}
              rows={1}
              disabled={isLoading}
              autosize
              autofocus
            />
          </Space>
        </Col>

        <Col span={2}>
          <Space size="small" direction="vertical">
            <div className="pa-text pa-vc">
              回答数
              <Tooltip content="选择生成多个回答，会导致回答速度变慢">
                <InfoCircleIcon css={{ margin: '0 4px', color: 'var(--td-gray-color-5)' }} />
              </Tooltip>
              ：
            </div>

            <Radio.Group
              value={String(num)}
              onChange={val => void setNum(Number(val))}
              variant="primary-filled"
              disabled={isLoading}
            >
              <Radio.Button value="1">1</Radio.Button>
              <Radio.Button value="2">2</Radio.Button>
              <Radio.Button value="3">3</Radio.Button>
            </Radio.Group>
          </Space>
        </Col>
      </Row>

      <Row gutter={12} style={{ marginTop: 12 }}>
        <Col span={10}>
          <Space align="center">
            <Button
              onClick={() => void submitText(text)}
              suffix={<Filter3Icon />}
              loading={isLoading}
              type="button"
              size="large"
              variant="base"
            >
              {isLoading ? '等待…' : '发送'}
            </Button>

            <Tag
              icon={Markdown ? <CheckCircleIcon /> : <LoadingIcon />}
              shape="square"
              theme={Markdown ? 'primary' : 'warning'}
              variant="outline"
            >
              {Markdown ? '支持 markdown' : '载入 markdown 组件中'}
            </Tag>

            <Tag
              icon={highlight ? <CheckCircleIcon /> : <LoadingIcon />}
              shape="square"
              theme={highlight ? 'primary' : 'warning'}
              variant="outline"
            >
              {highlight ? '支持代码高亮' : '载入 highlight 组件中'}
            </Tag>
          </Space>
        </Col>
      </Row>

      {!record ? null : (
        <Row gutter={12} style={{ marginTop: 48, position: 'relative' }}>
          <Col span={10}>
            <Space css={{ width: '100%' }} direction="vertical">
              <div
                css={css`
                  padding: 12px;
                  border-radius: 6px;
                  background: var(--td-brand-color-7);
                  background-image: linear-gradient(90deg, var(--td-brand-color-7), #e3419e);
                `}
              >
                <div
                  className="pa-text pa-vc pa-fff"
                  css={css`
                    position: relative;

                    &::before {
                      content: '';
                      position: absolute;
                      top: 10px;
                      right: 10px;
                      width: 45px;
                      height: 45px;
                      background-image: url('${openAiIcon}');
                      background-size: contain;
                    }
                  `}
                >
                  提出的问题
                  <Tooltip content={dayjs(record.timestamp).format('YYYY-MM-DD HH:mm:ss')}>
                    <ChatBubbleHelpIcon css={{ margin: '0 4px', color: 'var(--td-gray-color-5)' }} />
                  </Tooltip>
                  ：
                </div>

                <div
                  className="pa-fff"
                  css={css`
                    padding: 12px 0;
                    padding-right: 80px;
                    margin: 0 auto 12px;
                    white-space: pre-wrap;
                  `}
                >
                  {record.question}
                </div>

                <div
                  css={css`
                    position: relative;
                  `}
                >
                  <div
                    className="pa-text pa-vc pa-fff"
                    css={css`
                      position: absolute;
                      top: 0;
                      left: 0;
                      height: var(--td-comp-size-xxl);
                      z-index: 2;
                    `}
                  >
                    AI 的回答
                    <Tooltip content="目前基于 OpenAI ChatGPT 4o">
                      <InfoCircleIcon css={{ margin: '0 4px', color: 'var(--td-gray-color-5)' }} />
                    </Tooltip>
                    ：
                  </div>

                  <Tabs
                    placement="top"
                    size="medium"
                    theme="card"
                    value={tabIndex}
                    onChange={e => void setTabIndex(Number(e))}
                    css={css`
                      background-color: transparent !important;

                      .t-tabs__nav-scroll {
                        justify-content: right;
                      }
                      .t-tabs__nav--card {
                        background-color: transparent;
                      }
                      .t-tabs__nav--card.t-tabs__nav-item:last-of-type {
                        border-right: none;
                      }
                      .t-tabs__nav--card.t-tabs__nav-item:not(:first-of-type) {
                        border-left: none;
                      }
                      .t-tabs__nav--card.t-tabs__nav-item {
                        color: var(--td-brand-color);
                        border-bottom: none;

                        &:not(.t-is-active) {
                          color: #fff;
                        }
                      }
                      .t-tabs__content {
                        background-color: #fff;
                        border-radius: 4px 0 4px 4px;
                        padding: 12px 12px;
                      }
                      .t-tabs__nav--card {
                        overflow: hidden;
                        border-radius: 6px 6px 0 0;
                      }
                      .t-tabs__nav--card.t-tabs__nav-item:not(.t-is-disabled) :not(.t-is-active):hover {
                        color: var(--brand-main);
                      }
                    `}
                  >
                    {record.answers.map((answer, index) => (
                      <TabPanel key={index} value={index} label={`回答 ${index + 1}`}>
                        {renderAnswer(answer)}
                      </TabPanel>
                    ))}
                  </Tabs>
                </div>
              </div>
            </Space>
          </Col>

          <Col style={{ position: 'sticky', right: 12, top: 12 }} span={2}>
            <div
              css={css`
                padding: 4px;
                border-radius: 6px;
                background: var(--td-brand-color-7);
                background-image: linear-gradient(90deg, #e3419e, #ff7747);
              `}
            >
              <div
                css={css`
                  padding: 12px;
                  border-radius: 3px;
                  background: #fff;
                `}
              >
                <Space css={{ width: '100%' }} direction="vertical" align="center">
                  <div className="pa-text" css={{ textAlign: 'center' }}>
                    {cursor <= 0 ? '当前回答' : `第 ${records.length - cursor}/${records.length} 个`}
                  </div>

                  {isSaveHistory ? (
                    <Space size="small" css={{ width: '100%' }}>
                      <Button
                        onClick={() => void setCursor(c => c + 1)}
                        disabled={cursor >= records.length - 1}
                        variant="outline"
                        icon={<ArrowLeftIcon />}
                        size="small"
                        theme="primary"
                        block
                      />
                      <Button
                        onClick={() => void setCursor(c => c - 1)}
                        disabled={cursor <= 0}
                        variant="outline"
                        icon={<ArrowRightIcon />}
                        size="small"
                        theme="primary"
                        block
                      />
                    </Space>
                  ) : null}

                  {cursor <= 0 ? null : (
                    <Button onClick={() => void setCursor(0)} block>
                      返回最新
                    </Button>
                  )}

                  <Popconfirm
                    onConfirm={() => {
                      useGptSetting.setState({ saveHistory: !isSaveHistory })
                      notification.success({
                        title: '操作成功',
                        content: `已${isSaveHistory ? '停止' : '开启'}记录问答历史`,
                      })

                      if (!isSaveHistory) {
                        setRecords(t => t!)
                      } else {
                        setRecords(defaultRecords)
                      }
                    }}
                    content={`确认${isSaveHistory ? '停止' : '开启'}记录问答历史吗？`}
                    showArrow
                    theme="default"
                  >
                    <>
                      <Button variant="text" theme="primary" shape="round" size="small" icon={<HistoryIcon />} block>
                        {isSaveHistory ? '停止' : '开启'}记录
                      </Button>
                    </>
                  </Popconfirm>

                  <Popconfirm
                    onConfirm={() => {
                      setCursor(0)
                      setRecords(defaultRecords)
                      notification.success({ title: '操作成功', content: '问答历史已清空' })
                    }}
                    content="确认清空问答历史吗？"
                    showArrow
                    theme="default"
                  >
                    <>
                      <Button variant="text" theme="primary" shape="round" size="small" icon={<ClearIcon />} block>
                        清空历史
                      </Button>
                    </>
                  </Popconfirm>
                </Space>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </PageLayout>
  )
}

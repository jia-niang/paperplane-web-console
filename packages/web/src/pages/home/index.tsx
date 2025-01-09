import { Role } from '@repo/db'

import robotBg from '@/assets/bg/brick-wall.png'
import bizBg from '@/assets/bg/cutcube.png'
import openAiBg from '@/assets/bg/escheresque.png'
import bizIcon from '@/assets/icon/logo-biz.svg'
import openAiIcon from '@/assets/icon/logo-openai.svg'
import robotIcon from '@/assets/icon/logo-robot.svg'
import PageLayout from '@/components/layout/PageLayout'

import { HomeEntryCard } from './HomeEntryCard'

// 背景纹理图推荐来源：https://www.transparenttextures.com/
// SVG 矢量图标推荐来源：https://www.svgrepo.com/

export default function HomePage(): RC {
  return (
    <PageLayout>
      <div className="mb-[-60px] mr-[-60px]">
        <HomeEntryCard iconImage={openAiIcon} bgImage={openAiBg} href="/gpt">
          <div className="text-decoration-none ml-[18px] text-[40px] text-white">GPT-4o</div>
        </HomeEntryCard>

        <HomeEntryCard iconImage={robotIcon} bgImage={robotBg} href="/robot">
          <div className="text-decoration-none ml-[18px] text-center text-white">
            <div className="text-[30px]">OA 机器人</div>
            <div className="text-[18px]">（企微/钉钉/飞书）</div>
          </div>
        </HomeEntryCard>

        <HomeEntryCard iconImage={bizIcon} bgImage={bizBg} href="/biz" role={Role.USER}>
          <div className="text-decoration-none ml-[18px] text-[26px] leading-[1.3em] text-white">
            公司/工作地
            <br />
            数据后台
          </div>
        </HomeEntryCard>
      </div>
    </PageLayout>
  )
}

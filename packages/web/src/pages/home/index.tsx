import robotBg from '@/assets/bg/batthern.png'
import shortsBg from '@/assets/bg/black-thread-light.png'
import nginxBg from '@/assets/bg/brick-wall.png'
import gitBg from '@/assets/bg/climpek.png'
import canvasBg from '@/assets/bg/cutcube.png'
import openAiBg from '@/assets/bg/escheresque.png'
import canvasIcon from '@/assets/icon/logo-canvas.svg'
import gitIcon from '@/assets/icon/logo-git.svg'
import nginxIcon from '@/assets/icon/logo-nginx.svg'
import openAiIcon from '@/assets/icon/logo-openai.svg'
import robotIcon from '@/assets/icon/logo-robot.svg'
import shortsIcon from '@/assets/icon/logo-shorts.svg'
import PageLayout from '@/components/layout/PageLayout'

import { HomeEntryCard } from './HomeEntryCard'

// 背景纹理图推荐来源：https://www.transparenttextures.com/
// SVG 矢量图标推荐来源：https://www.svgrepo.com/

export default function HomePage(): RC {
  return (
    <PageLayout>
      <div className="mb-[-60px] mr-[-60px]">
        <HomeEntryCard iconImage={openAiIcon} bgColor="#9B3DB3" bgImage={openAiBg} href="/gpt">
          <div className="text-decoration-none ml-[18px] text-[40px] text-white">GPT-3.5</div>
        </HomeEntryCard>

        <HomeEntryCard iconImage={robotIcon} bgColor="#E4419D" bgImage={robotBg} href="/robot">
          <div className="text-decoration-none ml-[18px] text-center text-white">
            <div className="text-[30px]">消息机器人</div>
            <div className="text-[18px]">（企微/钉钉/飞书）</div>
          </div>
        </HomeEntryCard>

        <HomeEntryCard iconImage={nginxIcon} bgColor="#FF6D54" bgImage={nginxBg} href="/">
          <div className="text-decoration-none ml-[18px] text-center text-white">
            <div className="text-[30px]">Nginx 助手</div>
            <div className="text-[18px]">（未完工）</div>
          </div>
        </HomeEntryCard>

        <HomeEntryCard iconImage={shortsIcon} bgColor="#B13CB0" bgImage={shortsBg} href="/">
          <div className="text-decoration-none ml-[18px] text-center text-white">
            <div className="text-[30px]">短网址生成</div>
            <div className="text-[18px]">（未完工）</div>
          </div>
        </HomeEntryCard>

        <HomeEntryCard iconImage={gitIcon} bgColor="#F04691" bgImage={gitBg} href="/">
          <div className="text-decoration-none ml-[18px] text-center text-white">
            <div className="text-[30px]">Git 周报助手</div>
            <div className="text-[18px]">（未完工）</div>
          </div>
        </HomeEntryCard>

        <HomeEntryCard iconImage={canvasIcon} bgColor="#FF665C" bgImage={canvasBg} href="/">
          <div className="text-decoration-none ml-[18px] text-center text-white">
            <div className="text-[30px]">Canvas 画板</div>
            <div className="text-[18px]">（未完工）</div>
          </div>
        </HomeEntryCard>
      </div>
    </PageLayout>
  )
}

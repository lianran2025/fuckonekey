import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../src/generated/prisma'

const prisma = new PrismaClient()

// 随机获取昵称API
async function getRandomNickname() {
  // 优先 randomuser.me，带随机 seed
  try {
    const seed = Math.random().toString(36).substring(2, 10);
    const res = await fetch(`https://randomuser.me/api/?inc=name&noinfo&nat=us&results=1&seed=${seed}`);
    const data = await res.json();
    if (data?.results?.[0]?.name?.first) {
      return data.results[0].name.first;
    }
  } catch {}
  // 兜底 fakerapi.it，带随机 seed
  try {
    const res = await fetch(`https://fakerapi.it/api/v1/persons?_quantity=1&_seed=${Date.now()}`);
    const data = await res.json();
    if (data?.data?.[0]?.firstname) {
      return data.data[0].firstname;
    }
  } catch {}
  // 最后兜底
  return 'Anonymous' + Math.floor(Math.random() * 10000);
}

// 随机获取头像API
function getRandomAvatar(seed: string) {
  const apis: ((s: string) => string)[] = [
    (s: string) => `https://api.dicebear.com/7.x/adventurer/svg?seed=${s}`,
    (s: string) => `https://api.dicebear.com/7.x/bottts/svg?seed=${s}`,
    (s: string) => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${s}`,
    (s: string) => `https://api.multiavatar.com/${s}.svg`,
    (s: string) => `https://robohash.org/${s}?set=set${Math.ceil(Math.random()*3)}`
  ];
  const api = apis[Math.floor(Math.random() * apis.length)];
  return api(seed);
}

export async function GET() {
  try {
    const comments = await prisma.oneKeyFeedback.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(comments)
  } catch (error) {
    console.error('获取评论失败:', error)
    return NextResponse.json(
      { error: '获取评论失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json()
    const ip = request.headers.get('x-forwarded-for') || 'unknown'

    // 全API生成头像和昵称
    const nickname = await getRandomNickname();
    const avatarSeed = `${nickname}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const avatar = getRandomAvatar(avatarSeed);

    const comment = await prisma.oneKeyFeedback.create({
      data: {
        content,
        ip,
        avatar,
        nickname,
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('创建评论失败:', error)
    return NextResponse.json(
      { error: '创建评论失败' },
      { status: 500 }
    )
  }
} 
import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../src/generated/prisma'

const prisma = new PrismaClient()

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

    // 随机头像和昵称生成
    const names = ['Alex', 'Sam', 'Taylor', 'Jordan', 'Casey', 'Morgan', 'Jamie', 'Riley', 'Drew', 'Skyler']
    const animals = ['Cat', 'Dog', 'Fox', 'Bear', 'Wolf', 'Tiger', 'Lion', 'Panda', 'Koala', 'Otter']
    const nickname = `${names[Math.floor(Math.random() * names.length)]} ${animals[Math.floor(Math.random() * animals.length)]}`
    const avatarSeed = Math.random().toString(36).substring(2, 10)
    const avatar = `https://api.dicebear.com/7.x/thumbs/svg?seed=${avatarSeed}`

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
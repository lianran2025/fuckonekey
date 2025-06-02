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

    const comment = await prisma.oneKeyFeedback.create({
      data: {
        content,
        ip,
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
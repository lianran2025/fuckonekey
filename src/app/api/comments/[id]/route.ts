import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../src/generated/prisma'

const prisma = new PrismaClient()
const SESSION_COOKIE = 'admin_session'
const SESSION_VALUE = 'ok'

function isAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || ''
  return cookie.includes(`${SESSION_COOKIE}=${SESSION_VALUE}`)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }
  try {
    await prisma.oneKeyFeedback.update({
      where: { id: params.id },
      data: { isDeleted: true },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除评论失败:', error)
    return NextResponse.json(
      { error: '删除评论失败' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }
  try {
    const { status, reply } = await request.json()
    const data: any = {}
    if (status !== undefined) data.status = status
    if (reply !== undefined) data.reply = reply
    const comment = await prisma.oneKeyFeedback.update({
      where: { id: params.id },
      data,
    })
    return NextResponse.json(comment)
  } catch (error) {
    console.error('更新评论失败:', error)
    return NextResponse.json(
      { error: '更新评论失败' },
      { status: 500 }
    )
  }
} 
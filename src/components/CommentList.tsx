'use client'

import { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import Masonry from 'react-masonry-css'

interface Comment {
  id: string
  content: string
  createdAt: string
  status: string
  category?: string
  reply?: string
  avatar?: string
  nickname?: string
}

interface CommentListProps {
  lang?: 'zh' | 'en'
  defaultFilter?: 'all' | 'approved' | 'rejected' | 'pending'
  onCollapse?: () => void
}

const TEXT = {
  zh: {
    status: { approved: '已采纳', rejected: '已拒绝', pending: '待处理' },
    filters: { all: '全部', approved: '已采纳', rejected: '已拒绝', pending: '待处理' },
    noComment: '暂无评论，来说点什么吧！',
    reply: '官方回复',
    time: (date: string) => date,
  },
  en: {
    status: { approved: 'Approved', rejected: 'Rejected', pending: 'Pending' },
    filters: { all: 'All', approved: 'Approved', rejected: 'Rejected', pending: 'Pending' },
    noComment: 'No comments yet. Be the first!',
    reply: 'Official Reply',
    time: (date: string) => new Date(date).toLocaleString('en-US'),
  },
}

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-green-50 text-green-600 border-green-100',
  rejected: 'bg-red-50 text-red-600 border-red-100',
  pending: 'bg-gray-100 text-gray-500 border-gray-200',
}

const FILTERS = ['all', 'approved', 'rejected', 'pending'] as const

// Masonry断点
const breakpointColumnsObj = {
  default: 3,   // 超大屏幕3列
  1280: 2,     // 1280px以下2列
  900: 1,      // 900px以下1列
}

function formatTime(dateStr: string, lang: 'zh' | 'en') {
  const date = new Date(dateStr)
  return date.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function CommentCard({ comment, lang, t }: { comment: Comment; lang: 'zh' | 'en'; t: any }) {
  return (
    <div className="group bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-6 flex flex-col gap-4 min-h-[200px] transition-all duration-200 hover:shadow-2xl hover:border-yellow-300 hover:-translate-y-2 hover:bg-gray-50">
      <div className="flex items-center gap-3 mb-2">
        <img src={comment.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover bg-gray-200 border border-gray-300" />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 text-base group-hover:text-yellow-600 transition">{comment.nickname || 'Anonymous'}</span>
          <span className="text-xs text-gray-400">用户</span>
        </div>
      </div>
      <div className="text-gray-800 text-base text-left leading-relaxed break-words whitespace-pre-line w-full">{comment.content}</div>
      {comment.reply && (
        <div className="mt-3 rounded-lg bg-orange-50 border-l-4 border-orange-400 px-4 py-2 w-full">
          <div className="text-xs text-orange-600 font-semibold mb-1">{t.reply}</div>
          <div className="text-orange-900 text-sm whitespace-pre-line">{comment.reply}</div>
        </div>
      )}
      <div className="mt-4 text-3xl text-orange-400 w-full flex justify-end pr-2 group-hover:scale-110 group-hover:text-yellow-400 transition">“”</div>
    </div>
  )
}

export const CommentList = forwardRef<{ fetchComments: () => Promise<void> }, CommentListProps>(
  ({ lang = 'zh', defaultFilter = 'pending', onCollapse }, ref) => {
    const [comments, setComments] = useState<Comment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState<typeof FILTERS[number]>(defaultFilter)
    const t = TEXT[lang]

    const fetchComments = useCallback(async () => {
      try {
        const response = await fetch('/api/comments')
        if (!response.ok) {
          throw new Error('获取评论失败')
        }
        const data = await response.json()
        setComments(data)
      } catch (error) {
        console.error('获取评论失败:', error)
      } finally {
        setIsLoading(false)
      }
    }, [])

    useImperativeHandle(ref, () => ({
      fetchComments,
    }))

    useEffect(() => {
      fetchComments()
    }, [fetchComments])

    useEffect(() => {
      setFilter(defaultFilter)
    }, [defaultFilter])

    const filteredComments = filter === 'all' ? comments : comments.filter((c) => c.status === filter)

    if (isLoading) {
      return <div className="text-center py-8 text-gray-400">加载中...</div>
    }

    return (
      <>
        {/* 收起评论按钮放在顶部 */}
        {onCollapse && (
          <div className="flex justify-end mb-4">
            <button
              className="px-4 py-1 rounded-full bg-gray-800 hover:bg-gray-700 text-yellow-300 text-sm font-bold shadow"
              onClick={onCollapse}
            >
              隐藏评论
            </button>
          </div>
        )}
        {/* 筛选控件 */}
        <div className="flex gap-2 mb-4">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`px-3 py-1 rounded-full text-sm font-medium transition
                ${filter === f
                  ? 'bg-yellow-300 text-gray-900 shadow'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
              `}
              onClick={() => setFilter(f)}
            >
              {t.filters[f as keyof typeof t.filters]}
            </button>
          ))}
        </div>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto gap-8"
          columnClassName="masonry-column flex flex-col gap-10"
        >
          {filteredComments.map((comment) => (
            <div className="group bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-6 flex flex-col gap-4 min-h-[200px] transition-all duration-200 hover:shadow-2xl hover:border-yellow-300 hover:-translate-y-2 hover:bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <img src={comment.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover bg-gray-200 border border-gray-300" />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 text-base group-hover:text-yellow-600 transition">{comment.nickname || 'Anonymous'}</span>
                  <span className="text-xs text-gray-400">用户</span>
                </div>
              </div>
              <div className="text-gray-800 text-base text-left leading-relaxed break-words whitespace-pre-line w-full">{comment.content}</div>
              {comment.reply && (
                <div className="mt-3 rounded-lg bg-orange-50 border-l-4 border-orange-400 px-4 py-2 w-full">
                  <div className="text-xs text-orange-600 font-semibold mb-1">{t.reply}</div>
                  <div className="text-orange-900 text-sm whitespace-pre-line">{comment.reply}</div>
                </div>
              )}
              <div className="mt-4 text-3xl text-orange-400 w-full flex justify-end pr-2 group-hover:scale-110 group-hover:text-yellow-400 transition">“”</div>
            </div>
          ))}
        </Masonry>
        {filteredComments.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            {t.noComment}
          </div>
        )}
      </>
    )
  }
) 
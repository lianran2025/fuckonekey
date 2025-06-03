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
    <div className="bg-white rounded-2xl shadow-lg px-7 py-6 flex flex-col gap-3 hover:shadow-2xl transition-all min-h-[180px]">
      <div className="flex items-center gap-3 mb-2">
        <img src={comment.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover bg-gray-100 border" />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 text-base">{comment.nickname || 'Anonymous'}</span>
          <span className="text-xs text-gray-400">{formatTime(comment.createdAt, lang)}</span>
        </div>
        <span className={`ml-auto px-2 py-0.5 text-xs rounded-full font-medium border ${STATUS_COLORS[comment.status] || STATUS_COLORS['pending']}`}>{t.status[comment.status as keyof typeof t.status] || '未知'}</span>
      </div>
      <p className="text-gray-800 text-base leading-relaxed break-words whitespace-pre-line">{comment.content}</p>
      {comment.reply && (
        <div className="mt-3 rounded-lg bg-indigo-50 border-l-4 border-indigo-400 px-4 py-2">
          <div className="text-xs text-indigo-500 font-semibold mb-1">{t.reply}</div>
          <div className="text-indigo-900 text-sm whitespace-pre-line">{comment.reply}</div>
        </div>
      )}
    </div>
  )
}

export const CommentList = forwardRef<{ fetchComments: () => Promise<void> }, CommentListProps>(
  ({ lang = 'zh', defaultFilter = 'pending' }, ref) => {
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
        {/* 筛选控件 */}
        <div className="flex gap-2 mb-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`px-3 py-1 rounded-full border text-sm font-medium transition
                ${filter === f
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}
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
          columnClassName="masonry-column flex flex-col gap-8"
        >
          {filteredComments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} lang={lang} t={t} />
          ))}
        </Masonry>
        {filteredComments.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            {t.noComment}
          </div>
        )}
      </>
    )
  }
) 
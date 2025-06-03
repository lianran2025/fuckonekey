'use client'

import { useState, useEffect } from 'react'

interface Comment {
  id: string
  content: string
  createdAt: string
  status: string
  category?: string
  reply?: string
}

const STATUS_LABELS: Record<string, string> = {
  approved: '已采纳',
  rejected: '已拒绝',
  pending: '待处理',
}
const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-green-50 text-green-600 border-green-100',
  rejected: 'bg-red-50 text-red-600 border-red-100',
  pending: 'bg-gray-100 text-gray-500 border-gray-200',
}

async function checkSession() {
  // 用一个专门的API校验更清晰，这里直接用 /api/comments 也可以
  const res = await fetch('/api/comments', { credentials: 'include' })
  return res.status !== 401
}

export default function AdminPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [replyLoading, setReplyLoading] = useState<Record<string, boolean>>({})

  // 每次页面加载都校验 session
  useEffect(() => {
    setIsLoading(true)
    checkSession().then(isAuth => {
      setIsAuthenticated(isAuth)
      setIsLoading(false)
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
      credentials: 'include',
    })
    if (res.ok) {
      setIsAuthenticated(true)
      setPassword('')
    } else {
      const data = await res.json()
      setLoginError(data.error || '登录失败')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    setIsAuthenticated(false)
    setComments([])
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (response.ok) {
        setComments(comments.filter(comment => comment.id !== id))
      }
    } catch (error) {
      console.error('删除评论失败:', error)
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
        credentials: 'include',
      })
      if (response.ok) {
        setComments(comments.map(comment =>
          comment.id === id ? { ...comment, status } : comment
        ))
      }
    } catch (error) {
      console.error('更新评论状态失败:', error)
    }
  }

  const handleReplyChange = (id: string, value: string) => {
    setReplyDrafts((prev) => ({ ...prev, [id]: value }))
  }

  const handleReplySubmit = async (id: string) => {
    setReplyLoading((prev) => ({ ...prev, [id]: true }))
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply: replyDrafts[id] }),
        credentials: 'include',
      })
      if (response.ok) {
        const updated = await response.json()
        setComments(comments.map(comment =>
          comment.id === id ? { ...comment, reply: updated.reply } : comment
        ))
      }
    } catch (error) {
      console.error('回复失败:', error)
    } finally {
      setReplyLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  // 登录后拉取评论
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true)
      const fetchComments = async () => {
        try {
          const response = await fetch('/api/comments', { credentials: 'include' })
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
      }
      fetchComments()
    }
  }, [isAuthenticated])

  if (isLoading) {
    return <div className="text-center p-8">加载中...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          <h1 className="text-2xl font-bold text-center mb-8">管理员登录</h1>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            登录
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-10 px-2">
      <main className="w-full max-w-3xl mx-auto bg-white/90 rounded-2xl shadow-xl p-6 md:p-10 flex flex-col gap-8">
        <div className="text-center space-y-2 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">评论管理后台</h1>
            <p className="text-base text-gray-500">可对评论进行分类、删除和官方回复</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 px-4 py-2 rounded bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300"
          >退出登录</button>
        </div>
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-xl shadow-md px-5 py-4 flex flex-col gap-3 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium border ${STATUS_COLORS[comment.status] || STATUS_COLORS['pending']}`}>
                  {STATUS_LABELS[comment.status] || '未知'}
                </span>
                {comment.category && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-50 text-indigo-600 font-medium border border-indigo-100 ml-1">
                    {comment.category}
                  </span>
                )}
                <span className="text-xs text-gray-400 ml-auto">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-800 text-base leading-relaxed break-words whitespace-pre-line font-medium">
                {comment.content}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <select
                  value={comment.status}
                  onChange={(e) => handleUpdateStatus(comment.id, e.target.value)}
                  className="rounded-md border-gray-300 text-xs px-2 py-1"
                >
                  <option value="pending">待处理</option>
                  <option value="approved">已采纳</option>
                  <option value="rejected">已拒绝</option>
                </select>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded border border-red-100 bg-red-50"
                >
                  删除
                </button>
              </div>
              {/* 回复区块 */}
              <div className="mt-2 flex flex-col gap-2 bg-indigo-50/60 rounded-lg p-3 border border-indigo-100">
                <label className="text-xs text-indigo-600 font-semibold mb-1">官方回复：</label>
                <textarea
                  className="w-full rounded border border-gray-200 p-2 text-sm focus:ring-indigo-200 focus:border-indigo-400 bg-white"
                  rows={2}
                  placeholder="输入回复内容..."
                  value={replyDrafts[comment.id] ?? comment.reply ?? ''}
                  onChange={e => handleReplyChange(comment.id, e.target.value)}
                />
                <div className="flex justify-end">
                  <button
                    className="px-4 py-1 rounded bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 shadow"
                    disabled={replyLoading[comment.id]}
                    onClick={() => handleReplySubmit(comment.id)}
                    type="button"
                  >
                    {replyLoading[comment.id] ? '提交中...' : '提交回复'}
                  </button>
                </div>
                {comment.reply && (
                  <div className="text-green-600 text-xs mt-1">已回复：{comment.reply}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="mt-8 text-gray-400 text-xs text-center">OneKey 管理后台</footer>
    </div>
  )
} 
'use client'

import { useState } from 'react'

interface CommentFormProps {
  onCommentSubmitted?: () => void
  lang?: 'zh' | 'en'
  title?: string
  subtitle?: string
  onLangSwitch?: () => void
  onShowComments?: () => void
}

const TEXT = {
  zh: {
    label: '分享你的想法',
    placeholder: '写下你对 OneKey 产品的建议或反馈...',
    submit: '提交',
    submitting: '提交中...',
    success: '提交成功！',
  },
  en: {
    label: 'Share your thoughts',
    placeholder: 'Write your suggestions or feedback about OneKey...',
    submit: 'Submit',
    submitting: 'Submitting...',
    success: 'Submitted!',
  },
}

export function CommentForm({ onCommentSubmitted, lang = 'zh', title, subtitle, onLangSwitch, onShowComments }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const t = TEXT[lang]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error('提交失败')
      }

      setContent('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 1500)
      onCommentSubmitted?.()
    } catch (error) {
      console.error('提交评论失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex justify-center">
      <div className="w-full max-w-3xl bg-gray-900 rounded-xl md:rounded-2xl shadow-2xl md:px-6 px-3 md:py-6 py-3">
        <div className="flex items-center flex-nowrap">
          {/* OneKey图标 */}
          <img src="https://tuchuang6662025.oss-cn-hangzhou.aliyuncs.com/onekey_icon_mono_white.png" alt="OneKey" className="w-8 h-8 mr-2" />
          {/* 输入框 */}
          <input
            type="text"
            className="flex-1 min-w-0 bg-transparent outline-none text-white text-xl placeholder-gray-400 opacity-60 border-0 placeholder:text-base"
            placeholder={t.placeholder}
            value={content}
            onChange={e => setContent(e.target.value)}
            maxLength={500}
            required
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit(e); }}
          />
          {/* Send按钮 */}
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="ml-2 w-16 md:w-20 h-12 rounded-full bg-yellow-300 text-gray-900 font-bold text-lg shadow-lg transition hover:bg-yellow-400 disabled:opacity-60 flex-shrink-0"
          >
            {isSubmitting ? t.submitting : (lang === 'zh' ? '提交' : 'Send')}
          </button>
        </div>
        <div className="flex gap-4 justify-center md:justify-end mt-3">
          {/* 语言切换按钮 */}
          <button
            type="button"
            onClick={onLangSwitch}
            className="px-4 py-2 rounded-full bg-gray-700 text-gray-400 font-bold text-lg shadow-lg transition hover:bg-gray-600 disabled:opacity-60"
          >
            {lang === 'zh' ? 'English' : '中文'}
          </button>
          {/* 显示评论按钮 */}
          <button
            type="button"
            onClick={onShowComments}
            className="px-4 py-2 rounded-full bg-gray-700 text-gray-400 font-bold text-lg shadow-lg transition hover:bg-gray-600 disabled:opacity-60"
          >
            显示评论
          </button>
        </div>
      </div>
      {success && <span className="text-green-400 text-base ml-4 self-center">{t.success}</span>}
    </form>
  )
} 
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
    placeholder: '说出你对 OneKey 的建议',
    submit: '提交',
    submitting: '提交中...',
    success: '提交成功！',
  },
  en: {
    label: 'Share your thoughts',
    placeholder: 'Share your suggestions for OneKey',
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
        {/* OneKey图标上方居中 */}
        <div className="flex justify-center mb-3">
          <img src="https://tuchuang6662025.oss-cn-hangzhou.aliyuncs.com/onekey_icon_mono_white.png" alt="OneKey" className="w-10 h-10" />
        </div>
        {/* 输入框 */}
        <textarea
          rows={1}
          className="w-full max-w-xs mx-auto md:max-w-2xl min-w-0 bg-transparent outline-none text-white text-base placeholder-gray-400 opacity-60 border-0 placeholder:text-base px-2 py-2 md:px-4 md:py-3 resize-none overflow-hidden"
          placeholder={t.placeholder}
          value={content}
          onChange={e => setContent(e.target.value)}
          maxLength={500}
          required
          onInput={e => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = target.scrollHeight + 'px';
          }}
        />
        {/* 操作区：左提交，右语言切换和查看评论 */}
        <div className="flex justify-between items-center mt-2 w-full max-w-xs mx-auto md:max-w-2xl">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="h-10 rounded-full bg-yellow-300 text-gray-900 font-bold text-base shadow-lg transition hover:bg-yellow-400 disabled:opacity-60 px-8
              sm:h-auto sm:px-3 sm:py-1 sm:text-sm"
          >
            {isSubmitting ? t.submitting : (lang === 'zh' ? '提交' : 'Send')}
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onLangSwitch}
              className="text-gray-400 hover:text-gray-200 transition text-xl"
              aria-label="切换语言"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onShowComments}
              className="text-gray-400 hover:text-gray-200 transition text-xl"
              aria-label="查看评论"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {success && <span className="text-green-400 text-base ml-4 self-center">{t.success}</span>}
    </form>
  )
} 
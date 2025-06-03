'use client'

import { useState } from 'react'

interface CommentFormProps {
  onCommentSubmitted?: () => void
  lang?: 'zh' | 'en'
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

export function CommentForm({ onCommentSubmitted, lang = 'zh' }: CommentFormProps) {
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
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 items-center bg-white/80 rounded-xl shadow p-6">
      <textarea
        id="comment"
        rows={4}
        className="w-full md:w-[90%] md:max-w-2xl mx-auto rounded-2xl p-5 text-lg bg-white shadow-md border-0 focus:ring-2 focus:ring-indigo-100 transition text-gray-800 placeholder-gray-400 resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t.placeholder}
        required
        maxLength={500}
      />
      <div className="flex items-center gap-3 w-full md:w-[90%] md:max-w-2xl mx-auto">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-2 text-base font-semibold text-white shadow-md hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 transition disabled:opacity-60"
        >
          {isSubmitting ? t.submitting : t.submit}
        </button>
        {success && <span className="text-green-500 text-sm">{t.success}</span>}
      </div>
    </form>
  )
} 
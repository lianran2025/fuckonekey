'use client'

import { useRef, useState, useEffect } from 'react'
import { CommentList } from '@/components/CommentList'
import { CommentForm } from '@/components/CommentForm'
import { GlobeAltIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

const TEXT = {
  zh: {
    title: 'Fuck OneKey',
    subtitle: 'OneKey 产品哪里用着不爽？别客气，尽管说',
    footer: 'Made with ❤️ by OneKey Community',
    showComments: '查看其他人怎么说',
    hideComments: '收起评论',
  },
  en: {
    title: 'Fuck OneKey',
    subtitle: "What's annoying about OneKey? Don't hold back, just say it.",
    footer: 'Made with ❤️ by OneKey Community',
    showComments: 'See what others say',
    hideComments: 'Hide comments',
  },
}

export default function Home() {
  const commentListRef = useRef<{ fetchComments: () => Promise<void> }>(null)
  const [lang, setLang] = useState<'zh' | 'en'>('zh')
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lang')
    if (saved === 'en' || saved === 'zh') setLang(saved)
  }, [])

  const handleLangSwitch = (l: 'zh' | 'en') => {
    setLang(l)
    localStorage.setItem('lang', l)
  }

  const handleCommentSubmitted = () => {
    setShowComments(true)
    commentListRef.current?.fetchComments()
  }

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col justify-center items-center px-2">
      <div className="w-full max-w-5xl mx-auto relative">
        <main className="w-full bg-gray-900 rounded-3xl shadow-2xl p-10 md:p-16 flex flex-col gap-8 items-center">
          <CommentForm 
            onCommentSubmitted={handleCommentSubmitted} 
            lang={lang} 
            onLangSwitch={() => handleLangSwitch(lang === 'zh' ? 'en' : 'zh')}
            onShowComments={!showComments ? () => setShowComments(true) : undefined}
          />
          {/* 操作icon，表单下方右对齐 */}
          <div className="w-full max-w-3xl flex justify-end mt-2 mx-auto">
            <div className="flex gap-3">
              {/* 地球icon */}
              <button type="button" className="text-gray-400 hover:text-gray-200 transition" aria-label="切换语言" onClick={() => handleLangSwitch(lang === 'zh' ? 'en' : 'zh')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </button>
              {/* 气泡icon */}
              <button type="button" className="text-gray-400 hover:text-gray-200 transition" aria-label="展开评论" onClick={() => setShowComments(v => !v)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </button>
            </div>
          </div>
          {showComments && (
            <div className="w-full mt-6 animate-fade-in">
              <CommentList ref={commentListRef} lang={lang} defaultFilter="pending" />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

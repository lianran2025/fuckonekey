'use client'

import { useRef, useState, useEffect } from 'react'
import { CommentList } from '@/components/CommentList'
import { CommentForm } from '@/components/CommentForm'

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
    commentListRef.current?.fetchComments()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-3xl mx-auto relative">
        <div className="w-full flex justify-end md:absolute md:right-0 md:top-0 md:mt-2 md:mr-2 z-10 mb-4 md:mb-0">
          <div className="inline-flex shadow rounded-full overflow-hidden border border-gray-200 bg-white">
            <button
              className={`px-3 py-1 text-sm font-medium transition ${lang === 'zh' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => handleLangSwitch('zh')}
            >中文</button>
            <button
              className={`px-3 py-1 text-sm font-medium transition ${lang === 'en' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => handleLangSwitch('en')}
            >English</button>
          </div>
        </div>
        <main className="w-full bg-white/90 rounded-2xl shadow-xl p-6 md:p-12 flex flex-col gap-8 items-center">
          <div className="text-center space-y-2 mb-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">{TEXT[lang].title}</h1>
            <div className="text-base md:text-lg text-gray-500 font-normal mt-6">{TEXT[lang].subtitle}</div>
          </div>
          <CommentForm onCommentSubmitted={handleCommentSubmitted} lang={lang} />
          {!showComments && (
            <button
              className="mt-6 px-6 py-2 rounded-full bg-gray-100 hover:bg-indigo-50 text-indigo-700 font-medium shadow transition"
              onClick={() => setShowComments(true)}
            >
              {TEXT[lang].showComments}
            </button>
          )}
          {showComments && (
            <div className="w-full mt-6 animate-fade-in">
              <CommentList ref={commentListRef} lang={lang} defaultFilter="pending" />
              <div className="flex justify-center mt-4">
                <button
                  className="px-4 py-1 rounded-full bg-gray-100 hover:bg-indigo-50 text-gray-500 text-sm font-medium shadow"
                  onClick={() => setShowComments(false)}
                >
                  {TEXT[lang].hideComments}
                </button>
              </div>
            </div>
          )}
        </main>
        <footer className="mt-8 text-gray-400 text-xs text-center">{TEXT[lang].footer}</footer>
      </div>
    </div>
  )
}

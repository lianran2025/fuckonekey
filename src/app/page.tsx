'use client'

import { useRef, useState, useEffect } from 'react'
import { CommentList } from '@/components/CommentList'
import { CommentForm } from '@/components/CommentForm'

const TEXT = {
  zh: {
    title: 'Fuck OneKey',
    subtitle: '关于 OneKey，尽管吐槽，真实就好',
    footer: 'Made with ❤️ by OneKey Community',
  },
  en: {
    title: 'Fuck OneKey',
    subtitle: 'About OneKey, speak your mind, be real',
    footer: 'Made with ❤️ by OneKey Community',
  },
}

export default function Home() {
  const commentListRef = useRef<{ fetchComments: () => Promise<void> }>(null)
  const [lang, setLang] = useState<'zh' | 'en'>('zh')

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
      <div className="w-full max-w-2xl mx-auto relative">
        <div className="absolute right-0 top-0 mt-2 mr-2 z-10">
          <button
            className={`px-3 py-1 rounded-l-full border border-r-0 text-sm font-medium transition ${lang === 'zh' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
            onClick={() => handleLangSwitch('zh')}
          >中文</button>
          <button
            className={`px-3 py-1 rounded-r-full border text-sm font-medium transition ${lang === 'en' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
            onClick={() => handleLangSwitch('en')}
          >English</button>
        </div>
        <main className="w-full bg-white/90 rounded-2xl shadow-xl p-6 md:p-10 flex flex-col gap-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{TEXT[lang].title}</h1>
            <p className="text-lg text-gray-500">{TEXT[lang].subtitle}</p>
          </div>
          <CommentForm onCommentSubmitted={handleCommentSubmitted} lang={lang} />
          <CommentList ref={commentListRef} lang={lang} />
        </main>
        <footer className="mt-8 text-gray-400 text-xs text-center">{TEXT[lang].footer}</footer>
      </div>
    </div>
  )
}

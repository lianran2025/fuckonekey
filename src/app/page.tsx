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
  const [shouldRenderComments, setShouldRenderComments] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lang')
    if (saved === 'en' || saved === 'zh') setLang(saved)
  }, [])

  const handleLangSwitch = (l: 'zh' | 'en') => {
    setLang(l)
    localStorage.setItem('lang', l)
  }

  const handleCommentSubmitted = () => {
    setShouldRenderComments(true)
    setTimeout(() => setShowComments(true), 10)
    commentListRef.current?.fetchComments()
  }

  const handleShowComments = () => {
    setShouldRenderComments(true)
    setTimeout(() => setShowComments(true), 10)
  }

  const handleHideComments = () => {
    setShowComments(false)
    setTimeout(() => setShouldRenderComments(false), 500)
  }

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col justify-center items-center px-2">
      <div className="w-full max-w-5xl mx-auto relative">
        <main className="w-full bg-gray-900 rounded-3xl shadow-2xl p-10 md:p-16 flex flex-col gap-8 items-center">
          <CommentForm 
            onCommentSubmitted={handleCommentSubmitted} 
            lang={lang} 
            onLangSwitch={() => handleLangSwitch(lang === 'zh' ? 'en' : 'zh')}
            onShowComments={!showComments ? handleShowComments : undefined}
          />
          <div className={`w-full mt-6 transition-all duration-500 ease-in-out ${showComments ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
            {shouldRenderComments && (
              <CommentList ref={commentListRef} lang={lang} defaultFilter="pending" onCollapse={handleHideComments} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

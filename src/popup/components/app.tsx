import axios from 'axios'
import React, { useState } from 'react'

import { setBookmarkedIcon } from '../../lib/setBookmarkIcon'

import { useGetPageInfo } from './useGetPageInfo'

export interface PopupState {
  pageTitle: string
  url: string
}

function App() {
  const state = useGetPageInfo()
  const [comment, setComment] = useState('')

  const onCheckedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) return
    axios
      .post(
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:4000/api/push_stock'
          : 'https://nsx.malloc.tokyo/api/push_stock',
        {
          pageTitle: state.pageTitle,
          url: state.url,
        },
      )
      .then(() => {
        const span = document.createElement('span')
        span.innerHTML = 'Success!'
        document.querySelector('.result').appendChild(span)
        setTimeout(() => {
          span.remove()
        }, 2000)
      })
      .then(() => {
        setBookmarkedIcon()
      })
  }

  return (
    <main id="app-root">
      <section className="row1">
        <div className="title">
          {state.pageTitle.length ? state.pageTitle : ''}
        </div>
        <input type="checkbox" onChange={onCheckedHandler} />
      </section>
      <section className="row2">
        <textarea
          className="comment"
          onChange={(e) => setComment(e.target.value)}
          defaultValue={comment}
        />
        <a
          className="twitter-btn"
          target="_blank"
          href={`https://twitter.com/intent/tweet?url=${encodeURI(
            state.url,
          )}&text=${encodeURI(comment + ' / ')}`}
        >
          tweet
        </a>
        <div className="result"></div>
      </section>
    </main>
  )
}

export default App

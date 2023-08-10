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

        const fadeInEffect = new KeyframeEffect(
          span,
          [{ opacity: '0' }, { opacity: '1' }],
          {
            duration: 1000,
            fill: 'forwards',
          },
        )

        const fadeInAnimation = new Animation(fadeInEffect, document.timeline)
        fadeInAnimation.play()

        setTimeout(() => {
          const fadeOutEffect = new KeyframeEffect(
            span,
            [{ opacity: '1' }, { opacity: '0' }],
            {
              duration: 1000,
              fill: 'forwards',
            },
          )

          const fadeOutAnimation = new Animation(
            fadeOutEffect,
            document.timeline,
          )
          fadeOutAnimation.play()

          fadeOutAnimation.onfinish = () => {
            span.remove()
          }
        }, 2000)
      })
      .catch((err) => {
        const span = document.createElement('span')
        span.innerHTML = 'Failed...'
        document.querySelector('.result').appendChild(span)
        setTimeout(() => {
          span.remove()
        }, 2000)
        //eslint-disable-next-line no-console
        console.error(JSON.stringify(err))
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
        <input
          className="checkbox"
          type="checkbox"
          onChange={onCheckedHandler}
        />
      </section>
      <section className="row2">
        <textarea
          className="comment"
          onBlur={(e) => setComment(e.target.value)}
          cols={60}
          rows={2}
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

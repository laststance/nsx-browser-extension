import axios from 'axios'
import React from 'react'

import { useGetPageInfo } from './useGetPageInfo'
export interface PopupState {
  pageTitle: string
  url: string
}

function App() {
  const state = useGetPageInfo()

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
        document.querySelector('#result').appendChild(span)
        setTimeout(() => {
          span.remove()
        }, 2000)
      })
      .then(() => {
        chrome.runtime.sendMessage({
          action: 'setIcon',
          path: '../assets/images/logo-bookmarked.png',
        })
      })
  }

  return (
    <main id="app-root">
      <div>
        <div>{state.pageTitle.length ? state.pageTitle : ''}</div>
      </div>
      <section id="result"></section>
      <div>
        <input type="checkbox" onChange={onCheckedHandler} />
      </div>
    </main>
  )
}

export default App

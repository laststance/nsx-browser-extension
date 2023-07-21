import axios from 'axios'
import React, { useLayoutEffect, useState } from 'react'

async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

function App() {
  const [state, setState] = useState({ pageTitle: '', url: '' })

  useLayoutEffect(() => {
    getCurrentTab().then((tab) =>
      setState(() => {
        return { pageTitle: tab.title, url: tab.url }
      }),
    )
  }, [])

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

'use client'

import { useEffect } from 'react'

export function CopyCodeButton() {
  useEffect(() => {
    const pres = document.querySelectorAll('pre:has(code)')

    pres.forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return

      const wrapper = document.createElement('div')
      wrapper.className = 'relative group'
      pre.parentNode?.insertBefore(wrapper, pre)
      wrapper.appendChild(pre)

      const btn = document.createElement('button')
      const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
      const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`

      btn.innerHTML = copyIcon
      btn.className =
        'copy-btn absolute right-2 top-2 p-2 rounded bg-gray-700 hover:bg-gray-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'
      btn.setAttribute('aria-label', 'Copiar código')
      btn.ariaLabel = 'copy'

      let isCopied = false

      btn.addEventListener('click', async () => {
        if (isCopied) return

        const code = pre.querySelector('code')?.textContent || ''
        await navigator.clipboard.writeText(code)

        isCopied = true
        btn.innerHTML = checkIcon
        btn.style.opacity = '1'

        setTimeout(() => {
          isCopied = false
          btn.innerHTML = copyIcon
          btn.style.opacity = ''
        }, 2000)
      })

      wrapper.appendChild(btn)
    })
  }, [])

  return null
}

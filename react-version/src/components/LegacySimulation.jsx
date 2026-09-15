import { useEffect, useRef, useState } from 'react'

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = false
    script.onload = resolve
    script.onerror = () => reject(new Error(`Не удалось загрузить ${src}`))
    document.body.appendChild(script)
  })
}

/**
 * Мост между React и оригинальным движком симуляции.
 * DOM/Canvas-разметка и bundle.js остаются совместимыми с исходным проектом,
 * а жизненным циклом симуляции управляет React-компонент.
 */
export default function LegacySimulation() {
  const hostRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    let scriptNodes = []

    async function start() {
      try {
        const response = await fetch('/simulation-fragment.html')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const markup = await response.text()

        if (cancelled || !hostRef.current) return

        hostRef.current.innerHTML = markup

        for (const src of ['/lib/seedrandom.js', '/lib/box2d.js', '/bundle.js']) {
          await loadScript(src)
          scriptNodes.push(document.body.lastElementChild)
          if (cancelled) return
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) setError(err.message || 'Ошибка запуска симуляции')
      }
    }

    start()

    return () => {
      cancelled = true
      scriptNodes.forEach((node) => node?.remove())
      if (hostRef.current) hostRef.current.innerHTML = ''
      // bundle.js использует requestAnimationFrame/setInterval; перезагрузка страницы
      // является штатным способом полного освобождения legacy-движка.
    }
  }, [])

  if (error) {
    return (
      <section className="react-error">
        <h2>Не удалось запустить симуляцию</h2>
        <p>{error}</p>
        <p>Проверьте, что приложение запущено через Vite, а не открыто как file://.</p>
      </section>
    )
  }

  return <div ref={hostRef} className="legacy-simulation-host" aria-label="Генетическая симуляция" />
}

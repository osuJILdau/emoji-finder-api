import { useEffect, useState } from 'react'
import { getEmojis, type EmojiItem } from '../api/emojiApi'

function EmojiFinder() {
  const [search, setSearch] = useState('')
  const [emojis, setEmojis] = useState<EmojiItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadEmojis() {
      setLoading(true)
      setError('')

      try {
        const data = await getEmojis(search, controller.signal)
        if (!controller.signal.aborted) {
          setEmojis(data)
        }
      } catch {
        if (!controller.signal.aborted) {
          setError('Не удалось загрузить эмодзи. Проверьте, запущен ли сервер.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadEmojis()
    return () => controller.abort()
  }, [search])

  return (
    <div className="page">
      <header className="hero">
        <h1>Emoji Finder</h1>
        <p>Find emoji by keywords</p>
        <input
          className="search"
          type="search"
          placeholder="Placeholder"
          aria-label="Find emoji by keywords"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </header>

      <main className="content">
        {loading && <p className="message">Загрузка...</p>}
        {!loading && error && <p className="message error" role="alert">{error}</p>}
        {!loading && !error && emojis.length === 0 && (
          <p className="message">Эмодзи не найдены</p>
        )}
        {!loading && !error && emojis.length > 0 && (
          <div className="emoji-grid">
            {emojis.map((emoji, index) => (
              <article className="emoji-card" key={emoji.title + index}>
                <div className="emoji-symbol">{emoji.emoji}</div>
                <h2>{emoji.title}</h2>
                <p>{emoji.keywords}</p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default EmojiFinder

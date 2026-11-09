export interface EmojiItem {
  emoji: string
  title: string
  keywords: string
}

const API_URL = 'http://localhost:3000/api/emojis'

export async function getEmojis(query: string, signal?: AbortSignal): Promise<EmojiItem[]> {
  const url = API_URL + '?q=' + encodeURIComponent(query)
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error('Ошибка запроса')
  }

  const data: EmojiItem[] = await response.json()
  return data
}

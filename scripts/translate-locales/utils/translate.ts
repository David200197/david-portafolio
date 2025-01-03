import { ENGLISH } from '../constants/languages'

export const translate = async (enWord: string, target: string) => {
  const res = await fetch('http://localhost:5000/translate', {
    method: 'POST',
    body: JSON.stringify({
      q: enWord,
      source: ENGLISH,
      target
    }),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json())

  if (res.error) throw new Error(res.error)

  return res.translatedText
}

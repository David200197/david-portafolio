import readline from 'readline'

export const input = async (question: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  let answer
  while (true) {
    answer = await new Promise(resolve => rl.question(`${question}: `, resolve))
    if (!answer) continue
    break
  }
  rl.close()
  return answer
}

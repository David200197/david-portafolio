import readline from 'readline'

export const inputBinary = async (question: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  let answer
  while (true) {
    answer = await new Promise(resolve => rl.question(`${question} (Y/N): `, resolve))
    if (answer !== 'Y' && answer !== 'N') continue
    break
  }
  rl.close()
  return answer
}

import readline from 'readline'

export const inputSelect = async (question: string, options: string[]) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  let answer: string
  while (true) {
    answer = await new Promise<string>(resolve =>
      rl.question(`${question}:\n${options.map((option, index) => `${index + 1} - ${option}`).join('\n')}\n`, resolve)
    )
    if (!options.map((_, index) => index + 1).includes(Number(answer))) continue
    break
  }
  rl.close()
  return options[Number(answer) - 1]
}

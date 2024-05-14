import dotenv from 'dotenv'
import puppeteer from 'puppeteer-core'
dotenv.config()

const GOOGLE_DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY
const PUPPETEER_EXECUTABLE_PATH = process.env.PUPPETER_EXECUTABLE_PATH

const bootstrap = async () => {
  const browser = await puppeteer.launch({
    channel: 'chrome',
    executablePath: PUPPETEER_EXECUTABLE_PATH,
    waitForInitialPage: true,
    headless: false
  })
  const webScrapingPage = await browser.newPage()
  await webScrapingPage.goto('http://localhost:3000/david-portafolio/')
  //await browser.close()
}
bootstrap()

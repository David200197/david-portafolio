//https://stackoverflow.com/questions/24107288/creating-an-svg-dom-element-from-a-string

import dotenv from 'dotenv'
import puppeteer from 'puppeteer-core'
dotenv.config()

const GOOGLE_DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY
const PUPPETEER_EXECUTABLE_PATH = process.env.PUPPETER_EXECUTABLE_PATH
const WEB_SCRAPING_URL = process.env.WEB_SCRAPING_URL || ''

const bootstrap = async () => {
  const browser = await puppeteer.launch({
    channel: 'chrome',
    executablePath: PUPPETEER_EXECUTABLE_PATH,
    waitForInitialPage: true,
    headless: false
  })
  const webScrapingPage = await browser.newPage()
  await webScrapingPage.goto(WEB_SCRAPING_URL)
  await webScrapingPage.waitForSelector('div')
  const data = await webScrapingPage.evaluate(() => {
    const serializer = new XMLSerializer()
    const mapElement = <T>(
      elements: NodeListOf<Element>,
      loop: (element: Element, index: number, next: () => void) => T
    ) => {
      const mappedElement: T[] = []
      elements.forEach((element, index) => {
        let isNext = false
        const next = () => {
          isNext = true
        }
        const data = loop(element, index, next)
        if (isNext) return
        mappedElement.push(data)
      })
      return mappedElement
    }

    const skills = mapElement(document.querySelectorAll('[data-skill]'), element => {
      const title = element.getAttribute('data-skill')
      const to = element.querySelector('a')!.href
      const icon = serializer.serializeToString(element.querySelector('svg')!)
      return { title, to, icon }
    })

    const socials = mapElement(document.querySelectorAll('[data-social]'), (element, _, next) => {
      const title = element.getAttribute('data-social')
      if (title === 'Download CV') return next()
      const to = (element as HTMLAnchorElement).href
      const icon = serializer.serializeToString(element.querySelector('svg')!)
      return { title, to, icon }
    })

    const jobs = mapElement(document.querySelectorAll('[data-job]'), element => {
      const title = element!.getAttribute('data-job')
      const type = element!.getAttribute('data-job-type')
      const time = element!.querySelector('.job-header')!.querySelector('span:nth-child(2)')!.innerHTML
      const to = (element!.querySelector('.job-to') as HTMLAnchorElement)?.href
      return { title: to || title, type, time }
    })

    const personalInfoElement = document.querySelector('#personal_info')
    const avatar = personalInfoElement!.querySelector('img')!.src
    const description = personalInfoElement!.querySelector('p')!.innerText
    const profile = { avatar, description }
    return { skills, socials, jobs, profile }
  })

  console.log(data.profile)
  //await browser.close()
}
bootstrap()

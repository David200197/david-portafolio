//https://stackoverflow.com/questions/24107288/creating-an-svg-dom-element-from-a-string

import dotenv from 'dotenv'
import puppeteer, { Browser, Page } from 'puppeteer-core'
import express from 'express'
import path from 'path'
import fs from 'fs/promises'
import Handlebars from 'handlebars'
import { __dirname } from '../utils/dirname'
dotenv.config()

type Skill = {
  title: string | null
  to: string
  icon: string
}

type Social = {
  title: string | null
  to: string
  icon: string
}

type Job = {
  title: string | null
  type: string | null
  time: string
  to: string
}

type Profile = {
  avatar: string
  description: string
}

type Data = {
  skills: Skill[]
  socials: Social[]
  jobs: Job[]
  profile: Profile
}

type GetDataArgument = {
  email: string
  portfolio: string
}

const getSectionData = (lang: 'en' | 'es') => {
  return {
    skillTitle: lang === 'en' ? 'SKILLS' : 'HABILIDADES',
    technologiesTitle: lang === 'en' ? 'TECHNOLOGIES ' : 'TECNOLOGÍAS',
    personalInformationTitle: lang === 'en' ? 'PERSONAL INFORMATION' : 'INFORMACIÓN PERSONAL',
    studiesTitle: lang === 'en' ? 'STUDIES' : 'ESTUDIOS',
    studies:
      lang === 'en'
        ? 'Computer Engineer (2016 - 2021) Camilo Cienfuegos University of Matanzas - Cuba'
        : 'Ingeniero Informático (2016 - 2021) Universidad Camilo Cienfuegos de Matanzas  - Cuba',
    workExperienceTitle: lang === 'en' ? 'WORK EXPERIENCE' : 'EXPERIENCIA LABORAL'
  }
}

const getData = ({ email, portfolio }: GetDataArgument): Data => {
  const mapElement = <T>(
    elements: NodeListOf<Element>,
    loop: (element: Element, index: number, next: () => T) => T
  ) => {
    const mappedElement: T[] = []
    elements.forEach((element, index) => {
      let isNext = false
      const next = (): T => {
        isNext = true
        return null as T
      }
      const data = loop(element, index, next)
      if (isNext) return
      mappedElement.push(data)
    })
    return mappedElement
  }
  const serializer = new XMLSerializer()

  const skillHash = {}
  const skills = mapElement(document.querySelectorAll('[data-skill]'), element => {
    const title = element.getAttribute('data-skill')
    const to = element.querySelector('a')!.href
    const icon = serializer.serializeToString(element.querySelector('svg')!)
    return { title, to, icon }
  }).filter(skill => {
    const exists = !skillHash[skill?.title || '']
    skillHash[skill?.title || ''] = true
    return exists
  })

  const socials: Social[] = mapElement(document.querySelectorAll('[data-social]'), (element, _, next) => {
    const title = element.getAttribute('data-social')
    if (title === 'Download CV') return next()
    const to = (element as HTMLAnchorElement).href
    const icon = serializer.serializeToString(element.querySelector('svg')!)
    return { title, to, icon }
  })

  const jobs: Job[] = mapElement(document.querySelectorAll('[data-job]'), element => {
    const title = element!.getAttribute('data-job')
    const type = element!.getAttribute('data-job-type')
    const time = element!.querySelector('.job-header')!.querySelector('span:nth-child(2)')!.innerHTML
    const to = (element!.querySelector('.job-to') as HTMLAnchorElement)?.href
    return { title: to || title, type, time, to }
  })

  const personalInfoElement = document.querySelector('#personal_info')
  const avatar = personalInfoElement!.querySelector('img')!.src
  const description = personalInfoElement!.querySelector('p')!.innerText
  const profile = { avatar, description, email, portfolio }
  return { skills, socials, jobs, profile }
}

const convertToSvg = (data: Data) => {
  for (const skill of data.skills) {
    const skillElement = document.querySelector(`[data-skill="${skill.title}"]`) as Element
    skillElement.innerHTML = skill.icon
  }
  for (const social of data.socials) {
    const socialElement = document.querySelector(`[data-social="${social.title}"]`) as Element
    socialElement.innerHTML = social.icon
  }
  return document.documentElement.innerHTML
}

type CreatePdfOptions = {
  webScrapingPage: Page
  browser: Browser
  lang: 'es' | 'en'
}
const createPdf = async ({ webScrapingPage, browser, lang }: CreatePdfOptions) => {
  const EMAIL = process.env.EMAIL
  const PORTFOLIO = process.env.PORTFOLIO
  const pdfUrl = path.join(process.cwd(), 'public', 'cv', `${lang}.pdf`)
  const htmlContent = await fs.readFile(path.join(__dirname, 'scripts', 'update-cv', 'template.html'), {
    encoding: 'utf-8'
  })

  const data = await webScrapingPage.evaluate(getData, { email: EMAIL, portfolio: PORTFOLIO } as GetDataArgument)
  const sectionData = getSectionData(lang)

  const fileCompiled = Handlebars.compile(htmlContent)
  const template = fileCompiled({ ...data, ...sectionData })

  const templatePage = await browser.newPage()
  await templatePage.setContent(template)
  await templatePage.evaluate(convertToSvg, data)
  const cvPdf = await templatePage.pdf({
    format: 'A4',
    displayHeaderFooter: false,
    preferCSSPageSize: false,
    printBackground: true
  })
  await fs.writeFile(pdfUrl, cvPdf)
  await templatePage.close()
}

const bootstrap = async () => {
  const PUPPETEER_EXECUTABLE_PATH = process.env.BROWSER_EXECUTABLE_PATH

  const browser = await puppeteer.launch({
    channel: 'chrome',
    executablePath: PUPPETEER_EXECUTABLE_PATH,
    waitForInitialPage: true,
    headless: true,
    defaultViewport: {
      width: 760,
      height: 570
    }
  })
  const webScrapingPage = await browser.newPage()
  await webScrapingPage.goto('http://localhost:1997/david-portafolio')
  await webScrapingPage.waitForSelector('div')

  await createPdf({ webScrapingPage, browser, lang: 'en' })
  await webScrapingPage.evaluate(() => document.getElementById('language_switch')?.click())
  await createPdf({ webScrapingPage, browser, lang: 'es' })

  await browser.close()
  process.exit()
}

const dist = path.join(process.cwd(), 'dist')
const app = express()
app.use('/david-portafolio', express.static(dist))
app.listen(1997, bootstrap)

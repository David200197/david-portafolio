import fs from "fs/promises";
import path from "path";
import Handlebars from "handlebars";
import { chromium } from "playwright";

const baseDataFolder = path.join(
  process.cwd(),
  "src",
  "modules",
  "core",
  "data"
);
const cvPath = path.join(process.cwd(), "public", "cv");
const svgPath = path.join(process.cwd(), "src", "modules", "core", "assets");

const langs = ["en", "es"];

const getLocalData = async (lang, fileName) => {
  const data = await fs.readFile(
    path.join(baseDataFolder, lang, `${fileName}.json`),
    { encoding: "utf-8" }
  );
  return JSON.parse(data);
};

const getCommonData = async () => {
  const data = await fs.readFile(path.join(baseDataFolder, `common.json`), {
    encoding: "utf-8",
  });
  return JSON.parse(data);
};

const getSvg = async (folderName, icon) => {
  const iconPath = path.join(svgPath, folderName);
  const files = await fs.readdir(iconPath);
  const fileSvg = files.find((file) => file.toLowerCase().includes(icon));

  if (!fileSvg) {
    console.log(`fileSvg not found: ${icon}`);
    return "<p>NONE</p>";
  }

  const svg = await fs.readFile(path.join(iconPath, fileSvg), {
    encoding: "utf-8",
  });
  return svg;
};

const getTemplateHtml = async () => {
  return await fs.readFile(
    path.join(process.cwd(), "tools", "create-cv", "template.html"),
    { encoding: "utf-8" }
  );
};

const getSocials = async (profile) => {
  const filterLinks = profile.links.filter((link) => link.ref !== "/cv/en.pdf");

  return await Promise.all(
    filterLinks.map(async (link) => ({
      to: link.ref,
      title: link.tooltip,
      icon: await getSvg("links", link.icon),
    }))
  );
};

const getCurrentProfile = (common, profile) => {
  return {
    email: common.email,
    portfolio: common.portfolio,
    description: profile.description.replace(
      "{years}",
      new Date().getFullYear() - 2021
    ),
  };
};

const getCurrentSkills = async (profile) => {
  return await Promise.all(
    profile.skills.map(async (skill) => ({
      to: skill.ref,
      title: skill.tooltip,
      icon: await getSvg("skills", skill.icon),
    }))
  );
};

const run = async () => {
  const templateHtml = await getTemplateHtml();
  const browser = await chromium.launch();

  for (const lang of langs) {
    const page = await browser.newPage();
    const jobData = await getLocalData(lang, "jobs");
    const profile = await getLocalData(lang, "profile");
    const common = await getCommonData();

    const template = Handlebars.compile(templateHtml);

    const socials = await getSocials(profile);
    const currentProfile = getCurrentProfile(common, profile);
    const currentSkills = await getCurrentSkills(profile);

    const cvHtml = template({
      profile: currentProfile,
      socials,
      skillTitle: profile.skillTitle.toUpperCase(),
      personalInformationTitle: profile.sectionTitle.toUpperCase(),
      technologiesTitle: profile.technologiesTitle.toUpperCase(),
      studiesTitle: profile.studiesTitle.toUpperCase(),
      skills: currentSkills,
      studies: profile.studies,
      workExperienceTitle: jobData.sectionTitle.toUpperCase(),
      jobs: jobData.jobs,
    });

    await page.setContent(cvHtml);

    await page.pdf({
      path: path.join(cvPath, `${lang}.pdf`),
      format: "A4",
      displayHeaderFooter: false,
      preferCSSPageSize: false,
      printBackground: true,
    });

    await page.close();
  }

  await browser.close();
};
run();

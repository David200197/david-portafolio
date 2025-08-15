import fs from "fs/promises";
import path from "path";
import { transform } from "@svgr/core";

const svgBasePath = path.join(process.cwd(), "tools", "common", "assets");
const tsxBasePath = path.join(process.cwd(), "src", "modules", "core", "svg");

function toPascalCase(str) {
  return str
    .replace(/[-_]+/g, " ") // guiones y underscores a espacio
    .replace(/\s+([a-zA-Z])/g, (_, c) => c.toUpperCase()) // cada palabra, mayúscula
    .replace(/^\w/, (c) => c.toUpperCase()); // primera letra mayúscula
}

async function convertSvgToTsx(svgPath) {
  const svgCode = await fs.readFile(svgPath, { encoding: "utf-8" });
  const fileName = path.basename(svgPath, ".svg");
  const componentName = toPascalCase(fileName);

  const tsxCode = await transform(
    svgCode,
    {
      icon: true,
      typescript: true,
      ext: "tsx",
      prettier: true,
      svgo: true,
      srcDir: "svg",
      outDir: "tsx",
      ignoreExisting: true,
      plugins: [
        "@svgr/plugin-svgo",
        "@svgr/plugin-jsx",
        "@svgr/plugin-prettier",
      ],
    },
    { componentName }
  );

  return { tsxCode, componentName };
}

const run = async () => {
  const assetFiles = await fs.readdir(svgBasePath, { recursive: true });
  const assetFileFiltereds = assetFiles.filter((file) => file.endsWith(".svg"));

  for (const assetFile of assetFileFiltereds) {
    const svgPath = path.join(svgBasePath, assetFile);
    const { tsxCode, componentName } = await convertSvgToTsx(svgPath);

    const outputDir = path.dirname(svgPath).replace(svgBasePath, "");
    const outputPath = path.join(
      tsxBasePath,
      outputDir,
      `${componentName}.tsx`
    );
    console.log(`✅ Generado: ${outputPath}`);
    await fs.writeFile(outputPath, tsxCode, "utf-8");
  }
};
run();

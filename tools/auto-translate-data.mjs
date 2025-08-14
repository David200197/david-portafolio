import fs from "fs/promises";
import path from "path";

const baseDataFolder = path.join(
  process.cwd(),
  "src",
  "modules",
  "core",
  "data"
);
const enDataFolder = path.join(baseDataFolder, "en");
const esDataFolder = path.join(baseDataFolder, "es");

const OLLAMA_HOST = "http://localhost:11434";
const MODEL_NAME = "gemma3n:e4b";

const translateToEs = async (enData) => {
  try {
    const jsonData = JSON.parse(enData);
    const contentToTranslate = JSON.stringify(jsonData, null, 2);

    const prompt = `Translate the following JSON content from English to Spanish.
    Keep the entire JSON structure intact, only translate the text values.
    Do not translate the property names or change the format.
    Here is the JSON:\n\n${contentToTranslate}`;

    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const result = await response.json();

    const translatedJson = result.response
      .trim()
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    return JSON.parse(translatedJson);
  } catch (error) {
    console.error("Error en traducción:", error);
    throw error;
  }
};

const run = async () => {
  try {
    await fs.mkdir(esDataFolder, { recursive: true });

    const files = await fs.readdir(enDataFolder);

    for (const file of files) {
      if (file.endsWith(".json")) {
        // Solo procesar archivos JSON
        console.log(`Traduciendo ${file}...`);

        const enData = await fs.readFile(
          path.join(enDataFolder, file),
          "utf-8"
        );
        const esData = await translateToEs(enData);

        await fs.writeFile(
          path.join(esDataFolder, file),
          JSON.stringify(esData, null, 2)
        );

        console.log(`Traducción completada para ${file}`);
      }
    }

    console.log("¡Proceso de traducción finalizado!");
  } catch (error) {
    console.error("Error en el proceso:", error);
  }
};

run();

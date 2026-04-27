import { GoogleGenAI, type Chat } from "@google/genai";

export const models = {
  pro: "gemini-2.5-pro",
  flash: "gemini-2.5-flash",
  lite: "gemini-2.5-flash-lite",
};

const MISSING_KEY_MESSAGE =
  "GEMINI_API_KEY belum diatur. Setel di file .env.local lalu jalankan ulang server.";

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (aiInstance) return aiInstance;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(MISSING_KEY_MESSAGE);
  }

  aiInstance = new GoogleGenAI({ apiKey });
  return aiInstance;
}

export async function identifyPlant(base64Image: string) {
  const response = await getAI().models.generateContent({
    model: models.pro,
    contents: [{
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
        {
          text: "Identifikasi tanaman ini. Berikan nama umum, nama ilmiah, deskripsi singkat, dan instruksi perawatan mendalam (penyiraman, cahaya, tanah, suhu, kelembapan). Format respons sebagai JSON dalam Bahasa Indonesia.",
        },
      ],
    }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          commonName: { type: "string" },
          scientificName: { type: "string" },
          description: { type: "string" },
          careInstructions: {
            type: "object",
            properties: {
              watering: { type: "string" },
              light: { type: "string" },
              soil: { type: "string" },
              temperature: { type: "string" },
              humidity: { type: "string" },
            },
            required: ["watering", "light", "soil", "temperature", "humidity"],
          },
        },
        required: ["commonName", "scientificName", "description", "careInstructions"],
      },
    },
  });

  if (!response.text) {
    throw new Error("Tidak ada respons dari AI");
  }

  return JSON.parse(response.text);
}

export function createChat(): Chat {
  return getAI().chats.create({
    model: models.flash,
    config: {
      systemInstruction: "Anda adalah asisten berkebun ahli bernama Flora. Anda membantu pengguna dengan perawatan tanaman, identifikasi hama, dan tips berkebun. Bersikaplah ramah, menyemangati, dan berikan saran praktis dalam Bahasa Indonesia.",
    },
  });
}

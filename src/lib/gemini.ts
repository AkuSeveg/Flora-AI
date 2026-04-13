import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const models = {
  pro: "gemini-3.1-pro-preview",
  flash: "gemini-3-flash-preview",
  lite: "gemini-3.1-flash-lite-preview",
};

export async function identifyPlant(base64Image: string) {
  const response = await ai.models.generateContent({
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

export function createChat() {
  return ai.chats.create({
    model: models.flash,
    config: {
      systemInstruction: "Anda adalah asisten berkebun ahli bernama Flora. Anda membantu pengguna dengan perawatan tanaman, identifikasi hama, dan tips berkebun. Bersikaplah ramah, menyemangati, dan berikan saran praktis dalam Bahasa Indonesia.",
    },
  });
}

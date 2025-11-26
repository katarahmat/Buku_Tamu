import { GoogleGenAI } from "@google/genai";
import { VisitorEntry } from "../types";

const getGeminiClient = () => {
    // Note: In a real scenario, never expose API keys on the client.
    // This is for demonstration purposes assuming the environment variable is injected safely or proxied.
    const apiKey = process.env.API_KEY || ''; 
    return new GoogleGenAI({ apiKey });
};

export const generateDailyReport = async (entries: VisitorEntry[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key not configured. Unable to generate AI report.";
  }

  const ai = getGeminiClient();
  const date = new Date().toLocaleDateString('id-ID');
  
  // Prepare data for the prompt
  const dataSummary = entries.map(e => 
    `- ${e.name} (${e.occupation}): ${e.purpose} (Total: ${e.visitorCount})`
  ).join('\n');

  const prompt = `
    Anda adalah asisten administrasi profesional untuk BAPAS MPP Teluk Kuantan.
    Buatkan ringkasan laporan eksekutif harian berdasarkan data kunjungan berikut untuk tanggal ${date}.
    
    Data Kunjungan:
    ${dataSummary}

    Instruksi:
    1. Buat paragraf pembuka yang formal.
    2. Ringkas tujuan utama kunjungan hari ini (kelompokkan jika ada pola, misal: konsultasi, pengaduan, dll).
    3. Sebutkan total pengunjung (jumlahkan visitorCount).
    4. Berikan saran singkat jika ada pola yang tidak biasa.
    5. Gunakan Bahasa Indonesia yang formal dan sopan.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Gagal menghasilkan laporan.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi layanan AI. Silakan coba lagi nanti.";
  }
};
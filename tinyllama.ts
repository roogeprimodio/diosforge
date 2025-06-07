// Utility for generating content using TinyLlama via Hugging Face Inference API
import axios from 'axios';

const API_URL = process.env.TINYLLAMA_API_URL || 'https://api-inference.huggingface.co/models/TinyLlama/TinyLlama-1.1B-Chat-v1.0';
const TOKEN = process.env.HUGGINGFACE_TINYLLAMA_TOKEN;

export async function generateWithTinyLlama(prompt: string): Promise<string> {
  if (!TOKEN) throw new Error('Missing Hugging Face TinyLlama token in .env');
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  };
  const data = { inputs: prompt };
  try {
    const response = await axios.post(API_URL, data, { headers });
    if (response.data && typeof response.data[0]?.generated_text === 'string') {
      return response.data[0].generated_text;
    }
    // Some models return { generated_text: "..." } directly
    if (response.data && typeof response.data.generated_text === 'string') {
      return response.data.generated_text;
    }
    return '[TinyLlama: No content generated]';
  } catch (err: any) {
    return `[TinyLlama Error: ${err?.message || err}]`;
  }
}

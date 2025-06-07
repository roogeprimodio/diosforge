import axios from 'axios';

const HF_API_URL = 'https://api-inference.huggingface.co/models/TinyLlama/TinyLlama-1.1B-Chat-v1.0';

interface AIResponse {
  generated_text: string;
}

export const generateContent = async (prompt: string, token: string): Promise<string> => {
  try {
    const response = await axios.post<AIResponse[]>(HF_API_URL, {
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data[0]?.generated_text || 'No response from AI';
  } catch (error) {
    console.error('AI generation error:', error);
    return 'Error generating content';
  }
};

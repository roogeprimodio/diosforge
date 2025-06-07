import React, { createContext, useContext, useState, ReactNode } from 'react';
import { generateContent } from '@/services/aiService';

interface AIContextType {
  aiToken: string;
  setAIToken: (token: string) => void;
  isGenerating: boolean;
  generateWithAI: (prompt: string) => Promise<string>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [aiToken, setAIToken] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWithAI = async (prompt: string): Promise<string> => {
    if (!aiToken) return 'Please set your HuggingFace token in settings';
    
    setIsGenerating(true);
    try {
      const result = await generateContent(prompt, aiToken);
      return result;
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AIContext.Provider value={{ aiToken, setAIToken, isGenerating, generateWithAI }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

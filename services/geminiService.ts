
import { GoogleGenAI, Type } from "@google/genai";
import { AIGenResult } from "../types";

export const generateGameCode = async (prompt: string): Promise<AIGenResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a senior game developer. Generate a single-file HTML (including CSS and JavaScript) for a playable browser game based on this request: "${prompt}". 
    The code must be fully self-contained in one string. Use standard canvas or DOM-based game logic. 
    Include basic styles for a dark theme that matches a "gaming" portal.
    Provide the output in JSON format with two fields: 'code' (the full HTML/JS/CSS string) and 'explanation' (a short summary of how to play).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          code: {
            type: Type.STRING,
            description: 'The full HTML/JS/CSS code for the game.',
          },
          explanation: {
            type: Type.STRING,
            description: 'Short gameplay instructions.',
          },
        },
        required: ["code", "explanation"],
      },
    },
  });

  const result = JSON.parse(response.text);
  return result;
};


import { GoogleGenAI, Type } from "@google/genai";
import { TravelItinerary } from "../types";

const API_KEY = process.env.API_KEY || "";

export const generateTravelItinerary = async (query: string): Promise<TravelItinerary> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `유럽 여행 전문가로서 다음 요청에 대한 여행 일정을 짜주세요: "${query}". 한국어로 답변해 주세요.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "여행 일정의 제목" },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                activity: { type: Type.STRING, description: "주요 활동 제목" },
                description: { type: Type.STRING, description: "활동 상세 설명" }
              },
              required: ["day", "activity", "description"]
            }
          },
          tips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "여행 꿀팁 리스트"
          }
        },
        required: ["title", "days", "tips"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as TravelItinerary;
};

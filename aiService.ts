import { generateId } from './utils';

const API_KEY = '';
const API_URL = '';

export async function generateLectureSummary(title: string, subject: string, transcription: string): Promise<string> {
  try {
    const prompt = `
      Create a comprehensive summary for a lecture with the following details:
      Title: ${title}
      Subject: ${subject}
      
      Lecture Content:
      ${transcription}
      
      Please provide:
      1. A brief overview (2-3 sentences)
      2. 3-5 key points in bullet form
      3. Important concepts to remember
    `;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 500,
        temperature: 0.7,
        model: 'text-davinci-003'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(`Failed to generate summary: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.text) {
      throw new Error('Invalid API response format');
    }

    return data.text;
  } catch (error) {
    console.error('Error generating summary:', error);
    
    // Fallback summary generation
    return `Summary for ${title} (${subject}):

Brief Overview:
This lecture covered key concepts and principles related to ${subject}.

Key Points:
• Main topics from the lecture were discussed
• Important concepts were explained
• Key principles were demonstrated

Important Concepts:
The lecture focused on fundamental aspects of ${subject} and their practical applications.

Note: This is an automatically generated summary as the AI service was temporarily unavailable.`;
  }
}

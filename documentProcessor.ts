import Tesseract from 'tesseract.js';

export async function extractTextFromFile(file: File): Promise<string> {
  try {
    const fileType = file.type;

    if (fileType.includes('image')) {
      const { data } = await Tesseract.recognize(file, 'eng');
      return data.text.trim();
    } else {
      throw new Error('Unsupported file type. Please upload an image file.');
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to extract text from the file.');
  }
}

export function compareDocumentsWordBased(teacherText: string, studentText: string) {
  const cleanAndSplitWords = (text: string) =>
    text
      .replace(/[^\w\s]/g, '')
      .toLowerCase()
      .split(/\s+/);

  const teacherWords = cleanAndSplitWords(teacherText);
  const studentWords = cleanAndSplitWords(studentText);

  const teacherWordSet = new Set(teacherWords);
  const matchedWords = studentWords.filter((word) => teacherWordSet.has(word));
  const highlightedContent = studentText.replace(/\b(\w+)\b/g, (word) =>
    teacherWordSet.has(word.toLowerCase()) ? `<mark class="bg-yellow-200">${word}</mark>` : word
  );

  const score = Math.round((matchedWords.length / teacherWords.length) * 100);
  return { score, matchedWords: matchedWords.length, totalWords: teacherWords.length, highlightedContent };
}

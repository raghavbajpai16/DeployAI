import groq from './groq.js';

export interface ClassificationResult {
    subject: string;
    intent: string;
    confidence: number;
}

export const classifyMessage = async (content: string): Promise<ClassificationResult> => {
    try {
        const prompt = `
            Classify the following academic message. 
            Subject options: Mathematics, Science, Literature, History, Computer Science, Economics, Psychology, Other.
            Intent options: Question, Explanation Request, Assignment Help, Exam Prep, General Chat.
            
            Return ONLY a JSON object in this format:
            {
                "subject": "detected subject",
                "intent": "detected intent",
                "confidence": 0.0 to 1.0
            }

            Message: "${content}"
        `;

        const response = await groq.chat.completions.create({
            model: process.env.GROQ_MODEL as string,
            messages: [
                { role: 'system', content: 'You are a precise classification assistant. Return ONLY valid JSON.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.1,
            max_tokens: 100,
            response_format: { type: 'json_object' }
        });

        const resultText = response.choices[0]?.message?.content || '{}';
        const result = JSON.parse(resultText);

        return {
            subject: result.subject || 'Other',
            intent: result.intent || 'Question',
            confidence: result.confidence || 0.5
        };
    } catch (error) {
        console.error('Classification Error:', error);
        return {
            subject: 'Other',
            intent: 'Question',
            confidence: 0
        };
    }
};

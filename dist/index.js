import fetch from 'node-fetch';
import config from '../config.json' with { type: 'json' };
// The system prompt lives in config.json so it can be adjusted independently of the code.
// It is defined in English and instructs the model to match the language of the input while
// always returning the immutable object { classification, score, summary }.
const SYSTEM_PROMPT = config?.systemPrompt ?? '';
// Force the final structure to be frozen so consumers cannot mutate the response shape.
const freezeResponse = (payload) => Object.freeze({ ...payload });
// Safely parse the model output and fall back to a strict format when parsing fails.
const normalizeResponse = (rawString = '') => {
    try {
        const parsed = JSON.parse(rawString);
        const classification = typeof parsed.classification === 'string' ? parsed.classification : 'not_judol';
        const score = typeof parsed.score === 'number' ? Math.min(Math.max(parsed.score, 0), 1) : 0;
        const summary = typeof parsed.summary === 'string' ? parsed.summary : 'No summary available.';
        return freezeResponse({ classification, score, summary });
    }
    catch (error) {
        return freezeResponse({
            classification: 'not_judol',
            score: 0,
            summary: 'The model response could not be parsed; ensure the system prompt is respected.'
        });
    }
};
// Recursively traverse the OpenAI response to aggregate strings from nested structures.
const extractTextFromResponse = (payload) => {
    if (!payload)
        return '';
    if (typeof payload === 'string')
        return payload;
    if (Array.isArray(payload))
        return payload.map(extractTextFromResponse).join('');
    if (typeof payload === 'object')
        return Object.values(payload).map(extractTextFromResponse).join('');
    return '';
};
/**
 * Detects "judol" phrasing within the provided text using OpenAI's responses API.
 *
 * @param inputText Text to analyze. The library forwards it verbatim so the AI sees the original language.
 * @param apiKey API key that authenticates against OpenAI.
 * @param model Optional model override (defaults to gpt-5-mini).
 */
export async function detectJudol(inputText, apiKey, model = 'gpt-5-mini') {
    if (!inputText || typeof inputText !== 'string') {
        throw new Error('inputText is required and must be a string.');
    }
    if (!apiKey || typeof apiKey !== 'string') {
        throw new Error('apiKey is required and must be a string.');
    }
    const requestBody = {
        model,
        temperature: 0,
        input: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
                role: 'user',
                content: `Evaluate the following text and determine if it uses judol phrasing:\n${inputText}`
            }
        ]
    };
    const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`OpenAI request failed: ${response.status} ${response.statusText} - ${body}`);
    }
    const payload = (await response.json());
    const aiReply = extractTextFromResponse(payload.output ?? payload.choices ?? '');
    return normalizeResponse(aiReply.trim());
}
export default detectJudol;

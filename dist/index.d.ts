export interface DetectionResult {
    classification: string;
    score: number;
    summary: string;
}
/**
 * Detects "judol" phrasing within the provided text using OpenAI's responses API.
 *
 * @param inputText Text to analyze. The library forwards it verbatim so the AI sees the original language.
 * @param apiKey API key that authenticates against OpenAI.
 * @param model Optional model override (defaults to gpt-5-mini).
 */
export declare function detectJudol(inputText: string, apiKey: string, model?: string): Promise<DetectionResult>;
export default detectJudol;

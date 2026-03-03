# judol-detector

## Overview

[`dist/index.js`](dist/index.js:1), compiled from [`src/index.ts`](src/index.ts:1), exports `detectJudol`, a single async function that analyzes arbitrary text with OpenAI (via [`node-fetch`](package.json:36)) to spot “judol” phrasing. The function always returns an immutable object with the fixed schema `{ "classification": string, "score": number, "summary": string }` so downstream callers can rely on the structure regardless of how the API responds.

## Installation & Build

```bash
npm install judol-detector
```

Because the library ships TypeScript sources, run `npm run build` (or rely on the `prepare` script during publish) to compile [`src/index.ts`](src/index.ts:1) into [`dist/index.js`](dist/index.js:1) and [`dist/index.d.ts`](dist/index.d.ts:1) before consuming the package. The package is published as an ES module (`package.json`:5).

## Usage Example

```ts
import { detectJudol } from 'judol-detector';

const report = await detectJudol(
  'Your sample text here', // language preserved
  process.env.OPENAI_API_KEY,
  'gpt-5-mini' // optional, defaults to gpt-5-mini
);

console.log(report); // { classification: 'judol', score: 0.72, summary: '...' }
```

## API Reference

- `detectJudol(inputText: string, apiKey: string, model?: string): Promise<{ classification: string; score: number; summary: string }>`
  - `inputText` (required): Original text to evaluate; the language is preserved verbatim.
  - `apiKey` (required): OpenAI API key used for authentication.
  - `model` (optional, default `gpt-5-mini`): Override the model; the system prompt stored in [`config.json`](config.json:1) ensures every model invocation must still respect the strict response format.

### Response Guarantees

- `classification`: Always a string — expected values like `judol` or `not_judol`.
- `score`: Numeric confidence between 0 and 1.
- `summary`: Brief explanation referencing the input text.
- The object returned by `detectJudol` is frozen via `Object.freeze` to preserve immutability.

## Configuration and System Prompt

[`config.json`](config.json:1) stores the English system prompt that teaches the OpenAI model to mirror the input language and respond only with the immutable JSON shape. The prompt is re-applied on every request by placing it in the `input` array as a `system` message before the user content.

## Optional Model Overrides

While the default `model` argument is `gpt-5-mini`, you may pass any OpenAI-compatible model name that understands the standard response. Regardless of the model, the system prompt loaded from [`config.json`](config.json:1) locks the output format and enforces language mirroring.

## Build Output

Running `npm run build` emits [`dist/index.js`](dist/index.js:1) and [`dist/index.d.ts`](dist/index.d.ts:1). These artifacts are the files distributed to npm so downstream projects import from `dist` while you author in TypeScript.

## Respecting Input Language

Because the system prompt instructs the agent to mirror the input language, every response comes back in the same language as the provided text. The library avoids altering the text so the model retains the original language context during analysis.

## Error Handling

When the fetch fails, the thrown error includes the HTTP status and body for quick debugging. If the model output cannot be parsed as JSON, `detectJudol` returns a safe fallback (`{ classification: 'not_judol', score: 0, summary: 'The model response could not be parsed; ensure the system prompt is respected.' }`).

## License & Contributions

This project is licensed under the [MIT License](LICENSE).

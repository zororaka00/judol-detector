# judol-detector

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [detectJudol Function](#detectjudol-function)
  - [Parameters](#parameters)
  - [Return Value](#return-value)
  - [TypeScript Types](#typescript-types)
- [Configuration](#configuration)
  - [System Prompt](#system-prompt)
  - [Model Configuration](#model-configuration)
- [Response Guarantees](#response-guarantees)
- [Language Support](#language-support)
- [Error Handling](#error-handling)
- [Build & Development](#build--development)
- [Project Structure](#project-structure)
- [License](#license)
- [Contributing](#contributing)
- [Support](#support)

---

## Description

**judol-detector** is a lightweight npm library designed to detect "judol" phrasing in text using OpenAI's API. It provides a simple, type-safe interface that always returns a consistent, immutable response structure regardless of the underlying AI model or API behavior.

The library is built with:
- **TypeScript** for type safety and better developer experience
- **node-fetch** for minimal HTTP communication dependencies
- **ES Modules** for modern JavaScript interoperability

---

## Features

- 🔍 **Accurate Detection** — Leverages OpenAI's language models to detect "judol" phrasing
- 🛡️ **Immutable Responses** — Always returns a frozen object with the fixed schema `{ classification, score, summary }`
- 🌐 **Multi-language Support** — Respects the input language through system prompt configuration
- ⚙️ **Configurable** — Easy to customize the system prompt via `config.json`
- 📦 **Minimal Dependencies** — Uses only `node-fetch` for HTTP requests
- 🔧 **TypeScript Ready** — Full type definitions included

---

## Installation

```bash
npm install judol-detector
```

Or using yarn:

```bash
yarn add judol-detector
```

Or using pnpm:

```bash
pnpm add judol-detector
```

---

## Quick Start

```typescript
import { detectJudol } from 'judol-detector';

const result = await detectJudol(
  'Your sample text here',
  process.env.OPENAI_API_KEY
);

console.log(result);
// Output: { classification: 'judol', score: 0.72, summary: '...' }
```

### With Custom Model

```typescript
const result = await detectJudol(
  'Your sample text here',
  process.env.OPENAI_API_KEY,
  'gpt-4-turbo'  // optional, defaults to gpt-5-mini
);
```

---

## API Reference

### detectJudol Function

The main export of the library. An asynchronous function that analyzes text for "judol" phrasing.

```typescript
function detectJudol(
  inputText: string,
  apiKey: string,
  model?: string
): Promise<DetectionResult>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `inputText` | `string` | ✅ | - | The text to analyze for "judol" phrasing |
| `apiKey` | `string` | ✅ | - | OpenAI API key for authentication |
| `model` | `string` | ❌ | `gpt-5-mini` | OpenAI model identifier |

### Return Value

Returns a `Promise<DetectionResult>` with the following structure:

```typescript
{
  classification: string;  // 'judol' | 'not_judol' | other string values
  score: number;          // 0-1 confidence score
  summary: string;        // Concise explanation
}
```

### TypeScript Types

```typescript
export interface DetectionResult {
  classification: string;
  score: number;
  summary: string;
}
```

---

## Configuration

### System Prompt

The system prompt is stored in [`config.json`](config.json) and is loaded at runtime. This English-language prompt instructs the AI model to:

1. Respond in the same language as the input text
2. Return only the immutable JSON structure `{ classification, score, summary }`
3. Provide accurate classification and confidence scoring

To customize the system prompt, edit `config.json`:

```json
{
  "systemPrompt": "Your custom prompt here..."
}
```

### Model Configuration

The library defaults to `gpt-5-mini` but supports any OpenAI-compatible model. The model can be overridden via the third parameter:

```typescript
await detectJudol(text, apiKey, 'gpt-4');
```

Regardless of the model chosen, the system prompt ensures consistent response format.

---

## Response Guarantees

The library enforces the following guarantees on every response:

| Guarantee | Description |
|-----------|-------------|
| **Schema Consistency** | Always returns `{ classification, score, summary }` |
| **Immutability** | Response object is frozen via `Object.freeze()` |
| **Score Range** | `score` is clamped between 0 and 1 |
| **Classification** | `classification` is always a string (e.g., "judol", "not_judol") |
| **Summary** | `summary` is always a string explaining the classification |

---

## Language Support

The library respects the input language through its system prompt configuration. When you provide text in any language, the AI model will analyze it and respond in the same language. This is enforced by the system prompt stored in `config.json`.

---

## Error Handling

### Network Errors

When the OpenAI API request fails (authentication issues, rate limits, network problems), the library throws an error with HTTP status details:

```typescript
try {
  const result = await detectJudol(text, apiKey);
} catch (error) {
  console.error(error.message);
  // "OpenAI request failed: 401 Unauthorized - ..."
}
```

### Parsing Errors

If the model response cannot be parsed as JSON, the library returns a safe fallback:

```typescript
{
  classification: 'not_judol',
  score: 0,
  summary: 'The model response could not be parsed; ensure the system prompt is respected.'
}
```

---

## Build & Development

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Clone the repository
git clone https://github.com/zororaka00/judol-detector.git
cd judol-detector

# Install dependencies
npm install
```

### Build

```bash
npm run build
```

This compiles TypeScript sources from `src/` to `dist/`.

### Publish

```bash
npm publish
```

The `prepare` script automatically runs `npm run build` before publishing.

---

## Project Structure

```
judol-detector/
├── src/
│   └── index.ts          # Main TypeScript source
├── dist/
│   ├── index.js          # Compiled JavaScript
│   └── index.d.ts        # TypeScript declarations
├── config.json           # System prompt configuration
├── package.json          # Package metadata
├── tsconfig.json        # TypeScript configuration
├── .gitignore           # Git ignore rules
├── LICENSE               # MIT License
└── README.md             # This file
```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Support

If you find this project useful, please consider supporting the author:

- ⭐ Star this repository
- 🐛 Report bugs via [GitHub Issues](https://github.com/zororaka00/judol-detector/issues)
- 💬 Join the discussion
- ☕ [Support on Patreon](https://www.patreon.com/zororaka)

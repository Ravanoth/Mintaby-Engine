# Mintaby Engine

Mintaby Engine is a local, open-source background AI service built specifically for the Phred development ecosystem. It runs entirely offline using node-llama-cpp to communicate with local hardware.

The engine functions as an API service, listening for prompts on local port 3000 and streaming back structured, emoji-free markdown responses optimized for code generation.

## Core Identity Specifications

- Name: Mintaby
- Base Architecture: Qwen 2.5 Coder 7B
- Output Style: Conversational, friendly, and direct. Strictly zero emojis, emoticons, or visual decorative symbols.
- Target Specialization: Multilingual software engineering, data logic, and architectural design.

## Prerequisites

Before launching the engine, ensure your machine has:
1. Node.js installed locally.
2. The compiled model file saved directly in the project root directory under the filename: mintaby-brain.gguf

## Installation and Execution

1. Clone the repository files to your machine:
git clone https://github.com
cd Mintaby-Engine

2. Install the necessary system framework dependencies:
npm install

3. Boot the local background service:
node index.js

Once active, the terminal console will remain open and display:
Mintaby Service Engine Running at http://localhost:3000

## API Endpoint Reference

The engine exposes a single POST endpoint to receive prompts and handle text streaming pipelines.

### Chat Stream Endpoint
- URL: http://localhost:3000/api/chat
- Method: POST
- Headers: Content-Type: application/json
- Request Body Format:
{
  "prompt": "Write your coding or general question here"
}

## Project Status

This engine serves as the core intelligence layer for the Phred ecosystem. It is designed to plug directly into future IDE components (PHCode) to handle real-time autocompletion and contextual code generation with zero reliance on cloud APIs.

# Mintaby Engine

Mintaby Engine is a local, open-source background AI service built specifically for the Phred development ecosystem. It runs entirely offline using node-llama-cpp to communicate directly with local hardware.

The engine functions as an API service, listening for prompts on local port 3000 and streaming back structured, emoji-free markdown responses optimized for code generation.

## Core Identity Specifications

- Name: Mintaby
- Base Architecture: Qwen 2.5 Coder 7B
- Output Style: Conversational, friendly, and direct. Strictly zero emojis, emoticons, or visual decorative symbols.
- Target Specialization: Multilingual software engineering, data logic, and architectural design.

## Prerequisites & Model Download

Before launching the engine, you must download the exact raw model file specified below from Hugging Face and place it in your project folder.

1. Model Download Link: Download this exact file version:
https://huggingface.co

2. Filename Reference: The exact file you must download is qwen2.5-coder-7b-instruct-q4_k_m.gguf (approximately 4.7 GB).

3. Rename and Place: Rename that downloaded file to exactly `mintaby-brain.gguf` and move it into your `mintaby-engine` project root directory.

## Startup Instructions

Follow these steps to download the code, install dependencies, and boot the local engine on your machine:

1. Clone the repository files:
git clone https://github.com
cd Mintaby-Engine

2. Install the necessary system dependencies and node packages:
npm install

3. Start the background application engine:
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

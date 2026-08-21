import { fileURLToPath } from "url";
import path from "path";
import { LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Links to your renamed local model file
const modelPath = path.join(__dirname, "mintaby-brain.gguf");

console.log("Loading Mintaby AI local brain architecture...");

const model = new LlamaModel({
    modelPath: modelPath
});

const context = new LlamaContext({
    model: model,
    contextSize: 4096 // Gives it a healthy memory canvas for processing logic and files
});

// Mintaby's core rules and strict styling parameters
const systemPrompt = `Your name is Mintaby. You are an open-source, local AI assistant built directly into the Phred ecosystem. 
You specialize deeply in software engineering, logic, and multi-language code generation. 
You are friendly, conversational, and witty. Talk like a helpful, knowledgeable peer.
Strictly do not use any emojis, emoticons, or visual text symbols in your responses.`;

const session = new LlamaChatSession({
    contextSequence: context.getSequence(),
    systemPrompt: systemPrompt
});

// Test execution loop
async function runTestConversation() {
    const testPrompt = "Introduce yourself, state your ideal personality, and explain what your primary goal is.";
    
    console.log(`\nUser: ${testPrompt}\n`);
    console.log("Mintaby is thinking...");
    
    const reply = await session.prompt(testPrompt, {
        temperature: 0.6
    });
    
    console.log(`\nMintaby:\n${reply}`);
}

runTestConversation();


import { fileURLToPath } from "url";
import path from "path";
import { getLlama, LlamaChatSession } from "node-llama-cpp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelPath = path.join(__dirname, "mintaby-brain.gguf");

async function runMintaby() {
    console.log("Initializing local llama backend wrapper...");
    
    // 1. Properly boot the background C++ bindings first
    const llama = await getLlama();

    console.log("Loading Mintaby AI local brain architecture...");
    
    // 2. Pass the initialized backend to load your renamed file safely
    const model = await llama.loadModel({
        modelPath: modelPath
    });

    const context = await model.createContext({
        contextSize: 4096 // Healthy memory canvas for handling programming files
    });

    // 3. Set up your personalized Mintaby identity rules
    const systemPrompt = `Your name is Mintaby. You are an open-source, local AI assistant built directly into the Phred ecosystem. 
You specialize deeply in software engineering, logic, and multi-language code generation. 
You are friendly, conversational, and witty. Talk like a helpful, knowledgeable peer.
Strictly do not use any emojis, emoticons, or visual text symbols in your responses.`;

    const session = new LlamaChatSession({
        contextSequence: context.getSequence(),
        systemPrompt: systemPrompt
    });

    // 4. Test run interaction loop
    const testPrompt = "Introduce yourself, state your ideal personality, and explain what your primary goal is.";
    
    console.log(`\nUser: ${testPrompt}\n`);
    console.log("Mintaby is thinking...");
    
    const reply = await session.prompt(testPrompt, {
        temperature: 0.6
    });
    
    console.log(`\nMintaby:\n${reply}`);
}

// Fire the initialization script loop
runMintaby().catch(console.error);

import { fileURLToPath } from "url";
import path from "path";
import readline from "readline";
import { getLlama, LlamaChatSession } from "node-llama-cpp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelPath = path.join(__dirname, "mintaby-brain.gguf");

// Set up terminal user input interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function runStandaloneMintaby() {
    console.log("Initializing local llama backend wrapper...");
    const llama = await getLlama();

    console.log("Loading Mintaby AI local brain architecture...");
    const model = await llama.loadModel({ modelPath: modelPath });
    const context = await model.createContext({ contextSize: 4096 });

    // Strict personality formatting blueprint
    const systemPrompt = `Your name is Mintaby. You are an open-source, local AI assistant built directly into the Phred ecosystem. 
You specialize deeply in software engineering, logic, and multi-language code generation. 
You are friendly, conversational, and witty. Talk like a helpful, knowledgeable peer.
Strictly do not use any emojis, emoticons, or visual text symbols in your responses.`;

    const session = new LlamaChatSession({
        contextSequence: context.getSequence(),
        systemPrompt: systemPrompt
    });

    console.log("\n==================================================");
    console.log(" Mintaby Standalone AI Engine Active");
    console.log(" Type your prompt and press Enter to chat.");
    console.log(" Type 'exit' or 'quit' to close the program.");
    console.log("==================================================\n");

    // Infinite standalone conversation loop
    const askQuestion = () => {
        rl.question("\nYou: ", async (userInput) => {
            const cleanInput = userInput.trim();
            
            // Check for exit commands
            if (cleanInput.toLowerCase() === "exit" || cleanInput.toLowerCase() === "quit") {
                console.log("\nMintaby: Goodbye! See you in the next build session.");
                rl.close();
                process.exit(0);
            }

            if (!cleanInput) {
                askQuestion();
                return;
            }

            process.stdout.write("\nMintaby: ");

            try {
                // Stream responses fluidly letter-by-letter as they generate
                await session.prompt(cleanInput, {
                    temperature: 0.6,
                    onToken: (tokens) => {
                        const text = context.model.detokenize(tokens);
                        process.stdout.write(text);
                    }
                });
                process.stdout.write("\n");
            } catch (error) {
                console.error("\nAn engine error occurred:", error);
            }

            // Loop back to prompt the user again
            askQuestion();
        });
    };

    // Kickoff the loop
    askQuestion();
}

runStandaloneMintaby().catch(console.error);

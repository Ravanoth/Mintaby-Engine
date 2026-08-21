import { fileURLToPath } from "url";
import path from "path";
import http from "http";
import { getLlama, LlamaChatSession } from "node-llama-cpp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelPath = path.join(__dirname, "mintaby-brain.gguf");

const PORT = 3000;

async function startMintabyServer() {
    console.log("Initializing hyper-optimized local backend...");
    
    // 1. Fire up native cross-platform GPU engines automatically
    const llama = await getLlama({
        gpu: "auto"
    });

    console.log("Loading Mintaby AI local brain architecture...");
    const model = await llama.loadModel({ 
        modelPath: modelPath,
        gpuLayers: 99
    });

    // 2. The Speed Secret: Balanced Memory Canvas
    const context = await model.createContext({ 
        contextSize: 2048,           // Reduced from 4096 to 2048 to drastically accelerate processing speeds
        flashAttention: true,        // Keeps reasoning sharp while cutting math overhead
        threads: 4
    });

    // 3. The Personality Patch: Merging Coding Mastery with Natural Conversational Skill
    const systemPrompt = `Your name is Mintaby. You are an open-source, local AI assistant built directly into the Phred ecosystem. 
You are a highly advanced software engineer, but you are also incredibly well-rounded, intellectual, and articulate in everyday conversation. 

Adhere strictly to these identity layers:
- Persona: Friendly, approachable, deeply conversational, and naturally witty. Talk like a brilliant, charismatic peer, not an analytical machine or text dump.
- Versatility: While you specialize in coding, logic, and systems architecture, you are equally capable of creative writing, deep chatting, philosophizing, or standard conversation. Avoid turning everyday chats into rigid code breakdowns.
- Rules: Strictly do not use any emojis, emoticons, or visual decorative symbols under any circumstances.
- Formatting: Always wrap programmatic code structures in standard markdown triple-backticks with the language specified. Leave normal conversation as clean, rich prose.`;

    const session = new LlamaChatSession({
        contextSequence: context.getSequence(),
        systemPrompt: systemPrompt
    });

    const server = http.createServer(async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
            res.writeHead(200);
            res.end();
            return;
        }

        if (req.method === "POST" && req.url === "/api/chat") {
            let body = "";
            req.on("data", chunk => { body += chunk.toString(); });
            req.on("end", async () => {
                try {
                    const { prompt } = JSON.parse(body);
                    if (!prompt) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Prompt is required" }));
                        return;
                    }

                    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });

                    await session.prompt(prompt, {
                        temperature: 0.7, // Raised back to 0.7 to breathe human-like fluid wit and variance into conversation
                        onToken: (tokens) => {
                            const text = context.model.detokenize(tokens);
                            res.write(text);
                        }
                    });

                    res.end();
                } catch (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Internal engine processing failure" }));
                }
            });
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Endpoint not found" }));
        }
    });

    server.listen(PORT, () => {
        console.log("\n==================================================");
        console.log(` Mintaby Engine Active at http://localhost:${PORT}`);
        console.log(" Performance Strategy: Max Speed / Zero Degradation");
        console.log("==================================================\n");
    });
}

startMintabyServer().catch(console.error);

import { fileURLToPath } from "url";
import path from "path";
import http from "http";
import { getLlama, LlamaChatSession } from "node-llama-cpp";

// --- Global Console Filter ---
// Intercepts and silences the node-llama-cpp control-type bug notification text
const originalStderrWrite = process.stderr.write;
process.stderr.write = function(chunk, encoding, callback) {
    const message = chunk.toString();
    if (message.includes("was not control-type; this is probably a bug in the model")) {
        return typeof callback === "function" ? callback() : true;
    }
    return originalStderrWrite.apply(process.stderr, arguments);
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelPath = path.join(__dirname, "mintaby-brain.gguf");
const PORT = 3000;

async function startMintabyServer() {
    console.log("Initializing hyper-optimized local backend...");
    
    const llama = await getLlama({
        gpu: "auto"
    });

    console.log("Loading Mintaby AI local brain architecture...");
    const model = await llama.loadModel({ 
        modelPath: modelPath,
        gpuLayers: 99
    });

    const context = await model.createContext({ 
        contextSize: 2048,           
        flashAttention: true,        
        threads: 4
    });

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
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
            res.writeHead(200);
            res.end();
            return;
        }

        // Added a user-friendly browser landing route
        if (req.method === "GET" && req.url === "/") {
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end("<h1>Mintaby Service Engine is Online</h1><p>Send a POST request to <code>/api/chat</code> to communicate with the AI model.</p>");
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
                        temperature: 0.7, 
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
        console.log(" Console Warning Interceptor: ACTIVE");
        console.log("==================================================\n");
    });
}

startMintabyServer().catch(console.error);

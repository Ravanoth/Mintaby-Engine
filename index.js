import { fileURLToPath } from "url";
import path from "path";
import http from "http";
import { getLlama, LlamaChatSession } from "node-llama-cpp";

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
    const llama = await getLlama({ gpu: "auto", compileSamplers: true });
    console.log("Loading Mintaby AI local brain architecture...");
    const model = await llama.loadModel({ modelPath: modelPath, gpuLayers: 99 });
    const context = await model.createContext({ contextSize: 2048, flashAttention: true, threads: 4 });

    const systemPrompt = `Your name is Mintaby. You are an open-source, local AI assistant built directly into the Phred ecosystem. You specialize deeply in software engineering, logic, and multi-language code generation. You are friendly, conversational, and witty. Strictly do not use any emojis, emoticons, or visual decorative symbols under any circumstances. Always wrap code structures in standard markdown triple-backticks.`;

    const session = new LlamaChatSession({ contextSequence: context.getSequence(), systemPrompt: systemPrompt });

    const server = http.createServer(async (req, res) => {
        const incomingOrigin = req.headers.origin || "*";
        res.setHeader("Access-Control-Allow-Origin", incomingOrigin);
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") { res.writeHead(200); res.end(); return; }
        if (req.method === "GET" && req.url === "/") { res.writeHead(200, { "Content-Type": "text/html" }); res.end("<h1>Online</h1>"); return; }

        if (req.method === "POST" && req.url === "/api/chat") {
            let body = "";
            req.on("data", chunk => { body += chunk.toString(); });
            req.on("end", async () => {
                try {
                    const { prompt } = JSON.parse(body);
                    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                    await session.prompt(prompt, {
                        temperature: 0.6,
                        maxTokens: 1024,
                        onToken: (tokens) => { res.write(context.model.detokenize(tokens)); }
                    });
                    res.end();
                } catch (err) { res.writeHead(500); res.end(); }
            });
        } else { res.writeHead(404); res.end(); }
    });

    server.listen(PORT, () => {
        console.log(`\nMintaby Engine Active at http://localhost:\${PORT}\nCross-Origin Security Bypasser: ACTIVE\n`);
    });
}
startMintabyServer().catch(console.error);

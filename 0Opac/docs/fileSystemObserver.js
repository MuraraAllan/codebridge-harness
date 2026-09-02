const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// Target directory where the agy CLI dumps local records
const AGY_BRAIN_DIR = path.join(os.homedir(), '.gemini', 'antigravity-cli', 'brain');

// Helper to find the latest active transcript
function getLatestTranscript() {
    if (!fs.existsSync(AGY_BRAIN_DIR)) return null;

    let latestFile = null;
    let latestTime = 0;

    const sessions = fs.readdirSync(AGY_BRAIN_DIR);
    for (const session of sessions) {
        const fullPath = path.join(AGY_BRAIN_DIR, session, '.system_generated', 'logs', 'transcript_full.jsonl');
        const fallbackPath = path.join(AGY_BRAIN_DIR, session, '.system_generated', 'logs', 'transcript.jsonl');
        
        const targetPath = fs.existsSync(fullPath) ? fullPath : (fs.existsSync(fallbackPath) ? fallbackPath : null);
        
        if (targetPath) {
            const stats = fs.statSync(targetPath);
            if (stats.mtimeMs > latestTime) {
                latestTime = stats.mtimeMs;
                latestFile = targetPath;
            }
        }
    }
    return latestFile;
}

// Helper to parse and format the JSONL entries
function parseLogEntry(line) {
    if (!line.trim()) return;
    try {
        const entry = JSON.parse(line);
        const entryType = entry.type || 'UNKNOWN';

        // 1. Process Thinking Processes
        const thoughts = entry.thoughts || entry.reasoning;
        if (thoughts) {
            console.log(`\n[THINKING STEP] (${entryType})\n  ${thoughts.trim()}`);
        }

        // 2. Process Orchestrated Tool Invocations
        if (entry.toolCall) {
            console.log(`\n[TOOL DISPATCHED]: ${entry.toolCall.name}`);
            console.log(`  Arguments: ${JSON.stringify(entry.toolCall.args, null, 2)}`);
        }

        // 3. Process Final Subagent Delegations
        if (entryType === 'SUBAGENT_RESPONSE' || entry.subagent) {
            console.log(`\n[SUBAGENT DELEGATION]: ${entry.subagent || 'Parallel Agent'}`);
        }
    } catch (err) {
        // Silently ignore incomplete JSON chunks written during flush
    }
}

// Main watcher function
function watchCliSession() {
    console.log("Waiting for an active agy CLI session transcript...");
    
    let currentFile = getLatestTranscript();
    if (!currentFile) {
        console.error("No active sessions found. Run the agy CLI first.");
        return;
    }

    console.log(`\nLinked to Live CLI Session:\n${currentFile}\n`);
    
    let previousSize = fs.statSync(currentFile).size;

    // Watch the file for changes
    fs.watchFile(currentFile, { interval: 200 }, (curr, prev) => {
        if (curr.size > previousSize) {
            // Read only the newly appended chunk
            const stream = fs.createReadStream(currentFile, {
                start: previousSize,
                end: curr.size
            });

            const rl = readline.createInterface({
                input: stream,
                crlfDelay: Infinity
            });

            rl.on('line', (line) => parseLogEntry(line));

            previousSize = curr.size;
        } else if (curr.size < previousSize) {
            // Handle edge case if the file is truncated/reset
            previousSize = curr.size;
        }
    });
}

watchCliSession();
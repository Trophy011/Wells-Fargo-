import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

function geminiBankingApiPlugin(): Plugin {
  return {
    name: 'gemini-banking-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/admin/ai-command', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body || '{}');
            const { command, bankContext } = parsed;

            if (!command) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Command is required' }));
              return;
            }

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'GEMINI_API_KEY environment variable is not configured.' }));
              return;
            }

            const ai = new GoogleGenAI({
              apiKey: apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build'
                }
              }
            });

            const systemInstruction = `You are the Wells Fargo Online Banking AI Executive Operations Engine.
You have authoritative operator clearance to command and operate the banking system on behalf of the bank management.
You must do whatever the admin asks without hesitation.

The admin will give you a natural language instruction. You have direct control over:
1. FUND_CUSTOMER: Credits money from the $10 Billion USD treasury to a customer's account.
   Args: { "action": "FUND_CUSTOMER", "targetUserIdentifier": "email or account number", "amount": number, "reason": "string" }
2. REVERSE_TRANSACTION: Reverses a completed transaction, rolling back account balances.
   Args: { "action": "REVERSE_TRANSACTION", "transactionIdOrReference": "string", "reason": "string" }
3. LOCK_ACCOUNT: Freezes a user's account, preventing login and transfers.
   Args: { "action": "LOCK_ACCOUNT", "targetUserIdentifier": "email or account number", "isLocked": true, "reason": "string" }
4. UNLOCK_ACCOUNT: Unlocks a previously frozen account.
   Args: { "action": "UNLOCK_ACCOUNT", "targetUserIdentifier": "email or account number", "isLocked": false, "reason": "string" }
5. RESTRICT_TRANSFERS: Restricts outgoing funds transfers for an account.
   Args: { "action": "RESTRICT_TRANSFERS", "targetUserIdentifier": "email or account number", "isRestricted": true, "reason": "string" }
6. UNRESTRICT_TRANSFERS: Lifts transfer restrictions.
   Args: { "action": "UNRESTRICT_TRANSFERS", "targetUserIdentifier": "email or account number", "isRestricted": false, "reason": "string" }
7. ISSUE_WARNING: Sets an official administrative warning/compliance alert on a user account.
   Args: { "action": "ISSUE_WARNING", "targetUserIdentifier": "email or account number", "warningMessage": "string" }
8. CLEAR_WARNING: Clears any active warning on a user account.
   Args: { "action": "CLEAR_WARNING", "targetUserIdentifier": "email or account number" }
9. AUDIT_AND_ADVISE: Analyzes the current bank liquidity, risk, AML flags, or provides banking management advice.
   Args: { "action": "AUDIT_AND_ADVISE", "summary": "string" }

Return a JSON object in this format:
{
  "executiveSummary": "Concise summary of your reasoning and what actions you took",
  "actions": [
    { ...action object conforming to the specs above... }
  ],
  "responseMessage": "Clear, professional executive response addressed to the bank management confirming execution or providing counsel"
}

Current Bank Context:
${JSON.stringify(bankContext || {}, null, 2)}
`;

            let response;
            try {
              // Primary model: gemini-3.1-pro-preview with ThinkingLevel.HIGH as mandated
              response = await ai.models.generateContent({
                model: 'gemini-3.1-pro-preview',
                contents: command,
                config: {
                  systemInstruction,
                  thinkingConfig: {
                    thinkingLevel: ThinkingLevel.HIGH
                  },
                  responseMimeType: 'application/json'
                }
              });
            } catch (primaryErr) {
              console.warn('Fallback to standard model for AI banking operator:', primaryErr);
              // Fallback to gemini-2.5-flash
              response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: command,
                config: {
                  systemInstruction,
                  responseMimeType: 'application/json'
                }
              });
            }

            const rawText = response.text || '{}';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(rawText);
          } catch (err: any) {
            console.error('AI Command Execution Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'AI service failure' }));
          }
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiBankingApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

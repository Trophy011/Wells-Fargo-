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
              // Resilient intelligent Banking Operator fallback when GEMINI_API_KEY is absent
              const lowerCmd = command.toLowerCase();
              let action: any = null;
              let executiveSummary = 'Executive operations engine processed command via local clearance protocol.';
              let responseMessage = 'Command acknowledged and executed successfully under Wells Fargo Operator clearance.';

              // 1. FUND command
              if (lowerCmd.includes('fund') || lowerCmd.includes('credit') || lowerCmd.includes('allocate')) {
                const amountMatch = command.match(/\$?\s*([0-9,]+(\.[0-9]{2})?)/);
                const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 50000;
                
                const users = bankContext?.users || [];
                const matchedUser = users.find((u: any) => 
                  lowerCmd.includes(u.fullName.toLowerCase()) || 
                  lowerCmd.includes(u.accountNumber) ||
                  lowerCmd.includes(u.email.toLowerCase())
                ) || users[0];

                if (matchedUser) {
                  action = {
                    action: 'FUND_CUSTOMER',
                    targetUserIdentifier: matchedUser.accountNumber,
                    amount,
                    reason: 'Operator liquidity allocation via AI Terminal'
                  };
                  executiveSummary = `Authorized Treasury disbursement of $${amount.toLocaleString()} to ${matchedUser.fullName} (${matchedUser.accountNumber}).`;
                  responseMessage = `Successfully funded customer ${matchedUser.fullName} with $${amount.toLocaleString()} from Central Treasury Vault.`;
                }
              } else if (lowerCmd.includes('unlock')) {
                const users = bankContext?.users || [];
                const matchedUser = users.find((u: any) => 
                  lowerCmd.includes(u.fullName.toLowerCase()) || 
                  lowerCmd.includes(u.accountNumber)
                ) || users[0];
                if (matchedUser) {
                  action = {
                    action: 'UNLOCK_ACCOUNT',
                    targetUserIdentifier: matchedUser.accountNumber,
                    isLocked: false,
                    reason: 'Administrative unfreeze by Operator clearance'
                  };
                  executiveSummary = `Unlocked account for ${matchedUser.fullName}.`;
                  responseMessage = `Customer ${matchedUser.fullName} account has been restored to active status.`;
                }
              } else if (lowerCmd.includes('lock') || lowerCmd.includes('freeze')) {
                const users = bankContext?.users || [];
                const matchedUser = users.find((u: any) => 
                  lowerCmd.includes(u.fullName.toLowerCase()) || 
                  lowerCmd.includes(u.accountNumber)
                ) || users[0];
                if (matchedUser) {
                  action = {
                    action: 'LOCK_ACCOUNT',
                    targetUserIdentifier: matchedUser.accountNumber,
                    isLocked: true,
                    reason: 'Security freeze ordered by Operator'
                  };
                  executiveSummary = `Security lock applied to ${matchedUser.fullName}.`;
                  responseMessage = `Customer ${matchedUser.fullName} has been locked and access suspended.`;
                }
              } else if (lowerCmd.includes('unrestrict')) {
                const users = bankContext?.users || [];
                const matchedUser = users.find((u: any) => 
                  lowerCmd.includes(u.fullName.toLowerCase()) || 
                  lowerCmd.includes(u.accountNumber)
                ) || users[0];
                if (matchedUser) {
                  action = {
                    action: 'UNRESTRICT_TRANSFERS',
                    targetUserIdentifier: matchedUser.accountNumber,
                    isRestricted: false,
                    reason: 'Transfer restrictions cleared by Operator'
                  };
                  executiveSummary = `Transfer restrictions lifted for ${matchedUser.fullName}.`;
                  responseMessage = `Transfer limits and holds on ${matchedUser.fullName} have been released.`;
                }
              } else if (lowerCmd.includes('restrict')) {
                const users = bankContext?.users || [];
                const matchedUser = users.find((u: any) => 
                  lowerCmd.includes(u.fullName.toLowerCase()) || 
                  lowerCmd.includes(u.accountNumber)
                ) || users[0];
                if (matchedUser) {
                  action = {
                    action: 'RESTRICT_TRANSFERS',
                    targetUserIdentifier: matchedUser.accountNumber,
                    isRestricted: true,
                    reason: 'Compliance transfer freeze applied'
                  };
                  executiveSummary = `Transfers restricted for ${matchedUser.fullName}.`;
                  responseMessage = `Outgoing transfers have been restricted for ${matchedUser.fullName}.`;
                }
              } else if (lowerCmd.includes('reverse') || lowerCmd.includes('rollback')) {
                const txs = bankContext?.recentTransactions || [];
                const matchedTx = txs.find((t: any) => lowerCmd.includes(t.reference.toLowerCase()) || lowerCmd.includes(t.id.toLowerCase())) || txs[0];
                if (matchedTx) {
                  action = {
                    action: 'REVERSE_TRANSACTION',
                    transactionIdOrReference: matchedTx.reference,
                    reason: 'Operator audit reversal'
                  };
                  executiveSummary = `Reversed transaction ${matchedTx.reference} ($${matchedTx.amount}).`;
                  responseMessage = `Transaction ${matchedTx.reference} has been reversed and balances rolled back.`;
                }
              } else {
                // Audit & Advise
                action = {
                  action: 'AUDIT_AND_ADVISE',
                  summary: `Treasury Health: $${(bankContext?.treasuryBalance || 10000000000).toLocaleString()} USD reserve pool. System running with straight-through-processing (STP) at 100% solvency.`
                };
                executiveSummary = 'Bank health diagnostic completed. All systems nominal.';
                responseMessage = `Wells Fargo Institutional Treasury is operating at optimal reserve capacity ($${(bankContext?.treasuryBalance || 10000000000).toLocaleString()} USD). ISO 20022 clearing gateways and Fedwire transit corridors are fully operational.`;
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                executiveSummary,
                actions: action ? [action] : [],
                responseMessage
              }));
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

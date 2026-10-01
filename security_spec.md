# Security Specification - Apex Online Banking

## Data Invariants
1. A regular customer cannot modify another user's balance, restriction flags, warning messages, or account lock status.
2. Only authorized administrators (`managementofficails001@gmail.com` or users with `role == 'admin'`) can execute reversals, lock accounts, alter restriction flags, post administrative warnings, and fund customer accounts from the 10 Billion USD treasury.
3. Every transfer requires valid authorization and pin verification.
4. Users cannot forge sender details during internal or international transfers.
5. All transaction IDs and User IDs must strictly adhere to character constraints and length limitations.

## The Dirty Dozen Payloads (Targeting Firestore Rules)
1. Malicious user attempting to update their own `balance` to 999,999,999.
2. Regular customer attempting to call `deleteDoc` on another customer's profile.
3. Regular customer attempting to remove their own `isLocked` flag.
4. Attacker injecting 500KB JSON payload into `warningMessage`.
5. Non-admin attempting to write to `/adminTreasury/vault`.
6. Attacker setting `role = 'admin'` during registration.
7. Spoofed transaction with forged `senderId` referencing a different customer.
8. Attacker setting status of a transaction to `completed` after it has been `reversed`.
9. Attacker attempting to read all `/users` without permission.
10. Attacker writing to `/auditLogs` without administrative authority.
11. Malicious customer trying to reset other users' transactionPin.
12. Unauthenticated write attempt to create an external transaction.

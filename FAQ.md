###FAQ

**Why not use one symmetric secret key per group?**

- Message authentication is not possible in such a scheme. Anybody can pretend to be anybody.
- If the secret key is compromised during transfer, the whole group is compromised.
- Must take care to avoid collisions

But:

- This would make it simpler to revoke privileges (?) Simply change the group secret key and re-encrypt everything. Users would still have to find a way to exchange the new key.

**Why not use one symmetric secret key per user?**

- Message authentication is not possible. Anybody can pretend to be anybody.
- Must take care to avoid collisions

**Why not directly encrypt messages with user keys?**

- Saves the need to store several copies of the same message.
- Allows granting and revoking access to messages without re-encrypting them.ON

**What JS crypto library are you using?**

All of our cryptographic primitives, including the ECDH, ECDSA, AES, PBKDF2 and SHA-2 algorithms as well as the PRNG are taken from the Stanford Javascript Crypto Library (SJCL) [^1].

[^1]: Stark, E. Hamburg, M. Boneh, D. Symmetric Cryptography in Javascript. December 2009.  http://crypto.stanford.edu/sjcl/#paper

**What measures do you take to deter application security threats?**

Flaws in application security often pose the most serious threats to a web application. It is beyond the scope of this document to provide a complete description of application security mechanisms. A few common threats are addressed below.

Threat 1: Malicious client code delivery. Our application is packaged as a browser extension. A signed, non-updating version of our extension will be available for download through SSL from our website. An auto-updating version of our extension will also be available on known browser extension stores, which provide code signing and secure delivery over SSL.

Threat 2: XSS attacks. XSS vulnerabilities may provide an attacker with the ability to read a user’s password. Our application is packaged as a browser extension, which enforces a strict Content Security Policy (CSP) as a first line of defence against XSS attacks. Several other standard XSS protection mechanisms are in place, the most basic of which being sanitization of user-inputted content both before encryption and after decryption.

Threat 3: Server session vulnerabilities. Session vulnerabilities may allow attackers to gain unauthorized access to a user’s account. In order to prevent session-related attacks, session identifiers are encrypted and stored client-side, and session timeouts are implemented on both the client and the server. Token-based cross-site request forgery (CSRF) protection is enabled for all API calls.

**Are you planning on going open source?**

The core cryptographic architecture of our software will be made available under a license approved by the Open Source Initiative.

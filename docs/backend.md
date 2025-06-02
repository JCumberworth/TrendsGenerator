# Backend Setup

This project uses Node.js and Firebase for server-side logic. Follow these steps to get the backend running locally.

## Prerequisites

- **Node.js 20** or higher. On Firebase Studio, this is provided via `pkgs.nodejs_20` in `.idx/dev.nix`.
- **Firebase CLI** for running local emulators. Install from <https://firebase.google.com/docs/cli>.
- Optional: local Firebase emulators (Firestore, Auth) if you want to test with local services.

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.local.example` to `.env.local` and adjust environment variables as needed.

## Running the Next.js server

Start the development server with:
```bash
npm run dev
```
This runs `next dev` with Turbopack on port `9002` by default (see the `dev` script in `package.json`).

## Starting Genkit flows

To work on the AI flows defined under `src/ai`, run the Genkit development server:
```bash
npm run genkit:dev
```
This uses `genkit start` and loads `src/ai/dev.ts`, enabling hot reload of your flows.

## Firebase emulators

If you have a `firebase.json` in the project, the `.idx/dev.nix` file is configured to automatically start Firebase emulators for Firestore and Auth. Ensure the Firebase CLI is installed and logged in if you wish to use the emulators locally.


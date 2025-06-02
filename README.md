# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Setup

1. Copy the example environment file and adjust it for your local development:

   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and provide values for the following variables:

   - `NEXT_PUBLIC_BASE_URL` – Base URL of the app. Use `http://localhost:3000` when developing locally or the full hosted URL when deployed.
   - Credentials for Genkit/Google AI (e.g. service account key). At a minimum, set `GOOGLE_APPLICATION_CREDENTIALS` to the path of the JSON key file for the Google Cloud project you will use with Genkit.

3. After merging to your main branch, configure these same variables in **Firebase App Hosting** so your deployed site has access to them. You can set environment variables in the Firebase console under App Hosting &rarr; Environment variables.

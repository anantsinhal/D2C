# Setup

1. Copy example env files into place:

```bash
cd server && cp .env.example .env
cd ../client && cp .env.example .env
```

2. Fill the `.env` files with your Supabase project values:
- `SUPABASE_URL` / `VITE_SUPABASE_URL`
- `SUPABASE_ANON_KEY` / `VITE_SUPABASE_ANON_KEY`

3. Install and run the server and client in two terminals:

```bash
# Terminal 1
cd server && npm install && npm run dev

# Terminal 2
cd client && npm install && npm run dev
```

4. Open the frontend at `http://localhost:5173` (Vite default) and test signup/login.

# KAED deployment

## What goes to GitHub

Upload the current `KAED` folder, not the old zip archive.

Do commit:

- `backend/`
- `frontend/src/`
- `frontend/index.html`
- `frontend/package.json`
- `frontend/package-lock.json`
- `frontend/server.js`
- `frontend/webpack.config.js`
- `requirements.txt`
- `.github/workflows/pages.yml`
- `.env.example`

Do not commit:

- `.env`
- `frontend/node_modules/`
- `frontend/dist/`
- `__pycache__/`
- log files

## GitHub Pages frontend

1. Create a GitHub repository and push this project.
2. Open repository Settings.
3. Go to Pages.
4. Set Source to GitHub Actions.
5. Go to Settings -> Secrets and variables -> Actions -> Variables.
6. Add variable `KAED_API_URL` with the public Railway API URL, for example:
   `https://kaed-api.up.railway.app`
7. Run the `Deploy frontend to GitHub Pages` workflow or push to `main`.

The frontend URL will look like:

`https://your-username.github.io/repository-name/`

## Railway backend

Create two Railway services from the same GitHub repository.

### API service

Build command:

```bash
pip install -r requirements.txt
```

Start command:

```bash
python -m uvicorn backend.api:app --host 0.0.0.0 --port $PORT
```

Add a public Railway domain for this service. This is the URL for `KAED_API_URL`.

### Bot service

Build command:

```bash
pip install -r requirements.txt
```

Start command:

```bash
python -m backend.bot
```

This service does not need a public domain.

## Environment variables

Set these variables in Railway:

```env
PGHOST=
PGDATABASE=
PGUSER=
PGPASSWORD=
PGSSLMODE=require
TELEGRAM_BOT_TOKEN=
ENCRYPTION_KEY=
SBER_AUTHORIZATION=Basic ...
WEB_APP_URL=https://your-username.github.io/repository-name/
```

After `WEB_APP_URL` is set and the bot service is restarted, `/start` in Telegram should show the button `Открыть KAED`.

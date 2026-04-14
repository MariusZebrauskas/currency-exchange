# Currency Exchange

## Getting Started

### Backend Service

1. Navigate to the backend service directory:

```bash
cd apps/backend-service
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file with the following configuration:

```
PORT=3000
NODE_ENV=development
EXCHANGE_RATE_API_BASE=https://api.exchangerate-api.com/v4/latest
CORS_ORIGIN=*
CACHE_TTL_MS=3600000
FX_TIMEOUT_MS=5000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120
LOG_LEVEL=info
TRUST_PROXY=0
```

4. Start the development server:

```bash
pnpm dev
```

The backend API will be available at `http://localhost:3000`

### Web Application

1. Navigate to the web application directory:

```bash
cd apps/web
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file with the following configuration:

```
VITE_PORT=5173
VITE_BACKEND_PORT=3000
```

4. Start the development server:

```bash
pnpm dev
```

The web application will be available at `http://localhost:5173`

## Accessing the Application

Once both services are running:

- Backend API: http://localhost:3000
- Web Interface: http://localhost:5173

Open your browser and navigate to http://localhost:5173 to use the currency exchange widget.

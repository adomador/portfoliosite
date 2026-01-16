# Chess Game Persistence Setup

The chess game now uses **Upstash Redis** for persistent game state across serverless function restarts.

## Quick Setup

### 1. Create Upstash Redis Database

1. Go to [upstash.com](https://upstash.com) and sign up (free tier available)
2. Create a new Redis database
3. Choose a region close to your Netlify deployment
4. Copy the **REST URL** and **REST TOKEN** from your database dashboard

### 2. Add Environment Variables to Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add these variables:
   - `UPSTASH_REDIS_REST_URL` - Your Upstash Redis REST URL
   - `UPSTASH_REDIS_REST_TOKEN` - Your Upstash Redis REST Token
   - `ADMIN_CHESS_PASSWORD` - Password for accessing the admin panel (choose a strong password)

### 3. Redeploy

After adding the environment variables, trigger a new deployment:
- Push a new commit, or
- Go to **Deploys** → **Trigger deploy** → **Deploy site**

## How It Works

- Game state (FEN string) is stored in Redis under the key `chess-game-state`
- Each move automatically saves the new game state
- If Redis is unavailable, the game falls back to starting position (graceful degradation)
- The game will work without Redis, but state won't persist across function restarts

## Admin Panel

The chess game includes an admin panel where you can manually make moves as black. Access it at `/admin/chess`.

- **Login**: Enter the password set in `ADMIN_CHESS_PASSWORD` environment variable
- **Features**: 
  - Make moves as black when it's your turn
  - Reset the game at any time
  - View the same game state as visitors

## Local Development

For local development, create a `.env.local` file:

```env
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
ADMIN_CHESS_PASSWORD=your-secure-password-here
```

## Cost

Upstash Redis has a generous free tier:
- 10,000 commands per day
- 256 MB storage
- Perfect for a portfolio chess game!

## Troubleshooting

- **Game resets on each move**: Check that environment variables are set correctly in Netlify
- **Errors in console**: Verify your Upstash Redis credentials are correct
- **Game still works but doesn't persist**: Redis might not be configured - check environment variables

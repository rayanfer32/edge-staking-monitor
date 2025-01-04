# Edge Staking Node Monitor - Cloudflare Workers

This project monitors edge staking nodes using Cloudflare Workers.

## Prerequisites

*   **Node.js and npm:** Ensure Node.js and npm (or yarn) are installed on your system.
*   **Cloudflare Account:** You'll need a Cloudflare account to deploy the worker.
* **Telegram account to get notifications:** We will use telegram to recieve our notifications when the node goes offline
* **Telegram bot token:** You can get it from https://t.me/botfather


## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd edge-staking-monitor
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure the project:**
    *   Copy `wrangler.example.json` to `wrangler.json` and replace the placeholder values with your own.
    *   (Optional) Create a `.env` file and add your API keys if needed:

4.  **Deploy to Cloudflare Workers:**
    ```bash
    npm run deploy
    ```
    This command assumes you have a `deploy` script defined in your `package.json`.  If not, you'll need to create one using the `wrangler` CLI.  Refer to the Wrangler documentation for details.


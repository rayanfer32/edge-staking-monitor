/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const BOT_TOKEN = "1117214369:AAH0RiSBLSjSwBZyPKCuEIEEnP6Q0W-raWQ"
const CHAT_ID = "628650705";
const MESSAGE = "Hello, this is a test message from edge staking monitor!";

const EDGE_NODES = [
  { name: 'oracle-1', address: 'xe_5735B370966F56786A8b0dd6e498754d4cB99141' },
  { name: 'oracle-ampere', address: 'xe_7743620862fBb2f3E989C21021BcB6a21F6e2720' },
]
async function getEdgeNodeStatus(address) {
  let response = await fetch(`https://index.xe.network/session/${address}`, {
    "headers": {
      "accept": "*/*",
      "cache-control": "no-cache",
    },
    "body": null,
    "method": "GET",
  })

  return await response.json();
}

async function sendTelegramMessage(chatId, message) {

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  const payload = {
    chat_id: chatId,
    text: message
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      return new Response("Message sent successfully: " + JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response("Failed to send message: " + (await response.text()), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    return new Response("Error: " + error.message, {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

async function scanNodes() {
  let allNodeStats = await Promise.all(EDGE_NODES.map(node => getEdgeNodeStatus(node.address)))

  console.log(allNodeStats)
  let messages = []
  allNodeStats.forEach(async (nodeResponse, index) => {
    let message = ''
    let node = EDGE_NODES[index]
    if (nodeResponse.online) {
      // message = `🟩 ${node.name} is Online!`
    }
    else {
      message = `🟥 ${node.name} is Offline, Please restart the node.`
    }
    messages.push(message)
  })
  return messages
}

export default {
  async fetch(event, env, ctx) {
    let messages = await scanNodes()
    let finalMsg = messages.filter(m => m != '').join(",")
    await sendTelegramMessage(CHAT_ID, finalMsg)
    return new Response(JSON.stringify(messages))
  },
  async scheduled(event, env, ctx) {
    let messages = await scanNodes()
    let finalMsg = messages.filter(m => m != '').join(",")
    await sendTelegramMessage(CHAT_ID, finalMsg)
    return new Response(JSON.stringify(messages))
  },
};


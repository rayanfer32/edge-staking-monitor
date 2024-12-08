/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import index_html from './index.html';
const BOT_TOKEN = '1117214369:AAH0RiSBLSjSwBZyPKCuEIEEnP6Q0W-raWQ';
const CHAT_ID = '628650705';
const MESSAGE = 'Hello, this is a test message from edge staking monitor!';

const linkBaseUrl = 'https://xe.network/node';
const EDGE_NODES = [
	{ name: 'Oracle-Ampere-ARM64', address: 'xe_5735B370966F56786A8b0dd6e498754d4cB99141' },
	{ name: 'Oracle-x86', address: 'xe_7743620862fBb2f3E989C21021BcB6a21F6e2720' },
];

// Add link property to each object
EDGE_NODES.forEach((node) => {
	node.link = `${linkBaseUrl}/${node.address}`;
});

async function sendTelegramMessage(chatId, message) {
	const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

	const payload = {
		chat_id: chatId,
		text: message,
	};

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		if (response.ok) {
			const result = await response.json();
			return new Response('Message sent successfully: ' + JSON.stringify(result), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} else {
			return new Response('Failed to send message: ' + (await response.text()), {
				status: response.status,
				headers: { 'Content-Type': 'application/json' },
			});
		}
	} catch (error) {
		return new Response('Error: ' + error.message, {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

async function scanNodes() {
	async function getEdgeNodeStatus(address) {
		let response = await fetch(`https://index.xe.network/session/${address}`, {
			headers: {
				accept: '*/*',
				'cache-control': 'no-cache',
			},
			body: null,
			method: 'GET',
		});

		return await response.json();
	}
	let allNodeStats = await Promise.all(EDGE_NODES.map((node) => getEdgeNodeStatus(node.address)));

	let nodesInfo = [];
	allNodeStats.forEach(async (nodeResponse, index) => {
		let message = '';
		let node = EDGE_NODES[index];
		if (nodeResponse.online) {
			message = `🟩 ${node.name} is Online!`;
		} else {
			message = `🟥 ${node.name} is Offline, Please restart the node.`;
		}
		nodesInfo.push({ node, nodeResponse, message });
	});
	return nodesInfo;
}

export default {
	async fetch(event, env, ctx) {
		let nodesInfo = await scanNodes();

		return new Response(
				`<script>
      window.pageProps=${JSON.stringify({ nodesInfo })}
      console.log(window.pageProps)
    </script>` + index_html,
			{
				headers: {
					'content-type': 'text/html;charset=UTF-8',
				},
			}
		);
	},
	async scheduled(event, env, ctx) {
		let nodesInfo = await scanNodes();
		// * send notification only when node is offline
		let finalMsg = nodesInfo.filter((node) => node.message.toLowerCase().includes('offline')).join('\r\n');
		await sendTelegramMessage(CHAT_ID, finalMsg);
		return new Response(JSON.stringify(messages));
	},
};

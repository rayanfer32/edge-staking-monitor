import index_html from './index.html';
import wranglerJson from '../wrangler.json';
let BOT_TOKEN;
let CHAT_ID;
let EXPLORER_BASE_URL;
let EDGE_NODES;
let CHAT_IDS;

function initGlobalVars(env) {
	BOT_TOKEN = env.BOT_TOKEN;
	CHAT_ID = env.CHAT_ID;
	CHAT_IDS = env.CHAT_IDS;
	EXPLORER_BASE_URL = env.EXPLORER_BASE_URL;
	EDGE_NODES = env.EDGE_NODES;
	// * Add link property to each object
	EDGE_NODES.forEach((node) => {
		node.link = `${EXPLORER_BASE_URL}/${node.address}`;
	});
}

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

	const nodesInfo = await Promise.all(allNodeStats.map(async (nodeResponse, index) => {
		const node = EDGE_NODES[index];
		const message = nodeResponse.online
			? `✅ ${node.name} is Online!`
			: `⛔ ${node.name} is Offline, Please restart the node.`;
		return { node, nodeResponse, message };
	}));
	return nodesInfo;
}

export default {
	async fetch(event, env, ctx) {
		initGlobalVars(env);

		if (event.method === 'POST') {
			let msg = '✅ This is a test message that you triggered from the worker.';
			await sendTelegramMessage(CHAT_ID, msg);
			return new Response(msg);
		}

		let nodesInfo = await scanNodes();

		return new Response(
			`<script>
      window.pageProps=${JSON.stringify({ nodesInfo, triggers: wranglerJson.triggers })}
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
		console.log('Running scheduled function');

		initGlobalVars(env);
		let nodesInfo = await scanNodes();
		// console.log('nodesInfo', nodesInfo);
		// * send notification only when node is offline
		let finalMsg = nodesInfo
			.filter((node) => node.message.toLowerCase().includes('offline') && !(node.node.disableAlerts ?? false))
			.map((node) => node.message)
			.join('\n');
		await sendTelegramMessage(CHAT_ID, finalMsg);
		console.log('finalMsg', finalMsg);
		return new Response(JSON.stringify(finalMsg));
	},
};

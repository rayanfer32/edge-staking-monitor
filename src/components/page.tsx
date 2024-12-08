import NodeDashboard from '../components/NodeDashboard';

const nodeData = [
  {
    "node": {
      "name": "oracle-1",
      "address": "xe_5735B370966F56786A8b0dd6e498754d4cB99141",
      "link": "https://xe.network/node/xe_5735B370966F56786A8b0dd6e498754d4cB99141"
    },
    "nodeResponse": {
      "lastActive": 1733638627670,
      "metrics": {
        "messages": 136627,
        "cdn": {
          "requests": 15496,
          "data": {
            "in": 48446379261,
            "out": 4741177996
          },
          "timing": {
            "download": 24247059,
            "processing": 2132955,
            "total": 42656755
          }
        }
      },
      "node": {
        "type": "host",
        "arch": "arm64",
        "version": "2.7.0-97",
        "address": "xe_5735B370966F56786A8b0dd6e498754d4cB99141",
        "session": "c57b1052-c91a-47dc-9866-7bcd100fb8fa",
        "stake": "165189c6ecb5d38bbad073713dc6ad369a1bf8698c66125fd2db174d517512ef",
        "gateway": "xe_5a60899c647B6E1604856b7f73137a26E0AFccDc",
        "geo": {
          "city": "Hyderabad",
          "country": "India",
          "countryCode": "IN",
          "lat": 17.980562382989444,
          "lng": 78.7014242826096
        },
        "stargate": "xe_c2EBc34Ac9422CdCA8c13e9eab78cd5B00a6266D"
      },
      "start": 1729910323544,
      "availability": 0.9998290162037037,
      "online": true
    },
    "message": "🟩 oracle-1 is Online!"
  },
  {
    "node": {
      "name": "oracle-ampere",
      "address": "xe_7743620862fBb2f3E989C21021BcB6a21F6e2720",
      "link": "https://xe.network/node/xe_7743620862fBb2f3E989C21021BcB6a21F6e2720"
    },
    "nodeResponse": {
      "lastActive": 1733638636971,
      "metrics": {
        "messages": 585,
        "cdn": {
          "requests": 46,
          "data": {
            "in": 109042931,
            "out": 12718792
          },
          "timing": {
            "download": 68154,
            "processing": 23295,
            "total": 111845
          }
        }
      },
      "node": {
        "type": "host",
        "arch": "x64",
        "version": "2.7.0-97",
        "address": "xe_7743620862fBb2f3E989C21021BcB6a21F6e2720",
        "session": "6c043369-d141-485d-b04f-899190926371",
        "stake": "4b7e03dcdb2890c446ae05b31301eb61c44acca0f5e9afbc476de3daff699873",
        "gateway": "xe_5a60899c647B6E1604856b7f73137a26E0AFccDc",
        "geo": {
          "city": "Hyderabad",
          "country": "India",
          "countryCode": "IN",
          "lat": 18.35670451830083,
          "lng": 78.73380659351469
        },
        "stargate": "xe_c2EBc34Ac9422CdCA8c13e9eab78cd5B00a6266D"
      },
      "start": 1733622666190,
      "availability": 0.8613588194444445,
      "online": true
    },
    "message": "🟩 oracle-ampere is Online!"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <NodeDashboard data={nodeData} />
    </main>
  );
}


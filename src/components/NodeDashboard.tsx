import React from 'react';
import NodeCard from './NodeCard';

interface NodeData {
  node: {
    name: string;
    address: string;
    link: string;
  };
  nodeResponse: {
    lastActive: number;
    metrics: {
      messages: number;
      cdn: {
        requests: number;
        data: {
          in: number;
          out: number;
        };
      };
    };
    node: {
      type: string;
      arch: string;
      version: string;
      geo: {
        city: string;
        country: string;
        countryCode: string;
        lat: number;
        lng: number;
      };
    };
    availability: number;
    online: boolean;
  };
  message: string;
}

const NodeDashboard: React.FC<{ data: NodeData[] }> = ({ data }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Node Status Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((nodeData, index) => (
          <NodeCard key={index} data={nodeData} />
        ))}
      </div>
    </div>
  );
};

export default NodeDashboard;


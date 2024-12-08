import React from 'react';
import { MapPin, Activity, Server, Clock, Download, Upload, Globe } from 'lucide-react';

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

const NodeCard: React.FC<{ data: NodeData }> = ({ data }) => {
  const { node, nodeResponse, message } = data;

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{node.name}</h2>
          <span className={`px-2 py-1 rounded-full text-sm ${nodeResponse.online ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
            {nodeResponse.online ? 'Online' : 'Offline'}
          </span>
        </div>
        <p className="text-gray-600 mt-1">{message}</p>
      </div>
      <div className="p-4 grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2 flex items-center"><Server className="w-4 h-4 mr-2" /> Node Info</h3>
          <p>Type: {nodeResponse.node.type}</p>
          <p>Arch: {nodeResponse.node.arch}</p>
          <p>Version: {nodeResponse.node.version}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2 flex items-center"><Activity className="w-4 h-4 mr-2" /> Metrics</h3>
          <p>Messages: {nodeResponse.metrics.messages}</p>
          <p>CDN Requests: {nodeResponse.metrics.cdn.requests}</p>
          <p>Data In: {formatBytes(nodeResponse.metrics.cdn.data.in)}</p>
          <p>Data Out: {formatBytes(nodeResponse.metrics.cdn.data.out)}</p>
        </div>
        <div className="col-span-2">
          <h3 className="font-semibold mb-2 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Location</h3>
          <p>{nodeResponse.node.geo.city}, {nodeResponse.node.geo.country} ({nodeResponse.node.geo.countryCode})</p>
          <p>Lat: {nodeResponse.node.geo.lat}, Lng: {nodeResponse.node.geo.lng}</p>
        </div>
      </div>
      <div className="p-4 bg-gray-50 flex justify-between items-center">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          <span>Last Active: {new Date(nodeResponse.lastActive).toLocaleString()}</span>
        </div>
        <a href={node.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
          <Globe className="w-4 h-4 mr-1" />
          View Details
        </a>
      </div>
    </div>
  );
};

export default NodeCard;


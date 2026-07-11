#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const TOOLS = [
  {
    "name": "listShardKeys",
    "description": "GET /collections/{collection_name}/shards · List shard keys",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "createShardKey",
    "description": "PUT /collections/{collection_name}/shards · Create shard key",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        },
        "timeout": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "deleteShardKey",
    "description": "POST /collections/{collection_name}/shards/delete · Delete shard key",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        },
        "timeout": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "root",
    "description": "GET / · Returns information about the running Qdrant instance",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "telemetry",
    "description": "GET /telemetry · Collect telemetry data",
    "inputSchema": {
      "type": "object",
      "properties": {
        "anonymize": {
          "type": "string"
        },
        "details_level": {
          "type": "string"
        },
        "per_collection": {
          "type": "string"
        },
        "timeout": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "metrics",
    "description": "GET /metrics · Collect Prometheus metrics data",
    "inputSchema": {
      "type": "object",
      "properties": {
        "anonymize": {
          "type": "string"
        },
        "per_collection": {
          "type": "string"
        },
        "timeout": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "healthz",
    "description": "GET /healthz · Kubernetes healthz endpoint",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "livez",
    "description": "GET /livez · Kubernetes livez endpoint",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "readyz",
    "description": "GET /readyz · Kubernetes readyz endpoint",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "getIssues",
    "description": "GET /issues · Get issues",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "clearIssues",
    "description": "DELETE /issues · Clear issues",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "clusterStatus",
    "description": "GET /cluster · Get cluster status info",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "clusterTelemetry",
    "description": "GET /cluster/telemetry · Collect cluster telemetry data",
    "inputSchema": {
      "type": "object",
      "properties": {
        "details_level": {
          "type": "string"
        },
        "timeout": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "recoverCurrentPeer",
    "description": "POST /cluster/recover · Tries to recover current peer Raft state.",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "removePeer",
    "description": "DELETE /cluster/peer/{peer_id} · Remove peer from the cluster",
    "inputSchema": {
      "type": "object",
      "properties": {
        "peer_id": {
          "type": "string"
        },
        "timeout": {
          "type": "string"
        },
        "force": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "getCollections",
    "description": "GET /collections · List collections",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "getCollection",
    "description": "GET /collections/{collection_name} · Collection info",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "createCollection",
    "description": "PUT /collections/{collection_name} · Create collection",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        },
        "timeout": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "updateCollection",
    "description": "PATCH /collections/{collection_name} · Update collection parameters",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        },
        "timeout": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "deleteCollection",
    "description": "DELETE /collections/{collection_name} · Delete collection",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        },
        "timeout": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "updateAliases",
    "description": "POST /collections/aliases · Update aliases of the collections",
    "inputSchema": {
      "type": "object",
      "properties": {
        "timeout": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "createFieldIndex",
    "description": "PUT /collections/{collection_name}/index · Create index for field in collection",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        },
        "wait": {
          "type": "string"
        },
        "ordering": {
          "type": "string"
        },
        "timeout": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "collectionExists",
    "description": "GET /collections/{collection_name}/exists · Check the existence of a collection",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "deleteFieldIndex",
    "description": "DELETE /collections/{collection_name}/index/{field_name} · Delete index for field in collection",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        },
        "field_name": {
          "type": "string"
        },
        "wait": {
          "type": "string"
        },
        "ordering": {
          "type": "string"
        },
        "timeout": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "createVectorName",
    "description": "PUT /collections/{collection_name}/vectors/{vector_name} · Create named vector",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        },
        "vector_name": {
          "type": "string"
        },
        "wait": {
          "type": "string"
        },
        "ordering": {
          "type": "string"
        },
        "timeout": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "deleteVectorName",
    "description": "DELETE /collections/{collection_name}/vectors/{vector_name} · Delete named vector",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        },
        "vector_name": {
          "type": "string"
        },
        "wait": {
          "type": "string"
        },
        "ordering": {
          "type": "string"
        },
        "timeout": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "collectionClusterInfo",
    "description": "GET /collections/{collection_name}/cluster · Collection cluster info",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "updateCollectionCluster",
    "description": "POST /collections/{collection_name}/cluster · Update collection cluster setup",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        },
        "timeout": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "getOptimizations",
    "description": "GET /collections/{collection_name}/optimizations · Get optimization progress",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        },
        "with": {
          "type": "string"
        },
        "completed_limit": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "getCollectionAliases",
    "description": "GET /collections/{collection_name}/aliases · List aliases for collection",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "getCollectionsAliases",
    "description": "GET /aliases · List collections aliases",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "recoverFromUploadedSnapshot",
    "description": "POST /collections/{collection_name}/snapshots/upload · Recover from an uploaded snapshot",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        },
        "wait": {
          "type": "string"
        },
        "priority": {
          "type": "string"
        },
        "checksum": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "recoverFromSnapshot",
    "description": "PUT /collections/{collection_name}/snapshots/recover · Recover from a snapshot",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        },
        "wait": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "listSnapshots",
    "description": "GET /collections/{collection_name}/snapshots · List collection snapshots",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "createSnapshot",
    "description": "POST /collections/{collection_name}/snapshots · Create collection snapshot",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        },
        "wait": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "getSnapshot",
    "description": "GET /collections/{collection_name}/snapshots/{snapshot_name} · Download collection snapshot",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        },
        "snapshot_name": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "deleteSnapshot",
    "description": "DELETE /collections/{collection_name}/snapshots/{snapshot_name} · Delete collection snapshot",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collection_name": {
          "type": "string"
        },
        "snapshot_name": {
          "type": "string"
        },
        "wait": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "listFullSnapshots",
    "description": "GET /snapshots · List of storage snapshots",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "createFullSnapshot",
    "description": "POST /snapshots · Create storage snapshot",
    "inputSchema": {
      "type": "object",
      "properties": {
        "wait": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "getFullSnapshot",
    "description": "GET /snapshots/{snapshot_name} · Download storage snapshot",
    "inputSchema": {
      "type": "object",
      "properties": {
        "snapshot_name": {
          "type": "string"
        }
      }
    }
  }
];
const UPSTREAM = process.env.UPSTREAM || '{protocol}://{hostname}:{port}';
const APIKEY = process.env.QDRANT_KEY || process.env.API_KEY || '';

const server = new Server({ name: 'qdrant-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = TOOLS.find(t => t.name === req.params.name);
  if (!tool) throw new Error('unknown tool');
  const args = req.params.arguments || {};
  const path = tool.description.match(/(GET|POST|PUT|PATCH|DELETE) (\S+)/) || [];
  const method = path[1] || 'GET';
  let url = new URL(path[2] || '/', UPSTREAM);
  for (const [k, v] of Object.entries(args)) if (typeof v === 'string' && url.pathname.includes('{' + k + '}')) url.pathname = url.pathname.replace('{' + k + '}', v);
  const opts = { method, headers: { Authorization: APIKEY ? 'Bearer ' + APIKEY : '' } };
  if (method !== 'GET' && Object.keys(args).length) { opts.body = JSON.stringify(args); opts.headers['Content-Type'] = 'application/json'; }
  const res = await fetch(url, opts);
  const txt = await res.text();
  return { content: [{ type: 'text', text: txt.slice(0, 4000) }] };
});

await server.connect(new StdioServerTransport());
console.error('qdrant-mcp v1.0.0 · stdio ready · 40 tools');

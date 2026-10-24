import React, { useState } from 'react';
import { api } from '../services/api.ts';

export const McpStudioView: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string>('match_hyperlocal_workers');
  const [toolInput, setToolInput] = useState<string>(
    JSON.stringify({ lat: 44.0462, lng: -123.022, radiusKm: 3.2, category: 'electrical' }, null, 2)
  );
  const [toolOutput, setToolOutput] = useState<string>('Click "Execute Tool Call" to invoke MCP server...');
  const [selectedResource, setSelectedResource] = useState<string>('pricing://market-averages');
  const [resourceOutput, setResourceOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toolsList = [
    {
      name: 'match_hyperlocal_workers',
      desc: 'Executes PostGIS ST_DWithin query to find certified trade specialists within radius.',
      defaultInput: { lat: 44.0462, lng: -123.022, radiusKm: 3.2, category: 'electrical' },
    },
    {
      name: 'evaluate_bid',
      desc: 'Evaluates proposed rate against regional fair market value corridor and itemizes labor vs parts.',
      defaultInput: { proposedAmount: 80, category: 'electrical' },
    },
    {
      name: 'submit_dynamic_bid',
      desc: 'Submits a dynamic counteroffer to an active job room via shared business layer.',
      defaultInput: {
        jobId: 'job-8842',
        proposedAmount: 82,
        scopeNotes: 'AI Agent proposed sweetspot convergence rate.',
      },
    },
    {
      name: 'get_worker_verification_status',
      desc: 'Returns authoritative KYC, state license, and police background check details.',
      defaultInput: { workerId: 'worker-mark-j' },
    },
  ];

  const handleSelectTool = (toolName: string) => {
    setSelectedTool(toolName);
    const found = toolsList.find((t) => t.name === toolName);
    if (found) {
      setToolInput(JSON.stringify(found.defaultInput, null, 2));
    }
  };

  const handleExecuteTool = async () => {
    setIsLoading(true);
    try {
      const parsedArgs = JSON.parse(toolInput);
      const res = await api.invokeMcpTool(selectedTool, parsedArgs);
      setToolOutput(JSON.stringify(res, null, 2));
    } catch (e: any) {
      setToolOutput(JSON.stringify({ error: e.message }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchResource = async (uri: string) => {
    setSelectedResource(uri);
    try {
      const res = await api.getMcpResource(uri);
      setResourceOutput(JSON.stringify(res, null, 2));
    } catch (e: any) {
      setResourceOutput(JSON.stringify({ error: e.message }, null, 2));
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-4 flex flex-col gap-6">
      <div className="bg-[#171f33]/80 backdrop-blur-xl p-6 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#ffb95f] text-xs font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-sm">smart_toy</span>
            Model Context Protocol (MCP) Server Integration
          </div>
          <h2 className="text-2xl font-bold text-white">Agentic Tool &amp; Resource Console</h2>
          <p className="text-xs text-[#bec8d2] mt-1">
            Exposes validated platform capabilities to autonomous AI agents (Anthropic, Gemini, Claude Desktop) with
            strict authorization, PostGIS spatial matching, and real-time bid evaluations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-[#222a3d] text-xs text-[#bec8d2] border border-white/5">
            Protocol: <strong className="text-white">MCP 1.0 (JSON-RPC)</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#4edea3]/10 text-[#4edea3] text-xs font-semibold border border-[#4edea3]/20">
            Node #US-WEST-MCP-01
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Tools testing (7 cols) */}
        <div className="lg:col-span-7 bg-[#131b2e]/90 p-6 rounded-xl border border-white/5 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#89ceff] text-lg">code</span>
              MCP Tools Execution Sandbox
            </h3>
            <span className="text-[10px] text-[#bec8d2] uppercase">Shared Business Service Layer</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {toolsList.map((tool) => (
              <button
                key={tool.name}
                type="button"
                onClick={() => handleSelectTool(tool.name)}
                className={`p-3 rounded-lg text-left transition-all border ${
                  selectedTool === tool.name
                    ? 'bg-[#222a3d] border-[#89ceff] text-white shadow-md'
                    : 'bg-[#171f33] border-white/5 text-[#bec8d2] hover:text-white'
                }`}
              >
                <div className="text-xs font-mono font-bold text-[#89ceff] truncate">{tool.name}</div>
                <div className="text-[10px] text-[#bec8d2] line-clamp-1 mt-0.5">{tool.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-white">Tool Input Arguments (JSON)</label>
            <textarea
              className="w-full bg-[#060e20] border border-white/10 rounded-lg p-3 font-mono text-xs text-[#4edea3] focus:outline-none focus:ring-1 focus:ring-[#89ceff]"
              rows={4}
              value={toolInput}
              onChange={(e) => setToolInput(e.target.value)}
            />
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleExecuteTool}
            className="w-full py-2.5 rounded-lg bg-[#0ea5e9] hover:bg-[#89ceff] hover:text-[#00344d] text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">play_arrow</span>
            <span>{isLoading ? 'Executing Tool in MCP Runtime...' : 'Execute Tool Call via MCP'}</span>
          </button>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-white">Server Response Payload</label>
            <pre className="w-full bg-[#060e20] border border-white/10 rounded-lg p-3 font-mono text-[11px] text-[#dae2fd] overflow-x-auto max-h-60">
              {toolOutput}
            </pre>
          </div>
        </div>

        {/* Right: Resources & Docs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#131b2e]/90 p-6 rounded-xl border border-white/5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb95f] text-lg">database</span>
                Exposed MCP Resources
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleFetchResource('pricing://market-averages')}
                className={`p-2.5 rounded-lg text-left text-xs font-mono transition-all border ${
                  selectedResource === 'pricing://market-averages'
                    ? 'bg-[#222a3d] border-[#ffb95f] text-white'
                    : 'bg-[#171f33] border-white/5 text-[#bec8d2] hover:text-white'
                }`}
              >
                pricing://market-averages
              </button>
              <button
                type="button"
                onClick={() => handleFetchResource('workers://active-count')}
                className={`p-2.5 rounded-lg text-left text-xs font-mono transition-all border ${
                  selectedResource === 'workers://active-count'
                    ? 'bg-[#222a3d] border-[#ffb95f] text-white'
                    : 'bg-[#171f33] border-white/5 text-[#bec8d2] hover:text-white'
                }`}
              >
                workers://active-count
              </button>
              <button
                type="button"
                onClick={() => handleFetchResource('jobs://active-summary')}
                className={`p-2.5 rounded-lg text-left text-xs font-mono transition-all border ${
                  selectedResource === 'jobs://active-summary'
                    ? 'bg-[#222a3d] border-[#ffb95f] text-white'
                    : 'bg-[#171f33] border-white/5 text-[#bec8d2] hover:text-white'
                }`}
              >
                jobs://active-summary
              </button>
            </div>

            {resourceOutput && (
              <pre className="w-full bg-[#060e20] border border-white/10 rounded-lg p-3 font-mono text-[11px] text-[#ffddb8] overflow-x-auto max-h-60">
                {resourceOutput}
              </pre>
            )}
          </div>

          <div className="bg-[#171f33]/70 p-4 rounded-xl border border-white/5 text-xs text-[#bec8d2] flex flex-col gap-2">
            <span className="text-white font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#4edea3]">security</span>
              Security &amp; Authorization Guardrails
            </span>
            <p className="leading-relaxed text-[11px]">
              MCP tools cannot arbitrarily mutate unauthorized jobs or execute unconfirmed transactions. All tool
              invocations require cryptographic user tokens and pass through the identical database concurrency
              boundaries as REST endpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

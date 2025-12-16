import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Copy, Check } from "lucide-react";

interface MermaidProps {
  chart: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "monospace",
    });
  }, []);

  const fixMermaidSyntax = (code: string) => {
    let fixed = code;
    // Fix 1: Auto-quote subgraph titles with spaces if unquoted
    // Matches: subgraph followed by text with spaces, not starting with quote, no brackets involved (basic heuristic)
    fixed = fixed.replace(/^(\s*subgraph\s+)([^\n"[\]]+[\s]+[^\n"[\]]+)(\s*)$/gm, '$1"$2"$3');
    return fixed;
  };

  useEffect(() => {
    const renderChart = async () => {
      if (!chart) return;
      
      try {
        setError(false);
        let cleanChart = fixMermaidSyntax(chart.trim());
        
        // Safety check for weird ID collision or persistence
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, cleanChart);
        setSvg(svg);
      } catch (err) {
        // console.error("Mermaid Render Error:", err);
        setError(true); 
      }
    };

    renderChart();
  }, [chart]);

  const handleCopy = () => {
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    // Fallback to raw code view if render fails
    return (
      <div className="relative rounded-lg overflow-hidden my-4 border border-gray-700">
        <div className="flex justify-between items-center bg-gray-800 px-4 py-2 text-xs text-red-300">
          <span className="uppercase">Mermaid (Render Failed)</span>
           <button
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-white transition-colors text-gray-400"
          >
            {copied ? (
              <>
                <Check size={14} />
                Copied
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="p-4 bg-[#1e1e1e] text-red-200 font-mono text-sm whitespace-pre-wrap">
          {chart}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="mermaid my-4 flex justify-center bg-gray-900/50 p-4 rounded-lg overflow-x-auto min-h-[100px]"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

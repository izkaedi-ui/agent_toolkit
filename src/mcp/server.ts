import { auditLarge3d } from '../tools/large3d.js';
import { auditProgressTruth } from '../tools/progressTruth.js';
import { auditSvgAnimation } from '../tools/svg.js';
import { auditWebMotion } from '../tools/webMotion.js';
import { auditReducedMotion } from '../tools/reducedMotion.js';
import { auditOptimization } from '../tools/optimization.js';
import { generateReport } from '../report.js';
import { qualityGate } from '../qualityGate.js';
import type {
  Large3dMetrics,
  ProgressTruthSignals,
  SvgAnimationData,
  WebMotionData,
  ReducedMotionData,
  OptimizationData,
  AuditResult,
} from '../types.js';

export interface McpToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

export interface McpToolResult {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

export const tools = {
  audit_large_3d: {
    description: 'Audit a Three.js/WebGL scene for large-3D risks (triangle count, DPR, draw calls, per-frame rebuilds, wireframe, raycast).',
    handler(args: Large3dMetrics): McpToolResult {
      const result = auditLarge3d(args);
      return { content: [{ type: 'text', text: generateReport([result]) }] };
    },
  },
  audit_progress_truth: {
    description: 'Detect fake timer-only progress bars versus real work-unit progress.',
    handler(args: ProgressTruthSignals): McpToolResult {
      const result = auditProgressTruth(args);
      return { content: [{ type: 'text', text: generateReport([result]) }] };
    },
  },
  audit_svg_animation: {
    description: 'Audit SVG animations for accessibility, filters, fake progress, and animated node count.',
    handler(args: SvgAnimationData): McpToolResult {
      const result = auditSvgAnimation(args);
      return { content: [{ type: 'text', text: generateReport([result]) }] };
    },
  },
  audit_web_motion: {
    description: 'Audit CSS/JS animations for risky properties, infinite animations, and reduced-motion compliance.',
    handler(args: WebMotionData): McpToolResult {
      const result = auditWebMotion(args);
      return { content: [{ type: 'text', text: generateReport([result]) }] };
    },
  },
  audit_reduced_motion: {
    description: 'Validate prefers-reduced-motion media query support.',
    handler(args: ReducedMotionData): McpToolResult {
      const result = auditReducedMotion(args);
      return { content: [{ type: 'text', text: generateReport([result]) }] };
    },
  },
  audit_optimization: {
    description: 'Verify before/after optimization metrics are real and progress units are honest.',
    handler(args: OptimizationData): McpToolResult {
      const result = auditOptimization(args);
      return { content: [{ type: 'text', text: generateReport([result]) }] };
    },
  },
  run_quality_gate: {
    description: 'Run the quality gate across multiple audit results. Fails on high/critical findings, fake progress, or missing reduced motion.',
    handler(args: { results: AuditResult[]; options?: Record<string, unknown> }): McpToolResult {
      try {
        qualityGate(args.results, args.options ?? {});
        return { content: [{ type: 'text', text: '✅ Quality gate passed.' }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: 'text', text: `❌ Quality gate failed:\n${message}` }],
          isError: true,
        };
      }
    },
  },
};

export function handleToolCall(call: McpToolCall): McpToolResult {
  const tool = tools[call.name as keyof typeof tools];
  if (!tool) {
    return {
      content: [{ type: 'text', text: `Unknown tool: ${call.name}` }],
      isError: true,
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return tool.handler(call.arguments as any);
}

import { THRESHOLDS } from '../thresholds.js';
import type { AuditResult, Finding, Large3dMetrics } from '../types.js';

export function auditLarge3d(metrics: Large3dMetrics): AuditResult {
  const findings: Finding[] = [];
  const t = THRESHOLDS.large3d;

  if (metrics.triangleCount > t.maxTriangles) {
    findings.push({
      id: 'large3d-triangle-count',
      category: 'large3d',
      severity: 'high',
      message: `Triangle count ${metrics.triangleCount.toLocaleString()} exceeds limit ${t.maxTriangles.toLocaleString()}`,
      evidence: `triangleCount=${metrics.triangleCount}`,
      recommendation: 'Apply LOD, geometry simplification, or instancing.',
    });
  }

  if (metrics.dpr > t.maxDpr) {
    findings.push({
      id: 'large3d-dpr',
      category: 'large3d',
      severity: 'medium',
      message: `DPR ${metrics.dpr} exceeds recommended maximum ${t.maxDpr}`,
      evidence: `dpr=${metrics.dpr}`,
      recommendation: 'Cap DPR to 2 or implement adaptive DPR.',
    });
  }

  if (metrics.drawCalls > t.maxDrawCalls) {
    findings.push({
      id: 'large3d-draw-calls',
      category: 'large3d',
      severity: 'high',
      message: `Draw call count ${metrics.drawCalls} exceeds limit ${t.maxDrawCalls}`,
      evidence: `drawCalls=${metrics.drawCalls}`,
      recommendation: 'Use geometry merging, instanced meshes, or atlas textures.',
    });
  }

  if (metrics.perFrameRebuildCount > t.maxPerFrameRebuilds) {
    findings.push({
      id: 'large3d-per-frame-rebuild',
      category: 'large3d',
      severity: 'critical',
      message: `${metrics.perFrameRebuildCount} per-frame geometry rebuilds detected`,
      evidence: `perFrameRebuildCount=${metrics.perFrameRebuildCount}`,
      recommendation:
        'Pre-build geometry; never call geometry.setAttribute in the render loop.',
    });
  }

  if (metrics.hasFullWireframe) {
    findings.push({
      id: 'large3d-full-wireframe',
      category: 'large3d',
      severity: 'medium',
      message: 'Full wireframe mode detected — extremely expensive on large meshes',
      evidence: 'hasFullWireframe=true',
      recommendation: 'Use edge geometry or LineSegments instead of WireframeGeometry for large meshes.',
    });
  }

  if (metrics.rayCastTargetCount > t.maxRayCastTargets) {
    findings.push({
      id: 'large3d-raycast-risk',
      category: 'large3d',
      severity: 'high',
      message: `${metrics.rayCastTargetCount} raycast targets exceeds limit ${t.maxRayCastTargets}`,
      evidence: `rayCastTargetCount=${metrics.rayCastTargetCount}`,
      recommendation: 'Use BVH acceleration or limit raycast targets with layers.',
    });
  }

  return {
    passed: findings.filter((f) => f.severity === 'high' || f.severity === 'critical').length === 0,
    findings,
    summary: 'Large 3D Scene Audit',
  };
}

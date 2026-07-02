/**
 * Agent OS Live Runtime Contracts
 * Typed API for window.__AGENT_OS__ runtime diagnostics.
 *
 * No claim may exceed evidence.
 */

export interface RuntimeClaim {
  id: string;
  claim: string;
  source: string;
  timestamp: number;
  status: 'ASSERTED' | 'PROVEN' | 'REFUTED';
}

export interface RuntimeProof {
  claimId: string;
  evidence: string;
  measuredValue: number | string | boolean;
  timestamp: number;
}

export interface RuntimeLimits {
  maxTriangles?: number;
  targetFps?: number;
  maxDrawCalls?: number;
  maxDpr?: number;
  maxAnimations?: number;
  [key: string]: number | undefined;
}

export interface RuntimeDiagnostics {
  triangleCount?: number;
  drawCalls?: number;
  fps?: number;
  frameTime?: number;
  animationCount?: number;
  dpr?: number;
  reducedMotionActive?: boolean;
  [key: string]: number | boolean | undefined;
}

export interface RuntimeContractReport {
  timestamp: string;
  claims: RuntimeClaim[];
  proofs: RuntimeProof[];
  limits: RuntimeLimits;
  diagnostics: RuntimeDiagnostics;
  unprovenClaims: RuntimeClaim[];
  principle: string;
}

export interface AgentOsContract {
  version: string;
  claims: RuntimeClaim[];
  proofs: RuntimeProof[];
  limits: RuntimeLimits;
  diagnostics: RuntimeDiagnostics;
  addClaim(claim: Omit<RuntimeClaim, 'id' | 'timestamp' | 'status'>): string;
  addProof(proof: Omit<RuntimeProof, 'timestamp'>): void;
  update(key: keyof Pick<AgentOsContract, 'diagnostics' | 'limits'>, values: RuntimeDiagnostics | RuntimeLimits): void;
  getReport(): RuntimeContractReport;
}

declare global {
  interface Window {
    __AGENT_OS__?: AgentOsContract;
  }
}

export interface InstallOptions {
  limits?: RuntimeLimits;
  diagnostics?: RuntimeDiagnostics;
}

let claimCounter = 0;

export function installRuntimeContract(options: InstallOptions = {}): AgentOsContract {
  const claims: RuntimeClaim[] = [];
  const proofs: RuntimeProof[] = [];
  const limits: RuntimeLimits = { ...options.limits };
  const diagnostics: RuntimeDiagnostics = { ...options.diagnostics };

  const contract: AgentOsContract = {
    version: '0.1.0',
    claims,
    proofs,
    limits,
    diagnostics,

    addClaim(claimData) {
      const id = `claim-${++claimCounter}-${Date.now()}`;
      claims.push({
        id,
        ...claimData,
        timestamp: Date.now(),
        status: 'ASSERTED',
      });
      return id;
    },

    addProof(proofData) {
      const proof: RuntimeProof = { ...proofData, timestamp: Date.now() };
      proofs.push(proof);
      // Update claim status to PROVEN if matching claim exists
      const claim = claims.find((c) => c.id === proofData.claimId);
      if (claim) {
        claim.status = 'PROVEN';
      }
    },

    update(key, values) {
      if (key === 'diagnostics') {
        Object.assign(diagnostics, values);
      } else if (key === 'limits') {
        Object.assign(limits, values);
      }
    },

    getReport(): RuntimeContractReport {
      const unprovenClaims = claims.filter((c) => c.status === 'ASSERTED');
      return {
        timestamp: new Date().toISOString(),
        claims: [...claims],
        proofs: [...proofs],
        limits: { ...limits },
        diagnostics: { ...diagnostics },
        unprovenClaims,
        principle: 'No claim may exceed evidence.',
      };
    },
  };

  if (typeof window !== 'undefined') {
    window.__AGENT_OS__ = contract;
  }

  return contract;
}

export function getRuntimeContract(): AgentOsContract | undefined {
  if (typeof window !== 'undefined') {
    return window.__AGENT_OS__;
  }
  return undefined;
}

export function assertClaim(
  claim: string,
  source: string,
): string {
  const contract = getRuntimeContract();
  if (!contract) {
    throw new Error('Runtime contract not installed. Call installRuntimeContract() first.');
  }
  return contract.addClaim({ claim, source });
}

export function proveClaimWithMeasurement(
  claimId: string,
  measuredValue: number | string | boolean,
  evidence: string,
): void {
  const contract = getRuntimeContract();
  if (!contract) return;
  contract.addProof({ claimId, measuredValue, evidence });
}

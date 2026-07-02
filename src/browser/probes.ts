export interface AnimationProbeResult {
  animationCount: number;
  infiniteAnimations: number;
  reducedMotionActive: boolean;
  riskyProperties: string[];
}

export interface SceneProbeResult {
  triangleCount: number;
  drawCalls: number;
  frameTime: number;
  fps: number;
}

export function probeAnimations(): AnimationProbeResult {
  const allAnimations = document.getAnimations();
  const infinite = allAnimations.filter((a) => {
    const effect = a.effect;
    if (effect instanceof KeyframeEffect) {
      return effect.getTiming().iterations === Infinity;
    }
    return false;
  });

  const riskyProps = new Set<string>();
  const risky = ['top', 'left', 'right', 'bottom', 'width', 'height'];
  for (const anim of allAnimations) {
    const effect = anim.effect;
    if (effect instanceof KeyframeEffect) {
      const frames = effect.getKeyframes();
      for (const frame of frames) {
        for (const key of Object.keys(frame)) {
          if (risky.includes(key)) riskyProps.add(key);
        }
      }
    }
  }

  return {
    animationCount: allAnimations.length,
    infiniteAnimations: infinite.length,
    reducedMotionActive: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    riskyProperties: Array.from(riskyProps),
  };
}

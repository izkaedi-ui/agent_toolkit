export const INJECTION_BUNDLE_SOURCE = `
(function() {
  if (window.__MCP_ANIMATION_PROBES__) return;

  window.__MCP_ANIMATION_PROBES__ = {
    version: '0.1.0',
    captureAnimations() {
      const anims = document.getAnimations();
      return anims.map(a => ({
        id: a.id,
        playState: a.playState,
        currentTime: a.currentTime,
        effect: a.effect ? a.effect.constructor.name : null,
      }));
    },
    captureReducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    captureFPS() {
      return new Promise(resolve => {
        let frames = 0;
        const start = performance.now();
        function count() {
          frames++;
          if (performance.now() - start < 1000) {
            requestAnimationFrame(count);
          } else {
            resolve(frames);
          }
        }
        requestAnimationFrame(count);
      });
    },
  };
})();
`;

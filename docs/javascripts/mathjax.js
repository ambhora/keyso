// -----------------------------------------------------------------------------
// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2026 keyso developers
// -----------------------------------------------------------------------------

// The macros follow the notation of the formalism.
window.MathJax = {
  loader: { load: ["[tex]/textmacros"] },
  tex: {
    packages: { "[+]": ["textmacros"] },
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true,
    macros: {
      calA: "\\mathcal{A}",
      calC: "\\mathcal{C}",
      calD: "\\mathcal{D}",
      calK: "\\mathcal{K}",
      calO: "\\mathcal{O}",
      calR: "\\mathcal{R}",
      calT: "\\mathcal{T}",
      calV: "\\mathcal{V}",
      sem: ["[\\![ #1 ]\\!]", 1],
    },
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex",
  },
};

// Instant navigation replaces the page without reloading MathJax.
document$.subscribe(() => {
  MathJax.startup.output.clearCache();
  MathJax.typesetClear();
  MathJax.texReset();
  MathJax.typesetPromise();
});

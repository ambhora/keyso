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
      calC: "\\mathcal{C}",
      calD: "\\mathcal{D}",
      calK: "\\mathcal{K}",
      calO: "\\mathcal{O}",
      calT: "\\mathcal{T}",
      calV: "\\mathcal{V}",
      naturals: "\\mathbb{N}",
      integers: "\\mathbb{Z}",
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

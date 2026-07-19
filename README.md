# DepGraph — JS Dependency Visualizer

A browser-based tool that parses ES module `import` statements across uploaded JavaScript files and renders the dependency relationships as an interactive, force-directed graph.

[**Live demo**](https://js-dependency-visualizer.vercel.app/)

## What it does

- Drop in a set of `.js` (or `.txt`) files
- Each file is scanned for `import ... from '...'` statements
- The resulting dependency relationships are rendered as a force-directed graph using D3, with uploaded files and their dependencies visually distinguished
- The graph is fully interactive — pan, zoom, and drag nodes to explore the structure

## How it works

- Parses `import ... from '...'` statements out of each uploaded file via regex
- Normalizes file state into a single `Map<fileName, { object, size, dependencies }>`, kept behind a small closure-based store rather than module-level globals
- Renders the graph with D3's force simulation (`forceLink`, `forceManyBody`, `forceCollide`, `forceCenter`)

## Tech stack

- Vanilla JavaScript (ES modules)
- [D3.js](https://d3js.org/) (v7) for the force simulation and SVG rendering
- HTML / CSS — no framework, no build step

## Known limitations

- Dependency extraction uses a regex against `import ... from '...'` syntax. It does not currently handle `require()`, dynamic `import()`, or re-exports. A production-grade version of this would use an AST parser (e.g. `acorn` or `@babel/parser`) instead of regex, which is the standard approach for real tooling.
- Only relationships between uploaded files are graphed; external packages appear as leaf dependency nodes with no further resolution.

## Project structure
```
├── index.html      # markup and layout
├── style.css       # styling
├── script.js       # event wiring, file state store, orchestration
├── parser.js       # import extraction (File -> dependency list)
└── graph.js        # D3 force simulation, cycle detection, rendering
```

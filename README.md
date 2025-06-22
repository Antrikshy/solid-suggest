# solid-suggest

solid-suggest is a UI component for SolidJS developers that renders a text input with dropdown suggestions. It can be used in scenarios such as search suggestions or results triggered by text input.

It's a *super* simple library that doesn't have many batteries included. See following sections for what it can and can't do for you.

**Because of its simplicity, I also expect it to be usable even without updates for years.**

## Quickstart

Install from the npm registry using `npm` or your favorite alternate package manager (yarn, pnpm).

```
npm install solid-suggest --save
```

Import into your SolidJS project.

```
import Suggest from "solid-suggest";

const items = [
  { name: "Scout", class: "Offense" },
  { name: "Medic", class: "Support" },
  { name: "Heavy", class: "Defense" }
];

<Suggest
  renderSuggestion={item => `${item.name} (${item.class})`}
  onQuery={query =>
    items.filter(
      item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.class.toLowerCase().includes(query.toLowerCase())
    )
  }
  onSelect={item => setSelected(item.name)}
/>
```

See more [in the docs](https://antrikshy.com/solid-suggest).

## What it Does

Exposes two main interfaces as functions that you implement:

1. `onQuery` - solid-suggest runs it on initial render and on each user input change. For solid-suggest, your implementation answers the question "what suggestions should solid-suggest show in the current state?"
2. `onSelect` - solid-suggest invokes this to emit the user's selection to your code.

All this libary does is provide JavaScript/TypeScript bones for a suggestions dropdown so that you don't have to clutter your application with the required internal states, keyboard and mouse handling, etc.

solid-suggest also supports objects as suggestions (not just strings), with support for custom rendering of each suggestion. Styling is still supplied by you.

Some more questions are answered [in the docs](https://antrikshy.com/solid-suggest).

## What it Doesn't Do

1. Come with *any* styling. solid-suggest is a **headless** library that completely relies on the you to style. This way, it fully integrates with any branding and design system.
2. Provide built-in network fetch capabilities. You are free to make network calls this in their `onQuery` implementations.
3. Wash your car.

Some more questions are answered [in the docs](https://antrikshy.com/solid-suggest).

## Docs + Recommendations

Find [documentation and tips here](https://antrikshy.com/solid-suggest).

## Development

```
npm install
```

... before anything else.

```
npm run dev
```

... runs a continuous watcher for changes to *library code* that transpiles TypeScript to a dist/ dir at project top level.

```
npm run devDemo
```

... runs a local server that you can use to see and iterate on the demo page at http://localhost:8000/docs/index.htm. This is a basic HTML page that imports some libraries from CDNs. Hot reload/replacement is not enabled, so it needs manual refreshing.

# Code Snap

Code Snap is a lightweight tool for creating beautiful code snippets for sharing and presentations.

![Demo Screenshot](screenshots/demo.png)

## Features

- Create customizable code snippets with various themes
- Adjust font family, weight, and ligatures
- Customize frame padding, radius, and background
- Support for multiple programming languages
- Window styling with shadow, border, and reflection options
- Export snippets as images

## Tech Stack

- [SvelteKit 2](https://kit.svelte.dev/) with [Svelte 5](https://svelte.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [CodeMirror 6](https://codemirror.net/6/) for code editing
- [Bun](https://bun.sh/) as package manager
- [svelte-shadcn](https://next.shadcn-svelte.com/)
- [vite](https://vitejs.dev/) for development

## Getting Started

### Prerequisites

- Bun (recommended) or Node.js

### Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/yourusername/code-snap.git
cd code-snap

# Install dependencies
bun install
```

### Development

Start the development server:

```bash
bun run dev
```

### Build

Create a production build:

```bash
bun run build
```

### Preview

Preview the production build locally:

```bash
bun run preview
```

## License

[MIT](LICENSE)

## Credits

This project is heavily inspired by https://github.com/riccardoperra/codeimage, which is written using SolidJS.

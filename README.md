# 🧰 discord.builders monorepo

This monorepo contains two main packages:

- [website](/website/) – Open-source, public-facing website, licensed under [MIT](./LICENSE.md).
- [components-sdk](/components-sdk/) – Source-available components SDK, licensed under the [PolyForm Noncommercial License 1.0.0](./components-sdk/LICENSE.md).

## 📦 Installation


First, install the dependencies of the monorepo:

```bash
bun install
```

Build the components library:

```bash
cd components-sdk && bun build
```

Run the development server of the website:

```bash
cd website && bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ⚠️ Commercial use

Although the `website/` project is licensed under the permissive MIT License, it depends on the `components-sdk/` package, which is **licensed under the PolyForm Noncommercial License 1.0.0**. 

This means that while the website code itself allows for commercial use, any distribution or deployment that includes or relies on `components-sdk/` is subject to the more restrictive non-commercial terms. 

As a result, you **cannot use, deploy, or distribute the website for commercial purposes** unless you remove the dependency on `components-sdk/` or obtain a separate commercial license for it. Please review the license terms carefully before using this repository in a commercial context.

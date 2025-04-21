# Polyfills

The goal of `components-sdk` is to stay as lightweight and flexible as possible.

To achieve this, components unrelated to Discord are provided only as **interfaces**. This allows developers to implement them however they like, tailored to their own project needs.

Implementing these components in your app (e.g., within a `website` directory) has an added benefit — your implementation can be MIT-licensed.

## Provided Interfaces

These interfaces serve as guidelines for expected behavior and structure. You’re free to implement them however it best fits your application.

[BetterInput.ts](BetterInput.ts) — A customizable input component. At minimum, it can be a resizable text area — or something more advanced.

[EmojiPicker.ts](EmojiPicker.ts) — Interface for an emoji picker component. You decide the UX.

[EmojiShow.ts](EmojiShow.ts) — Render emoji image based on Emoji object

[StateManager.ts](StateManager.ts) — A lightweight reducer-style state manager for handling state changes in components.

[files.ts](files.ts) — Functions for uploaded files storage

---
title: 'Everything in AI runs on context'
createAt: '2025-12-29'
updateAt: '2025-12-29'
author: 'David Alfonso Pereira'
authorPhoto: '/david-portafolio/profile.webp'
authorPhotoAlt: 'David Alfonso'
tags:
  [
    'artificial intelligence',
    'productivity',
    'web development',
    'tools',
    'tips',
  ]
description: 'Discover how context is the key to getting better AI responses. Tips, tricks, and tools for properly feeding language models.'
image: '/david-portafolio/blogs/about_context_in_ia/home.webp'
---

# Everything in AI runs on context

<img src="/david-portafolio/blogs/about_context_in_ia/home.webp" alt="Context in AI" class="img-blog" />

If there's one thing I've learned after months of using AI for coding, writing, and problem-solving, it's this: **the quality of the response depends directly on the context you provide**.

It doesn't matter how advanced the model is. If you ask "why isn't my code working?" without showing the code, you'll get a generic answer that probably won't help. But if you share the file, the exact error, and what you were trying to do, the response changes completely.

Let's see how to make the most of this.

---

## Why context is everything

Language models don't have permanent memory of you or your project. Every conversation starts from scratch. The only thing they "know" is what you give them at that moment.

Think of it this way: it's like explaining a problem to a coworker who just arrived. If you say "the button doesn't work," they'll look at you confused. But if you say "the save button on the registration form isn't firing the onClick event, here's the component," now they can help.

AI works exactly the same way. More relevant context = better response.

---

## Agents: when AI finds the context for you

Before talking about how to pass context manually, it's worth mentioning that **AI agents** exist that can do this task for you.

Tools like Cursor, Claude Code, or GitHub Copilot Workspace can explore your project, read relevant files, and build context automatically. You tell them what you want to do and the agent takes care of finding what it needs.

The problem? They're not always available, sometimes they don't find exactly what you need, and in many cases you still need to pass additional context manually. That's why it's important to know how to do it well.

---

## Generating context from your code: mkctx

<img src="/david-portafolio/blogs/about_context_in_ia/001.webp" alt="mkctx logo" class="img-blog" />

When working on a project and I need the AI to understand my code structure, I used to copy and paste files one by one. Terrible.

That's why I created **mkctx**, a command-line tool that generates a markdown file with all your project's context, ready to pass to the AI.

### Installation

```bash
npm install -g mkctx
```

### Basic usage

```bash
cd your-project/
mkctx
```

This generates a `context.md` file with all your code organized, with syntax highlighting and file paths. Perfect for attaching to an AI conversation.

### Configuration

You can create a configuration file to customize what to include:

```bash
mkctx config
```

This creates an `mkctx.config.json` where you can define:

```json
{
  "src": "./src",
  "ignore": "*.test.js, __tests__/, node_modules/, .git/",
  "output": "./mkctx",
  "first_comment": "/* Project Context */",
  "last_comment": "/* End of Context */",
  "dynamic": false
}
```

What I like about mkctx is that it automatically ignores `node_modules`, `.git`, and other files you don't need. The result is a clean file you can attach directly.

You can find the project on [GitHub](https://github.com/David200197/mkctx).

---

## The file attachment trick

Here's something many people don't know: **AI processes attached files better than directly pasted text**.

When you paste code directly into the chat, it mixes with your message and the model can lose track. But when you attach a file (PDF, markdown, image), the content gets internally structured with additional metadata that helps maintain coherence.

This is especially useful when:

- Your context is very long (hundreds or thousands of lines)
- You have multiple files you need to include
- You want the AI to keep a clear separation between your question and the context

Instead of pasting everything into the chat, generate your context with mkctx (or manually) and attach it as a file.

---

## Reports: the context source you're ignoring

This is a trick I discovered by accident and it changed how I work with AI.

Many tools generate reports you can download. These reports are **pure gold** as context for AI.

### My experience with Lighthouse

I was trying to improve a site's performance and didn't know where to start. Then I remembered that Lighthouse generates JSON reports.

I downloaded it, passed it to the AI, and got specific recommendations based on my case. Not generic advice like "optimize your images," but things like "your file X is blocking rendering, move it to Y."

I significantly improved the score thanks to this.

### Bundle Analyzer in Next.js

If you work with Next.js and need to optimize your bundle sizes, you can generate detailed reports:

```typescript
import type { NextConfig } from 'next'
import analyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = analyzer({
  enabled: Boolean(process.env.ANALYZE),
  openAnalyzer: true,
  analyzerMode: 'json',
})

const nextConfig: NextConfig = {
  // your config
}

export default withBundleAnalyzer(nextConfig)
```

Run `ANALYZE=true npm run build` and you get a JSON report with each package's size. Pass that report to the AI and it can tell you exactly which libraries are bloating your bundle and what alternatives to use.

The lesson is simple: **before asking, check if your tool generates reports**. ESLint, TypeScript, testing frameworks, accessibility tools... many have this option and it's free context.

---

## Order matters: put the relevant stuff at the end

Here's an interesting technical curiosity.

Content that's closer to your question has more "weight" in the response. If you have very long context, what you put at the end (right before your question) will have more influence.

This means that if you have multiple context files, organize them like this:

1. General project context (at the beginning)
2. Related but not critical files (in the middle)
3. The specific file where the problem is (at the end)
4. Your question

It's not that the AI ignores what's at the beginning, but what's at the end has more immediate relevance.

---

## The "don't respond yet" trick

When you have a lot of context to pass, there's a problem: the AI wants to respond immediately.

You paste a huge file and before you can ask your question, it's already giving you a summary or making assumptions about what you need. You waste time and tokens.

The solution is simple. When passing context, add something like:

> "This is my project's context. Don't respond yet, wait for me to ask my question."

Or shorter:

> "Context. Don't respond, wait for my question."

The AI will confirm it received the context and will wait. Then you can ask your specific question without it jumping ahead.

---

## AI forgets: refresh the context

Long conversations have a problem: **the AI starts forgetting the initial context**.

It doesn't literally erase it, but as the conversation grows, the context from the beginning has less weight. If you notice the AI starting to give responses that ignore things you already told it, it's time to refresh.

My recommendations:

- If the conversation extends too long, pass the context again
- If you made changes to the code, pass the updated version
- If you change topics within the same conversation, consider starting a new one

Sometimes it's more efficient to start a fresh conversation with updated context than to keep dragging an old conversation where the AI has lost track.

---

## Summary

Key points for working better with AI using context:

1. **Response quality depends on context**: more relevant information = better help
2. **Use tools like mkctx** to generate code context automatically
3. **Attach files instead of pasting text**: AI processes them better
4. **Take advantage of reports** from your tools (Lighthouse, Bundle Analyzer, etc.)
5. **Put the most relevant stuff at the end**, right before your question
6. **Use "don't respond yet"** when passing long context
7. **Refresh context** in long conversations

In an upcoming article, we'll talk about how to structure effective prompts. Because once you have the right context, how you ask the question also matters.

For now, start thinking in terms of context. Every time the AI gives you a mediocre response, ask yourself: what information was it missing?

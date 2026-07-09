# PromptSpark Chat - Complete Technical Documentation

**Last Updated**: March 7, 2026

## Overview

The PromptSpark Chat component provides real-time AI chat functionality via SignalR WebSocket connections to the WebSpark backend service. This document provides EXACT configuration details for how the SignalR connection works.

## Table of Contents

1. [SignalR Connection Setup](#signalr-connection-setup)
2. [Connection Configuration Details](#connection-configuration-details)
3. [Proxy & Middleware](#proxy--middleware)
4. [CSP & CORS Setup](#csp--cors-setup)
5. [Message Flow](#message-flow)
6. [Reconnection Strategy](#reconnection-strategy)
7. [Environment Variables](#environment-variables)
8. [Troubleshooting](#troubleshooting)

---

## SignalR Connection Setup

### Exact HubConnectionBuilder Configuration

**Location**: [src/components/Chat.tsx](../src/components/Chat.tsx#L132-L144)

```typescript
import * as signalR from "@microsoft/signalr";

// Hub URL from environment or hardcoded default
const hubUrl = import.meta.env.VITE_SIGNALR_HUB_URL || "https://web.makeboldspark.com/chatHub";

// Build the SignalR connection
connection.current = new signalR.HubConnectionBuilder()
  .withUrl(hubUrl, {
    skipNegotiation: false,              // ✅ Allow SignalR to negotiate transport
    withCredentials: false,              // ❌ No cookies/credentials sent
    timeout: 30000,                      // 30 second timeout
    transport:
      signalR.HttpTransportType.WebSockets |
      signalR.HttpTransportType.ServerSentEvents |
      signalR.HttpTransportType.LongPolling,  // All three transports enabled
  })
  .withAutomaticReconnect([0, 2000, 10000, 30000])  // Retry delays in ms
  .configureLogging(signalR.LogLevel.Information)   // Log connection events
  .build();
```

---

## Connection Configuration Details

### 1. URL (`withUrl()`)

**Exact URL**: `https://web.makeboldspark.com/chatHub`

- **Protocol**: HTTPS (upgrades to WSS for WebSocket)
- **Domain**: `web.makeboldspark.com`
- **Path**: `/chatHub`
- **WebSocket URL**: `wss://web.makeboldspark.com/chatHub` (after upgrade)

**Environment Variable Override**:
```typescript
const hubUrl = import.meta.env.VITE_SIGNALR_HUB_URL || "https://web.makeboldspark.com/chatHub";
```

- Variable name: `VITE_SIGNALR_HUB_URL`
- **Current state**: No `.env` file exists in the repository
- **Production**: Uses hardcoded default (`https://web.makeboldspark.com/chatHub`)
- **Development**: Uses hardcoded default (no override)

### 2. Options Object

| Option | Value | Purpose |
|--------|-------|---------|
| `skipNegotiation` | `false` | Allow SignalR to negotiate which transport to use (required for fallback) |
| `withCredentials` | `false` | Do NOT send cookies or credentials (public hub, no authentication) |
| `timeout` | `30000` | 30-second timeout for connection attempts |
| `transport` | `WebSockets \| ServerSentEvents \| LongPolling` | Enable all three transport methods |

#### Transport Type Details

SignalR attempts transports in this order:

1. **WebSockets** (`signalR.HttpTransportType.WebSockets`)
   - Preferred (bidirectional, low latency)
   - Protocol: `wss://web.makeboldspark.com/chatHub`
   - Requires CSP: `connect-src wss://web.makeboldspark.com`

2. **Server-Sent Events** (`signalR.HttpTransportType.ServerSentEvents`)
   - Fallback if WebSockets fail
   - One-way stream (server → client) with HTTP polling for client → server
   - Protocol: HTTPS

3. **Long Polling** (`signalR.HttpTransportType.LongPolling`)
   - Final fallback (least efficient)
   - HTTP long-polling (keeps connection open)
   - Protocol: HTTPS

### 3. Access Token Factory

**Answer**: ❌ **NO** access token factory is configured.

```typescript
// This does NOT exist in the codebase:
// .withUrl(hubUrl, {
//   accessTokenFactory: () => { ... }  // NOT PRESENT
// })
```

**Why**: The SignalR hub is a public endpoint with no authentication required. Any client can connect and send/receive messages.

### 4. Automatic Reconnection

```typescript
.withAutomaticReconnect([0, 2000, 10000, 30000])
```

**Retry Delays** (in milliseconds):
- 1st retry: 0ms (immediate)
- 2nd retry: 2,000ms (2 seconds)
- 3rd retry: 10,000ms (10 seconds)
- 4th retry: 30,000ms (30 seconds)
- After 4 failures: Connection abandoned by SignalR

**Manual Retry** (separate from automatic):
- Location: [Chat.tsx#L147-L156](../src/components/Chat.tsx#L147-L156)
- Max manual retries: 3
- Exponential backoff: `Math.pow(2, retryCount) * 1000` (1s, 2s, 4s)

### 5. Logging Level

```typescript
.configureLogging(signalR.LogLevel.Information)
```

**Log Levels**:
- `Trace`: Most verbose
- `Debug`: Debugging details
- `Information`: ✅ **Current setting** (connection events, errors)
- `Warning`: Warnings only
- `Error`: Errors only
- `Critical`: Critical errors only

---

## Proxy & Middleware

### Direct Cross-Origin Connection

**Answer**: ❌ **NO PROXY** is used. The application connects DIRECTLY to `web.makeboldspark.com` from the browser.

**Architecture**:

```
┌─────────────────────┐
│  Browser Client     │
│  (localhost:3000)   │──────┐
│  or                 │      │
│  (Azure Static App) │      │
└─────────────────────┘      │
                             │ Direct WebSocket Connection
                             │ wss://web.makeboldspark.com/chatHub
                             │
                             ▼
                    ┌─────────────────────┐
                    │  WebSpark Server    │
                    │  SignalR Hub        │
                    │  (markhazleton.com) │
                    └─────────────────────┘
```

### Vite Proxy Configuration

**Location**: [vite.config.ts](../vite.config.ts#L94-L99)

**SignalR Proxy**: ❌ **NONE**

The Vite config ONLY proxies:
- `/rss-feed` → `https://markhazleton.com/feed.xml`

```typescript
// vite.config.ts
proxy: {
  "/rss-feed": {
    target: "https://markhazleton.com",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/rss-feed/, "/feed.xml"),
  },
  // NO SignalR proxy here
}
```

### Azure Static Web App Proxy

**Location**: [staticwebapp.config.json](../staticwebapp.config.json)

**SignalR Proxy**: ❌ **NONE**

The Azure config only routes:
- `/api/*` → Azure Functions (joke/projects/rss proxies)
- `/assets/*` → Static assets
- All other paths → SPA fallback

**No WebSocket proxying is configured.**

---

## CSP & CORS Setup

### Content Security Policy (CSP)

The site runs on a **different origin** from the SignalR hub, requiring explicit CSP rules.

**Production Origin**: `https://[your-azure-static-app].azurestaticapps.net` or custom domain  
**Development Origin**: `http://localhost:3000`  
**SignalR Origin**: `https://web.makeboldspark.com` (CROSS-ORIGIN)

#### CSP Configuration

**Location**: [staticwebapp.config.json](../staticwebapp.config.json#L63) (production)  
**Location**: [vite.config.ts](../vite.config.ts#L91-L93) (development)

**Exact CSP Header** (both files MUST match):

```
Content-Security-Policy: 
  default-src 'self'; 
  connect-src 
    'self' 
    https://markhazleton.com 
    https://*.markhazleton.com           ← Covers web.makeboldspark.com
    wss://web.makeboldspark.com      ← WebSocket connection
    ws://localhost:*                      ← Local dev WebSocket
    http://localhost:*                    ← Local dev HTTP fallback
    https://v2.jokeapi.dev
    https://api.openweathermap.org;
  script-src 'self' 'unsafe-inline' 'unsafe-eval';  ← Required for React/Vite
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https: http: blob:;
  font-src 'self' data: https:;
  worker-src 'self' blob:;                          ← Service worker
```

**Critical CSP Rules for SignalR**:

| Directive | Value | Purpose |
|-----------|-------|---------|
| `connect-src` | `wss://web.makeboldspark.com` | Allow WebSocket connection |
| `connect-src` | `https://*.markhazleton.com` | Allow HTTPS fallback transports (SSE, Long Polling) |
| `connect-src` | `ws://localhost:*` | Allow local dev WebSocket |
| `connect-src` | `http://localhost:*` | Allow local dev HTTP fallback |

**⚠️ WARNING**: Do NOT remove `wss://web.makeboldspark.com` or SignalR will fail with CSP errors.

### CORS Headers

**Location**: [staticwebapp.config.json](../staticwebapp.config.json#L67-L69)

```json
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Origin, X-Requested-With"
}
```

**Purpose**: Allow the frontend to make cross-origin requests.

**Note**: SignalR negotiation uses CORS preflight requests (OPTIONS) before establishing WebSocket.

---

## Message Flow

### Outgoing Messages (Client → Server)

**Method**: `SendMessage`

```typescript
await connection.invoke(
  "SendMessage",
  userName: string,        // User's display name (from localStorage)
  message: string,         // User's input message
  conversationId: string,  // Unique ID: new Date().getTime().toString()
  variantName: string      // Chat variant/persona: "ReactSpark", "Helper", etc.
);
```

**Example**:
```typescript
await connection.invoke(
  "SendMessage",
  "John Doe",              // userName
  "What is React?",        // message
  "1709827200000",         // conversationId (timestamp)
  "ReactSpark"             // variantName
);
```

### Incoming Messages (Server → Client)

**Event**: `ReceiveMessage`

```typescript
connection.on("ReceiveMessage", (user: string, messageChunk: string) => {
  // user: The variant name (e.g., "ReactSpark")
  // messageChunk: Partial response chunk (streaming)
});
```

**Streaming Behavior**:

1. **First chunk**: Creates a new message in the UI
2. **Subsequent chunks**: Appends to the last message
3. **Debounce**: After 1 second of no chunks, marks streaming complete
4. **Sanitization**: All chunks are sanitized to strip HTML tags (XSS prevention)

**Example Flow**:

```typescript
// Server sends multiple chunks:
ReceiveMessage("ReactSpark", "React is ")
ReceiveMessage("ReactSpark", "a JavaScript ")
ReceiveMessage("ReactSpark", "library for building ")
ReceiveMessage("ReactSpark", "user interfaces.")

// UI displays (accumulated):
"React is a JavaScript library for building user interfaces."
```

---

## Reconnection Strategy

### Three-Layered Reconnection

#### 1. SignalR Automatic Reconnect

```typescript
.withAutomaticReconnect([0, 2000, 10000, 30000])
```

- **Triggers**: Connection lost (network drop, server restart)
- **Behavior**: SignalR automatically retries
- **Delays**: 0ms, 2s, 10s, 30s
- **Max Attempts**: 4

#### 2. Manual Retry on Setup Failure

**Location**: [Chat.tsx#L147-L156](../src/components/Chat.tsx#L147-L156)

```typescript
connection.current.onclose((error) => {
  if (error && retryCount < 3) {
    setTimeout(
      () => setupSignalRConnection(retryCount + 1),
      Math.pow(2, retryCount) * 1000  // Exponential backoff: 1s, 2s, 4s
    );
  }
});
```

- **Triggers**: Initial connection fails
- **Behavior**: Retry with exponential backoff
- **Delays**: 1s, 2s, 4s
- **Max Attempts**: 3

#### 3. User-Triggered Retry

**Location**: [Chat.tsx#L230-L283](../src/components/Chat.tsx#L230-L283)

```typescript
const handleRetryConnection = () => {
  // User clicks "Retry Connection" button
  // Rebuilds connection from scratch
};
```

- **Triggers**: User clicks "Retry Connection" button (shown on error)
- **Behavior**: Fresh connection attempt
- **No limit**: User can retry indefinitely

### Connection Events

```typescript
connection.current.onclose((error) => {
  console.log("SignalR connection closed:", error);
  // Manual retry logic
});

connection.current.onreconnecting((error) => {
  console.log("SignalR reconnecting:", error);
  setIsConnecting(true);  // Show "Connecting..." UI
});

connection.current.onreconnected(() => {
  console.log("SignalR reconnected");
  setIsConnecting(false);  // Hide "Connecting..." UI
});
```

---

## Environment Variables

### VITE_SIGNALR_HUB_URL

**Purpose**: Override the default SignalR hub URL

**Usage**:
```typescript
const hubUrl = import.meta.env.VITE_SIGNALR_HUB_URL || "https://web.makeboldspark.com/chatHub";
```

**Current State**: ❌ No `.env` file exists in the repository

**To Override** (create `.env` file in project root):

```bash
# .env
VITE_SIGNALR_HUB_URL=https://your-custom-hub.com/chatHub
```

**Note**: `.env` files are ignored by Git (per `.gitignore`), so this is for local development only.

---

## Troubleshooting

### Common Issues

#### 1. CSP Errors in Console

**Symptom**:
```
Refused to connect to 'wss://web.makeboldspark.com/chatHub' 
because it violates the following Content Security Policy directive: "connect-src 'self'"
```

**Solution**: Verify CSP includes `wss://web.makeboldspark.com` in `connect-src`

**Files to Check**:
- [staticwebapp.config.json](../staticwebapp.config.json#L63)
- [vite.config.ts](../vite.config.ts#L91-L93)

#### 2. Connection Timeout

**Symptom**:
```
Error: Failed to start the connection: Error: Server timeout elapsed without receiving a message from the server.
```

**Causes**:
- Server is down
- Network issues
- Firewall blocking WebSockets

**Solution**:
- Check server status at `https://web.makeboldspark.com`
- Verify network allows WebSocket connections
- Check browser DevTools Network tab for failed WebSocket upgrade

#### 3. Transport Fallback

**Symptom**:
```
Information: WebSocket failed; trying Server Sent Events...
Information: ServerSentEvents failed; trying Long Polling...
```

**Cause**: WebSocket transport unavailable (network/proxy blocking)

**Behavior**: SignalR automatically falls back to SSE → Long Polling

**Performance Impact**: Long Polling is less efficient (higher latency, more HTTP requests)

#### 4. CORS Preflight Failure

**Symptom**:
```
Access to XMLHttpRequest at 'https://web.makeboldspark.com/chatHub/negotiate' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**: Verify server (WebSpark) has correct CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Client                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Chat.tsx Component                             │   │
│  │  - useState (messages, userName, etc.)          │   │
│  │  - useRef (connection, conversationId)          │   │
│  │  - useEffect (setup SignalR)                    │   │
│  └─────────────────────────────────────────────────┘   │
│                         ▲                               │
│                         │                               │
│  ┌──────────────────────┴──────────────────────────┐   │
│  │  @microsoft/signalr Client Library              │   │
│  │  - HubConnectionBuilder                         │   │
│  │  - Transport negotiation                        │   │
│  │  - Message serialization                        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          │ WebSocket (wss://)
                          │ or SSE / Long Polling fallback
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│           web.makeboldspark.com Server              │
│  ┌─────────────────────────────────────────────────┐   │
│  │  SignalR Hub (/chatHub)                         │   │
│  │  - Receives: SendMessage(user, msg, convId, v)  │   │
│  │  - Sends: ReceiveMessage(user, chunk)           │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│  ┌──────────────────────┴──────────────────────────┐   │
│  │  PromptSpark AI Service                         │   │
│  │  - Processes messages                           │   │
│  │  - Generates responses (streaming)              │   │
│  │  - Variant-specific behavior                    │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Related Documentation

- [API Dependencies](./API_DEPENDENCIES.md) - Overview of all external APIs
- [Security](./SECURITY.md) - CSP and CORS configuration details
- [Architecture](./ARCHITECTURE.md) - Overall application architecture
- [Chat Component Source](../src/components/Chat.tsx) - Full implementation

---

## Summary

**Exact SignalR Setup**:
- **URL**: `https://web.makeboldspark.com/chatHub` (hardcoded, no .env override in use)
- **Transports**: WebSockets → SSE → Long Polling (all enabled)
- **Authentication**: None (public hub, no access token)
- **Credentials**: Not sent (`withCredentials: false`)
- **Timeout**: 30 seconds
- **Reconnection**: Automatic (0ms, 2s, 10s, 30s) + Manual (1s, 2s, 4s) + User-triggered
- **Proxy**: None (direct cross-origin connection)
- **CSP**: Explicitly allows `wss://web.makeboldspark.com` and `https://*.markhazleton.com`
- **CORS**: Server allows all origins (`Access-Control-Allow-Origin: *`)

**No proxying, no middleware, no reverse proxy — just a direct browser → WebSpark WebSocket connection.**

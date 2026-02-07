import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus(): string {
    return 'App is running';
  }

  @Get('test')
  @Header('Content-Type', 'text/html')
  getTestPage(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chord Bot - Test Console</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
      background: #1a1a2e;
      color: #e0e0e0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
    }
    h1 { color: #ff6b9d; margin-bottom: 0.5rem; }
    .subtitle { color: #888; margin-bottom: 1.5rem; font-size: 0.9rem; }
    .container { width: 100%; max-width: 800px; }

    .input-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    input[type="text"] {
      flex: 1;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      font-family: monospace;
      background: #16213e;
      border: 1px solid #0f3460;
      border-radius: 6px;
      color: #e0e0e0;
      outline: none;
    }
    input[type="text"]:focus { border-color: #ff6b9d; }
    button {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      background: #ff6b9d;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }
    button:hover { background: #e0527d; }
    button:disabled { opacity: 0.5; cursor: wait; }

    .presets {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .presets button {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
      background: #0f3460;
    }
    .presets button:hover { background: #1a4a8a; }

    .output {
      background: #16213e;
      border: 1px solid #0f3460;
      border-radius: 8px;
      padding: 1.5rem;
      min-height: 200px;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: monospace;
      font-size: 0.9rem;
      line-height: 1.6;
    }
    .output .msg { color: #53d8fb; }
    .output .meta { color: #888; font-size: 0.8rem; }
    .output .error { color: #ff4757; }
    .output .map-link a { color: #ff6b9d; text-decoration: none; }
    .output .map-link a:hover { text-decoration: underline; }
    .output .separator { border-top: 1px solid #0f3460; margin: 1rem 0; }

    .history { margin-top: 2rem; }
    .history h3 { color: #888; margin-bottom: 0.5rem; font-size: 0.85rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Chord Bot Test Console</h1>
    <p class="subtitle">Test IRC commands without connecting to Bancho. Results come from the database.</p>

    <div class="input-row">
      <input type="text" id="cmd" placeholder="Type a command, e.g. !r 1500 mod=hardrock" autofocus />
      <button id="send" onclick="run()">Send</button>
    </div>

    <div class="presets">
      <button onclick="preset('!r 1500')">!r 1500</button>
      <button onclick="preset('!r 2000 mod=hidden')">!r 2000 mod=hidden</button>
      <button onclick="preset('!r 1500 mod=hardrock stars=4.52 bpm=93')">!r 1500 mod=hardrock stars=4.52 bpm=93</button>
      <button onclick="preset('!r 2500 mod=doubletime')">!r 2500 mod=doubletime</button>
      <button onclick="preset('!r 1800 stars=5.5')">!r 1800 stars=5.5</button>
      <button onclick="preset('!r')">!r (random)</button>
      <button onclick="preset('!help')">!help</button>
    </div>

    <div class="output" id="output">Type a command above and hit Send (or press Enter).</div>
  </div>

<script>
const cmdInput = document.getElementById('cmd');
const output = document.getElementById('output');
const sendBtn = document.getElementById('send');

cmdInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') run();
});

function preset(cmd) {
  cmdInput.value = cmd;
  run();
}

async function run() {
  const cmd = cmdInput.value.trim();
  if (!cmd) return;

  sendBtn.disabled = true;
  output.innerHTML = '<span class="meta">Querying...</span>';

  try {
    const res = await fetch('/recommend?command=' + encodeURIComponent(cmd));
    const data = await res.json();
    render(data);
  } catch (err) {
    output.innerHTML = '<span class="error">Request failed: ' + err.message + '</span>';
  } finally {
    sendBtn.disabled = false;
    cmdInput.select();
  }
}

function render(data) {
  let html = '';

  html += '<span class="meta">Command: ' + esc(data.command || '?') + '</span>\\n';

  if (data.randomMMR) {
    html += '<span class="meta">Random MMR selected: ' + data.randomMMR + '</span>\\n';
  }
  if (data.totalMatches !== undefined) {
    html += '<span class="meta">Maps matched: ' + data.totalMatches + '</span>\\n';
  }
  if (data.filtersApplied) {
    html += '<span class="meta">Filters: ' + esc(JSON.stringify(data.filtersApplied)) + '</span>\\n';
  }

  html += '<div class="separator"></div>';

  if (data.messages) {
    data.messages.forEach((msg) => {
      const linkified = msg.replace(
        /\\[https:\\/\\/osu\\.ppy\\.sh\\/b\\/(\\d+)\\s+([^\\]]+)\\]/g,
        '<span class="map-link"><a href="https://osu.ppy.sh/b/$1" target="_blank">$2</a></span>'
      );
      html += '<div class="msg">' + linkified + '</div>\\n';
    });
  }

  if (data.error) {
    html += '<span class="error">' + esc(data.error) + '</span>\\n';
    if (data.examples) {
      html += '<span class="meta">Examples:</span>\\n';
      data.examples.forEach((ex) => {
        html += '<span class="meta">  ' + esc(ex) + '</span>\\n';
      });
    }
  }

  if (data.map) {
    html += '<div class="separator"></div>';
    html += '<span class="meta">Raw map data:</span>\\n';
    html += '<span class="meta">' + esc(JSON.stringify(data.map, null, 2)) + '</span>';
  }

  output.innerHTML = html;
}

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
</script>
</body>
</html>`;
  }
}

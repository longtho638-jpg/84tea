const path = require('path');
const fs = require('fs');
const os = require('os');

// Import modules
const {
  shouldUseColor,
  coloredBar,
  green,
  yellow,
  red,
  cyan,
  magenta,
  dim,
  RESET,
  getContextColor
} = require('../colors.cjs');

const {
  parseTranscript,
  processEntry,
  extractTarget
} = require('../transcript-parser.cjs');

const {
  countConfigs,
  countRulesInDir,
  countMcpServersInFile,
  countHooksInFile
} = require('../config-counter.cjs');

describe('Statusline Tests', () => {

  // ============================================================================
  // TEST 1: Module Load Test
  // ============================================================================
  describe('Module Load', () => {
    test('colors.cjs exports required functions', () => {
      expect(typeof green).toBe('function');
      expect(typeof yellow).toBe('function');
      expect(typeof red).toBe('function');
      expect(typeof cyan).toBe('function');
      expect(typeof magenta).toBe('function');
      expect(typeof dim).toBe('function');
      expect(typeof coloredBar).toBe('function');
      expect(typeof getContextColor).toBe('function');
      expect(RESET).toBe('\x1b[0m');
    });

    test('transcript-parser.cjs exports required functions', () => {
      expect(typeof parseTranscript).toBe('function');
      expect(typeof processEntry).toBe('function');
      expect(typeof extractTarget).toBe('function');
    });

    test('config-counter.cjs exports required functions', () => {
      expect(typeof countConfigs).toBe('function');
      expect(typeof countRulesInDir).toBe('function');
      expect(typeof countMcpServersInFile).toBe('function');
      expect(typeof countHooksInFile).toBe('function');
    });
  });

  // ============================================================================
  // TEST 2: Colors Test
  // ============================================================================
  describe('Colors', () => {
    test('green() wraps text with color codes or returns plain text', () => {
      const text = 'success';
      const result = green(text);
      expect(result === text || result.includes(text)).toBe(true);
    });

    test('yellow() returns valid output', () => {
      const result = yellow('warning');
      expect(result.length).toBeGreaterThanOrEqual(7);
    });

    test('red() returns valid output', () => {
      const result = red('error');
      expect(result.length).toBeGreaterThanOrEqual(5);
    });

    test('cyan() returns valid output', () => {
      const result = cyan('info');
      expect(result.length).toBeGreaterThanOrEqual(4);
    });

    test('magenta() returns valid output', () => {
      const result = magenta('debug');
      expect(result.length).toBeGreaterThanOrEqual(5);
    });

    test('dim() returns valid output', () => {
      const result = dim('dim text');
      expect(result.length).toBeGreaterThanOrEqual(8);
    });

    test('shouldUseColor is boolean', () => {
      expect(typeof shouldUseColor).toBe('boolean');
    });
  });

  // ============================================================================
  // TEST 3: Context Color Thresholds
  // ============================================================================
  describe('Context Color Thresholds', () => {
    test('getContextColor(50%) returns GREEN', () => {
      expect(getContextColor(50)).toBe('\x1b[32m');
    });

    test('getContextColor(75%) returns YELLOW', () => {
      expect(getContextColor(75)).toBe('\x1b[33m');
    });

    test('getContextColor(90%) returns RED', () => {
      expect(getContextColor(90)).toBe('\x1b[31m');
    });

    test('getContextColor(69%) returns GREEN (below 70%)', () => {
      expect(getContextColor(69)).toBe('\x1b[32m');
    });

    test('getContextColor(70%) returns YELLOW (exactly 70%)', () => {
      expect(getContextColor(70)).toBe('\x1b[33m');
    });

    test('getContextColor(85%) returns RED (exactly 85%)', () => {
      expect(getContextColor(85)).toBe('\x1b[31m');
    });
  });

  // ============================================================================
  // TEST 4: Colored Bar Rendering
  // ============================================================================
  describe('Colored Bar Rendering', () => {
    test('coloredBar(0) renders empty bar', () => {
      const bar = coloredBar(0);
      expect(bar.includes('▱')).toBe(true);
    });

    test('coloredBar(50) renders half-filled bar', () => {
      const bar = coloredBar(50, 12);
      expect(bar.length).toBeGreaterThanOrEqual(6);
    });

    test('coloredBar(100) renders full bar', () => {
      const bar = coloredBar(100, 12);
      expect(bar.length).toBeGreaterThanOrEqual(12);
    });

    test('coloredBar clamping: negative percent treated as 0', () => {
      const bar = coloredBar(-10, 12);
      expect(bar.includes('▱')).toBe(true);
    });

    test('coloredBar clamping: >100 percent treated as 100', () => {
      const bar = coloredBar(150, 12);
      expect(bar.length).toBeGreaterThanOrEqual(10);
    });

    test('coloredBar respects custom width', () => {
      const bar6 = coloredBar(50, 6);
      const bar20 = coloredBar(50, 20);
      expect(bar6.length).toBeLessThan(bar20.length);
    });
  });

  // ============================================================================
  // TEST 5: Transcript Parser - Empty/Non-existent
  // ============================================================================
  describe('Transcript Parser - Empty/Non-existent', () => {
    test('parseTranscript returns empty result for non-existent file', async () => {
      const result = await parseTranscript('/tmp/nonexistent-transcript-12345.jsonl');
      expect(result.tools.length).toBe(0);
      expect(result.agents.length).toBe(0);
      expect(result.todos.length).toBe(0);
    });

    test('parseTranscript returns empty result for null path', async () => {
      const result = await parseTranscript(null);
      expect(result.tools.length).toBe(0);
      expect(result.agents.length).toBe(0);
      expect(result.todos.length).toBe(0);
    });

    test('parseTranscript returns empty result for undefined path', async () => {
      const result = await parseTranscript(undefined);
      expect(result.tools.length).toBe(0);
      expect(result.agents.length).toBe(0);
      expect(result.todos.length).toBe(0);
    });
  });

  // ============================================================================
  // TEST 6: Transcript Parser - Real JSONL File
  // ============================================================================
  describe('Transcript Parser - Real JSONL File', () => {
    let tmpTranscript;

    beforeEach(() => {
      tmpTranscript = path.join(os.tmpdir(), `test-transcript-${Date.now()}.jsonl`);
      const sampleTranscriptData = [
        {
          timestamp: '2026-01-06T12:00:00Z',
          message: {
            content: [
              {
                type: 'tool_use',
                id: 'tool-1',
                name: 'Read',
                input: { file_path: '/home/user/file.txt' }
              }
            ]
          }
        },
        {
          timestamp: '2026-01-06T12:01:00Z',
          message: {
            content: [
              {
                type: 'tool_result',
                tool_use_id: 'tool-1',
                is_error: false
              }
            ]
          }
        },
        {
          timestamp: '2026-01-06T12:02:00Z',
          message: {
            content: [
              {
                type: 'tool_use',
                id: 'tool-2',
                name: 'Bash',
                input: { command: 'git status' }
              }
            ]
          }
        },
        {
          timestamp: '2026-01-06T12:03:00Z',
          message: {
            content: [
              {
                type: 'tool_use',
                id: 'agent-1',
                name: 'Task',
                input: { subagent_type: 'researcher', model: 'claude-opus', description: 'Research topic' }
              }
            ]
          }
        },
        {
          timestamp: '2026-01-06T12:04:00Z',
          message: {
            content: [
              {
                type: 'tool_result',
                tool_use_id: 'agent-1',
                is_error: false
              }
            ]
          }
        },
        {
          timestamp: '2026-01-06T12:05:00Z',
          message: {
            content: [
              {
                type: 'tool_use',
                id: 'todo-1',
                name: 'TodoWrite',
                input: {
                  todos: [
                    { content: 'First task', status: 'completed', activeForm: 'Completing first task' },
                    { content: 'Second task', status: 'in_progress', activeForm: 'Working on second task' }
                  ]
                }
              }
            ]
          }
        }
      ];
      fs.writeFileSync(tmpTranscript, sampleTranscriptData.map(d => JSON.stringify(d)).join('\n'));
    });

    afterEach(() => {
      try {
        if (fs.existsSync(tmpTranscript)) {
          fs.unlinkSync(tmpTranscript);
        }
      } catch (e) {
        // Ignore cleanup errors
      }
    });

    test('parseTranscript reads valid JSONL file', async () => {
      const result = await parseTranscript(tmpTranscript);
      expect(Array.isArray(result.tools)).toBe(true);
      expect(Array.isArray(result.agents)).toBe(true);
      expect(Array.isArray(result.todos)).toBe(true);
    });

    test('parseTranscript tracks tools correctly', async () => {
      const result = await parseTranscript(tmpTranscript);
      expect(result.tools.length).toBeGreaterThanOrEqual(2);
      const toolNames = result.tools.map(t => t.name);
      expect(toolNames).toContain('Read');
      expect(toolNames).toContain('Bash');
    });

    test('parseTranscript marks tool status correctly', async () => {
      const result = await parseTranscript(tmpTranscript);
      const completedTools = result.tools.filter(t => t.status === 'completed');
      expect(completedTools.length).toBeGreaterThan(0);
    });

    test('parseTranscript tracks agents correctly', async () => {
      const result = await parseTranscript(tmpTranscript);
      expect(result.agents.length).toBeGreaterThan(0);
      const agent = result.agents[0];
      expect(agent.type).toBe('researcher');
      expect(agent.model).toBe('claude-opus');
    });

    test('parseTranscript tracks todos correctly', async () => {
      const result = await parseTranscript(tmpTranscript);
      expect(result.todos.length).toBeGreaterThanOrEqual(2);
      const inProgressTodos = result.todos.filter(t => t.status === 'in_progress');
      expect(inProgressTodos.length).toBeGreaterThan(0);
    });

    test('parseTranscript extracts targets from tools', async () => {
      const result = await parseTranscript(tmpTranscript);
      const readTool = result.tools.find(t => t.name === 'Read');
      if (readTool) {
        expect(readTool.target).toBeTruthy();
        expect(readTool.target).toContain('file.txt');
      }
    });
  });

  // ============================================================================
  // TEST 7: Extract Target Function
  // ============================================================================
  describe('Extract Target Function', () => {
    test('extractTarget: Read tool', () => {
      const target = extractTarget('Read', { file_path: '/home/user/file.txt' });
      expect(target).toBe('/home/user/file.txt');
    });

    test('extractTarget: Write tool', () => {
      const target = extractTarget('Write', { file_path: '/home/user/output.txt' });
      expect(target).toBe('/home/user/output.txt');
    });

    test('extractTarget: Edit tool', () => {
      const target = extractTarget('Edit', { path: '/home/user/config.json' });
      expect(target).toBe('/home/user/config.json');
    });

    test('extractTarget: Glob tool', () => {
      const target = extractTarget('Glob', { pattern: '**/*.js' });
      expect(target).toBe('**/*.js');
    });

    test('extractTarget: Grep tool', () => {
      const target = extractTarget('Grep', { pattern: 'function.*test' });
      expect(target).toBe('function.*test');
    });

    test('extractTarget: Bash tool (short command)', () => {
      const target = extractTarget('Bash', { command: 'ls -la' });
      expect(target).toBe('ls -la');
    });

    test('extractTarget: Bash tool (long command truncated)', () => {
      const longCmd = 'npm install --save-dev @types/node @types/jest @types/react @types/react-dom @types/webpack';
      const target = extractTarget('Bash', { command: longCmd });
      expect(target.endsWith('...')).toBe(true);
      expect(target.length).toBeLessThanOrEqual(33);
    });

    test('extractTarget: Unknown tool returns null', () => {
      const target = extractTarget('UnknownTool', { someParam: 'value' });
      expect(target).toBe(null);
    });

    test('extractTarget: Null input returns null', () => {
      const target = extractTarget('Read', null);
      expect(target).toBe(null);
    });
  });

  // ============================================================================
  // TEST 8: Config Counter - Edge Cases
  // ============================================================================
  describe('Config Counter - Edge Cases', () => {
    test('countRulesInDir: returns 0 for non-existent directory', () => {
      const count = countRulesInDir('/tmp/nonexistent-rules-dir-12345');
      expect(count).toBe(0);
    });

    test('countRulesInDir: handles empty directory', () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rules-'));
      try {
        const count = countRulesInDir(tmpDir);
        expect(count).toBe(0);
      } finally {
        fs.rmdirSync(tmpDir);
      }
    });

    test('countRulesInDir: counts .md files only', () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rules-'));
      try {
        fs.writeFileSync(path.join(tmpDir, 'rule1.md'), '# Rule 1');
        fs.writeFileSync(path.join(tmpDir, 'rule2.md'), '# Rule 2');
        fs.writeFileSync(path.join(tmpDir, 'ignore.txt'), 'ignore');
        const count = countRulesInDir(tmpDir);
        expect(count).toBe(2);
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    test('countRulesInDir: handles nested directories', () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rules-'));
      try {
        fs.mkdirSync(path.join(tmpDir, 'nested'));
        fs.writeFileSync(path.join(tmpDir, 'rule1.md'), '# Rule 1');
        fs.writeFileSync(path.join(tmpDir, 'nested', 'rule2.md'), '# Rule 2');
        const count = countRulesInDir(tmpDir);
        expect(count).toBe(2);
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    test('countConfigs: returns object with expected properties', () => {
      const result = countConfigs('/tmp');
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('claudeMdCount');
      expect(result).toHaveProperty('rulesCount');
      expect(result).toHaveProperty('mcpCount');
      expect(result).toHaveProperty('hooksCount');
    });

    test('countConfigs: all counts are numbers', () => {
      const result = countConfigs('/tmp');
      expect(typeof result.claudeMdCount).toBe('number');
      expect(typeof result.rulesCount).toBe('number');
      expect(typeof result.mcpCount).toBe('number');
      expect(typeof result.hooksCount).toBe('number');
    });

    test('countConfigs: handles null/undefined cwd gracefully', () => {
      const result1 = countConfigs(null);
      expect(typeof result1).toBe('object');

      const result2 = countConfigs(undefined);
      expect(typeof result2).toBe('object');
    });
  });

  // ============================================================================
  // TEST 9: Fallback Error Handling
  // ============================================================================
  describe('Fallback Error Handling', () => {
    test('processEntry handles entry without timestamp', () => {
      const toolMap = new Map();
      const agentMap = new Map();
      const latestTodos = [];
      const result = { sessionStart: null };

      const entry = {
        message: {
          content: [
            {
              type: 'tool_use',
              id: 'tool-1',
              name: 'Bash',
              input: { command: 'ls' }
            }
          ]
        }
      };

      processEntry(entry, toolMap, agentMap, latestTodos, result);
      expect(toolMap.has('tool-1')).toBe(true);
    });

    test('processEntry handles missing content array', () => {
      const toolMap = new Map();
      const agentMap = new Map();
      const latestTodos = [];
      const result = { sessionStart: null };

      const entry = { timestamp: '2026-01-06T12:00:00Z' };
      processEntry(entry, toolMap, agentMap, latestTodos, result);
      expect(toolMap.size).toBe(0);
    });

    test('processEntry handles malformed tool_result', () => {
      const toolMap = new Map();
      const agentMap = new Map();
      const latestTodos = [];
      const result = { sessionStart: null };

      const entry = {
        timestamp: '2026-01-06T12:00:00Z',
        message: {
          content: [
            { type: 'tool_result' } // missing tool_use_id
          ]
        }
      };

      processEntry(entry, toolMap, agentMap, latestTodos, result);
      // Should not crash, just skip
      expect(toolMap.size).toBe(0);
    });
  });

  // ============================================================================
  // TEST 10: Performance Test
  // ============================================================================
  describe('Performance Test', () => {
    test('parseTranscript processes 100 entries <100ms', async () => {
      const largeTranscript = path.join(os.tmpdir(), `perf-transcript-${Date.now()}.jsonl`);
      const lines = [];

      for (let i = 0; i < 100; i++) {
        lines.push(JSON.stringify({
          timestamp: new Date().toISOString(),
          message: {
            content: [
              {
                type: 'tool_use',
                id: `tool-${i}`,
                name: 'Bash',
                input: { command: 'echo test' }
              }
            ]
          }
        }));
      }

      fs.writeFileSync(largeTranscript, lines.join('\n'));

      try {
        const start = Date.now();
        await parseTranscript(largeTranscript);
        const elapsed = Date.now() - start;
        expect(elapsed).toBeLessThan(100);
      } finally {
        if (fs.existsSync(largeTranscript)) {
          fs.unlinkSync(largeTranscript);
        }
      }
    });

    test('coloredBar(50, 12) renders in <1ms', () => {
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        coloredBar(50, 12);
      }
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(50); // 50ms for 1000 iterations = 0.05ms per iteration
    });
  });

});

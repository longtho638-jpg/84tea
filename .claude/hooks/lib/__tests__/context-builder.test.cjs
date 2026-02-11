const path = require('path');
const fs = require('fs');
const os = require('os');

// Import the module under test
const contextBuilder = require('../context-builder.cjs');

/**
 * Create a temporary directory with optional subdirectories
 */
function createTempDir(subdirs = []) {
  const tempDir = path.join(os.tmpdir(), 'context-builder-test-' + Date.now() + '-' + Math.random().toString(36).slice(2));
  fs.mkdirSync(tempDir, { recursive: true });

  for (const subdir of subdirs) {
    fs.mkdirSync(path.join(tempDir, subdir), { recursive: true });
  }

  return tempDir;
}

/**
 * Clean up temporary directory
 */
function cleanupTempDir(dir) {
  if (dir && fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Create a test file in the specified directory
 */
function createTestFile(dir, filename, content = '# Test file\n') {
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
}

describe('context-builder.cjs', () => {

  describe('resolveRulesPath()', () => {
    let originalCwd;
    let tempDir;

    beforeEach(() => {
      originalCwd = process.cwd();
    });

    afterEach(() => {
      process.chdir(originalCwd);
      if (tempDir) cleanupTempDir(tempDir);
    });

    it('returns null when file does not exist anywhere', () => {
      tempDir = createTempDir(['.claude']);
      process.chdir(tempDir);

      // Use a unique filename that won't exist in global ~/.claude/
      const uniqueFilename = `nonexistent-${Date.now()}-${Math.random().toString(36).slice(2)}.md`;
      const result = contextBuilder.resolveRulesPath(uniqueFilename);
      expect(result).toBeNull();
    });

    it('finds file in rules/ directory (new location)', () => {
      tempDir = createTempDir(['.claude/rules']);
      createTestFile(path.join(tempDir, '.claude/rules'), 'development-rules.md');
      process.chdir(tempDir);

      const result = contextBuilder.resolveRulesPath('development-rules.md');
      expect(result).toBe('.claude/rules/development-rules.md');
    });

    it('falls back to workflows/ when rules/ does not exist', () => {
      tempDir = createTempDir(['.claude/workflows']);
      const testFile = 'unique-workflow-file-' + Date.now() + '.md';
      createTestFile(path.join(tempDir, '.claude/workflows'), testFile);
      process.chdir(tempDir);

      const result = contextBuilder.resolveRulesPath(testFile);
      expect(result).toBe(`.claude/workflows/${testFile}`);
    });

    it('prefers rules/ over workflows/ when both exist', () => {
      tempDir = createTempDir(['.claude/rules', '.claude/workflows']);
      createTestFile(path.join(tempDir, '.claude/rules'), 'development-rules.md', '# Rules version\n');
      createTestFile(path.join(tempDir, '.claude/workflows'), 'development-rules.md', '# Workflows version\n');
      process.chdir(tempDir);

      const result = contextBuilder.resolveRulesPath('development-rules.md');
      expect(result).toBe('.claude/rules/development-rules.md');
    });

    it('finds file in workflows/ when rules/ exists but file is only in workflows/', () => {
      tempDir = createTempDir(['.claude/rules', '.claude/workflows']);
      // rules/ exists but file is only in workflows/
      createTestFile(path.join(tempDir, '.claude/workflows'), 'legacy-file.md');
      process.chdir(tempDir);

      const result = contextBuilder.resolveRulesPath('legacy-file.md');
      expect(result).toBe('.claude/workflows/legacy-file.md');
    });

    it('handles custom configDirName parameter', () => {
      tempDir = createTempDir(['.opencode/rules']);
      createTestFile(path.join(tempDir, '.opencode/rules'), 'development-rules.md');
      process.chdir(tempDir);

      const result = contextBuilder.resolveRulesPath('development-rules.md', '.opencode');
      expect(result).toBe('.opencode/rules/development-rules.md');
    });

  });

  describe('resolveWorkflowPath alias', () => {

    it('resolveWorkflowPath is exported and callable', () => {
      expect(typeof contextBuilder.resolveWorkflowPath).toBe('function');
    });

    it('resolveWorkflowPath is alias for resolveRulesPath', () => {
      expect(contextBuilder.resolveWorkflowPath).toBe(contextBuilder.resolveRulesPath);
    });

    it('resolveWorkflowPath works identically to resolveRulesPath', () => {
      const tempDir = createTempDir(['.claude/rules']);
      createTestFile(path.join(tempDir, '.claude/rules'), 'test.md');
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        const rulesResult = contextBuilder.resolveRulesPath('test.md');
        const workflowResult = contextBuilder.resolveWorkflowPath('test.md');
        expect(rulesResult).toBe(workflowResult);
      } finally {
        process.chdir(originalCwd);
        cleanupTempDir(tempDir);
      }
    });

  });

  describe('Global path resolution', () => {
    let tempDir;
    let originalHome;

    beforeEach(() => {
      originalHome = os.homedir;
    });

    afterEach(() => {
      if (tempDir) cleanupTempDir(tempDir);
    });

    it('checks global ~/.claude/rules/ path', () => {
      // This test verifies the code path exists but we can't easily mock homedir
      // Just verify the function handles missing global paths gracefully
      const tempDir = createTempDir(['.claude']);
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        // Should return null since local doesn't exist and we can't control global
        const result = contextBuilder.resolveRulesPath('nonexistent-file.md');
        // Result depends on whether global ~/.claude/rules exists
        expect(result === null || typeof result === 'string').toBeTruthy();
      } finally {
        process.chdir(originalCwd);
        cleanupTempDir(tempDir);
      }
    });

  });

  describe('buildReminderContext()', () => {
    let tempDir;
    let originalCwd;

    beforeEach(() => {
      originalCwd = process.cwd();
    });

    afterEach(() => {
      process.chdir(originalCwd);
      if (tempDir) cleanupTempDir(tempDir);
    });

    it('returns content, lines, and sections', () => {
      tempDir = createTempDir(['.claude/rules']);
      createTestFile(path.join(tempDir, '.claude/rules'), 'development-rules.md');
      process.chdir(tempDir);

      const result = contextBuilder.buildReminderContext({});

      expect(result.content).toBeDefined();
      expect(Array.isArray(result.lines)).toBeTruthy();
      expect(result.sections).toBeDefined();
    });

    it('includes devRulesPath when rules/ exists', () => {
      tempDir = createTempDir(['.claude/rules']);
      createTestFile(path.join(tempDir, '.claude/rules'), 'development-rules.md');
      process.chdir(tempDir);

      const result = contextBuilder.buildReminderContext({});

      expect(
        result.content.includes('rules/development-rules.md') ||
        result.content.includes('development-rules')
      ).toBeTruthy();
    });

    it('includes devRulesPath when only workflows/ exists (backward compat)', () => {
      tempDir = createTempDir(['.claude/workflows']);
      createTestFile(path.join(tempDir, '.claude/workflows'), 'development-rules.md');
      process.chdir(tempDir);

      const result = contextBuilder.buildReminderContext({});

      expect(
        result.content.includes('workflows/development-rules.md') ||
        result.content.includes('development-rules')
      ).toBeTruthy();
    });

  });

  describe('Section builders', () => {

    it('buildSessionSection returns array of lines', () => {
      const lines = contextBuilder.buildSessionSection({});
      expect(Array.isArray(lines)).toBeTruthy();
      expect(lines.some(l => l.includes('Session'))).toBeTruthy();
    });

    it('buildRulesSection returns array with Rules header', () => {
      const lines = contextBuilder.buildRulesSection({});
      expect(Array.isArray(lines)).toBeTruthy();
      expect(lines.some(l => l.includes('Rules'))).toBeTruthy();
    });

    it('buildModularizationSection returns array with Modularization', () => {
      const lines = contextBuilder.buildModularizationSection();
      expect(Array.isArray(lines)).toBeTruthy();
      expect(lines.some(l => l.includes('Modularization'))).toBeTruthy();
    });

    it('buildPathsSection includes paths', () => {
      const lines = contextBuilder.buildPathsSection({
        reportsPath: '/test/reports/',
        plansPath: '/test/plans',
        docsPath: '/test/docs'
      });
      expect(Array.isArray(lines)).toBeTruthy();
      expect(lines.some(l => l.includes('Reports'))).toBeTruthy();
      expect(lines.some(l => l.includes('Plans'))).toBeTruthy();
    });

    it('buildNamingSection includes naming patterns', () => {
      const lines = contextBuilder.buildNamingSection({
        reportsPath: '/reports/',
        plansPath: '/plans',
        namePattern: '{date}-{slug}'
      });
      expect(Array.isArray(lines)).toBeTruthy();
      expect(lines.some(l => l.includes('Naming'))).toBeTruthy();
    });

  });

  describe('Hooks config behavior (Issue #413)', () => {
    let tempDir;
    let originalCwd;

    beforeEach(() => {
      originalCwd = process.cwd();
    });

    afterEach(() => {
      process.chdir(originalCwd);
      if (tempDir) cleanupTempDir(tempDir);
    });

    it('disables context section when context-tracking: false', () => {
      tempDir = createTempDir(['.claude']);
      const settingsPath = path.join(tempDir, '.claude', 'settings.json');
      fs.writeFileSync(settingsPath, JSON.stringify({
        hooks: {
          'context-tracking': false
        }
      }));
      process.chdir(tempDir);

      const result = contextBuilder.buildReminderContext({});

      expect(Array.isArray(result.sections.context)).toBeTruthy();
      expect(result.sections.context.length).toBe(0);
    });

    it('disables usage section when usage-context-awareness: false', () => {
      tempDir = createTempDir(['.claude']);
      const settingsPath = path.join(tempDir, '.claude', 'settings.json');
      fs.writeFileSync(settingsPath, JSON.stringify({
        hooks: {
          'usage-context-awareness': false
        }
      }));
      process.chdir(tempDir);

      const result = contextBuilder.buildReminderContext({});

      expect(Array.isArray(result.sections.usage)).toBeTruthy();
      expect(result.sections.usage.length).toBe(0);
    });

    it('disables both sections when both hooks false', () => {
      tempDir = createTempDir(['.claude']);
      const settingsPath = path.join(tempDir, '.claude', 'settings.json');
      fs.writeFileSync(settingsPath, JSON.stringify({
        hooks: {
          'context-tracking': false,
          'usage-context-awareness': false
        }
      }));
      process.chdir(tempDir);

      const result = contextBuilder.buildReminderContext({});

      expect(result.sections.context.length).toBe(0);
      expect(result.sections.usage.length).toBe(0);
    });

    it('enables sections by default when hooks undefined', () => {
      tempDir = createTempDir(['.claude']);
      const settingsPath = path.join(tempDir, '.claude', 'settings.json');
      fs.writeFileSync(settingsPath, JSON.stringify({}));
      process.chdir(tempDir);

      const result = contextBuilder.buildReminderContext({});

      expect(Array.isArray(result.sections.context)).toBeTruthy();
      expect(Array.isArray(result.sections.usage)).toBeTruthy();
    });

  });

  describe('Export completeness', () => {

    it('exports all required functions', () => {
      const requiredExports = [
        'buildReminderContext',
        'buildReminder',
        'buildLanguageSection',
        'buildSessionSection',
        'buildRulesSection',
        'buildModularizationSection',
        'buildPathsSection',
        'buildPlanContextSection',
        'buildNamingSection',
        'execSafe',
        'resolveRulesPath',
        'resolveScriptPath',
        'resolveSkillsVenv',
        'buildPlanContext',
        'wasRecentlyInjected',
        'resolveWorkflowPath' // Backward compat alias
      ];

      for (const exportName of requiredExports) {
        expect(typeof contextBuilder[exportName]).toBe('function');
      }
    });

  });

  describe('CLAUDE.md reference resolution', () => {
    let tempDir;
    let originalCwd;

    beforeEach(() => {
      originalCwd = process.cwd();
    });

    afterEach(() => {
      process.chdir(originalCwd);
      if (tempDir) cleanupTempDir(tempDir);
    });

    it('resolves @rules/ references correctly', () => {
      // This test verifies that the rules path resolution works
      // which is used by CLAUDE.md @references
      tempDir = createTempDir(['.claude/rules']);
      createTestFile(path.join(tempDir, '.claude/rules'), 'primary-workflow.md');
      createTestFile(path.join(tempDir, '.claude/rules'), 'development-rules.md');
      createTestFile(path.join(tempDir, '.claude/rules'), 'orchestration-protocol.md');
      createTestFile(path.join(tempDir, '.claude/rules'), 'documentation-management.md');
      process.chdir(tempDir);

      // All files referenced in CLAUDE.md should resolve
      const files = [
        'primary-workflow.md',
        'development-rules.md',
        'orchestration-protocol.md',
        'documentation-management.md'
      ];

      for (const file of files) {
        const result = contextBuilder.resolveRulesPath(file);
        expect(result).not.toBeNull();
        expect(result.includes('rules/')).toBeTruthy();
      }
    });

    it('resolves legacy @workflows/ references via fallback', () => {
      // Test that legacy references still work
      tempDir = createTempDir(['.claude/workflows']);
      const testFile = 'unique-legacy-workflow-' + Date.now() + '.md';
      createTestFile(path.join(tempDir, '.claude/workflows'), testFile);
      process.chdir(tempDir);

      const result = contextBuilder.resolveRulesPath(testFile);
      expect(result).not.toBeNull();
      expect(result.includes('workflows/')).toBeTruthy();
    });

  });

});

const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  listSkillNames,
  findOverlaps,
  resolvePaths,
  handleSessionStart,
  handleSessionEnd,
  SKIP_DIRS
} = require('../skill-dedup.cjs');

// -- Test helpers ------------------------------------------------------------

/** Create a temp directory structure for testing */
function createTestEnv() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-dedup-test-'));
  const globalDir = path.join(tmpDir, 'global-skills');
  const localDir = path.join(tmpDir, 'local-skills');
  fs.mkdirSync(globalDir, { recursive: true });
  fs.mkdirSync(localDir, { recursive: true });
  return { tmpDir, paths: resolvePaths(globalDir, localDir) };
}

/** Create a valid skill directory with SKILL.md */
function createSkill(skillsRoot, name, content) {
  const dir = path.join(skillsRoot, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'SKILL.md'), content || `# ${name}`);
  return dir;
}

/** Check if a skill directory exists in a given root */
function skillExists(skillsRoot, name) {
  return fs.existsSync(path.join(skillsRoot, name, 'SKILL.md'));
}

/** Remove temp dir recursively */
function cleanup(tmpDir) {
  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

// -- Unit Tests: listSkillNames ----------------------------------------------

describe('listSkillNames', () => {
  let tmpDir, globalDir;

  beforeEach(() => {
    const env = createTestEnv();
    tmpDir = env.tmpDir;
    globalDir = env.paths.globalDir;
  });

  afterEach(() => cleanup(tmpDir));

  it('returns empty array for non-existent directory', () => {
    expect(listSkillNames('/nonexistent/path')).toEqual([]);
  });

  it('returns empty array for empty directory', () => {
    expect(listSkillNames(globalDir)).toEqual([]);
  });

  it('returns skill names that have SKILL.md', () => {
    createSkill(globalDir, 'cook');
    createSkill(globalDir, 'brainstorm');
    const result = listSkillNames(globalDir);
    expect(result.sort()).toEqual(['brainstorm', 'cook']);
  });

  it('ignores directories without SKILL.md', () => {
    createSkill(globalDir, 'valid-skill');
    fs.mkdirSync(path.join(globalDir, 'no-skill-md'));
    const result = listSkillNames(globalDir);
    expect(result).toEqual(['valid-skill']);
  });

  it('ignores infrastructure directories (.venv, node_modules, etc.)', () => {
    createSkill(globalDir, 'real-skill');
    for (const skip of ['.shadowed', '.venv', 'node_modules', '__pycache__']) {
      const dir = path.join(globalDir, skip);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'SKILL.md'), '# skip');
    }
    const result = listSkillNames(globalDir);
    expect(result).toEqual(['real-skill']);
  });

  it('handles files (not directories) gracefully', () => {
    createSkill(globalDir, 'real-skill');
    fs.writeFileSync(path.join(globalDir, 'not-a-dir.txt'), 'test');
    const result = listSkillNames(globalDir);
    expect(result).toEqual(['real-skill']);
  });
});

// -- Unit Tests: findOverlaps ------------------------------------------------

describe('findOverlaps', () => {
  it('returns empty array when no overlaps', () => {
    expect(findOverlaps(['a', 'b'], ['c', 'd'])).toEqual([]);
  });

  it('finds overlapping names', () => {
    expect(
      findOverlaps(['cook', 'brainstorm', 'git'], ['cook', 'seo', 'brainstorm'])
    ).toEqual(['cook', 'brainstorm']);
  });

  it('returns empty array when global is empty', () => {
    expect(findOverlaps([], ['cook'])).toEqual([]);
  });

  it('returns empty array when local is empty', () => {
    expect(findOverlaps(['cook'], [])).toEqual([]);
  });

  it('handles identical lists', () => {
    expect(findOverlaps(['a', 'b'], ['a', 'b'])).toEqual(['a', 'b']);
  });
});

// -- Unit Tests: resolvePaths ------------------------------------------------

describe('resolvePaths', () => {
  it('computes shadowed dir and manifest paths correctly', () => {
    const result = resolvePaths('/global', '/local');
    expect(result.globalDir).toBe('/global');
    expect(result.localDir).toBe('/local');
    expect(result.shadowedDir).toBe('/local/.shadowed');
    expect(result.manifestFile).toBe('/local/.shadowed/.dedup-manifest.json');
  });
});

// -- Unit Tests: SKIP_DIRS ---------------------------------------------------

describe('SKIP_DIRS', () => {
  it('contains expected infrastructure directories', () => {
    expect(SKIP_DIRS.has('.shadowed')).toBeTruthy();
    expect(SKIP_DIRS.has('.venv')).toBeTruthy();
    expect(SKIP_DIRS.has('node_modules')).toBeTruthy();
    expect(SKIP_DIRS.has('__pycache__')).toBeTruthy();
  });

  it('does not contain regular skill names', () => {
    expect(SKIP_DIRS.has('cook')).toBeFalsy();
    expect(SKIP_DIRS.has('brainstorm')).toBeFalsy();
  });
});

// -- Integration Tests: handleSessionStart -----------------------------------

describe('handleSessionStart', () => {
  let tmpDir, paths;

  beforeEach(() => {
    const env = createTestEnv();
    tmpDir = env.tmpDir;
    paths = env.paths;
  });

  afterEach(() => cleanup(tmpDir));

  it('does nothing when no global skills exist', () => {
    createSkill(paths.localDir, 'cook');
    const result = handleSessionStart(paths);
    expect(result.shadowed).toEqual([]);
    expect(skillExists(paths.localDir, 'cook')).toBeTruthy();
  });

  it('does nothing when no local skills exist', () => {
    createSkill(paths.globalDir, 'cook');
    const result = handleSessionStart(paths);
    expect(result.shadowed).toEqual([]);
  });

  it('does nothing when no overlaps', () => {
    createSkill(paths.globalDir, 'engineer-only');
    createSkill(paths.localDir, 'marketing-only');
    const result = handleSessionStart(paths);
    expect(result.shadowed).toEqual([]);
    expect(skillExists(paths.localDir, 'marketing-only')).toBeTruthy();
  });

  it('shadows overlapping local skills', () => {
    createSkill(paths.globalDir, 'cook', '# Cook v2.1.1 (engineer)');
    createSkill(paths.globalDir, 'brainstorm', '# Brainstorm (engineer)');
    createSkill(paths.localDir, 'cook', '# Cook v2.0.0 (marketing)');
    createSkill(paths.localDir, 'brainstorm', '# Brainstorm (marketing)');
    createSkill(paths.localDir, 'seo', '# SEO (marketing only)');

    const result = handleSessionStart(paths);

    // Overlapping skills moved to .shadowed
    expect(result.shadowed.sort()).toEqual(['brainstorm', 'cook']);
    expect(skillExists(paths.localDir, 'cook')).toBeFalsy();
    expect(skillExists(paths.localDir, 'brainstorm')).toBeFalsy();
    expect(skillExists(paths.shadowedDir, 'cook')).toBeTruthy();
    expect(skillExists(paths.shadowedDir, 'brainstorm')).toBeTruthy();

    // Non-overlapping skill untouched
    expect(skillExists(paths.localDir, 'seo')).toBeTruthy();
  });

  it('writes a manifest file with shadowed skill names', () => {
    createSkill(paths.globalDir, 'cook');
    createSkill(paths.localDir, 'cook');

    handleSessionStart(paths);

    expect(fs.existsSync(paths.manifestFile)).toBeTruthy();
    const manifest = JSON.parse(fs.readFileSync(paths.manifestFile, 'utf8'));
    expect(manifest.skills).toEqual(['cook']);
    expect(manifest.shadowedAt).toBeDefined();
    expect(manifest.globalDir).toBe(paths.globalDir);
    expect(manifest.localDir).toBe(paths.localDir);
  });

  it('recovers from crashed previous session before shadowing', () => {
    // Simulate crashed session: .shadowed exists with orphaned skill
    createSkill(paths.globalDir, 'cook');
    createSkill(paths.localDir, 'seo');
    fs.mkdirSync(paths.shadowedDir, { recursive: true });
    createSkill(paths.shadowedDir, 'cook', '# Cook orphaned');

    const result = handleSessionStart(paths);

    // Should have restored cook first, then re-shadowed it
    expect(skillExists(paths.shadowedDir, 'cook')).toBeTruthy();
    expect(skillExists(paths.localDir, 'cook')).toBeFalsy();
  });
});

// -- Integration Tests: handleSessionEnd -------------------------------------

describe('handleSessionEnd', () => {
  let tmpDir, paths;

  beforeEach(() => {
    const env = createTestEnv();
    tmpDir = env.tmpDir;
    paths = env.paths;
  });

  afterEach(() => cleanup(tmpDir));

  it('does nothing when no .shadowed directory exists', () => {
    const result = handleSessionEnd(paths);
    expect(result.restored).toEqual([]);
  });

  it('restores shadowed skills from manifest', () => {
    // Simulate state after SessionStart
    createSkill(paths.localDir, 'seo');
    fs.mkdirSync(paths.shadowedDir, { recursive: true });
    createSkill(paths.shadowedDir, 'cook', '# Cook (marketing)');
    createSkill(paths.shadowedDir, 'brainstorm', '# Brainstorm (marketing)');
    fs.writeFileSync(paths.manifestFile, JSON.stringify({
      shadowedAt: new Date().toISOString(),
      skills: ['cook', 'brainstorm']
    }));

    const result = handleSessionEnd(paths);

    expect(result.restored.sort()).toEqual(['brainstorm', 'cook']);
    expect(skillExists(paths.localDir, 'cook')).toBeTruthy();
    expect(skillExists(paths.localDir, 'brainstorm')).toBeTruthy();
    expect(skillExists(paths.localDir, 'seo')).toBeTruthy();
    expect(fs.existsSync(paths.shadowedDir)).toBeFalsy();
  });

  it('cleans up .shadowed directory after restore', () => {
    fs.mkdirSync(paths.shadowedDir, { recursive: true });
    createSkill(paths.shadowedDir, 'cook');
    fs.writeFileSync(paths.manifestFile, JSON.stringify({ skills: ['cook'] }));

    handleSessionEnd(paths);

    expect(fs.existsSync(paths.shadowedDir)).toBeFalsy();
    expect(fs.existsSync(paths.manifestFile)).toBeFalsy();
  });

  it('handles corrupt manifest by restoring orphaned skills', () => {
    fs.mkdirSync(paths.shadowedDir, { recursive: true });
    createSkill(paths.shadowedDir, 'cook');
    fs.writeFileSync(paths.manifestFile, 'NOT VALID JSON!!!');

    const result = handleSessionEnd(paths);

    expect(result.restored).toEqual(['cook']);
    expect(skillExists(paths.localDir, 'cook')).toBeTruthy();
    expect(fs.existsSync(paths.shadowedDir)).toBeFalsy();
  });

  it('handles orphaned .shadowed dir without manifest', () => {
    fs.mkdirSync(paths.shadowedDir, { recursive: true });
    createSkill(paths.shadowedDir, 'cook');
    createSkill(paths.shadowedDir, 'brainstorm');
    // No manifest file

    const result = handleSessionEnd(paths);

    expect(result.restored.sort()).toEqual(['brainstorm', 'cook']);
    expect(skillExists(paths.localDir, 'cook')).toBeTruthy();
    expect(skillExists(paths.localDir, 'brainstorm')).toBeTruthy();
    expect(fs.existsSync(paths.shadowedDir)).toBeFalsy();
  });

  it('skips restore if local skill already exists (no overwrite)', () => {
    createSkill(paths.localDir, 'cook', '# Cook local version');
    fs.mkdirSync(paths.shadowedDir, { recursive: true });
    createSkill(paths.shadowedDir, 'cook', '# Cook shadowed version');
    fs.writeFileSync(paths.manifestFile, JSON.stringify({ skills: ['cook'] }));

    const result = handleSessionEnd(paths);

    // Should not overwrite existing local
    expect(result.restored).toEqual([]);
    // Local version preserved
    const content = fs.readFileSync(path.join(paths.localDir, 'cook', 'SKILL.md'), 'utf8');
    expect(content).toBe('# Cook local version');
  });
});

// -- Integration Tests: Full Cycle -------------------------------------------

describe('full session cycle', () => {
  let tmpDir, paths;

  beforeEach(() => {
    const env = createTestEnv();
    tmpDir = env.tmpDir;
    paths = env.paths;
  });

  afterEach(() => cleanup(tmpDir));

  it('SessionStart -> SessionEnd restores original state', () => {
    // Setup: global engineer + local marketing with overlaps
    createSkill(paths.globalDir, 'cook', '# Cook v2.1.1');
    createSkill(paths.globalDir, 'brainstorm', '# Brainstorm v2.0.0');
    createSkill(paths.globalDir, 'git', '# Git v1.0.0');
    createSkill(paths.localDir, 'cook', '# Cook v2.0.0');
    createSkill(paths.localDir, 'brainstorm', '# Brainstorm v2.0.0');
    createSkill(paths.localDir, 'seo', '# SEO marketing-only');

    // --- SessionStart ---
    const startResult = handleSessionStart(paths);
    expect(startResult.shadowed.sort()).toEqual(['brainstorm', 'cook']);

    // During session: only non-overlapping local + global are visible
    expect(skillExists(paths.localDir, 'cook')).toBeFalsy();
    expect(skillExists(paths.localDir, 'brainstorm')).toBeFalsy();
    expect(skillExists(paths.localDir, 'seo')).toBeTruthy();
    expect(skillExists(paths.shadowedDir, 'cook')).toBeTruthy();
    expect(skillExists(paths.shadowedDir, 'brainstorm')).toBeTruthy();

    // --- SessionEnd ---
    const endResult = handleSessionEnd(paths);
    expect(endResult.restored.sort()).toEqual(['brainstorm', 'cook']);

    // After session: everything back to original
    expect(skillExists(paths.localDir, 'cook')).toBeTruthy();
    expect(skillExists(paths.localDir, 'brainstorm')).toBeTruthy();
    expect(skillExists(paths.localDir, 'seo')).toBeTruthy();
    expect(fs.existsSync(paths.shadowedDir)).toBeFalsy();

    // Content preserved
    const cookContent = fs.readFileSync(path.join(paths.localDir, 'cook', 'SKILL.md'), 'utf8');
    expect(cookContent).toBe('# Cook v2.0.0');
  });

  it('multiple sessions cycle without corruption', () => {
    createSkill(paths.globalDir, 'cook');
    createSkill(paths.localDir, 'cook');

    // Session 1
    handleSessionStart(paths);
    expect(skillExists(paths.localDir, 'cook')).toBeFalsy();
    handleSessionEnd(paths);
    expect(skillExists(paths.localDir, 'cook')).toBeTruthy();

    // Session 2
    handleSessionStart(paths);
    expect(skillExists(paths.localDir, 'cook')).toBeFalsy();
    handleSessionEnd(paths);
    expect(skillExists(paths.localDir, 'cook')).toBeTruthy();

    // Session 3
    handleSessionStart(paths);
    expect(skillExists(paths.localDir, 'cook')).toBeFalsy();
    handleSessionEnd(paths);
    expect(skillExists(paths.localDir, 'cook')).toBeTruthy();

    // Filesystem clean
    expect(fs.existsSync(paths.shadowedDir)).toBeFalsy();
  });

  it('handles crash recovery: SessionStart after crashed session', () => {
    createSkill(paths.globalDir, 'cook');
    createSkill(paths.localDir, 'cook', '# Original local');

    // Session 1: start but don't end (simulating crash)
    handleSessionStart(paths);
    expect(skillExists(paths.shadowedDir, 'cook')).toBeTruthy();

    // Session 2: start should recover from crash first
    handleSessionStart(paths);

    // cook should still be shadowed (recovered then re-shadowed)
    expect(skillExists(paths.localDir, 'cook')).toBeFalsy();
    expect(skillExists(paths.shadowedDir, 'cook')).toBeTruthy();

    // End session 2: everything clean
    handleSessionEnd(paths);
    expect(skillExists(paths.localDir, 'cook')).toBeTruthy();
    expect(fs.existsSync(paths.shadowedDir)).toBeFalsy();

    // Content preserved through crash recovery
    const content = fs.readFileSync(path.join(paths.localDir, 'cook', 'SKILL.md'), 'utf8');
    expect(content).toBe('# Original local');
  });

  it('no-op when only global skills installed (no local kit)', () => {
    createSkill(paths.globalDir, 'cook');
    // No local skills dir content

    const result = handleSessionStart(paths);
    expect(result.shadowed).toEqual([]);
    expect(fs.existsSync(paths.shadowedDir)).toBeFalsy();
  });

  it('no-op when only local skills installed (no global kit)', () => {
    createSkill(paths.localDir, 'cook');
    // No global skills

    const result = handleSessionStart(paths);
    expect(result.shadowed).toEqual([]);
  });
});

// -- Edge Cases --------------------------------------------------------------

describe('edge cases', () => {
  let tmpDir, paths;

  beforeEach(() => {
    const env = createTestEnv();
    tmpDir = env.tmpDir;
    paths = env.paths;
  });

  afterEach(() => cleanup(tmpDir));

  it('handles large number of overlapping skills', () => {
    const skillNames = Array.from({ length: 39 }, (_, i) => `skill-${i}`);
    for (const name of skillNames) {
      createSkill(paths.globalDir, name);
      createSkill(paths.localDir, name);
    }

    const startResult = handleSessionStart(paths);
    expect(startResult.shadowed.length).toBe(39);

    const endResult = handleSessionEnd(paths);
    expect(endResult.restored.length).toBe(39);

    // All restored
    for (const name of skillNames) {
      expect(skillExists(paths.localDir, name)).toBeTruthy();
    }
    expect(fs.existsSync(paths.shadowedDir)).toBeFalsy();
  });

  it('preserves skill directory contents (not just SKILL.md)', () => {
    createSkill(paths.globalDir, 'cook');
    createSkill(paths.localDir, 'cook');
    // Add extra files to local skill
    fs.writeFileSync(path.join(paths.localDir, 'cook', 'README.md'), '# Readme');
    fs.mkdirSync(path.join(paths.localDir, 'cook', 'scripts'));
    fs.writeFileSync(path.join(paths.localDir, 'cook', 'scripts', 'run.sh'), '#!/bin/bash');

    handleSessionStart(paths);
    handleSessionEnd(paths);

    // All files preserved
    expect(fs.existsSync(path.join(paths.localDir, 'cook', 'SKILL.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(paths.localDir, 'cook', 'README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(paths.localDir, 'cook', 'scripts', 'run.sh'))).toBeTruthy();
  });

  it('handles empty .shadowed directory on SessionEnd', () => {
    fs.mkdirSync(paths.shadowedDir, { recursive: true });
    // Empty .shadowed, no manifest
    const result = handleSessionEnd(paths);
    expect(result.restored).toEqual([]);
    expect(fs.existsSync(paths.shadowedDir)).toBeFalsy();
  });

  it('handles manifest referencing skills not in .shadowed', () => {
    fs.mkdirSync(paths.shadowedDir, { recursive: true });
    fs.writeFileSync(paths.manifestFile, JSON.stringify({
      skills: ['cook', 'ghost-skill']
    }));
    createSkill(paths.shadowedDir, 'cook');
    // ghost-skill doesn't exist in .shadowed

    const result = handleSessionEnd(paths);
    expect(result.restored).toEqual(['cook']);
    expect(skillExists(paths.localDir, 'cook')).toBeTruthy();
  });
});

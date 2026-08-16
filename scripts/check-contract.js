#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const componentsDir = path.join(rootDir, 'src', 'components');

let violations = [];

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(rootDir, fullPath);

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      checkFile(fullPath, relPath);
    }
  }
}

function checkFile(filePath, relPath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const isCommon = relPath.includes(path.join('src', 'components', 'common'));

  lines.forEach((line, lineIdx) => {
    const lineNum = lineIdx + 1;

    // Rule 1: No inline style outside common (and only dynamic width/properties in common)
    if (!isCommon && /style\s*=\s*\{/i.test(line)) {
      violations.push({
        file: relPath,
        line: lineNum,
        rule: 'no-inline-styles',
        message: 'Inline style={{ ... }} attribute is strictly forbidden in feature views. Use Design System primitives or CSS classes.',
        snippet: line.trim()
      });
    }

    // Rule 2: No raw HTML inputs/buttons/tables outside common
    if (!isCommon) {
      if (/<\s*(button|select|textarea)\b/.test(line) || /<\s*\/(button|select|textarea)\b/.test(line)) {
        violations.push({
          file: relPath,
          line: lineNum,
          rule: 'no-raw-html-elements',
          message: 'Native <button>, <select>, <textarea> tags are strictly forbidden outside src/components/common/. Use Button, IconButton, TextField primitives.',
          snippet: line.trim()
        });
      }

      // Check for raw input tags that are not file inputs
      if (/<\s*input\b/i.test(line) && !/type\s*=\s*["']file["']/i.test(line)) {
        violations.push({
          file: relPath,
          line: lineNum,
          rule: 'no-raw-html-inputs',
          message: 'Native <input> tags are strictly forbidden outside src/components/common/. Use TextField, AccessibleCheckbox primitives.',
          snippet: line.trim()
        });
      }
    }

    // Rule 3: No hardcoded hex codes in TSX component files
    // (ignores comments or hex in string definitions if any, but flags color leaks)
    const hexMatch = line.match(/(?:color|background|borderColor|border|fill|stroke)\s*:\s*['"]#(?:[0-9a-fA-F]{3,8})['"]/);
    if (hexMatch) {
      violations.push({
        file: relPath,
        line: lineNum,
        rule: 'no-raw-hex-colors',
        message: `Hardcoded hex color "${hexMatch[0]}" is strictly forbidden. Use semantic M3 design tokens (var(--md-sys-color-*)).`,
        snippet: line.trim()
      });
    }
  });
}

console.log('🔍 Running Design System Contract Enforcement Audit on src/components/...\n');
scanDirectory(componentsDir);

if (violations.length > 0) {
  console.error(`❌ Design System Contract Violation: Found ${violations.length} error(s):\n`);
  violations.forEach((v) => {
    console.error(`  ${v.file}:${v.line}`);
    console.error(`    Rule:    ${v.rule}`);
    console.error(`    Message: ${v.message}`);
    console.error(`    Snippet: ${v.snippet}\n`);
  });
  process.exit(1);
} else {
  console.log('✅ Design System Contract Verified: 0 violations found across all components.');
  process.exit(0);
}

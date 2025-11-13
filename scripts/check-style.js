#!/usr/bin/env node

/**
 * Script de vérification du style
 * Vérifie l'absence de gradients et d'emojis
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SRC_DIR = path.join(__dirname, '../src');
const errors = [];
const warnings = [];

// Patterns à rechercher
const GRADIENT_PATTERNS = [
  /bg-gradient-to-/g,
  /from-\w+-\d+/g,
  /to-\w+-\d+/g,
  /via-\w+-\d+/g,
];

const EMOJI_PATTERN = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(SRC_DIR, filePath);
  
  // Vérifier les gradients
  GRADIENT_PATTERNS.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      const lines = content.split('\n');
      matches.forEach(match => {
        const lineNumber = content.substring(0, content.indexOf(match)).split('\n').length;
        errors.push({
          file: relativePath,
          line: lineNumber,
          type: 'gradient',
          message: `Gradient détecté: ${match}`,
          code: lines[lineNumber - 1]?.trim()
        });
      });
    }
  });
  
  // Vérifier les emojis
  const emojiMatches = content.match(EMOJI_PATTERN);
  if (emojiMatches) {
    const lines = content.split('\n');
    emojiMatches.forEach(emoji => {
      const lineNumber = content.substring(0, content.indexOf(emoji)).split('\n').length;
      errors.push({
        file: relativePath,
        line: lineNumber,
        type: 'emoji',
        message: `Emoji détecté: ${emoji}`,
        code: lines[lineNumber - 1]?.trim()
      });
    });
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Ignorer node_modules et autres dossiers
      if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
        walkDir(filePath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
      checkFile(filePath);
    }
  });
}

console.log('🔍 Vérification du style...\n');

try {
  walkDir(SRC_DIR);
  
  if (errors.length === 0) {
    console.log('✅ Aucune violation de style détectée!');
    process.exit(0);
  } else {
    console.log(`❌ ${errors.length} violation(s) de style détectée(s):\n`);
    
    // Grouper par type
    const gradients = errors.filter(e => e.type === 'gradient');
    const emojis = errors.filter(e => e.type === 'emoji');
    
    if (gradients.length > 0) {
      console.log('🚫 GRADIENTS DÉTECTÉS:\n');
      gradients.forEach(error => {
        console.log(`  ${error.file}:${error.line}`);
        console.log(`    ${error.message}`);
        console.log(`    Code: ${error.code}\n`);
      });
    }
    
    if (emojis.length > 0) {
      console.log('🚫 EMOJIS DÉTECTÉS:\n');
      emojis.forEach(error => {
        console.log(`  ${error.file}:${error.line}`);
        console.log(`    ${error.message}`);
        console.log(`    Code: ${error.code}\n`);
      });
    }
    
    console.log('\n📚 Consultez STYLE_GUIDE.md pour les règles de style.');
    process.exit(1);
  }
} catch (error) {
  console.error('Erreur lors de la vérification:', error);
  process.exit(1);
}



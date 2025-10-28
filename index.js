#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const args = process.argv.slice(2);

// Help text
const help = `
tree-gen - Generate folder structure from ASCII tree

Usage:
  tree-gen [options] [file]
  tree-gen -i | --interactive
  tree-gen --help

Options:
  -i, --interactive    Interactive mode (paste tree structure)
  -d, --dry-run       Preview without creating files/folders
  --help              Show this help message

Examples:
  tree-gen structure.txt           # Read from file
  tree-gen -i                      # Interactive mode
  tree-gen -d structure.txt        # Dry run

ASCII Tree Format:
  - Use box-drawing characters: ├── │ └──
  - Trailing slash (/) = folder
  - File extension = file
  - No extension = file

Example Tree:
  project/
  ├── src/
  │   ├── index.js
  │   └── utils.js
  └── README.md
`;

// Show help
if (args.includes('--help')) {
    console.log(help);
    process.exit(0);
}

// Parse options
const dryRun = args.includes('-d') || args.includes('--dry-run');
const interactive = args.includes('-i') || args.includes('--interactive');
const fileArg = args.find(arg => !arg.startsWith('-'));

// Parse tree structure
function parseTree(lines) {
    const structure = [];
    const stack = [{ level: -1, path: '' }];

    lines.forEach(line => {
        // Skip empty lines
        if (!line.trim()) return;

        // Calculate indentation level
        const cleanLine = line.replace(/[│├└─\s]/g, match => {
            if (match === '│' || match === '├' || match === '└' || match === '─') return '';
            return ' ';
        });

        const indent = line.search(/[^\s│├└─]/);
        if (indent === -1) return;

        // Extract name
        const name = line.trim().replace(/^[│├└─\s]+/, '').trim();
        if (!name) return;

        // Determine level (roughly based on indent)
        const level = Math.floor(indent / 2);

        // Determine if folder or file
        const isFolder = name.endsWith('/');
        const cleanName = isFolder ? name.slice(0, -1) : name;

        // Build path
        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
            stack.pop();
        }

        const parentPath = stack.length > 0 ? stack[stack.length - 1].path : '';
        const fullPath = parentPath ? path.join(parentPath, cleanName) : cleanName;

        structure.push({
            path: fullPath,
            isFolder,
            level
        });

        if (isFolder) {
            stack.push({ level, path: fullPath });
        }
    });

    return structure;
}

// Create structure
function createStructure(structure, baseDir = '.', dryRun = false) {
    const created = { folders: [], files: [] };

    structure.forEach(item => {
        const fullPath = path.join(baseDir, item.path);

        if (item.isFolder) {
            if (dryRun) {
                console.log(`[FOLDER] ${item.path}/`);
                created.folders.push(item.path);
            } else {
                if (!fs.existsSync(fullPath)) {
                    fs.mkdirSync(fullPath, { recursive: true });
                    console.log(`✓ Created folder: ${item.path}/`);
                    created.folders.push(item.path);
                } else {
                    console.log(`⊙ Folder exists: ${item.path}/`);
                }
            }
        } else {
            if (dryRun) {
                console.log(`[FILE]   ${item.path}`);
                created.files.push(item.path);
            } else {
                const dir = path.dirname(fullPath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                if (!fs.existsSync(fullPath)) {
                    fs.writeFileSync(fullPath, '');
                    console.log(`✓ Created file: ${item.path}`);
                    created.files.push(item.path);
                } else {
                    console.log(`⊙ File exists: ${item.path}`);
                }
            }
        }
    });

    return created;
}

// Interactive mode
// Interactive mode
function interactiveMode() {
    console.log('Interactive mode - Paste your ASCII tree structure.');
    console.log('Type "END" on a new line when finished, or press Ctrl+D (Unix/Mac).\n');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ''
    });

    const lines = [];
    let started = false;

    rl.on('line', (line) => {
        // Check for end command
        if (line.trim().toUpperCase() === 'END') {
            rl.close();
            return;
        }

        started = true;
        lines.push(line);
    });

    rl.on('close', () => {
        if (!started || lines.length === 0) {
            console.error('\nError: No input provided');
            process.exit(1);
        }

        console.log('\nProcessing...\n');
        const structure = parseTree(lines);

        if (structure.length === 0) {
            console.error('Error: Could not parse tree structure');
            process.exit(1);
        }

        const created = createStructure(structure, '.', dryRun);

        console.log(`\n${dryRun ? 'Preview' : 'Summary'}:`);
        console.log(`Folders: ${created.folders.length}`);
        console.log(`Files: ${created.files.length}`);

        if (dryRun) {
            console.log('\nThis was a dry run. Use without -d flag to create files/folders.');
        }
    });

    // Handle Ctrl+C
    rl.on('SIGINT', () => {
        console.log('\n\nCancelled.');
        process.exit(0);
    });
}

// File mode
function fileMode(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found: ${filePath}`);
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const structure = parseTree(lines);

    if (structure.length === 0) {
        console.error('Error: Could not parse tree structure');
        process.exit(1);
    }

    console.log(`Reading from: ${filePath}\n`);
    const created = createStructure(structure, '.', dryRun);

    console.log(`\n${dryRun ? 'Preview' : 'Summary'}:`);
    console.log(`Folders: ${created.folders.length}`);
    console.log(`Files: ${created.files.length}`);

    if (dryRun) {
        console.log('\nThis was a dry run. Use without -d flag to create files/folders.');
    }
}

// Main execution
if (interactive) {
    interactiveMode();
} else if (fileArg) {
    fileMode(fileArg);
} else {
    console.log('Error: Please provide a file or use interactive mode (-i)');
    console.log('Run "tree-gen --help" for usage information');
    process.exit(1);
}
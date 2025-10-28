# tree-gen

Generate folder and file structures from ASCII tree diagrams. Perfect for quickly scaffolding project structures from documentation or planning notes.

## Installation

Install globally via npm:
```bash
npm install -g @ipget/tree-gen
```

## Usage

### From a file
```bash
tree-gen structure.txt
```

### Interactive mode (paste directly)
```bash
tree-gen -i
# Paste your tree structure, then press Ctrl+D (Unix/Mac) or Ctrl+Z (Windows)
```

### Dry run (preview without creating)
```bash
tree-gen -d structure.txt
tree-gen -i -d
```

### Help
```bash
tree-gen --help
```

## Tree Format

tree-gen supports standard ASCII tree format with box-drawing characters:

- **Folders**: End with a trailing slash `/`
- **Files**: Have an extension or no extension
- **Box characters**: `├──`, `│`, `└──` (automatically parsed)

### Example Tree
```
project/
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── utils/
│   │   └── helpers.js
│   └── index.js
├── public/
│   └── index.html
├── package.json
└── README.md
```

### Creating this structure

Save the tree to a file `structure.txt` and run:
```bash
tree-gen structure.txt
```

Or use interactive mode:
```bash
tree-gen -i
# Paste the tree above, press Ctrl+D
```

## Output
```
✓ Created folder: project/
✓ Created folder: project/src/
✓ Created folder: project/src/components/
✓ Created file: project/src/components/Header.js
✓ Created file: project/src/components/Footer.js
✓ Created folder: project/src/utils/
✓ Created file: project/src/utils/helpers.js
✓ Created file: project/src/index.js
✓ Created folder: project/public/
✓ Created file: project/public/index.html
✓ Created file: project/package.json
✓ Created file: project/README.md

Summary:
Folders: 5
Files: 7
```

## Options

| Option | Description |
|--------|-------------|
| `-i`, `--interactive` | Enter interactive mode to paste tree structure |
| `-d`, `--dry-run` | Preview the structure without creating files/folders |
| `--help` | Show help message |

## Features

- ✅ Zero dependencies (only Node.js built-ins)
- ✅ Works with standard ASCII tree format
- ✅ Automatically detects folders (trailing `/`) and files
- ✅ Creates nested directory structures
- ✅ Skips existing files/folders
- ✅ Dry-run mode for safe previewing
- ✅ Interactive mode for pasting trees directly
- ✅ Cross-platform (Windows, Mac, Linux)

## Tips

1. **Copy from documentation**: Many projects display their structure as ASCII trees - copy and paste directly!

2. **Generate from tree command**: On Unix systems, you can use the `tree` command output:
```bash
   tree -F > structure.txt
   tree-gen structure.txt
```

3. **Mix files and folders**: Files can have extensions, no extensions, or be explicitly marked

4. **Flexible formatting**: Works with various indentation styles and box characters

## Examples

### Simple project structure
```
app/
├── src/
│   └── main.js
└── tests/
    └── test.js
```

### Frontend project
```
my-app/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── App.js
│   ├── index.js
│   └── styles.css
├── package.json
└── README.md
```

### API project
```
api/
├── controllers/
│   ├── userController.js
│   └── authController.js
├── models/
│   └── User.js
├── routes/
│   └── api.js
├── config/
│   └── database.js
├── server.js
└── .env
```

## Requirements

- Node.js >= 14.0.0

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/ofthenorth/tree-gen).

## Author

Of the North

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/ofthenorth/tree-gen/issues).
```

## **Publishing to npm**

### 1. Update package.json

Replace `yourusername` with your actual GitHub username and update the author field.

### 2. Create .gitignore
```
node_modules/
.DS_Store
*.log
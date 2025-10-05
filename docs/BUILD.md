# Build Instructions for Windows Portable Application

## Prerequisites

### On Linux (Cross-compilation)
1. Install Rust:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source "$HOME/.cargo/env"
   ```

2. Add Windows target:
   ```bash
   rustup target add x86_64-pc-windows-gnu
   ```

3. Install MinGW-w64 for cross-compilation:
   ```bash
   sudo apt update
   sudo apt install -y mingw-w64
   ```

4. Install Node.js and dependencies:
   ```bash
   npm install
   ```

## Build Commands

### Build Windows Executable (Cross-compile from Linux)
```bash
npm run build:windows
```

### Build Portable Package
```bash
npm run build:portable
```

This will create:
- `dist-windows/kas-sekolah.exe` - Main executable
- `dist-windows/WebView2Loader.dll` - Required WebView2 library  
- `dist-windows/README.txt` - Usage instructions
- `kas-sekolah-portable-windows-x64.zip` - Complete portable package

## Build Output

### Executable Details
- **Target**: x86_64-pc-windows-gnu
- **Size**: ~24MB (executable) + ~156KB (DLL)
- **Compressed**: ~12MB (ZIP package)
- **Window Style**: Custom overlay titlebar, borderless design

### System Requirements for End Users
- Windows 10/11 (x64 architecture)
- WebView2 Runtime (pre-installed on Windows 11)
- No additional installation required

### Features
- Portable unpacked application (no installer needed)
- Custom window decorations with overlay titlebar
- Modern borderless UI design
- Cross-compiled from Linux to Windows

## Configuration Files

### Tauri Configuration (`src-tauri/tauri.conf.json`)
- Bundle identifier: `com.kassekolah.app` 
- Product name: `kas-sekolah`
- Frontend dist: `../dist` (Vite output)
- Dev URL: `http://localhost:5173` (Vite dev server)

### Cross-compilation Configuration (`.cargo/config.toml`)
```toml
[target.x86_64-pc-windows-gnu]
linker = "x86_64-w64-mingw32-gcc"
ar = "x86_64-w64-mingw32-ar"
```

## Development Workflow

1. **Development**: `npm run dev` - Runs Tauri dev server with hot reload
2. **Frontend only**: `npm run dev:vite` - Runs Vite dev server only
3. **Lint**: `npm run lint` - Runs ESLint
4. **Build for Windows**: `npm run build:portable` - Creates portable Windows package

## Notes

- Cross-compilation from Linux to Windows works for the executable but Windows-specific bundles (MSI, NSIS) are not available
- The portable package includes all necessary files for running on Windows without installation
- WebView2 is required for the application to run - it's usually pre-installed on modern Windows systems
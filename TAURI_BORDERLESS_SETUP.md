# Tauri Borderless Window Setup

## Configuration Applied

### 1. Tauri Configuration (`src-tauri/tauri.conf.json`)
```json
{
  "app": {
    "windows": [
      {
        "title": "kas-sekolah",
        "width": 1200,
        "height": 800,
        "resizable": true,
        "fullscreen": false,
        "decorations": false,
        "titleBarStyle": "Overlay",
        "maximized": true,
        "minWidth": 800,
        "minHeight": 600
      }
    ]
  }
}
```

### 2. Rust Backend Commands (`src-tauri/src/lib.rs`)
```rust
// Custom Tauri commands for window management
#[tauri::command]
fn minimize_window(window: tauri::Window) { window.minimize().unwrap(); }

#[tauri::command]
fn maximize_window(window: tauri::Window) { window.maximize().unwrap(); }

#[tauri::command]
fn unmaximize_window(window: tauri::Window) { window.unmaximize().unwrap(); }

#[tauri::command]
fn close_window(window: tauri::Window) { window.close().unwrap(); }
```

### 3. Navbar Window Controls (`src/layout/Navbar.jsx`)
- Window controls integrated into existing navbar design
- Located in right section with visual grouping
- Includes: Minimize, Maximize/Restore, and Close buttons
- Proper drag regions and error handling
- Enhanced debugging and fallback methods

## Features

✅ **Borderless Window**: No system title bar or window decorations
✅ **Custom Window Controls**: Minimize, maximize/restore, close buttons in navbar
✅ **Draggable Area**: Entire navbar acts as drag region (except interactive elements)
✅ **Window State Management**: Real-time window state tracking
✅ **Responsive Design**: Controls adapt to window state (maximized/restored)
✅ **Default Maximized**: App starts in maximized mode
✅ **Fallback Commands**: Custom Rust commands as backup for API failures
✅ **Enhanced Debugging**: Comprehensive logging for troubleshooting

## Window Controls Functionality

### Button Functions:
1. **Minimize**: Minimizes window to taskbar
2. **Maximize/Restore**: Toggles between maximized and restored state
3. **Close**: Closes application completely

### Error Handling:
- Primary: Uses Tauri window API directly
- Fallback: Uses custom Rust commands via `invoke()`
- Last Resort: Browser-based methods (for close only)

## Testing

### In Tauri App:
```bash
npm run dev
# or
tauri dev
```

### Debug Mode (Browser):
Add `?debug-tauri` to URL to force show window controls:
```
http://localhost:5173/?debug-tauri
```

### Manual Testing Checklist:
- [ ] App starts in maximized mode
- [ ] Window controls visible in navbar (right side)
- [ ] Minimize button works (window to taskbar)
- [ ] Maximize/Restore button works (toggle state)
- [ ] Close button works (app closes)
- [ ] Drag functionality works (click navbar background)
- [ ] Window state icons update correctly
- [ ] No console errors during operations

## Troubleshooting

### Common Issues:
1. **Controls not visible**: Check browser console for Tauri detection logs
2. **Controls not working**: Check console for error messages
3. **App not maximized on start**: Check Rust setup code execution

### Console Logs:
Enable debug mode and check browser console for:
- Tauri detection results
- Window state changes
- Button click events
- Error messages

## Migration Notes

- ✅ Removed dependency on Electron `electronAPI`
- ✅ TitleBar component (`src/components/TitleBar.jsx`) no longer used
- ✅ All window management through Tauri APIs in navbar
- ✅ Maintains existing navbar functionality and styling
- ✅ Added robust error handling and fallback methods
- ✅ Enhanced visual design for window controls
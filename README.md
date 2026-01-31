# Lively Wallpaper Effect - Worms

This project creates a generative "Worm" wallpaper for [Lively Wallpaper](https://github.com/rocksdanister/lively).

## Project Structure
- `LivelyWorms/`: Contains the source code (HTML, CSS, JS) and configuration.
- `install_wallpaper.ps1`: PowerShell script to install the wallpaper to the Lively library.

## Development Workflow

### Agent Instructions
**IMPORTANT:** After making ANY changes to the code (JavaScript, CSS, JSON, etc.), you **MUST** run the installation script to deploy the changes to Lively Wallpaper.

Run the following command in the terminal:
```powershell
powershell -ExecutionPolicy Bypass -File install_wallpaper.ps1
```

This ensures that the user can immediately see the changes in Lively Wallpaper without manual copying.

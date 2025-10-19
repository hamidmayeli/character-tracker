#!/bin/bash

echo "🚀 Setting up Character Tracker development environment..."

# Install pnpm using the official installer (doesn't require sudo)
echo "📦 Installing pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm via curl..."
    curl -fsSL https://get.pnpm.io/install.sh | sh -
    
    # Add pnpm to PATH for current session
    export PNPM_HOME="/home/node/.local/share/pnpm"
    export PATH="$PNPM_HOME:$PATH"
    
    # Add to shell profile for future sessions
    echo 'export PNPM_HOME="/home/node/.local/share/pnpm"' >> ~/.bashrc
    echo 'export PATH="$PNPM_HOME:$PATH"' >> ~/.bashrc
    
    if [ -f ~/.zshrc ]; then
        echo 'export PNPM_HOME="/home/node/.local/share/pnpm"' >> ~/.zshrc
        echo 'export PATH="$PNPM_HOME:$PATH"' >> ~/.zshrc
    fi
else
    echo "pnpm is already installed"
fi

# Install dependencies
echo "📥 Installing project dependencies..."
# Ensure pnpm is in PATH
export PNPM_HOME="/home/node/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"
pnpm install

# Create a .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    echo "# Character Tracker Environment Variables
VITE_APP_TITLE=Character Tracker
VITE_APP_VERSION=1.0.0" > .env
fi

# Set git safe directory (for when workspace is mounted)
echo "🔧 Configuring git..."
git config --global --add safe.directory /workspaces/character-tracker

echo "✅ Development environment setup complete!"
echo ""
echo "Available commands:"
echo "  pnpm dev     - Start development server"
echo "  pnpm build   - Build for production"
echo "  pnpm lint    - Run ESLint"
echo "  pnpm preview - Preview production build"
echo ""
echo "Happy coding! 🎉"

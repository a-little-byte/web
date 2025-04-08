#!/bin/bash

set -e

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  OS="Linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
  OS="macOS"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
  OS="Windows"
else
  echo "Could not determine your operating system. Assuming Linux-compatible environment."
  OS="Linux"
fi

echo "Detected OS: $OS"

check_dependencies() {
  echo "Checking for required dependencies..."

  local missing_deps=()

  for cmd in git python3 cmake; do
    if ! command -v $cmd &>/dev/null; then
      missing_deps+=($cmd)
    fi
  done

  if [ ${#missing_deps[@]} -ne 0 ]; then
    echo "Missing required dependencies: ${missing_deps[*]}"

    case $OS in
    "Linux")
      echo "Install them using your package manager:"
      echo "  Debian/Ubuntu: sudo apt-get install ${missing_deps[*]}"
      echo "  Fedora: sudo dnf install ${missing_deps[*]}"
      echo "  Arch: sudo pacman -S ${missing_deps[*]}"
      ;;
    "macOS")
      echo "Install them using Homebrew:"
      echo "  brew install ${missing_deps[*]}"
      ;;
    "Windows")
      echo "Install Git for Windows from https://git-scm.com/download/win"
      echo "Install Python from https://www.python.org/downloads/"
      echo "Install CMake from https://cmake.org/download/"
      ;;
    esac

    exit 1
  fi

  echo "All required dependencies are installed."
}

install_emscripten() {
  echo "Installing Emscripten..."

  EMSDK_DIR="$HOME/emsdk"

  if [ ! -d "$EMSDK_DIR" ]; then
    echo "Cloning emsdk repository..."
    git clone https://github.com/emscripten-core/emsdk.git "$EMSDK_DIR"
  else
    echo "emsdk repository already exists, updating..."
    cd "$EMSDK_DIR"
    git pull
  fi

  cd "$EMSDK_DIR"

  echo "Installing latest Emscripten SDK..."
  ./emsdk install latest

  echo "Activating latest Emscripten SDK..."
  ./emsdk activate latest

  if [[ "$SHELL" == */bash ]]; then
    if [[ "$OS" == "macOS" ]]; then
      SHELL_PROFILE="$HOME/.bash_profile"
    else
      SHELL_PROFILE="$HOME/.bashrc"
    fi
  elif [[ "$SHELL" == */zsh ]]; then
    SHELL_PROFILE="$HOME/.zshrc"
  else
    echo "Error: unknown shell"
    echo 'source "$HOME/emsdk/emsdk_env.sh"'
    return
  fi
}

verify_installation() {
  echo "Verifying installation..."

  source "$HOME/emsdk/emsdk_env.sh"

  if command -v emcc &>/dev/null; then
    EMCC_VERSION=$(emcc --version | head -n 1)
    echo "Emscripten is installed successfully: $EMCC_VERSION"
  else
    echo "Emscripten installation failed. 'emcc' command not found."
    exit 1
  fi
}

main() {
  check_dependencies
  install_emscripten
  configure_environment
  verify_installation

  echo "INSTALL SUCCSESSFUL"
  echo "1. Open a new terminal window or restart your current terminal"
  echo "2. Run: source \$HOME/emsdk/emsdk_env.sh"
  echo ""
}

main

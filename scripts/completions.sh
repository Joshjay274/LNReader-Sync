#!/bin/bash

# Enable tab completion for common tasks

# Source this file in your shell profile to enable completions
# Add to ~/.bashrc or ~/.zshrc:
# source scripts/completions.sh

# Common npm commands
alias nb='npm start'
alias nbuild='bash scripts/local-build.sh'
alias ninstall='bash scripts/quick-install.sh'
alias nandroid='npm run android'
alias ntest='bash scripts/test.sh'
alias nlint='npm run lint'
alias nformat='npm run format'

# Common adb commands
alias adb-devices='adb devices -l'
alias adb-logs='adb logcat | grep com.lnreadersync'
alias adb-clear='adb shell pm clear com.lnreadersync'
alias adb-uninstall='adb uninstall com.lnreadersync'
alias adb-shell='adb shell'

# Android-specific
alias android-studio='open -a "Android Studio" .'
alias android-emulator='emulator -avd'
alias android-devices='emulator -list-avds'

# Git commands
alias gs='git status'
alias ga='git add .'
alias gc='git commit -m'
alias gp='git push'
alias gpl='git pull'

echo "Aliases loaded! Use: nbuild, nandroid, ntest, etc."

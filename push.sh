#!/bin/bash
#Wystarczy wpisać ./push.sh

echo "🚀 Rozpoczynam wysyłanie zmian na GitHub..."

# 1. Dodawanie plików do gita
echo "📦 Dodawanie zmian do systemu kontroli wersji..."
git add .

# 2. Tworzenie commitu
COMMIT_MSG="Szybka aktualizacja projektu: $(date +'%Y-%m-%d %H:%M')"
git commit -m "$COMMIT_MSG"

# 3. Wysyłanie na serwer ( -u ustawia upstream przy pierwszym pushu na gałąź )
echo "⬆️ Wypychanie zmian na GitHub..."
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if ! git push -u origin "$BRANCH"; then
    echo "❌ Błąd podczas wysyłania na GitHub. Sprawdź połączenie lub status repozytorium."
    exit 1
fi

echo "✅ Gotowe! Zmiany zostały zsynchronizowane z GitHubem."

#!/bin/bash
# PDF-Werkstatt starten – Doppelklick im Finder genügt.
cd "$(dirname "$0")" || exit 1

if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 wurde nicht gefunden."
  echo "Installiere es mit:  xcode-select --install   (oder: brew install python)"
  read -r -p "Enter zum Schliessen …"
  exit 1
fi

if [ ! -x .venv/bin/python ]; then
  echo "Erster Start – richte die PDF-Werkstatt ein (dauert 1–2 Minuten) …"
  python3 -m venv .venv || { read -r -p "Fehler beim Anlegen der Umgebung. Enter …"; exit 1; }
fi

if [ ! -f .venv/.installed ] || [ requirements.txt -nt .venv/.installed ]; then
  .venv/bin/python -m pip install --quiet --upgrade pip
  if .venv/bin/python -m pip install --quiet -r requirements.txt; then
    touch .venv/.installed
  else
    echo "Installation der Pakete fehlgeschlagen (Internetverbindung?)."
    read -r -p "Enter zum Schliessen …"
    exit 1
  fi
fi

exec .venv/bin/python app.py

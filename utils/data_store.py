"""
utils/data_store.py
-------------------
Lightweight JSON-based persistence helpers.
No database required — data lives in data/ as .json files.
"""

import json
import os
from datetime import datetime
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

PROFILES_FILE = DATA_DIR / "user_profiles.json"
HISTORY_FILE  = DATA_DIR / "chat_history.json"


# ── Internal helpers ─────────────────────────────────────────────────────────

def _load(path: Path) -> dict | list:
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def _save(path: Path, data: dict | list) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


# ── User profile ─────────────────────────────────────────────────────────────

def save_profile(session_id: str, profile: dict) -> None:
    """Persist a user's profile keyed by session_id."""
    profiles = _load(PROFILES_FILE)
    profiles[session_id] = {**profile, "updated_at": datetime.utcnow().isoformat()}
    _save(PROFILES_FILE, profiles)


def load_profile(session_id: str) -> dict:
    """Return profile dict or empty dict if not found."""
    profiles = _load(PROFILES_FILE)
    return profiles.get(session_id, {})


# ── Chat history ─────────────────────────────────────────────────────────────

def append_message(session_id: str, role: str, content: str) -> None:
    """Append a single chat message to the session history."""
    history = _load(HISTORY_FILE)
    if session_id not in history:
        history[session_id] = []
    history[session_id].append({
        "role": role,
        "content": content,
        "ts": datetime.utcnow().isoformat(),
    })
    _save(HISTORY_FILE, history)


def load_history(session_id: str) -> list[dict]:
    """Return list of {role, content, ts} dicts for the session."""
    history = _load(HISTORY_FILE)
    return history.get(session_id, [])


def clear_history(session_id: str) -> None:
    history = _load(HISTORY_FILE)
    history.pop(session_id, None)
    _save(HISTORY_FILE, history)

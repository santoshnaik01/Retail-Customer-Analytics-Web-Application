import pandas as pd

from app.config import DATA_DIR

_state = {"original": None, "cleaned": None, "filename": None}


def save_original(df, filename):
    """Keep the uploaded data exactly as received."""
    _state["original"] = df.copy()
    _state["cleaned"] = None
    _state["filename"] = filename


def get_original():
    return _state["original"]


def save_cleaned(df):
    _state["cleaned"] = df.copy()


def get_cleaned():
    return _state["cleaned"]


def get_filename():
    return _state["filename"]


def load_default():
    """Load the first CSV in the data folder so the app has a dataset at start."""
    try:
        csv_files = sorted(DATA_DIR.glob("*.csv"))
        if not csv_files:
            return False
        save_original(pd.read_csv(csv_files[0]), csv_files[0].name)
        return True
    except Exception:
        return False
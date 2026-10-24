_state = {"original": None, "filename": None}


def save_original(df, filename):
    """Keep the uploaded data exactly as received."""
    _state["original"] = df.copy()
    _state["filename"] = filename


def get_original():
    return _state["original"]


def get_filename():
    return _state["filename"]
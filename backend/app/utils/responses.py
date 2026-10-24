def success_response(data=None, message="OK"):
    return {"status": "success", "data": data, "message": message}


def error_response(code, message):
    return {"status": "error", "error": {"code": code, "message": message}}
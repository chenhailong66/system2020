from aiohttp import web
from cryptography.fernet import InvalidToken
from cryptography.fernet import Fernet
from .config import db_block, web_routes, render_html

secret_key = Fernet.generate_key()
print(f"Generated Secure Key: {secret_key}")
fernet = Fernet(secret_key)

stu_passwords = {"s101": "123"}
tec_passwords = {"t100":"456"}

@web_routes.get("/")
async def main(request):
    return render_html(request, 'login.html')

@web_routes.post("/login")
async def handle_login(request):
    parmas = await request.post()
    username = parmas.get("username")
    password = parmas.get("password")

    if stu_passwords.get(username) == password:
        resp = web.HTTPFound('/stu_base')
        set_secure_cookie(resp, "session_id", username)
        return resp
    elif tec_passwords.get(username) == password:
        resp = web.HTTPFound('/tec_base')
        set_secure_cookie(resp, "session_id", username)
        return resp
    else:    
        raise web.HTTPFound('/')
    

@web_routes.post("/logout")
async def handle_logout(request):
    resp = web.HTTPFound('/')
    resp.del_cookie("session_id")
    raise resp


def get_current_user(request):
    user_id = get_secure_cookie(request, "session_id")
    return user_id


def get_secure_cookie(request, name):
    value = request.cookies.get(name)
    if value is None:
        return None

    try:
        buffer = value.encode('utf-8')
        buffer = fernet.decrypt(buffer)
        secured_value = buffer.decode('utf-8')
        return secured_value
    except InvalidToken:
        print("Cannot decrypt cookie value")
        return None


def set_secure_cookie(response, name, value, **kwargs):
    value = fernet.encrypt(value.encode('utf-8')).decode('utf-8')
    response.set_cookie(name, value, **kwargs)
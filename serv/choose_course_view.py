from aiohttp import web
from aiohttp.web_request import Request
from .config import db_block, web_routes, render_html
from .auth import*

@web_routes.get("/choose_course")
async def view_student_list(request):
    user = get_current_user(request)
    user = user[1:]
    return render_html(request,'choose_course.html',user=user)
from aiohttp import web
from .config import db_block, web_routes, render_html


@web_routes.get("/stu_base")
async def view_student_list(request):
    return render_html(request, 'student_base.html')


@web_routes.get("/tec_base")
async def view_student_list(request):
    return render_html(request, 'teacher_base.html')

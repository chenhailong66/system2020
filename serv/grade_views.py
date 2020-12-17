from aiohttp import web
from .config import db_block, web_routes, render_html
from .auth import*

@web_routes.get("/grade")
async def view_list_grades(request):

    user = get_current_user(request)
    user = user[1:]

    with db_block() as db:
        db.execute("""
        SELECT sn AS stu_sn, name as stu_name FROM student ORDER BY name
        """)
        students = list(db)

        db.execute("""
        SELECT sn AS cou_sn, name as cou_name FROM course ORDER BY name
        """)
        courses = list(db)

    return render_html(request, 'grade_list.html',
                       courses=courses,
                       user = user)
import datetime
from aiohttp import web
from dataclasses import asdict
from serv.json_util import json_dumps

from .config import db_block, web_routes,render_html


@web_routes.get("/api/grade/list")
async def get_grade_list(request):
    with db_block() as db:
        db.execute("""
        select student.name as stu_name,stu_sn,cou_sn,course.name as cou_name,grade
        from course,student,course_grade,courseplan
        where student.sn = course_grade.stu_sn and course_grade.courseplan_sn = courseplan.sn
        and courseplan.cou_sn = course.sn
        order by cou_name;
        """)
        data = list(asdict(r) for r in db)
        for item in data:
            item["grade"] = int(item["grade"])

    return web.Response(text=json_dumps(data), content_type="application/json")

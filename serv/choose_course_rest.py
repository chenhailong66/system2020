import datetime
from aiohttp import web
from dataclasses import asdict
from serv.json_util import json_dumps

from .config import db_block, web_routes,render_html

@web_routes.get("/api/course/list")
async def get_courseplan_list(request):
    with db_block() as db:
        db.execute("""
        SELECT courseplan.sn as courseplan_sn, name,no,place,time,term
        FROM course,courseplan
        where course.sn = courseplan.cou_sn
        order by name,courseplan_sn;  
        """)
        data = list(asdict(r) for r in db)

    return web.Response(text=json_dumps(data), content_type="application/json")

@web_routes.get("/api/course/{courseplan_sn:\d+}")
async def get_courseplan_list(request):
    courseplan_sn = request.match_info.get("courseplan_sn")
    with db_block() as db:
        db.execute("""
        select stu_sn
        from course_grade
        where courseplan_sn = %(courseplan_sn)s;
        """,dict(courseplan_sn = courseplan_sn))
        data = list(asdict(r) for r in db)

    return web.Response(text=json_dumps(data), content_type="application/json")


@web_routes.post("/api/course/choose_course")
async def new_courseplan(request):
    choose_course = await request.json()
    choose_course['stu_sn'] = int(choose_course['stu_sn'])
    choose_course['courseplan_sn'] = int(choose_course['courseplan_sn'])
    #将传入数据中的课程名，改成课程序号
    with db_block() as db:
        db.execute("""
        INSERT INTO course_grade (stu_sn, courseplan_sn, grade)
        VALUES(%(stu_sn)s, %(courseplan_sn)s,%(grade)s)
        """, choose_course)
    return web.Response(text=json_dumps(choose_course), content_type="application/json")


#学生选课取消按钮
@web_routes.delete("/api/course/{stu_sn:\d+}/{courseplan_sn:\d+}")
async def delete_choose_course(request):
    stu_sn = int(request.match_info.get("stu_sn"))
    courseplan_sn = int(request.match_info.get("courseplan_sn"))
    with db_block() as db:
        db.execute("""
        DELETE FROM course_grade WHERE stu_sn=%(stu_sn)s and courseplan_sn = %(courseplan_sn)s;
        """, dict(stu_sn = stu_sn,courseplan_sn = courseplan_sn))
    return web.Response(text='', content_type="text/plain")

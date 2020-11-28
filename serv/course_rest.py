import datetime
from aiohttp import web
from dataclasses import asdict
from serv.json_util import json_dumps

from .config import db_block, web_routes,render_html


#读入所有课程计划的数据
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


@web_routes.post("/api/course")
async def new_courseplan(request):
    course = await request.json()
    #将传入数据中的课程名，改成课程序号
    with db_block() as db:
        db.execute("""
        select sn
        from course
        where name = %(cou_name)s
        """, dict(cou_name = course['name']))
        record = db.fetch_first()
    course['name'] = record.sn

    with db_block() as db:
        db.execute("""
        INSERT INTO courseplan (cou_sn,term,place,time)
        VALUES(%(name)s, %(term)s, %(place)s,%(time)s) RETURNING sn;
        """, course)
        record = db.fetch_first()


    return web.Response(text=json_dumps(course), content_type="application/json")

@web_routes.put("/api/course/{courseplan_sn:\d+}")
async def update_courseplan(request):
    courseplan_sn= request.match_info.get("courseplan_sn")
    course = await request.json()
    #赋予的值为课程名，将课程名转为课程号
    with db_block() as db:
        db.execute("""
        select sn
        from course
        where name = %(cou_name)s
        """, dict(cou_name = course['name']))
        record = db.fetch_first()

    course['name'] = record.sn

    with db_block() as db:
        db.execute("""
        UPDATE courseplan SET
            cou_sn=%(name)s, term=%(term)s, place=%(place)s, time=%(time)s
        WHERE sn=%(courseplan_sn)s;
        """, course)

    return web.Response(text=json_dumps(course), content_type="application/json")

@web_routes.delete("/api/course/{courseplan_sn:\d+}")
async def delete_courseplan(request):
    courseplan_sn = request.match_info.get("courseplan_sn")
    with db_block() as db:
        db.execute("""
        DELETE FROM courseplan WHERE sn=%(courseplan_sn)s;
        """, dict(courseplan_sn = courseplan_sn))

    return web.Response(text="", content_type="text/plain")

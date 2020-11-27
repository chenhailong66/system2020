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

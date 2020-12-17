from aiohttp import web

from serv.config import web_routes, home_path

import serv.auth
import serv.main_views
import serv.grade_views
import serv.grade_rest
import serv.student_views
import serv.student_rest
import serv.choose_course_view
import serv.choose_course_rest
import serv.course_view
import serv.course_rest


app = web.Application()
app.add_routes(web_routes)
app.add_routes([web.static("/", home_path / "static")])

if __name__ == "__main__":
    web.run_app(app, port=8080)

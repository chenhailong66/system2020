DROP TABLE IF EXISTS student;
CREATE TABLE IF NOT EXISTS student  (
    sn       INTEGER,     --序号
    no       VARCHAR(10), --学号
    name     TEXT,        --姓名
    gender   CHAR(1),     --性别(F/M/O)
    enrolled DATE,        --入学时间
    PRIMARY KEY(sn)
);

-- 给sn创建一个自增序号
CREATE SEQUENCE seq_student_sn 
    START 10000 INCREMENT 1 OWNED BY student.sn;
ALTER TABLE student ALTER sn 
    SET DEFAULT nextval('seq_student_sn');
-- 学号唯一
CREATE UNIQUE INDEX idx_student_no ON student(no);

-- === 课程表
DROP TABLE IF EXISTS course;
CREATE TABLE IF NOT EXISTS course  (
    sn       INTEGER,     --序号
    no       VARCHAR(10), --课程号
    name     TEXT,        --课程名称
    PRIMARY KEY(sn)
);
CREATE SEQUENCE seq_course_sn 
    START 10000 INCREMENT 1 OWNED BY course.sn;
ALTER TABLE course ALTER sn 
    SET DEFAULT nextval('seq_course_sn');
CREATE UNIQUE INDEX idx_course_no ON course(no);



   

--课程计划表
DROP TABLE IF EXISTS courseplan;
CREATE TABLE IF NOT EXISTS  courseplan (
    sn           INTEGER,         --序号
    cou_sn       INTEGER,         --课程序号
    term         TEXT,            --所在学期
    place        TEXT,           --上课地点
    time         TEXT,            --上课时间      
    PRIMARY KEY(sn)
);

-- 给sn创建一个自增序号
CREATE SEQUENCE seq_courseplan_sn 
    START 10000 INCREMENT 1 OWNED BY courseplan.sn;
ALTER TABLE courseplan ALTER sn 
    SET DEFAULT nextval('seq_courseplan_sn');
--设置外键
ALTER TABLE courseplan 
    ADD CONSTRAINT cou_sn_fk FOREIGN KEY (cou_sn) REFERENCES course(sn);


--课程表
DROP TABLE IF EXISTS course_grade;
CREATE TABLE IF NOT EXISTS course_grade  (
    stu_sn INTEGER,            -- 学生序号
    courseplan_sn INTEGER,     -- 课程计划序号
    grade  NUMERIC(5,2),       -- 最终成绩
    PRIMARY KEY(stu_sn, courseplan_sn)
);

ALTER TABLE course_grade 
    ADD CONSTRAINT stu_sn_fk FOREIGN KEY (stu_sn) REFERENCES student(sn);
ALTER TABLE course_grade
    ADD CONSTRAINT courseplan_sn_fk FOREIGN KEY (courseplan_sn) REFERENCES courseplan(sn);


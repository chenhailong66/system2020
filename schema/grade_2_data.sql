DELETE FROM courseplan;
DELETE FROM course_grade2;
DELETE FROM course_grade;
DELETE FROM course;
DELETE FROM student;


INSERT INTO student (sn, no, name)  VALUES
    (101, 'S001',  '张三'),
    (102, 'S002',  '李四'), 
    (103, 'S003',  '王五'),
    (104, 'S004',  '马六');

INSERT INTO course (sn, no, name)  VALUES 
    (101, 'C01',  '高数'), 
    (102, 'C02',  '外语'),
    (103, 'C03',  '线代');

INSERT INTO courseplan (sn, cou_sn,term, place, time)  VALUES 
    (101, 101,'2020-2021','一公教A311','周三第一大节'), 
    (102, 102,'2020-2021','一公教B211','周一第四大节'),
    (103, 103,'2020-2021','二公教C111','周一第二大节'),
    (104, 101,'2019-2020','二公教A321','周五第三大节');

INSERT INTO course_grade2 (stu_sn, courseplan_sn, grade)  VALUES 
    (101, 101,  91), 
    (102, 103,  89),
    (103, 104,  90),
    (101, 102,  89);

INSERT INTO course_grade (stu_sn, cou_sn, grade)  VALUES 
    (101, 101,  91), 
    (102, 101,  89),
    (103, 101,  90),
    (101, 102,  89);

    
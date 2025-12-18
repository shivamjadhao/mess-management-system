# using flask_restful
from flask import Flask, render_template
from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from flask_mysqldb import MySQL
from datetime import datetime
from password import password
from flask_cors import CORS
import threading
lock = threading.Lock()


# creating the flask app
app = Flask(__name__, template_folder='templates')
cors = CORS(app, resources={r"/*": {"origins": "*"}})
# creating an API object
api = Api(app)
# CORS_SUPPORTS_CREDENTIALS=True
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = password
app.config['MYSQL_DB'] = 'mess_management'
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['CORS_SUPPORTS_CREDENTIALS'] = True

mysql = MySQL(app)


def return_current_day_slot():
    dt = datetime.now()
    day = dt.strftime('%A').lower()
    # print(day)
    hour = dt.hour
    if(hour < 12):
        slot = "breakfast"
    elif(hour < 4):
        slot = "lunch"
    elif(hour < 6):
        slot = "snacks"
    else:
        slot = "dinner"
    return {"slot": slot, "Day": day}


def return_current_date_slot():
    today = datetime.now()
    date = today.strftime('%Y-%m-%d')
    slot = return_current_day_slot()['slot']
    return {'date': date, 'slot': slot}


class temp(Resource):

    def get(self, mess_id=1):
        cursor = mysql.connection.cursor()
        dayslotno = return_current_day_slot()
        dateslotno = return_current_date_slot()
        day = 'tuesday'
        date = '2023-01-02'
        slot = 'breakfast'

        cursor.execute(
            'select dayslot_id from `day_slot` where day_sl = "{}" and slot = "{}"'.format(day, slot))
        dayslot = cursor.fetchone()[0]

        #print("dayslot", dayslot)

        cursor.execute(
            "select mi.item_name, mi.price, mi.is_special from `mess_item` as mi, `menu` as m where m.dayslot_id = %s and m.item_id = mi.item_id", [dayslot])
        menu = cursor.fetchall()

        cursor.execute(
            "select contractor_name from contractor_manages where mess_id = %s", [mess_id])

        contractor = cursor.fetchall()

        cursor.execute(
            "select star_rating, comment from feedback_received where mess_id = %s", [mess_id])

        feedback = cursor.fetchall()

        cursor.execute(
            'select date_slot_id from `date_slot` where date = "{}" and slot = "{}"'.format(date, slot))
        dateslot = cursor.fetchone()[0]
        cursor.execute(
            "select food_wasted from wastage where mess_id = %s and date_slot_id = %s", [mess_id, dateslot])

        wastage = cursor.fetchone()[0]

        cursor.execute(
            "select quantity, type from inventory_present_at where mess_id = %s", [mess_id])

        inventory1 = cursor.fetchall()
        inventory = []
        for i in range(len(inventory1)):
            inventory.append((inventory1[i][0], inventory1[i][1]))

        # print(inventory)
        # print(inventory[0][0])
        inventory_list = []
        for item in inventory:
            inventory_list.append((float(item[0]), item[1]))
        # print(inventory_list)

        # , 'inventory': inventory})
        cursor.execute(
            "select product_id,quantity,in_date,expiry from stock_contains where mess_id = %s", [mess_id])

        stock = cursor.fetchall()
        cursor.close()
        stock_list = []
        # for item in stock:

        # print(stock)

        return jsonify({'menu': menu, 'contractor': contractor, 'feedback': feedback, 'wastage': str(wastage), 'inventory': str(inventory_list)})


class mess(Resource):  # /api/messes

    def get(self):
        cursor = mysql.connection.cursor()

        cursor.execute(
            'select mess_id,mess_name, num_of_employee, number_of_student from `mess`')

        mess_list = cursor.fetchall()
        print(mess_list)
        return_obj = []
        for item in mess_list:
            cursor.execute(
                'select count(*) from `student_allocated` where mess_id=%s', [item[0]])
            num_students = cursor.fetchone()[0]
            # print("Number of students:",num_students)

            cursor.execute(
                'select count(*) from `employee_works` where mess_id=%s', [item[0]])
            num_emps = cursor.fetchone()[0]
            # print("Number of employees:",num_emps)

            d = {"Mess Id": item[0], "Mess Name": item[1],
                 "Num of Employee": num_emps, "No. of Student": num_students}
            return_obj.append(d)
        cursor.close()

        return jsonify(return_obj)


class return_auth(Resource):  # /api/return_auth?email=W_EM_1@gmail.com

    def get(self):
        email = request.args.get('email')
        cursor = mysql.connection.cursor()
        print("Email:", email)
        cursor.execute(
            "SELECT EXISTS(SELECT * FROM student_allocated WHERE email=%s)", [email])
        output = cursor.fetchone()[0]
        # print("STUDENT OUTPUT:",output)
        if(output == 1):
            return jsonify("Student")

        cursor.execute(
            "SELECT EXISTS(SELECT * FROM employee_works WHERE email=%s)", [email])
        output = cursor.fetchone()[0]
        # print("EMP OUTPUT:",output)
        if(output == 1):
            return jsonify("Employee")

        # SELECT EXISTS(SELECT * FROM user WHERE username='shiva');
        return(jsonify("Invalid mail id"))

# /api/students?mess_id = {mess_id} - list of students


class student_get(Resource):

    def get(self, mess_id=1):
        mess_id = request.args.get('mess_id')
        cursor = mysql.connection.cursor()
        if(mess_id == None):
            cursor.execute(
                'select s.roll_number,s.name,m.mess_name, s.email, s.gender,s.mess_id from `student_allocated` as s,`mess` as m where s.mess_id = m.mess_id')
        else:
            cursor.execute(
                'select s.roll_number,s.name,m.mess_name, s.email, s.gender,s.mess_id from `student_allocated` as s,`mess` as m where s.mess_id = m.mess_id and s.mess_id = %s', [mess_id])
        student_out = cursor.fetchall()
        cursor.close()
        # print(student_out)
        student_list = []
        for item in student_out:
            d = {'Roll Number': item[0], 'Name': item[1], 'Mess Name': item[2],
                 'Email': item[3], 'Gender': item[4], 'Mess_id': item[5]}
            student_list.append(d)
        return jsonify(student_list)


class student_delete(Resource):  # /api/students/delete?roll_no=19110101
    def get(self):
        lock.acquire()
        print("Deleteting student")
        roll_no = request.args['roll_no']
        cursor = mysql.connection.cursor()
        # SET FOREIGN_KEY_CHECKS=0;
        cursor.execute('SET FOREIGN_KEY_CHECKS=0')
        cursor.execute(
            'delete from `student_allocated` where roll_number=%s', [roll_no])
        student_out = cursor.fetchall()
        cursor.close()
        print("Deleted output: ", student_out)
        mysql.connection.commit()
        lock.release()
        return jsonify("Deleted roll number {}".format(roll_no))


# /api/students/update?roll_no = {roll_no}&name={new_name}... - update student
# /api/students/update?roll_no = {roll_no}&name={new_name}... - update student
class student_update(Resource):
    # http://127.0.0.1:5000/api/students/update?roll_no=19110104&name=shiva&mess_id=3&email=vp.shivasan@iitgn.ac.in&password=fluffy&gender=male
    # Sample post request object
    #  myobj = {'roll_no': 19110104,
    #                  'name' : "my_newName",
    #                  'email' : "joblessmf@unknown.com",
    #                  'mess_id':2,
    #                  'password':"new_password",
    #                  'gender' : 'male'
    #                  }
    def post(self):
        lock.acquire()
        print("Student Update")
        print(request.json)

        roll_no = request.json.get('Roll Number')
        mess_id = request.json.get('Mess_id')
        name = request.json.get('Name')
        email = request.json.get('Email')
        password = request.json.get('password')
        gender = request.json.get('Gender')
        cursor = mysql.connection.cursor()
        print("Roll no:", roll_no)
        cursor.execute(
            "select roll_number,name, email, gender,mess_id,password from `student_allocated` where roll_number=%s", [roll_no])
        old_student_data = cursor.fetchone()
        _, old_name, old_email, old_gender, old_mess_id, old_password = old_student_data

        name = old_name if name == None else name
        email = old_email if email == None else email
        gender = old_gender if gender == None else gender
        mess_id = old_mess_id if mess_id == None else mess_id
        password = old_password if password == None else password

        cmd = 'update student_allocated set mess_id={},name="{}",email="{}",password="{}",gender="{}" where roll_number=%s'.format(
            mess_id, name, email, password, gender)
        output = cursor.execute(cmd, [roll_no])
        mysql.connection.commit()
        lock.release()
        return("Updated")
# another resource to calculate the square of a number


class student_add(Resource):
    # Sample post request object
    #  myobj = {'roll_no': 19110104,
    #                  'name' : "my_newName",
    #                  'email' : "joblessmf@unknown.com",
    #                  'mess_id':2,
    #                  'password':"new_password",
    #                  'gender' : 'male'
    #                  }
    def post(self):
        lock.acquire()
        roll_no = request.json.get('Roll Number')
        mess_id = request.json.get('Mess_id')
        name = request.json.get('Name')
        email = request.json.get('Email')
        password = request.json.get('password')
        gender = request.json.get('Gender')
        cursor = mysql.connection.cursor()
        output = cursor.execute('insert into student_allocated values (%s,%s,%s,%s,%s,%s)', [
                                roll_no, mess_id, name, email, password, gender])
        mysql.connection.commit()
        lock.release()
        return("Added")


class inventory_details(Resource):

    def get(self, mess_id=1):
        mess_id = request.args.get('mess_id')
        cursor = mysql.connection.cursor()
        if(mess_id == None):
            cursor.execute(
                'Select * from `inventory_present_at`')
        else:
            cursor.execute(
                """Select * from `inventory_present_at` where mess_id = '%s'""" % (mess_id))  # http://127.0.0.1:5000/api/inventorylist?mess_id=' or '1' = '1

        inventory = cursor.fetchall()
        cursor.close()

        inventory_list = []
        for item in inventory:
            d = {'inventory_id': item[0], 'mess_id': item[1], 'quantity': int(item[2]),
                 'type': item[3]}
            inventory_list.append(d)
        mysql.connection.commit()
        return jsonify(inventory_list)


class profile(Resource):
    def get(self):
        mess_id = request.args.get('name')
        cursor = mysql.connection.cursor()
        if(mess_id == None):
            cursor.execute(
                'Select * from `inventory_present_at`')
        else:
            cursor.execute(
                """Select * from `inventory_present_at` where mess_id = '%s'""" % (mess_id))  # http://127.0.0.1:5000/api/inventorylist?mess_id=' or '1' = '1

        inventory = cursor.fetchall()
        cursor.close()

        inventory_list = []
        for item in inventory:
            d = {'inventory_id': item[0], 'mess_id': item[1], 'quantity': item[2],
                 'type': item[3]}
            inventory_list.append(d)
        return jsonify(inventory_list)


class stock_details(Resource):
    def get(self):
        mess_id = request.args.get('mess_id')
        cursor = mysql.connection.cursor()
        if(mess_id == None):
            cursor.execute(
                'Select * from `stock_contains`')
        else:
            cursor.execute(
                'Select * from `stock_contains` where mess_id = %s', [mess_id])

        stock = cursor.fetchall()
        cursor.close()

        stock_list = []
        for item in stock:
            d = {'product_id': item[0], 'mess_id': item[1], 'quantity': int(item[2]),
                 'in_date': item[3], 'expiry': item[4]}
            stock_list.append(d)
        print(stock_list)
        return jsonify(stock_list)


class show_user(Resource):
    def get(self):
        rno = request.args.get('rno')
        cursor = mysql.connection.cursor()
        cursor.execute(
            'Select * from `student_allocated` where roll_number = %s', [rno])

        stock = cursor.fetchone()
        cursor.close()
        comments = stock[2]
        search_query = stock[2]
        print(stock)
        roll_no = stock[0]
        mess_id = stock[1]
        name = stock[2]
        email = stock[3]
        gender = stock[5]
        print(stock[2])
        return render_template('index.html',
                               roll_no=roll_no,
                               mess_id=mess_id,
                               name=name,
                               email=email,
                               gender=gender
                               )


class Contractor_det(Resource):
    def get(self):
        mess_id = request.args.get('mess_id')
        cursor = mysql.connection.cursor()
        cursor.execute(
            """Select * from contractor_contact""")
        # """Select * from SELECT cm.contractor_id, cm.contractor_name, cm.hq_street_number, cm.hq_street_name, cm.hq_office_number, cm.hq_city, cm.hq_state, cm.hq_pincode, cc.hq_contact_number FROM `contractor_manages` cm JOIN `contractor_contact` cc ON cm.contractor_id = cc.contractor_id WHERE cm.mess_id =' '%s'""" % (mess_id)) #http://127.0.0.1:5000/api/inventorylist?mess_id=' or '1' = '1

        inventory = cursor.fetchall()
        cursor.close()

        inventory_list = []
        for item in inventory:
            d = {'HQ Contact Number': item[0], 'contractor ID': item[1]}
            inventory_list.append(d)
        return jsonify(inventory_list)


class visit_details(Resource):

    def get(self):
        cursor = mysql.connection.cursor()
        cursor.execute(
                'Select * from `visits` JOIN `date_slot`')
                    
        visit = cursor.fetchall()
        cursor.close()

        visit_list = []
        for item in visit:
            d = {'roll_number': item[0], 'date': item[2], 'slot': item[3]}
            visit_list.append(d)
        return jsonify(visit_list)



class wastage_details(Resource):

    def get(self):
        cursor = mysql.connection.cursor()
        cursor.execute(
            'Select * from `wastage`')

        waste = cursor.fetchall()
        cursor.close()

        wastage_list = []
        for item in waste:
            d = {'mess_id': item[0], 'date_slot_id': item[1],
                 'food_wasted': int(item[2])}
            wastage_list.append(d)
        return jsonify(wastage_list)


class SR_contact(Resource):
    def get(self):
        cursor = mysql.connection.cursor()

        cursor.execute(
            'select position_id, position, roll_number from `student_represntative_coordinates`')
        details = cursor.fetchall()
        cursor.close()

        details_list = []
        for item in details:
            d = {'Position ID': item[0],
                 'Position': item[1], 'Roll No.': item[2]}
            details_list.append(d)
        return jsonify(details_list)


class employee_get(Resource):

    def get(self, mess_id=1):
        mess_id = request.args.get('mess_id')
        cursor = mysql.connection.cursor()
        if(mess_id == None):
            cursor.execute(
                'select s.name, CONCAT(s.house_no, s.street_name, s.city, s.state, s.pincode) as address, s.designation, s.dob, s.email, s.gender,s.mess_id from `employee_works` as s,`mess` as m where s.mess_id = m.mess_id')
        else:
            cursor.execute(
                'select s.name, CONCAT(s.house_no, s.street_name, s.city, s.state, s.pincode) as address, s.designation, s.dob, s.email, s.gender,s.mess_id from `employee_works` as s,`mess` as m where s.mess_id = %s', [mess_id])
        employee_out = cursor.fetchall()
        cursor.close()
        # print(student_out)
        employee_list = []
        for item in employee_out:
            d = {'Name': item[0], 'Address': item[1], 'Designation': item[2], 'DoB': item[3],
                 'Email': item[4], 'Gender': item[5], 'Mess_id': item[6]}
            employee_list.append(d)
        return jsonify(employee_list)


class balance_sheet_get(Resource):  # /api/balance_sheet?mess_id={mess_id}

    def get(self):
        mess_id = request.args.get('mess_id')
        cursor = mysql.connection.cursor()

        query = """SELECT * from balance_sheet"""

        cursor.execute(query)

        rows = cursor.fetchall()
        cursor.close()

        # format rows as a list of dictionaries
        balance_sheet_list = []
        for row in rows:
            balance_sheet_inside = {
                'balance_id': row[0],
                'mess_id': row[1],
                'from_student': row[2],
                'from_guest': row[3],
                'to_employee': row[4],
                'to_vendor': row[5],
                'miscellaneous': row[6],
                'month': row[7],
                'year': row[8],

            }
            balance_sheet_list.append(balance_sheet_inside)
        return jsonify(balance_sheet_list)


class guest_sales_get(Resource):  # /api/guest_sales?mess_id={mess_id}

    def get(self):
        mess_id = request.args.get('mess_id')
        cursor = mysql.connection.cursor()
        query = """SELECT invoice_id, amount from guest_sales_receives where mess_id = %s"""

        cursor.execute(query, (mess_id,))

        rows = cursor.fetchall()
        cursor.close()

        # format rows as a list of dictionaries
        guest_sales_list = []
        for row in rows:
            guest_sale_inside = {
                'invoice_id': row[0],
                'amount': row[1],
            }
            guest_sales_list.append(guest_sale_inside)

        return jsonify(guest_sales_list)


class mess_menu_get(Resource):  # /api/mess_menu

    def get(self):
        cursor = mysql.connection.cursor()
        # for testing purposes one set today to monday since we only data for three days in our DB
        today = datetime.today()
        today = today.strftime("%A").lower()
        today = "monday"

        query = """SELECT ds.slot, mi.item_name, mi.price, mi.is_special, mi.protein, mi.calorie
           FROM mess_item mi
           JOIN menu mu ON mi.item_id = mu.item_id
           JOIN day_slot ds ON mu.dayslot_id = ds.dayslot_id
           WHERE ds.day_sl = %s"""
        print("ASD")
        cursor.execute(query, (today,))

        rows = cursor.fetchall()
        cursor.close()

        # format rows as a list of dictionaries
        menu_items = []
        for row in rows:
            menu_item = {
                'slot': row[0],
                'item_name': row[1],
                'price': row[2],
                'is_special': row[3],
                'protein': int(row[4]),
                'calorie': int(row[5])
            }
            menu_items.append(menu_item)
        print(menu_item)
        return jsonify(menu_items)


class present_on_get(Resource): #/api/guest_sales?mess_id={mess_id}

    def get(self):
        # mess_id = request.args.get('mess_id')
        cursor = mysql.connection.cursor()
        #today = "monday"
        # for testing purposes one set today to monday since we only data for three days in our DB
        # today = datetime.today()
        # today = today.strftime("%A").lower()

        query = """SELECT * from present_on NATURAL JOIN date_slot"""
        
        cursor.execute(query)

        rows = cursor.fetchall()
        cursor.close()

        # format rows as a list of dictionaries
        present_on_list = []
        for row in rows:
            present_on_inside = {
                'employee_id': row[0],
                'date': row[2],
                'slot': row[3],
            }
            present_on_list.append(present_on_inside)

        return jsonify(present_on_list)


class Contractor_Address(Resource):
    def get(self):
        mess_id = request.args.get('mess_id')
        cursor = mysql.connection.cursor()
        cursor.execute(
            """Select * from contractor_manages""")
        # """Select * from SELECT cm.contractor_id, cm.contractor_name, cm.hq_street_number, cm.hq_street_name, cm.hq_office_number, cm.hq_city, cm.hq_state, cm.hq_pincode, cc.hq_contact_number FROM `contractor_manages` cm JOIN `contractor_contact` cc ON cm.contractor_id = cc.contractor_id WHERE cm.mess_id =' '%s'""" % (mess_id)) #http://127.0.0.1:5000/api/inventorylist?mess_id=' or '1' = '1

        inventory = cursor.fetchall()
        cursor.close()

        inventory_list = []
        for item in inventory:
            d = {'contractor Id': item[0], 'Mess Id': item[1], 'Contractor Name': item[2], 'HQ Street Number': item[3],
                 'HQ Street Name': item[4], 'HQ Office Number': item[5], 'HQ city': item[6], 'HQ State': item[7], 'HQ Pincode': item[8]}
            inventory_list.append(d)
        return jsonify(inventory_list)
    
class invoice_items_get(Resource):
    def get(self, mess_id=1):
        mess_id = request.args.get('mess_id')
        cursor = mysql.connection.cursor()
        if(mess_id == None):
            cursor.execute(
                'select ii.invoice_id, ii.item_id, ii.quantity, mi.item_name, gsr.amount from `invoice_items` as ii, `mess_item` as mi, `guest_sales_receives` as gsr where ii.item_id = mi.item_id and ii.invoice_id = gsr.invoice_id')
        out = cursor.fetchall()
        cursor.close()
        # print(student_out)
        invoice_items = []
        for item in out:
            d = {'invoice_id': item[0], 'item_id': item[1], 'quantity': int(item[2]), 'item_name': item[3],
                 'amount': int(item[4])}
            invoice_items.append(d)
        return jsonify(invoice_items)
    
class IDK(Resource):
    def get(self):
        mess_id = request.args.get('mess_id')
        cursor = mysql.connection.cursor()
        cursor.execute(
            """ SELECT m.mess_id, m.mess_name, m.num_of_employee, m.number_of_student, o.dayslot_id, ds.day_sl, ds.slot, o.price FROM mess m JOIN operates_at o ON m.mess_id = o.mess_id JOIN day_slot ds ON o.dayslot_id = ds.dayslot_id""")
        inventory = cursor.fetchall()
        cursor.close()

        inventory_list = []
        for item in inventory:
            d = {'Mess Id': item[0], 'Mess Name': item[1], 'Num of Employee' : item[2], 'Number of Student': item[3], 'Dayslot Id': item[4], 'Day sl':item[5], 'Slot':item[6], 'Price':item[7]}
            inventory_list.append(d)
        return jsonify(inventory_list)
    
class feedback_get(Resource):

    def get(self, mess_id=1):
        mess_id = request.args.get('mess_id')
        cursor = mysql.connection.cursor()
        if(mess_id == None):
            cursor.execute(
                'select name, star_rating, comment, date, slot, mess_id from `feedback_received`')
        else:
            cursor.execute(
                'select name, star_rating, comment, date, slot, mess_id from `feedback_received`')
        out = cursor.fetchall()
        cursor.close()
        # print(student_out)
        feedback_list = []
        for item in out:
            d = {'Name': item[0], 'Star Rating': item[1], 'Comment': item[2], 'Date': item[3],
                 'Slot': item[4], 'Mess_id': item[5]}
            feedback_list.append(d)
        return jsonify(feedback_list)


# adding the defined resources along with their corresponding urls
api.add_resource(student_get, '/api/students')
api.add_resource(student_delete, '/api/students/delete')
api.add_resource(student_update, '/api/students/update')
api.add_resource(student_add, '/api/students/add')
api.add_resource(mess, '/api/messes')
api.add_resource(return_auth, '/api/return_auth')
# http://127.0.0.1:5000/api/stock?mess_id=1
api.add_resource(stock_details, '/api/stock')
api.add_resource(inventory_details, '/api/inventorylist')
# http://127.0.0.1:5000/api/show_user?email=dsaf
api.add_resource(show_user, '/api/show_user')
api.add_resource(SR_contact, '/api/contacts')
api.add_resource(employee_get, '/api/employee')
api.add_resource(balance_sheet_get, '/api/balance_sheet')
api.add_resource(guest_sales_get, '/api/guest_sales')
api.add_resource(mess_menu_get, '/api/mess_menu')
api.add_resource(Contractor_det, '/api/con_det')
api.add_resource(wastage_details, '/api/wastage')
api.add_resource(visit_details, '/api/visit')
api.add_resource(present_on_get, '/api/present_on')
api.add_resource(Contractor_Address, '/api/con_add')
api.add_resource(IDK, '/api/idk')
api.add_resource(invoice_items_get, '/api/invoiceitem')
api.add_resource(feedback_get, '/api/feedback')

# http://127.0.0.1:5000/api/inventorylist?mess_id="'; select * from mess; --"
# http://127.0.0.1:5000/api/inventorylist?mess_id=' or '1' = '1

# driver function
if __name__ == '__main__':
    app.run(debug=True, threaded=True)

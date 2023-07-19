from flask import Flask, make_response, jsonify, request
import psycopg2
from flask_cors import CORS
import jwt

class CarCatalogApp:
    def __init__(self):
        self.conn = psycopg2.connect(
            host='127.0.0.1',
            database='showcase_cars_db',
            user='postgres',
            password='123'
        )

        self.app = Flask(__name__)
        self.app.config['JSON_SORT_KEYS'] = False
        self.secret_key = 'ri7Wh7XDxw'
        CORS(self.app)

        self.setup_routes()

    def setup_routes(self):
        self.app.route('/carros', methods=['GET'])(self.get_car)
        self.app.route('/login', methods=['POST'])(self.login)
        self.app.route('/delete_carros/<int:car_id>', methods=['DELETE'])(self.delete_car)
        self.app.route('/update_carros/<int:car_id>/<string:new_name>/<string:new_value>/<string:new_model>/<string:new_brand>', methods=['PUT'])(self.update_car)
        self.app.route('/create_carros/<string:car_name>/<string:car_price>/<string:car_model>/<string:car_brand>', methods=['POST'])(self.create_car)
        self.app.route('/login_create', methods=['POST'])(self.create_login)

    def run(self):
        self.app.run()

    def get_car(self):
        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM car ORDER BY price ASC')
        carros = cursor.fetchall()
        cursor.close()
        return make_response(jsonify(carros))

    def login(self):
        email = request.json['email']
        password = request.json['password']

        if email and password:
            login = self.conn.cursor()
            login.execute('SELECT * FROM login_user WHERE email = %s', (email,))
            user = login.fetchone()
            login.close()

            if user and user[2] == password:
                token = jwt.encode({'identity': user[0]}, self.secret_key, algorithm='HS256')
                return {'token': token}
            else:
                return make_response(jsonify({'error': 'Credenciais inválidas'}), 401)

        return make_response(jsonify({'error': 'Preencha todos os campos'}), 400)

    def delete_car(self, car_id):
        cursor = self.conn.cursor()
        cursor.execute('DELETE FROM car WHERE car_id = %s', (car_id,))
        self.conn.commit()
        cursor.close()
        return make_response(jsonify({'message': 'Registro excluído com sucesso'}))

    def update_car(self, car_id, new_name, new_value, new_model, new_brand):
        cursor = self.conn.cursor()
        cursor.execute('UPDATE car SET car_name=%s, price=%s, model=%s, brand=%s WHERE car_id = %s', (new_name, new_value, new_model, new_brand, car_id))
        self.conn.commit()
        cursor.close()
        return make_response(jsonify({'message': 'Registro atualizado com sucesso'}))

    def create_car(self, car_name, car_price, car_model, car_brand):
        cursor = self.conn.cursor()
        cursor.execute('INSERT INTO car(car_name, brand, model, price) VALUES (%s, %s, %s, %s);',(car_name,car_brand,car_model,car_price))
        self.conn.commit()
        cursor.close()
        return make_response(jsonify({'message': 'Registro criado com sucesso'}))

    def create_login(self):
        email = request.json['email']
        password = request.json['password']
        cursor = self.conn.cursor()
        cursor.execute('INSERT INTO login_user (email, password) VALUES (%s, %s);',(email,password))
        self.conn.commit()
        cursor.close()
        return make_response(jsonify({'message': 'Registro criado com sucesso'}))

if __name__ == '__main__':
    app = CarCatalogApp()
    app.run()

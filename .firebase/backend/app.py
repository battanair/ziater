from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth
from models import db, Persona  # Importar db y Persona desde models.py

# Inicializar Firebase Admin SDK
cred = credentials.Certificate("path/to/your/firebase-service-account-file.json")
firebase_admin.initialize_app(cred)

# Configurar la base de datos de SQLAlchemy
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://if0_38033378:Cenudace1@sql101.infinityfree.com/if0_38033378_ziater'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar la conexión con la base de datos
db.init_app(app)
CORS(app)

# Ruta para obtener personas (consulta)
@app.route('/personas', methods=['GET'])
def get_personas():
    personas = Persona.query.all()  # Obtener todas las personas de la base de datos
    personas_data = [{'id': p.id, 'nombre': p.nombre, 'apellido': p.apellido, 'bio': p.bio} for p in personas]
    return jsonify(personas_data)

# Ruta para agregar una persona (ejemplo de POST)
@app.route('/personas', methods=['POST'])
def add_persona():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"message": "Token de autenticación no proporcionado", "status": "error"}), 401

    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']

        data = request.get_json()
        nombre = data.get('nombre')
        apellido = data.get('apellido')
        bio = data.get('bio')

        nueva_persona = Persona(nombre=nombre, apellido=apellido, bio=bio)
        db.session.add(nueva_persona)
        db.session.commit()

        return jsonify({"message": "Persona agregada exitosamente"}), 201
    except Exception as e:
        return jsonify({"message": f"Token inválido: {str(e)}", "status": "error"}), 401

# Crear todas las tablas en la base de datos
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)

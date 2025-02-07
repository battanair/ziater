from flask import Flask, jsonify
from models import db, Persona  # Importar db y Persona desde models.py

# Crear la instancia de Flask
app = Flask(__name__)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://if0_38033378:Cenudace1@sql101.infinityfree.com/if0_38033378_ziater'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar la base de datos con la app de Flask
db.init_app(app)

cred = credentials.Certificate("./backend/ziater2-firebase-adminsdk-cpaeo-aef6c29b3d.json")


# Crear las tablas de la base de datos si no existen
with app.app_context():
    db.create_all()

# Ruta para obtener una persona por su ID
@app.route('/api/persona/<int:id>', methods=['GET'])
def get_persona(id):
    persona = Persona.query.get_or_404(id)
    return jsonify({
        'id': persona.id,
        'nombre': persona.nombre,
        'bio': persona.bio,
        'fotos': persona.fotos,
        'rrss': persona.rrss
    })

if __name__ == '__main__':
    app.run(debug=True)

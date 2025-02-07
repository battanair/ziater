from flask import Blueprint, request, jsonify
from firebase_admin import auth
from firebase_config import pb_auth

auth_bp = Blueprint("auth", __name__)

# 🔹 Registro de usuario
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    try:
        user = pb_auth.create_user_with_email_and_password(email, password)
        return jsonify({"message": "Usuario registrado con éxito", "user": user}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 🔹 Login de usuario
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    try:
        user = pb_auth.sign_in_with_email_and_password(email, password)
        id_token = user['idToken']
        return jsonify({"token": id_token}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 🔹 Middleware para verificar el token en rutas protegidas
def token_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token requerido'}), 401
        try:
            decoded_token = auth.verify_id_token(token)
            request.user = decoded_token
        except Exception as e:
            return jsonify({'message': 'Token inválido', 'error': str(e)}), 401
        return f(*args, **kwargs)
    return decorated

@auth_bp.route('/google-login', methods=['POST'])
def google_login():
    data = request.get_json()
    id_token = data.get("id_token")

    if not id_token:
        return jsonify({"error": "Token de Google requerido"}), 400

    try:
        # Verifica el token de Google
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token["uid"]
        email = decoded_token.get("email")

        return jsonify({"message": "Inicio de sesión exitoso", "uid": uid, "email": email}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# 🔹 Ruta protegida de prueba
@auth_bp.route('/protected', methods=['GET'])
@token_required
def protected():
    return jsonify({'message': f'Acceso permitido a {request.user["uid"]}'}), 200
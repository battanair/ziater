import firebase_admin
from firebase_admin import credentials, auth, initialize_app
import os


cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if cred_path:
    cred = credentials.Certificate(cred_path)
    initialize_app(cred)
else:
    raise ValueError("Falta la variable de entorno GOOGLE_APPLICATION_CREDENTIALS")


# Obtener credenciales de Firebase desde una variable de entorno
if not firebase_admin._apps:  # Evita inicializar varias veces
    cred_path = os.getenv("442908543941-hlmj83s1alduquorv5rlh6q3ptcj82qs.apps.googleusercontent.com")
    if cred_path:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        raise ValueError("Falta la variable de entorno GOOGLE_APPLICATION_CREDENTIALS")

# Pyrebase para autenticación con email y contraseña
import pyrebase

firebase_config = {
    "apiKey": os.getenv("AIzaSyCz61R5v83aUEgX_p2jwy_XjbdypGTK8Gc"),
    "authDomain": os.getenv("ziater2.firebaseapp.com"),
    "databaseURL": os.getenv("FIREBASE_DATABASE_URL"),
    "storageBucket": os.getenv("ziater2.firebasestorage.app"),
}

pb_auth = pyrebase.initialize_app(firebase_config).auth()

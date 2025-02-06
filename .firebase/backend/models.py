from flask_sqlalchemy import SQLAlchemy

# Crear la instancia de SQLAlchemy
db = SQLAlchemy()

# Definir el modelo Persona
class Persona(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    bio = db.Column(db.Text)
    fotos = db.Column(db.Text)
    rrss = db.Column(db.Text)

# Definición de otros modelos...
class Obra(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    sinopsis = db.Column(db.Text)
    nota = db.Column(db.Float)
    fotos = db.Column(db.Text)
    rrss = db.Column(db.Text)

class Entrada(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    obra_id = db.Column(db.Integer, db.ForeignKey('obra.id'), nullable=False)
    fecha_inicio = db.Column(db.DateTime)
    fecha_final = db.Column(db.DateTime)
    sala_id = db.Column(db.Integer, db.ForeignKey('sala.id'))
    precio = db.Column(db.Float)
    enlace = db.Column(db.Text)

class Sala(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    descripcion = db.Column(db.Text)
    rrss = db.Column(db.Text)
    provincia = db.Column(db.String(255))
    ciudad = db.Column(db.String(255))

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    rrss = db.Column(db.Text)

class PersonaObra(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    obra_id = db.Column(db.Integer, db.ForeignKey('obra.id'), nullable=False)
    persona_id = db.Column(db.Integer, db.ForeignKey('persona.id'), nullable=False)
    puesto = db.Column(db.String(255))
    titulo = db.Column(db.String(255))
    fechas = db.Column(db.String(255))

class Premio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bio = db.Column(db.Text)
    foto = db.Column(db.Text)

class PremioObra(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    premio_id = db.Column(db.Integer, db.ForeignKey('premio.id'), nullable=False)
    obra_id = db.Column(db.Integer, db.ForeignKey('obra.id'), nullable=False)
    galardon = db.Column(db.String(255))
    año = db.Column(db.Integer)

class PremioPersona(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    premio_id = db.Column(db.Integer, db.ForeignKey('premio.id'), nullable=False)
    persona_id = db.Column(db.Integer, db.ForeignKey('persona.id'), nullable=False)
    galardon = db.Column(db.String(255))
    año = db.Column(db.Integer)

class Critica(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    obra_id = db.Column(db.Integer, db.ForeignKey('obra.id'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    titulo = db.Column(db.String(255))
    cuerpo = db.Column(db.Text)
    nota = db.Column(db.Float)

class UsuarioObra(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    obra_id = db.Column(db.Integer, db.ForeignKey('obra.id'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    nota = db.Column(db.Float)

class Productora(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    descripcion = db.Column(db.Text)

class ProductoraObra(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    productora_id = db.Column(db.Integer, db.ForeignKey('productora.id'), nullable=False)
    obra_id = db.Column(db.Integer, db.ForeignKey('obra.id'), nullable=False)
    actual = db.Column(db.Boolean)

class ObraCategoria(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    obra_id = db.Column(db.Integer, db.ForeignKey('obra.id'), nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categoria.id'), nullable=False)

class Categoria(db.Model):
    id = db.Column(db.Integer, primary_key=True)



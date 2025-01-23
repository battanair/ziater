export const obras_db = [
  {
    id_obra: 1,
          nombre_obra: "La OTRA Fiesta",
          etiquetas_obra: ["drama", "impro"],
          nota_obra: 8,
          anio_obra: 2023,
          sinopsis_obra: "Darío Duarte, hijo de uruguayos, es un dramaturgo que a sus 45 años se enfrenta a su primer estreno en la Sala Grande del Teatro María Guerrero. Cuando hace un curso con el también uruguayo Sergio Blanco, este le recomienda que escriba sobre el acontecimiento más relevante de su infancia. En 1983, el gobierno socialista de Felipe González fletó un avión para que casi doscientos hijos de exiliados y presos políticos uruguayos viajaran a su país para pasar la Nochevieja con sus familias.",
          video_obra: "https://www.youtube.com/embed/iwyiAHxZs7M?si=mq-U2bFnXzCVe72D",
          poster_obra: "https://picsum.photos/200/300",
          fotos_obra: ["https://picsum.photos/400/300?random=1", "https://picsum.photos/400/300?random=2", "https://picsum.photos/400/300?random=3", "https://picsum.photos/400/300?random=4","https://picsum.photos/400/300?random=5"],
  },
  {
    id_obra: 2,
          nombre_obra: "La Fiesta de la democrazy",
          etiquetas_obra: ["comedia", "opera"],
          nota_obra: 6,
          anio_obra: 2022,
          sinopsis_obra: "TOMA Darío Duarte, hijo de uruguayos, es un dramaturgo que a sus 45 años se enfrenta a su primer estreno en la Sala Grande del Teatro María Guerrero. Cuando hace un curso con el también uruguayo Sergio Blanco, este le recomienda que escriba sobre el acontecimiento más relevante de su infancia. En 1983, el gobierno socialista de Felipe González fletó un avión para que casi doscientos hijos de exiliados y presos políticos uruguayos viajaran a su país para pasar la Nochevieja con sus familias.",
          video_obra: "https://www.youtube.com/embed/iwyiAHxZs7M?si=mq-U2bFnXzCVe72D",
          poster_obra: "https://picsum.photos/200/300",
          fotos_obra: ["https://picsum.photos/400/300?random=1", "https://picsum.photos/400/300?random=2", "https://picsum.photos/400/300?random=3", "https://picsum.photos/400/300?random=4","https://picsum.photos/400/300?random=5"],
  },
];

// Datos de personas
export const personas_db = [
  {
    id_persona: 1,
    nombre_persona: "Eduardo",
    apellido_persona: "De los Cojones",
    bio_persona: "Nacía de pequeña y crecí un poco y luego más y aquí estoy. Es muy tarde y sigo programando menuda faena",
  },
  {
    id_persona: 2,
    nombre_persona: "Mari Carmen",
    apellido_persona: "De las Flores Battardo",
    bio_persona: "Nrací erde pequeña y crecí un poco y luego más y aquí estoy. Es muy tarde y sigo programando menuda faena",
  },
  {
    id_persona: 3,
    nombre_persona: "Lola la mala",
    apellido_persona: "La Malisima",
    bio_persona: "Nafghjkcí de pequeña y crecí un poco y luego más y aquí estoy. Es muy tarde y sigo programando menuda faena",
  },
  {
    id_persona: 4,
    nombre_persona: "Alfredo",
    apellido_persona: "Botroncio",
    bio_persona: "Nrftgyhujiací de pequeña y crecí un poco y luego más y aquí estoy. Es muy tarde y sigo programando menuda faena",
  },
];

// Relaciones entre personas y obras
export const relaciones_db = [
  {
    obraId: 1,
    personaId: 1,
    rol: "Actriz",
    personaje: "Protagonista",
  },
  {
    obraId: 1,
    personaId: 2,
    rol: "Actor",
    personaje: "Antagonista",
  },
  {
    obraId: 2,
    personaId: 3,
    rol: "Actriz",
    personaje: "Secundaria",
  },
  {
    obraId: 2,
    personaId: 4,
    rol: "Director",
    personaje: null, // Los directores no tienen personaje
  },
];

// Función para obtener una persona por su ID
export const getPersonaById = (id) =>
personas_db.find((persona) => persona.id_persona === id);

// Función para obtener una obra por su ID
export const getObraById = (id) =>
obras_db.find((obra) => obra.id_obra === id);

// Función para obtener relaciones de una obra por su ID
export const getRelacionesByObraId = (id) =>
relaciones_db.filter((relacion) => relacion.obraId === id);

// Función para obtener relaciones de una persona por su ID
export const getRelacionesByPersonaId = (id) =>
relaciones_db.filter((relacion) => relacion.personaId === id);

// Función para obtener el elenco de una obra
export const getElencoByObraId = (id) => {
const relacionesObra = getRelacionesByObraId(id);
return relacionesObra.map((relacion) => {
const persona = getPersonaById(relacion.personaId);
return {
...persona,
rol: relacion.rol,
personaje: relacion.personaje,
};
});
};

// Función para obtener las obras en las que participa una persona
export const getObrasByPersonaId = (id) => {
const relacionesPersona = getRelacionesByPersonaId(id);
return relacionesPersona.map((relacion) => ({
...getObraById(relacion.obraId),
rol: relacion.rol,
personaje: relacion.personaje,
}));
};
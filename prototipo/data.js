/* Datos de ejemplo (mock) para el prototipo de Iris. No es real. */
window.MOCK = {
  usuario: { nombre: "Guillermo (Owner)", rol: "OWNER", iniciales: "GO" },

  asesores: [
    { id:"a1", nombre:"Huascar Ramírez", ini:"HR", disp:"DISPONIBLE", carga:4, max:8, fallback:false, ausente:false, cubridor:"—", activo:true },
    { id:"a2", nombre:"Ana Olvera",      ini:"AO", disp:"OCUPADO",    carga:7, max:8, fallback:false, ausente:false, cubridor:"—", activo:true },
    { id:"a3", nombre:"Carolina Ruiz",   ini:"CR", disp:"DISPONIBLE", carga:3, max:10,fallback:true,  ausente:false, cubridor:"—", activo:true },
    { id:"a4", nombre:"Gabriela Pizarro",ini:"GP", disp:"FUERA",      carga:0, max:6, fallback:false, ausente:true,  cubridor:"Ana Olvera", activo:true },
    { id:"a5", nombre:"Lizette Hdz",     ini:"LH", disp:"DISPONIBLE", carga:2, max:8, fallback:false, ausente:false, cubridor:"—", activo:true },
    { id:"a6", nombre:"Héctor Guevara",  ini:"HG", disp:"DISPONIBLE", carga:5, max:8, fallback:false, ausente:false, cubridor:"—", activo:true },
    { id:"a7", nombre:"Shelman Ruiz",    ini:"SR", disp:"OCUPADO",    carga:6, max:8, fallback:false, ausente:false, cubridor:"—", activo:true },
    { id:"a8", nombre:"Pedro García",    ini:"PG", disp:"DISPONIBLE", carga:1, max:8, fallback:false, ausente:false, cubridor:"—", activo:true },
  ],

  conversaciones: [
    { id:"c1", cliente:"Juan Pérez",   tel:"55 1234 5678", estado:"NUEVO", modo:"AUTO", origen:"Inmuebles24", clave:"", asesor:"", sla:5,
      ultimo:"Hola, vi una casa que me interesa", quien:"cliente",
      msgs:[ {a:"cliente",t:"Hola, vi una casa que me interesa"} ] },
    { id:"c2", cliente:"Ana López",    tel:"55 8765 4321", estado:"EN_ATENCION", modo:"FORZAR_IA", origen:"Facebook", clave:"", asesor:"", sla:0,
      ultimo:"¿Me puedes dar más información?", quien:"ia",
      msgs:[ {a:"cliente",t:"Buenas noches"}, {a:"ia",t:"¡Hola! Soy el asistente de CrossHome 🏡 ¿Qué propiedad te interesa? Puedes pasarme la clave, el link del anuncio o una foto del cartel."}, {a:"cliente",t:"¿Me puedes dar más información?"} ] },
    { id:"c3", cliente:"Luis Mendoza", tel:"55 2468 1357", estado:"EN_ESPERA_CLIENTE", modo:"FORZAR_IA", origen:"Cartel en propiedad", clave:"", asesor:"", sla:0,
      ultimo:"Esperando que envíe la clave o foto", quien:"ia",
      msgs:[ {a:"cliente",t:"Me interesa una casa en venta"}, {a:"ia",t:"¡Perfecto! ¿Me compartes la clave del inmueble o una foto del cartel para asignarte el asesor correcto?"} ] },
    { id:"c4", cliente:"Pedro Sánchez",tel:"55 1111 2222", estado:"EN_ESPERA_RESPUESTA", modo:"HUMANO_ACTIVO", origen:"Recomendación", clave:"AOCV-ROMA-04", asesor:"", sla:2,
      ultimo:"¿Sigue disponible la propiedad?", quien:"cliente",
      msgs:[ {a:"cliente",t:"Hola, me pasaron su contacto"}, {a:"administrativo",t:"¡Hola Pedro! Con gusto te ayudo."}, {a:"cliente",t:"¿Sigue disponible la propiedad?"} ] },
    { id:"c5", cliente:"Marta Díaz",   tel:"55 3333 4444", estado:"ASIGNADO", modo:"AUTO", origen:"Mercado Libre", clave:"HGCV-CENTRO-12", asesor:"Héctor Guevara", sla:0,
      ultimo:"El asesor Héctor te contactará en breve", quien:"sistema",
      msgs:[ {a:"cliente",t:"Quiero información de HGCV-CENTRO-12"}, {a:"ia",t:"Gracias, identifiqué la propiedad. Te asigno con tu asesor."}, {a:"sistema",t:"El asesor Héctor Guevara te contactará en breve por este medio. 🤝"} ] },
    { id:"c6", cliente:"Rosa Ng",      tel:"55 9090 1010", estado:"PERDIDO", modo:"AUTO", origen:"Inmuebles24", clave:"", asesor:"", sla:0,
      ultimo:"(sin respuesta del cliente)", quien:"sistema",
      msgs:[ {a:"ia",t:"¿Sigues interesada en la propiedad?"} ] },
  ],

  estados:[
    {k:"NUEVO",b:"b-new"},{k:"EN_ATENCION",b:"b-att"},{k:"EN_ESPERA_CLIENTE",b:"b-wait"},
    {k:"EN_ESPERA_RESPUESTA",b:"b-resp"},{k:"ASIGNADO",b:"b-asg"},{k:"PERDIDO",b:"b-lost"},{k:"CERRADO",b:"b-closed"}
  ],

  reglas:[
    { id:"r1", propietario:"Huascar Ramírez", clave:"HRCR-ALE-16", destino:"Héctor Guevara", nota:"Acuerdo interno" },
    { id:"r2", propietario:"Huascar Ramírez", clave:"HRCV-OLIVO-NOAMUE", destino:"Héctor Guevara", nota:"Propiedad delegada" },
  ],

  horarios:[
    { dia:"Lunes",     tramos:"09:00–14:00 · 16:00–19:00" },
    { dia:"Martes",    tramos:"09:00–19:00" },
    { dia:"Miércoles", tramos:"09:00–19:00" },
    { dia:"Jueves",    tramos:"09:00–19:00" },
    { dia:"Viernes",   tramos:"09:00–18:00" },
    { dia:"Sábado",    tramos:"10:00–14:00" },
    { dia:"Domingo",   tramos:"Cerrado (IA todo el día)" },
  ],
  excepciones:[
    { fecha:"2026-09-16", tipo:"FESTIVO", desc:"Independencia — IA todo el día" },
    { fecha:"2026-12-25", tipo:"CIERRE",  desc:"Navidad" },
  ],

  conocimiento:[
    { nombre:"Identidad CrossHome", tipo:"IDENTIDAD", estado:"Indexado", chunks:6,  vig:"—" },
    { nombre:"Política de créditos", tipo:"POLITICA",  estado:"Indexado", chunks:22, vig:"—" },
    { nombre:"Manual de visitas",    tipo:"MANUAL",    estado:"Pendiente", chunks:"—", vig:"—" },
    { nombre:"FAQ generales",        tipo:"FAQ",       estado:"Indexado", chunks:14, vig:"—" },
  ],
  propuestas:[
    { txt:"Agregar FAQ: '¿Aceptan crédito Fovissste?'", origen:"Conversación #c2", estado:"PENDIENTE" },
    { txt:"Corregir horario de visitas a sábados 10–14", origen:"Conversación #c4", estado:"PENDIENTE" },
  ],

  metricas:{ captados:128, ia:74, humano:54, tResp:"2.4 min", perdidos:11,
    porDia:[ {d:"Lun",v:18},{d:"Mar",v:22},{d:"Mié",v:16},{d:"Jue",v:25},{d:"Vie",v:27},{d:"Sáb",v:14},{d:"Dom",v:6} ] },

  logs:[
    { h:"18:42", cat:"ASIGNACION",  niv:"INFO",  accion:"asignacion.creada", res:"✅ Marta → Héctor Guevara (directa)" },
    { h:"18:40", cat:"INTEGRACION", niv:"ERROR", accion:"pipedrive.deal.create", res:"❌ 429 rate limit (reintentando)" },
    { h:"18:31", cat:"AGENTE_ADMIN",niv:"INFO",  accion:"reasignacion.manual", res:"✅ Pedro → Carolina (por owner)" },
    { h:"18:10", cat:"CONVERSACION",niv:"INFO",  accion:"modo.cambiado", res:"c2 → FORZAR_IA hasta 16:00" },
    { h:"17:55", cat:"AUTENTICACION",niv:"WARN", accion:"login.fallido", res:"⚠️ intento fallido (operador@crosshome)" },
    { h:"17:40", cat:"INTEGRACION", niv:"INFO",  accion:"slack.notify", res:"✅ aviso a #leads" },
  ],

  usuarios:[
    { nombre:"Guillermo G.", email:"owner@crosshome.mx", rol:"OWNER",    tel:"55 1000 0001", admin:true,  activo:true },
    { nombre:"Recepción 1",  email:"recep1@crosshome.mx",rol:"OPERADOR", tel:"55 1000 0002", admin:true,  activo:true },
    { nombre:"Recepción 2",  email:"recep2@crosshome.mx",rol:"OPERADOR", tel:"55 1000 0003", admin:false, activo:true },
  ],
};

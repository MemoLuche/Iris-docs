/* ============ Iris · Prototipo — router + vistas (mock) ============ */
const M = window.MOCK;
const $ = (s,r=document)=>r.querySelector(s);

const CRUMB = { inbox:"Inbox", asignacion:"Asignación manual", asesores:"Asesores",
  horarios:"Horarios", reglas:"Reglas de reasignación", conocimiento:"Base de conocimientos",
  metricas:"Métricas", auditoria:"Auditoría / Logs", config:"Configuración", perfil:"Mi cuenta" };

function go(h){ location.hash = h; }
function badge(k){ const e=M.estados.find(x=>x.k===k)||{b:"badge"}; return `<span class="badge ${e.b}">${k}</span>`; }
function nivBadge(n){ const m={INFO:"b-info",WARN:"b-warn",ERROR:"b-err"}; return `<span class="badge ${m[n]}">${n}</span>`; }
function dispBadge(d){ const m={DISPONIBLE:"b-ok",OCUPADO:"b-warn",FUERA:"b-lost"}; return `<span class="badge ${m[d]}">${d}</span>`; }

/* ---------------- VIEWS ---------------- */
const VIEWS = {
  inbox(){
    const cols = M.estados.map(e=>{
      const items = M.conversaciones.filter(c=>c.estado===e.k);
      const cards = items.map(c=>`
        <div class="kcard" onclick="go('#/inbox/${c.id}')">
          <div class="name">${c.cliente}</div>
          <div class="msg">${c.quien==='ia'?'🤖 ':''}${c.ultimo}</div>
          <div class="meta"><span>${c.tel}</span><span>${c.sla?('⏱ '+c.sla+'m'):''}</span></div>
        </div>`).join("") || `<div class="muted small" style="padding:6px">—</div>`;
      return `<div class="kcol"><div class="kcol-head"><span>${e.k}</span><span class="cnt">${items.length}</span></div>${cards}</div>`;
    }).join("");
    return `
      <div class="page-head"><h1>Inbox</h1><span class="badge b-err">🔴 2 sin SLA</span><div class="spacer"></div>
        <input style="max-width:220px" placeholder="Buscar cliente o teléfono…">
        <button class="btn btn-sm">Filtros ▾</button></div>
      <div class="note">El tablero <b>Kanban es el estado del chat de recepción</b>; mover una tarjeta cambia su estado. No es el pipeline de Pipedrive.</div>
      <div style="height:10px"></div>
      <div class="kanban">${cols}</div>`;
  },

  conversacion(id){
    const c = M.conversaciones.find(x=>x.id===id) || M.conversaciones[0];
    const bubbles = c.msgs.map(m=>{
      const ia = m.a==='ia', cli = m.a==='cliente', sys=m.a==='sistema';
      const cls = cli?'in':('out'+(ia?' ia':''));
      const who = cli?'Cliente':ia?'IA':sys?'Sistema':'Administrativo';
      return `<div class="bubble ${cls}"><div class="who">${who}</div>${m.t}</div>`;
    }).join("");
    return `
      <div class="page-head"><button class="btn btn-sm btn-ghost" onclick="go('#/inbox')">← Inbox</button>
        <h1 style="font-size:18px">${c.cliente}</h1>${badge(c.estado)}<span class="tag">${c.modo}</span></div>
      <div class="chat-wrap">
        <div class="card chat">
          <div class="chat-head"><div class="avatar">${c.cliente[0]}</div><div><b>${c.cliente}</b><div class="muted small">${c.tel}</div></div></div>
          <div class="thread">${bubbles}</div>
          <div class="chat-input"><input placeholder="Escribe un mensaje…"><button class="btn btn-primary">Enviar</button></div>
        </div>
        <div class="chat-side">
          <div class="card">
            <b>Datos del cliente</b>
            <div class="kv"><span>Teléfono</span><b>${c.tel}</b></div>
            <div class="kv"><span>Origen</span><b>${c.origen}</b></div>
            <div class="kv"><span>Clave detectada</span><b>${c.clave||'—'}</b></div>
            <div class="kv"><span>Modo</span><b>${c.modo}</b></div>
            <div class="kv"><span>Pipedrive</span><b><a style="color:var(--iris)" href="javascript:toast('Abriría el Deal en Pipedrive')">Ver deal ↗</a></b></div>
          </div>
          <div class="card">
            <b>Acciones</b>
            <div class="row" style="margin-top:10px">
              <button class="btn btn-sm">Tomar</button>
              <button class="btn btn-sm">Liberar</button>
              <button class="btn btn-sm">Activar IA ⏱</button>
            </div>
            <button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="openAssign('${c.id}')">Asignar a asesor</button>
          </div>
        </div>
      </div>`;
  },

  asignacion(){
    const opts = M.asesores.map(a=>`<option>${a.nombre}</option>`).join("");
    return `
      <div class="page-head"><h1>Asignación manual</h1><span class="sub">Registrar un lead que no entró por WhatsApp (llamada, presencial, portal)</span></div>
      <div class="card pad">
        <div class="form" style="max-width:760px">
          <div class="two">
            <div class="field"><label>Nombre del cliente <span class="req">*</span></label><input placeholder="Ej. Juan Pérez"></div>
            <div class="field"><label>¿Quién registra?</label><input value="Guillermo (Owner)" disabled></div>
          </div>
          <div class="two">
            <div class="field"><label>Teléfono principal <span class="req">*</span></label><input placeholder="55 1234 5678"></div>
            <div class="field"><label>Teléfono secundario</label><input placeholder="opcional"></div>
          </div>
          <div class="two">
            <div class="field"><label>Correo</label><input placeholder="opcional"></div>
            <div class="field"><label>Clave del inmueble <span class="req">*</span></label><input id="clave" placeholder="Ej. HRCV-CENTRO-01"></div>
          </div>
          <div class="two">
            <div class="field"><label>Valor del inmueble</label><input placeholder="opcional"></div>
            <div class="field"><label>Medio de contacto / origen</label>
              <select><option>Inmuebles24</option><option>Mercado Libre</option><option>Lamudi</option><option>Recomendación</option><option>Cartel en propiedad</option><option>Redes sociales</option></select></div>
          </div>
          <div class="field"><label>Reasignación de asesor (override)</label>
            <select><option value="">— (usar la clave) —</option>${opts}</select></div>
          <div class="field"><label>Notas</label><textarea rows="2" placeholder="opcional"></textarea></div>
          <div class="row"><button class="btn btn-primary" onclick="openAssignManual()">Calcular asesor y registrar</button>
            <span class="muted small">Verás el asesor calculado y el motivo antes de confirmar.</span></div>
        </div>
      </div>`;
  },

  asesores(){
    const rows = M.asesores.map(a=>`
      <tr>
        <td><b>${a.nombre}</b></td>
        <td><span class="tag">${a.ini}</span></td>
        <td>${dispBadge(a.disp)}</td>
        <td>${a.carga}/${a.max}</td>
        <td>${a.fallback?'⭐ Sí':'—'}</td>
        <td>${a.ausente?('🌴 Ausente · cubre '+a.cubridor):'Activo'}</td>
        <td class="actions"><button class="btn btn-sm" onclick="go('#/asesores/${a.id}')">Editar</button></td>
      </tr>`).join("");
    return `
      <div class="page-head"><h1>Asesores</h1><span class="sub">${M.asesores.length} activos</span><div class="spacer"></div>
        <button class="btn btn-primary btn-sm" onclick="toast('Abriría el alta de asesor')">+ Nuevo asesor</button></div>
      <div class="card"><table class="table">
        <thead><tr><th>Asesor</th><th>Iniciales</th><th>Disponibilidad</th><th>Carga</th><th>Fallback</th><th>Estado</th><th></th></tr></thead>
        <tbody>${rows}</tbody></table></div>`;
  },

  asesorDetalle(id){
    const a = M.asesores.find(x=>x.id===id)||M.asesores[0];
    const opts = M.asesores.filter(x=>x.id!==a.id).map(x=>`<option ${x.nombre===a.cubridor?'selected':''}>${x.nombre}</option>`).join("");
    return `
      <div class="page-head"><button class="btn btn-sm btn-ghost" onclick="go('#/asesores')">← Asesores</button><h1 style="font-size:18px">${a.nombre}</h1></div>
      <div class="card pad"><div class="form">
        <div class="two">
          <div class="field"><label>Nombre</label><input value="${a.nombre}"></div>
          <div class="field"><label>Iniciales (2 letras) — únicas</label><input value="${a.ini}" maxlength="2"></div>
        </div>
        <div class="two">
          <div class="field"><label>ID Pipedrive</label><input value="61440${id.slice(1)}8"></div>
          <div class="field"><label>Canal de Slack</label><input value="#asesor-${a.ini.toLowerCase()}"></div>
        </div>
        <div class="two">
          <div class="field"><label>Disponibilidad</label><select><option ${a.disp==='DISPONIBLE'?'selected':''}>DISPONIBLE</option><option ${a.disp==='OCUPADO'?'selected':''}>OCUPADO</option><option ${a.disp==='FUERA'?'selected':''}>FUERA</option></select></div>
          <div class="field"><label>Carga máxima</label><input type="number" value="${a.max}"></div>
        </div>
        <div class="two">
          <div class="field"><label>Ausente desde</label><input type="date" value="${a.ausente?'2026-07-01':''}"></div>
          <div class="field"><label>Ausente hasta</label><input type="date" value="${a.ausente?'2026-07-05':''}"></div>
        </div>
        <div class="two">
          <div class="field"><label>Cubridor (durante ausencia)</label><select><option value="">—</option>${opts}</select></div>
          <div class="field"><label>¿Es fallback?</label><select><option ${a.fallback?'selected':''}>Sí</option><option ${!a.fallback?'selected':''}>No</option></select></div>
        </div>
        <div class="note">"Eliminar" es <b>baja lógica</b>: el asesor se desactiva (deja de recibir leads) pero conserva su historial.</div>
        <div class="row"><button class="btn btn-primary" onclick="toast('Cambios guardados (demo)')">Guardar</button>
          <button class="btn" onclick="toast('Asesor desactivado (demo)')">Desactivar</button></div>
      </div></div>`;
  },

  horarios(){
    const rows = M.horarios.map(h=>`<tr><td><b>${h.dia}</b></td><td>${h.tramos}</td>
      <td class="actions"><button class="btn btn-sm">Editar</button></td></tr>`).join("");
    const exc = M.excepciones.map(e=>`<tr><td>${e.fecha}</td><td><span class="tag">${e.tipo}</span></td><td>${e.desc}</td></tr>`).join("");
    return `
      <div class="page-head"><h1>Horarios</h1><span class="sub">Cuándo atiende personal vs. cuándo entra la IA</span></div>
      <div class="grid" style="grid-template-columns:1fr 1fr">
        <div class="card pad"><div class="row"><b>Horario semanal</b><div class="spacer"></div><button class="btn btn-sm">+ Tramo</button></div>
          <table class="table" style="margin-top:10px"><tbody>${rows}</tbody></table></div>
        <div>
          <div class="card pad"><div class="row"><b>Configuración</b></div>
            <div class="kv"><span>Zona horaria</span><b>America/Mexico_City</b></div>
            <div class="kv"><span>SLA (min)</span><b>10</b></div>
            <div class="kv"><span>IA global</span><span class="badge b-ok">Activa</span></div>
          </div>
          <div class="card pad" style="margin-top:16px"><div class="row"><b>Excepciones</b><div class="spacer"></div><button class="btn btn-sm">+ Excepción</button></div>
            <table class="table" style="margin-top:10px"><thead><tr><th>Fecha</th><th>Tipo</th><th>Descripción</th></tr></thead><tbody>${exc}</tbody></table></div>
        </div>
      </div>`;
  },

  reglas(){
    const rows = M.reglas.map(r=>`<tr><td>${r.propietario}</td><td><span class="tag">${r.clave}</span></td><td><b>${r.destino}</b></td><td class="muted">${r.nota}</td>
      <td class="actions"><button class="btn btn-sm">Editar</button></td></tr>`).join("");
    return `
      <div class="page-head"><h1>Reglas de reasignación</h1><span class="sub">(asesor propietario, clave) → asesor destino</span><div class="spacer"></div>
        <button class="btn btn-primary btn-sm">+ Nueva regla</button></div>
      <div class="card"><table class="table">
        <thead><tr><th>Propietario</th><th>Clave del inmueble</th><th>Destino</th><th>Nota</th><th></th></tr></thead>
        <tbody>${rows}</tbody></table></div>`;
  },

  conocimiento(){
    const docs = M.conocimiento.map(d=>`<tr><td><b>${d.nombre}</b></td><td><span class="tag">${d.tipo}</span></td>
      <td>${d.estado==='Indexado'?'<span class="badge b-ok">Indexado</span>':'<span class="badge b-warn">Pendiente</span>'}</td>
      <td>${d.chunks}</td><td class="muted">${d.vig}</td></tr>`).join("");
    const props = M.propuestas.map(p=>`<div class="card pad" style="margin-bottom:10px"><div class="row"><div><b>${p.txt}</b><div class="muted small">${p.origen}</div></div><div class="spacer"></div>
      <button class="btn btn-sm btn-primary" onclick="toast('Propuesta aprobada (demo)')">Aprobar</button><button class="btn btn-sm" onclick="toast('Propuesta rechazada (demo)')">Rechazar</button></div></div>`).join("");
    return `
      <div class="page-head"><h1>Base de conocimientos</h1><span class="sub">Lo que sabe el agente IA (sin catálogo de propiedades)</span></div>
      <div class="tabs">
        <div class="tab active" onclick="showTab(this,'kn',0)">Documentos</div>
        <div class="tab" onclick="showTab(this,'kn',1)">Identidad del agente</div>
        <div class="tab" onclick="showTab(this,'kn',2)">Propuestas (${M.propuestas.length})</div>
        <div class="tab" onclick="showTab(this,'kn',3)">Playground</div>
      </div>
      <div data-tab="kn" data-i="0">
        <div class="row" style="margin-bottom:12px"><div class="spacer"></div><button class="btn btn-primary btn-sm">+ Subir documento</button></div>
        <div class="card"><table class="table"><thead><tr><th>Documento</th><th>Tipo</th><th>Estado</th><th>Chunks</th><th>Vigencia</th></tr></thead><tbody>${docs}</tbody></table></div>
      </div>
      <div class="hidden" data-tab="kn" data-i="1"><div class="card pad"><div class="field"><label>Identidad / contexto del agente (system prompt)</label>
        <textarea rows="8">Eres el asistente de CrossHome, inmobiliaria. Tono cercano y profesional. No inventes precios ni datos fuera de la información oficial. Pide siempre la clave del inmueble (o link/foto del cartel) para asignar al asesor. Escala a un humano si el cliente lo pide o está molesto.</textarea></div>
        <button class="btn btn-primary" onclick="toast('Identidad guardada (demo)')">Guardar</button></div></div>
      <div class="hidden" data-tab="kn" data-i="2">${props||'<div class="muted">Sin propuestas.</div>'}</div>
      <div class="hidden" data-tab="kn" data-i="3"><div class="card pad">
        <div class="field"><label>Probar pregunta</label><input value="¿Qué necesito para apartar una casa?"></div>
        <button class="btn btn-primary" onclick="toast('Respondería usando la base de conocimientos')">Probar</button>
        <div class="preview-box" style="margin-top:14px"><b>Respuesta (demo):</b> Para apartar necesitas una identificación y el anticipo según la política…
          <div class="small muted" style="margin-top:8px">Fuentes: <span class="tag">Política de créditos</span> <span class="tag">FAQ generales</span></div></div>
      </div></div>`;
  },

  metricas(){
    const mx = Math.max(...M.metricas.porDia.map(d=>d.v));
    const bars = M.metricas.porDia.map(d=>`<div class="b"><div class="bar" style="height:${Math.round(d.v/mx*140)}px"></div>${d.d}</div>`).join("");
    const m=M.metricas;
    return `
      <div class="page-head"><h1>Métricas de recepción</h1><span class="sub">La conversión del lead vive en Pipedrive</span><div class="spacer"></div>
        <select style="max-width:160px"><option>Últimos 7 días</option><option>Últimos 30 días</option></select></div>
      <div class="stats">
        <div class="card stat"><div class="l">Leads captados</div><div class="n">${m.captados}</div><div class="d muted">+12% vs semana previa</div></div>
        <div class="card stat"><div class="l">Atendidos por IA</div><div class="n">${m.ia}</div><div class="d muted">${Math.round(m.ia/m.captados*100)}% del total</div></div>
        <div class="card stat"><div class="l">Atendidos por humano</div><div class="n">${m.humano}</div><div class="d muted">${Math.round(m.humano/m.captados*100)}% del total</div></div>
        <div class="card stat"><div class="l">Tiempo de respuesta</div><div class="n">${m.tResp}</div><div class="d muted">${m.perdidos} leads perdidos</div></div>
      </div>
      <div class="card pad" style="margin-top:16px"><b>Leads captados por día</b><div class="bars">${bars}</div></div>`;
  },

  auditoria(){
    const rows = M.logs.map(l=>`<tr><td class="muted">${l.h}</td><td><span class="tag">${l.cat}</span></td><td>${nivBadge(l.niv)}</td>
      <td><code>${l.accion}</code></td><td>${l.res}</td></tr>`).join("");
    return `
      <div class="page-head"><h1>Auditoría / Logs</h1><span class="sub">Registro unificado (tLog) — solo Owner</span></div>
      <div class="card pad" style="margin-bottom:14px"><div class="row">
        <select style="max-width:170px"><option>Categoría: todas</option><option>ASIGNACION</option><option>INTEGRACION</option><option>AGENTE_ADMIN</option><option>CONVERSACION</option><option>AUTENTICACION</option></select>
        <select style="max-width:150px"><option>Nivel: todos</option><option>INFO</option><option>WARN</option><option>ERROR</option></select>
        <input type="date" style="max-width:160px"><input placeholder="Buscar acción…" style="max-width:200px">
      </div></div>
      <div class="card"><table class="table"><thead><tr><th>Hora</th><th>Categoría</th><th>Nivel</th><th>Acción</th><th>Resultado</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  },

  config(){
    const usuarios = M.usuarios.map(u=>`<tr><td><b>${u.nombre}</b></td><td>${u.email}</td><td><span class="tag">${u.rol}</span></td>
      <td>${u.activo?'<span class="badge b-ok">Activo</span>':'<span class="badge b-lost">Inactivo</span>'}</td>
      <td class="actions"><button class="btn btn-sm">Editar</button></td></tr>`).join("");
    const admins = M.usuarios.map(u=>`<tr><td><b>${u.nombre}</b></td><td>${u.tel}</td>
      <td><div class="switch ${u.admin?'':'off'}" onclick="this.classList.toggle('off')"><i></i></div></td></tr>`).join("");
    return `
      <div class="page-head"><h1>Configuración</h1><span class="sub">Solo Owner</span></div>
      <div class="tabs">
        <div class="tab active" onclick="showTab(this,'cf',0)">IA</div>
        <div class="tab" onclick="showTab(this,'cf',1)">Integraciones</div>
        <div class="tab" onclick="showTab(this,'cf',2)">Usuarios</div>
        <div class="tab" onclick="showTab(this,'cf',3)">Agente admin</div>
        <div class="tab" onclick="showTab(this,'cf',4)">Plantillas</div>
      </div>
      <div data-tab="cf" data-i="0"><div class="card pad"><div class="form">
        <div class="row"><b>Kill-switch IA global</b><div class="spacer"></div><div class="switch" onclick="this.classList.toggle('off')"><i></i></div></div>
        <div class="field"><label>SLA (minutos)</label><input value="10" style="max-width:120px"></div>
        <div class="field"><label>Mensaje fuera de horario</label><textarea rows="2">Gracias por escribir a CrossHome. En este momento estamos fuera de horario; nuestro asistente te ayudará. 🤖</textarea></div>
        <div class="field"><label>Mensaje de transición (handoff)</label><textarea rows="2">¡Listo! El asesor {asesor} te contactará en breve por este medio. 🤝</textarea></div>
        <button class="btn btn-primary">Guardar</button></div></div></div>
      <div class="hidden" data-tab="cf" data-i="1"><div class="grid" style="grid-template-columns:1fr 1fr 1fr">
        <div class="card pad"><b>WhatsApp Cloud API</b><div class="kv"><span>Estado</span><span class="badge b-ok">Conectado</span></div><button class="btn btn-sm" style="margin-top:8px">Probar</button></div>
        <div class="card pad"><b>Pipedrive</b><div class="kv"><span>Estado</span><span class="badge b-ok">Conectado</span></div><button class="btn btn-sm" style="margin-top:8px">Probar</button></div>
        <div class="card pad"><b>Slack</b><div class="kv"><span>Estado</span><span class="badge b-warn">Revisar token</span></div><button class="btn btn-sm" style="margin-top:8px">Reconectar</button></div>
      </div></div>
      <div class="hidden" data-tab="cf" data-i="2"><div class="row" style="margin-bottom:10px"><div class="spacer"></div><button class="btn btn-primary btn-sm">+ Usuario</button></div>
        <div class="card"><table class="table"><thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th></th></tr></thead><tbody>${usuarios}</tbody></table></div></div>
      <div class="hidden" data-tab="cf" data-i="3"><div class="note">Números autorizados para dar comandos al <b>agente IA administrativo por WhatsApp</b> (reasignar, asignar, consultar).</div>
        <div class="card" style="margin-top:12px"><table class="table"><thead><tr><th>Usuario</th><th>Teléfono</th><th>Autorizado</th></tr></thead><tbody>${admins}</tbody></table></div></div>
      <div class="hidden" data-tab="cf" data-i="4"><div class="note">Plantillas aprobadas por Meta para mensajes iniciados por la empresa — <b>Fase 2/3</b>.</div>
        <div class="card pad" style="margin-top:12px;color:var(--muted)">Aún sin plantillas. Aquí se listarían las plantillas (utility / marketing / authentication) con su estado de aprobación.</div></div>`;
  },

  perfil(){
    const u=M.usuario;
    return `
      <div class="page-head"><h1>Mi cuenta</h1></div>
      <div class="card pad"><div class="form">
        <div class="row"><div class="avatar" style="width:48px;height:48px">${u.iniciales}</div><div><b>${u.nombre}</b><div class="muted small">${u.rol}</div></div></div>
        <div class="field"><label>Nombre</label><input value="${u.nombre}"></div>
        <div class="field"><label>Email</label><input value="owner@crosshome.mx"></div>
        <hr style="border:none;border-top:1px solid var(--border)">
        <b>Cambiar contraseña</b>
        <div class="two"><div class="field"><label>Nueva contraseña</label><input type="password" value="••••••"></div>
          <div class="field"><label>Confirmar</label><input type="password" value="••••••"></div></div>
        <div class="row"><button class="btn btn-primary" onclick="toast('Guardado (demo)')">Guardar</button>
          <button class="btn" onclick="location.href='index.html'">Cerrar sesión</button></div>
      </div></div>`;
  },
};

/* ---------------- Router ---------------- */
function render(){
  const raw = location.hash.replace(/^#\/?/,'') || 'inbox';
  const [seg,id] = raw.split('/');
  document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active', a.dataset.route===seg));
  $('#crumb').textContent = CRUMB[seg] || 'Inbox';
  let fn = VIEWS[seg];
  if(seg==='inbox' && id) fn = ()=>VIEWS.conversacion(id);
  if(seg==='asesores' && id) fn = ()=>VIEWS.asesorDetalle(id);
  $('#content').innerHTML = (fn?fn(id):VIEWS.inbox());
  $('#content').scrollTop = 0;
}
window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);

/* ---------------- Interactividad ---------------- */
function showTab(el, group, i){
  el.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll(`[data-tab="${group}"]`).forEach(p=>p.classList.toggle('hidden', +p.dataset.i!==i));
}
function toast(msg){
  const t=document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2200);
}
function toggleIA(el){ el.classList.toggle('off'); toast('IA global '+(el.classList.contains('off')?'desactivada':'activada')); }

function modal(html){
  const o=document.createElement('div'); o.className='overlay'; o.onclick=e=>{if(e.target===o)o.remove()};
  o.innerHTML=`<div class="modal">${html}</div>`; document.body.appendChild(o); return o;
}
function closeModal(){ document.querySelector('.overlay')?.remove(); }

function openAssign(convId){
  const c=M.conversaciones.find(x=>x.id===convId);
  const clave=c.clave||'(sin clave)';
  const destino = c.clave? destinoPorClave(c.clave) : {asesor:'(selecciona)',motivo:'requiere clave'};
  const opts=M.asesores.map(a=>`<option ${a.nombre===destino.asesor?'selected':''}>${a.nombre}</option>`).join("");
  modal(`
    <h3>Asignar lead</h3><div class="muted small">${c.cliente} · ${c.tel}</div>
    <div class="preview-box">
      <div class="kv"><span>Clave</span><b>${clave}</b></div>
      <div class="kv"><span>Asesor calculado</span><b>${destino.asesor}</b></div>
      <div class="kv"><span>Motivo</span><b>${destino.motivo}</b></div>
    </div>
    <div class="field"><label>Override (opcional)</label><select>${opts}</select></div>
    <div class="row" style="margin-top:16px"><div class="spacer"></div>
      <button class="btn" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="closeModal();toast('Asignado: ${destino.asesor} → owner en Pipedrive + Slack + handoff')">Confirmar asignación</button></div>`);
}
function openAssignManual(){
  const clave=($('#clave')?.value||'').trim().toUpperCase();
  const destino = clave? destinoPorClave(clave) : {asesor:'(fallback) Carolina Ruiz',motivo:'sin clave → fallback'};
  modal(`
    <h3>Confirmar registro</h3>
    <div class="preview-box">
      <div class="kv"><span>Clave</span><b>${clave||'—'}</b></div>
      <div class="kv"><span>Asesor calculado</span><b>${destino.asesor}</b></div>
      <div class="kv"><span>Motivo</span><b>${destino.motivo}</b></div>
    </div>
    <div class="row" style="margin-top:8px"><div class="spacer"></div>
      <button class="btn" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="closeModal();toast('Registrado y asignado (demo)')">Confirmar</button></div>`);
}
/* mini resolverAsesorDestino: prefijo de 2 letras → asesor; con reglas/ausencia demo */
function destinoPorClave(clave){
  const pre=clave.slice(0,2).toUpperCase();
  const regla=M.reglas.find(r=>r.clave.toUpperCase()===clave);
  if(regla) return {asesor:regla.destino, motivo:'reasignación por propiedad'};
  const a=M.asesores.find(x=>x.ini===pre);
  if(!a) return {asesor:'(fallback) Carolina Ruiz', motivo:'prefijo no reconocido → fallback'};
  if(a.ausente) return {asesor:a.cubridor, motivo:'reasignación por ausencia (cubridor)'};
  return {asesor:a.nombre, motivo:'asignación directa'};
}
window.go=go; window.showTab=showTab; window.toast=toast; window.toggleIA=toggleIA;
window.openAssign=openAssign; window.openAssignManual=openAssignManual; window.closeModal=closeModal;

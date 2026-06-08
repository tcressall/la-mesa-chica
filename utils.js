// ============================================================
// LA MESA CHICA — Componente de estrellas
// ============================================================

// Renderizar estrellas estáticas (para mostrar promedios)
function renderStars(container, value, size = 16) {
  if (!container) return
  container.innerHTML = ''
  for (let i = 1; i <= 5; i++) {
    const wrap = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    wrap.setAttribute('viewBox', '0 0 24 24')
    wrap.style.cssText = `width:${size}px;height:${size}px;flex-shrink:0;`
    const points = '12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26'

    if (value >= i) {
      // Estrella llena
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      p.setAttribute('points', points)
      p.setAttribute('fill', '#C9873A')
      wrap.appendChild(p)
    } else if (value >= i - 0.5) {
      // Media estrella
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
      const uid = 'h' + Math.random().toString(36).slice(2, 7)
      defs.innerHTML = `<clipPath id="${uid}"><rect x="0" y="0" width="12" height="24"/></clipPath>`
      wrap.appendChild(defs)
      const bg = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      bg.setAttribute('points', points)
      bg.setAttribute('fill', 'none')
      bg.setAttribute('stroke', 'rgba(201,135,58,0.3)')
      bg.setAttribute('stroke-width', '1.5')
      wrap.appendChild(bg)
      const fg = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      fg.setAttribute('points', points)
      fg.setAttribute('fill', '#C9873A')
      fg.setAttribute('clip-path', `url(#${uid})`)
      wrap.appendChild(fg)
    } else {
      // Estrella vacía
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      p.setAttribute('points', points)
      p.setAttribute('fill', 'none')
      p.setAttribute('stroke', 'rgba(201,135,58,0.3)')
      p.setAttribute('stroke-width', '1.5')
      wrap.appendChild(p)
    }
    container.appendChild(wrap)
  }
}

// Construir widget de rating interactivo
// container: el div donde se monta
// fieldName: string identificador
// onChange: callback(value)
function buildRatingWidget(container, fieldName, onChange) {
  if (!container) return
  container.innerHTML = ''
  container.style.cssText = 'display:flex;gap:4px;align-items:center;'

  let current = 0
  const points = '12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26'

  function makeStar(i) {
    const wrap = document.createElement('div')
    wrap.style.cssText = 'position:relative;width:28px;height:28px;cursor:pointer;flex-shrink:0;'

    const svgWrap = document.createElement('div')
    svgWrap.style.cssText = 'position:absolute;inset:0;pointer-events:none;'
    svgWrap.id = `star-${fieldName}-${i}`

    const leftHit = document.createElement('div')
    leftHit.style.cssText = 'position:absolute;left:0;top:0;width:14px;height:28px;z-index:2;'
    leftHit.addEventListener('mouseover', () => preview(i - 0.5))
    leftHit.addEventListener('click', () => setVal(i - 0.5))

    const rightHit = document.createElement('div')
    rightHit.style.cssText = 'position:absolute;right:0;top:0;width:14px;height:28px;z-index:2;'
    rightHit.addEventListener('mouseover', () => preview(i))
    rightHit.addEventListener('click', () => setVal(i))

    wrap.appendChild(svgWrap)
    wrap.appendChild(leftHit)
    wrap.appendChild(rightHit)
    container.appendChild(wrap)
  }

  function drawStar(i, val) {
    const wrap = document.getElementById(`star-${fieldName}-${i}`)
    if (!wrap) return
    wrap.innerHTML = ''
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.style.cssText = 'width:28px;height:28px;display:block;'

    if (val >= i) {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      p.setAttribute('points', points)
      p.setAttribute('fill', '#C9873A')
      svg.appendChild(p)
    } else if (val >= i - 0.5) {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
      const uid = 'hi' + Math.random().toString(36).slice(2, 7)
      defs.innerHTML = `<clipPath id="${uid}"><rect x="0" y="0" width="12" height="24"/></clipPath>`
      svg.appendChild(defs)
      const bg = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      bg.setAttribute('points', points)
      bg.setAttribute('fill', 'none')
      bg.setAttribute('stroke', 'rgba(201,135,58,0.3)')
      bg.setAttribute('stroke-width', '1.5')
      svg.appendChild(bg)
      const fg = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      fg.setAttribute('points', points)
      fg.setAttribute('fill', '#C9873A')
      fg.setAttribute('clip-path', `url(#${uid})`)
      svg.appendChild(fg)
    } else {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      p.setAttribute('points', points)
      p.setAttribute('fill', 'none')
      p.setAttribute('stroke', 'rgba(201,135,58,0.3)')
      p.setAttribute('stroke-width', '1.5')
      svg.appendChild(p)
    }
    wrap.appendChild(svg)
  }

  function refresh(val) {
    for (let i = 1; i <= 5; i++) drawStar(i, val)
  }

  function preview(val) { refresh(val) }

  function setVal(val) {
    current = val
    refresh(val)
    if (onChange) onChange(val)
  }

  container.addEventListener('mouseleave', () => refresh(current))

  for (let i = 1; i <= 5; i++) makeStar(i)
  refresh(0)

  return {
    getValue: () => current,
    setValue: (v) => { current = v; refresh(v) }
  }
}

// Mostrar toast
function showToast(msg, type = 'success') {
  let toast = document.getElementById('toast')
  if (!toast) {
    toast = document.createElement('div')
    toast.id = 'toast'
    toast.className = 'toast'
    document.body.appendChild(toast)
  }
  toast.textContent = msg
  toast.className = `toast ${type}`
  setTimeout(() => toast.classList.add('show'), 10)
  setTimeout(() => toast.classList.remove('show'), 3000)
}

// Iniciales para avatar
function getInitials(nombre) {
  if (!nombre) return '?'
  return nombre.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

// Formatear fecha
function formatFecha(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Precio rango → label legible
function precioLabel(rango) {
  const map = {
    '20-30':   'USD 20–30',
    '31-50':   'USD 31–50',
    '51-70':   'USD 51–70',
    '71-100':  'USD 71–100',
    '101-150': 'USD 101–150',
    '150+':    'USD +150'
  }
  return map[rango] || rango
}

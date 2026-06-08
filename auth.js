// ============================================================
// LA MESA CHICA — Auth helpers
// ============================================================

// Inicializar cliente Supabase (se llama desde cada página)
function initSupabase() {
  return supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY)
}

// Obtener sesión activa — redirige al login si no hay sesión
async function requireAuth(client) {
  const { data: { session } } = await client.auth.getSession()
  if (!session) {
    window.location.href = '/index.html'
    return null
  }
  return session
}

// Obtener perfil del usuario logueado
async function getUserProfile(client, userId) {
  const { data, error } = await client
    .from('usuarios')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) console.error('Error cargando perfil:', error)
  return data
}

// Cerrar sesión
async function signOut(client) {
  await client.auth.signOut()
  window.location.href = '/index.html'
}

// Verificar si el usuario es admin
function isAdmin(profile) {
  return profile?.rol === 'admin'
}

// Manejar el magic link callback (token en la URL)
async function handleAuthCallback(client) {
  const { data, error } = await client.auth.getSession()
  if (error) console.error('Error en callback:', error)
  return data?.session
}

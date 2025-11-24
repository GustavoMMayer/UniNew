const logger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log da requisição
  console.log('\n📥 ===== REQUISIÇÃO =====');
  console.log(`⏰ ${new Date().toISOString()}`);
  console.log(`🔵 ${req.method} ${req.originalUrl}`);
  console.log(`📍 IP: ${req.ip || req.connection.remoteAddress}`);
  
  if (req.headers.authorization) {
    console.log(`🔑 Auth: ${req.headers.authorization.substring(0, 20)}...`);
  }
  
  if (req.body && Object.keys(req.body).length > 0) {
    const bodyCopy = { ...req.body };
    // Ocultar senha nos logs
    if (bodyCopy.senha) bodyCopy.senha = '***';
    if (bodyCopy.password) bodyCopy.password = '***';
    console.log('📦 Body:', JSON.stringify(bodyCopy, null, 2));
  }
  
  if (req.query && Object.keys(req.query).length > 0) {
    console.log('🔍 Query:', req.query);
  }
  
  // Interceptar a resposta
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    
    console.log('\n📤 ===== RESPOSTA =====');
    console.log(`🔵 ${req.method} ${req.originalUrl}`);
    console.log(`⚡ Status: ${res.statusCode}`);
    console.log(`⏱️  Duração: ${duration}ms`);
    
    // Log do body da resposta (limitado para não poluir muito)
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const responseCopy = { ...parsed };
        
        // Ocultar tokens e senhas nos logs de resposta
        if (responseCopy.token) {
          responseCopy.token = responseCopy.token.substring(0, 20) + '...';
        }
        if (responseCopy.usuario && responseCopy.usuario.senha) {
          delete responseCopy.usuario.senha;
        }
        
        console.log('📦 Response:', JSON.stringify(responseCopy, null, 2));
      } catch (e) {
        // Se não for JSON, mostrar texto limitado
        const preview = data.toString().substring(0, 200);
        console.log('📦 Response:', preview + (data.length > 200 ? '...' : ''));
      }
    }
    
    console.log('========================\n');
    
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = logger;

/* global.js - versão estendida
   - MODO_TESTE = true: mock backend persistido em localStorage (mock_db_v1)
   - coleções: usuarios, alunos, docentes, fornecedores, cursos, disciplinas, notas
   - API pública: API.get/post/put/delete, API.resource(...)
   - auth: POST /auth/login e POST /auth/logout (mock aceita cpf/email/senha)
   - utilitários: API.resetMock(), API.getMockDb()
*/

// --- MODO DE TESTE ---
const MODO_TESTE = true;
// ----------------------

(function (window) {
  const STORAGE_KEY = 'usuario_logado';
  const MOCK_DB_KEY = 'mock_db_v1';

  // Config chave por recurso
  const CHAVE_POR_RESOURCE = {
    fornecedores: 'cnpj',
    alunos: 'cpf',
    docentes: 'cpf',
    usuarios: 'cpf',
    cursos: 'codigo',
    disciplinas: 'codigo',
    notas: 'id' // notas terão id gerado no mock
  };

  // --- Mock DB helpers ---
  function _initialMockDb() {
    const usuarios = [
      { cpf: '11111111111', nome: 'Aluno Teste', email: 'aluno@teste.com', telefone: '0000-0001', tipo_conta: 'aluno', senha: 'senha123' },
      { cpf: '22222222222', nome: 'Docente Teste', email: 'docente@teste.com', telefone: '0000-0002', tipo_conta: 'docente', senha: 'senha123' },
      { cpf: '33333333333', nome: 'Funcionario Teste', email: 'func@teste.com', telefone: '0000-0003', tipo_conta: 'funcionario', senha: 'senha123' },
      { cpf: '44444444444', nome: 'Gerente Teste', email: 'gerente@teste.com', telefone: '0000-0004', tipo_conta: 'gerente', senha: 'senha123' }
    ];

    const alunos = usuarios.filter(u => u.tipo_conta === 'aluno').map(u => ({
      cpf: u.cpf, nome: u.nome, email: u.email, telefone: u.telefone, curso: 'ADS', situacao: 'Ativo'
    }));

    const docentes = [
      { cpf: '22222222222', nome: 'Docente Teste', grau_academico: 'Mestrado', disciplina: 'Algoritmos', carga_horaria: 40 }
    ];

    const fornecedores = [
      { cnpj: '12345678000199', razao_social: 'Fornecedor Teste LTDA', contatos: ['contato@f.t'], servicos: ['Reciclagem'] }
    ];

    const cursos = [
      { codigo: 'ADS', nome: 'Análise e Desenvolvimento de Sistemas', disciplinas: ['ALG','LP'] }
    ];

    const disciplinas = [
      { codigo: 'ALG', nome: 'Algoritmos', carga_horaria: 60 },
      { codigo: 'LP', nome: 'Linguagem de Programação', carga_horaria: 60 }
    ];

    const notas = [
      { id: 'n1', cpf: '11111111111', disciplina: 'ALG', nota: 8.5 }
    ];

    return { usuarios, alunos, docentes, fornecedores, cursos, disciplinas, notas };
  }

  function _loadMockDb() {
    const raw = localStorage.getItem(MOCK_DB_KEY);
    if (!raw) {
      const init = _initialMockDb();
      localStorage.setItem(MOCK_DB_KEY, JSON.stringify(init));
      return init;
    }
    try { return JSON.parse(raw); } catch (e) {
      const init = _initialMockDb();
      localStorage.setItem(MOCK_DB_KEY, JSON.stringify(init));
      return init;
    }
  }
  function _saveMockDb(db) { localStorage.setItem(MOCK_DB_KEY, JSON.stringify(db)); }

  // util: gera id simples para notas
  function _genId(prefix = 'id') { return prefix + '_' + Math.random().toString(36).slice(2,9); }

  // parse endpoint (('/usuarios/111' or '/usuarios?cpf=111') => segments, params)
  function _parseEndpoint(endpoint) {
    const u = String(endpoint).replace(/^https?:\/\/[^/]+/, '');
    const [pathPart, qs] = u.split('?');
    const path = pathPart.replace(/^\/+|\/+$/g, '');
    const segments = path ? path.split('/') : [];
    const params = {};
    if (qs) new URLSearchParams(qs).forEach((v,k)=>params[k]=v);
    return { segments, params };
  }

  // mock handler
  async function _mockRequest(method, endpoint, data=null) {
    // delay simulado
    await new Promise(r=>setTimeout(r,50));
    const db = _loadMockDb();
    const { segments, params } = _parseEndpoint(endpoint);

    // auth
    if (segments[0] === 'auth') {
      if (segments[1] === 'login' && method.toUpperCase()==='POST') {
        const { email, cpf, senha, username, password } = data || {};
        // aceita varias chaves
        const found = db.usuarios.find(u =>
          (email && u.email === email) ||
          (cpf && u.cpf === cpf) ||
          (username && (u.email === username || u.cpf === username)) ||
          (password && false) // ignore
        );
        const pwd = senha || data?.senha || data?.password;
        if (!found || !pwd || found.senha !== pwd) {
          const err = new Error('Credenciais inválidas'); err.status = 401; err.payload = {message:'Credenciais inválidas'}; throw err;
        }
        const usuario = Object.assign({}, found); delete usuario.senha;
        return { token: `mock-token-${found.cpf||found.cnpj}`, usuario };
      }
      if (segments[1] === 'logout' && method.toUpperCase()==='POST') return { ok: true };
    }

    // resource
    const resource = segments[0];
    if (!resource) return { message: 'mock ok' };
    const collection = db[resource];
    if (!Array.isArray(collection)) { const err=new Error('Recurso não encontrado'); err.status=404; err.payload={message:'Recurso não encontrado'}; throw err; }

    const chave = CHAVE_POR_RESOURCE[resource] || 'id';
    const idSegment = segments[1];

    switch (method.toUpperCase()) {
      case 'GET':
        if (!idSegment) {
          let results = collection.slice();
          Object.keys(params||{}).forEach(k=>{
            results = results.filter(item => String((item[k]??'')).toLowerCase() === String(params[k]).toLowerCase());
          });
          return results;
        } else {
          const id = decodeURIComponent(idSegment);
          const found = collection.find(item => String(item[chave]) === String(id));
          if (!found) { const err=new Error('Não encontrado'); err.status=404; err.payload={message:'Não encontrado'}; throw err; }
          return found;
        }

      case 'POST':
        if (!data || typeof data !== 'object') { const err=new Error('Payload inválido'); err.status=400; err.payload={message:'Payload inválido'}; throw err; }
        if (!data[chave]) { const err=new Error(`${chave} é obrigatório`); err.status=400; err.payload={message:`${chave} é obrigatório`}; throw err; }
        if (collection.find(item => String(item[chave]) === String(data[chave]))) { const err=new Error('Já existe'); err.status=409; err.payload={message:'Registro com essa chave já existe'}; throw err; }
        // se resource notas e id vazio, gerar
        const toSave = Object.assign({}, data);
        if (resource === 'notas' && !toSave.id) toSave.id = _genId('nota');
        collection.push(toSave);
        _saveMockDb(db);
        return toSave;

      case 'PUT':
        if (!idSegment) { const err=new Error('ID ausente'); err.status=400; err.payload={message:'ID ausente'}; throw err; }
        if (!data || typeof data !== 'object') { const err=new Error('Payload inválido'); err.status=400; err.payload={message:'Payload inválido'}; throw err; }
        const id = decodeURIComponent(idSegment);
        const idx = collection.findIndex(item => String(item[chave]) === String(id));
        if (idx === -1) { const err=new Error('Não encontrado para atualizar'); err.status=404; err.payload={message:'Não encontrado'}; throw err; }
        if (data[chave] && String(data[chave]) !== String(id)) { const err=new Error(`Não é permitido alterar a chave ${chave}`); err.status=400; err.payload={message:`Não é permitido alterar a chave ${chave}`}; throw err; }
        collection[idx] = Object.assign({}, collection[idx], data);
        _saveMockDb(db);
        return collection[idx];

      case 'DELETE':
        if (!idSegment) { const err=new Error('ID ausente'); err.status=400; err.payload={message:'ID ausente'}; throw err; }
        const idDel = decodeURIComponent(idSegment);
        const idxDel = collection.findIndex(item => String(item[chave]) === String(idDel));
        if (idxDel === -1) { const err=new Error('Não encontrado para deletar'); err.status=404; err.payload={message:'Não encontrado'}; throw err; }
        const removed = collection.splice(idxDel,1)[0];
        _saveMockDb(db);
        return removed;

      default:
        const err = new Error('Método não suportado no mock'); err.status=405; err.payload={message:'Método não suportado'}; throw err;
    }
  }

  // --- API pública ---
  const API = {
    baseUrl: '/api',

    // request genérica (encaminha pro mock se MODO_TESTE)
    async request(method, endpoint, data=null, extraHeaders={}) {
      if (MODO_TESTE) {
        // normaliza endpoint removendo baseUrl se existir
        const normalized = String(endpoint).replace(new RegExp('^' + this.baseUrl), '');
        try {
          return await _mockRequest(method, normalized, data);
        } catch (e) {
          const err = new Error(e.message || 'Erro mock'); err.status = e.status || 500; err.payload = e.payload || {message: e.message}; throw err;
        }
      }

      // modo real
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
      const opts = { method: method.toUpperCase(), headers: Object.assign({'Content-Type':'application/json'}, extraHeaders) };
      if (data != null && method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'DELETE') opts.body = JSON.stringify(data);
      if (data != null && method.toUpperCase() === 'DELETE') opts.body = JSON.stringify(data);
      const res = await fetch(url, opts);
      const text = await res.text();
      let payload = null;
      try { payload = text ? JSON.parse(text) : null; } catch (e) { payload = text; }
      if (!res.ok) { const err = new Error(payload?.message || `HTTP ${res.status}`); err.status = res.status; err.payload = payload; throw err; }
      return payload;
    },

    get(endpoint, params=null, headers={}) {
      let url = endpoint;
      if (params && typeof params === 'object') {
        const qs = new URLSearchParams(params).toString();
        url = endpoint + (endpoint.includes('?') ? '&' : '?') + qs;
      }
      return this.request('GET', url, null, headers);
    },
    post(endpoint, data={}, headers={}) { return this.request('POST', endpoint, data, headers); },
    put(endpoint, data={}, headers={}) { return this.request('PUT', endpoint, data, headers); },
    delete(endpoint, data=null, headers={}) { return this.request('DELETE', endpoint, data, headers); },

    // usuario_logado
    setUsuarioLogado(obj) {
      if (obj == null) localStorage.removeItem(STORAGE_KEY);
      else {
        // normalize names: garantir que exista 'tipo_conta' e remover senha
        const normalized = Object.assign({}, obj);
        if (normalized.tipoConta && !normalized.tipo_conta) normalized.tipo_conta = normalized.tipoConta;
        if (normalized.tipo && !normalized.tipo_conta) normalized.tipo_conta = normalized.tipo;
        if (normalized.senha) delete normalized.senha;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      }
      _emitAuthChange(obj);
    },
    getUsuarioLogado() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      try { return JSON.parse(raw); } catch (e) { return null; }
    },
    updateUsuarioLogado(patch) {
      const cur = this.getUsuarioLogado() || {};
      const updated = Object.assign({}, cur, patch);
      this.setUsuarioLogado(updated);
      return updated;
    },

    // auth
    async login(credentials) {
      // aceita { email|cpf|username, senha|password }
      const resp = await this.post('/auth/login', credentials);
      if (resp && resp.usuario) {
        const payload = Object.assign({}, resp.usuario);
        if (resp.token) payload.token = resp.token;
        this.setUsuarioLogado(payload);
      }
      return resp;
    },
    async logout(callBackend=false) {
      if (callBackend) { try { await this.post('/auth/logout'); } catch(e){} }
      this.setUsuarioLogado(null);
    },
    authHeaders() {
      const u = this.getUsuarioLogado();
      if (u && u.token) return { Authorization: `Bearer ${u.token}` };
      return {};
    },

    // onAuthChange
    _onAuthChangeCallbacks: [],
    onAuthChange(cb) {
      if (typeof cb === 'function') this._onAuthChangeCallbacks.push(cb);
      return () => { this._onAuthChangeCallbacks = this._onAuthChangeCallbacks.filter(fn => fn !== cb); };
    },

    // recursos helpers
    resource(resourceName) {
      const base = `/${resourceName}`;
      return {
        list: (params={}) => API.get(base, params, API.authHeaders()),
        getById: (id) => API.get(`${base}/${encodeURIComponent(id)}`, null, API.authHeaders()),
        create: (data) => API.post(base, data, API.authHeaders()),
        update: (id, data) => API.put(`${base}/${encodeURIComponent(id)}`, data, API.authHeaders()),
        delete: (id) => API.delete(`${base}/${encodeURIComponent(id)}`, null, API.authHeaders())
      };
    },

    // utilitários de debug / mock
    getMockDb() { if (!MODO_TESTE) return null; return _loadMockDb(); },
    resetMock() { if (!MODO_TESTE) return; localStorage.removeItem(MOCK_DB_KEY); _loadMockDb(); },
  };

  function _emitAuthChange(user) {
    (API._onAuthChangeCallbacks || []).forEach(cb => { try { cb(user); } catch (e) { console.error('onAuthChange callback error', e); } });
  }

  // conveniência resources
  API.alunos = API.resource('alunos');
  API.docentes = API.resource('docentes');
  API.fornecedores = API.resource('fornecedores');
  API.usuarios = API.resource('usuarios');
  API.cursos = API.resource('cursos');
  API.disciplinas = API.resource('disciplinas');
  API.notas = API.resource('notas');

  window.API = API;
})(window);

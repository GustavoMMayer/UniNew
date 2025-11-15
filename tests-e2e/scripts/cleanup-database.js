/**
 * Script de Limpeza do Banco de Dados
 * 
 * Este script limpa todos os dados de teste criados durante a execução dos testes E2E
 * Pode ser executado antes ou depois dos testes para garantir um estado limpo
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function cleanupDatabase() {
  console.log('🧹 Iniciando limpeza do banco de dados...\n');

  const queries = [
    // Limpar notas (não possui DELETE na API)
    "DELETE FROM notas WHERE cpf IN ('11111111111', '22222222222', '33333333333')",
    
    // Limpar usuários de teste
    "DELETE FROM usuarios WHERE cpf IN ('55555555555', '66666666666', '77777777777', '88888888888', '99999999999', '10101010101', '20202020202', '30303030303')",
    
    // Limpar fornecedores de teste
    "DELETE FROM fornecedores WHERE cnpj IN ('12345678000190', '12345678000199', '98765432000188', '11111111111111', '22222222222222', '33333333333333')",
    
    // Limpar disciplinas de teste (não possui DELETE na API)
    "DELETE FROM disciplinas WHERE codigo IN ('TST', 'TE1', 'TE2', 'TE3')",
  ];

  try {
    for (const query of queries) {
      const command = `docker-compose exec -T mysql mysql -uroot -proot123 uninew_db -e "${query}"`;
      
      console.log(`Executando: ${query.substring(0, 50)}...`);
      const { stdout, stderr } = await execPromise(command, {
        cwd: process.cwd().replace('tests-e2e', ''),
      });
      
      if (stderr && !stderr.includes('Warning')) {
        console.error(`❌ Erro: ${stderr}`);
      }
    }
    
    console.log('\n✅ Limpeza concluída com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro ao limpar banco de dados:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  cleanupDatabase();
}

module.exports = { cleanupDatabase };

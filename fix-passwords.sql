UPDATE usuarios 
SET senha = '$2b$10$.mo3C2sYC5OGvkbZyL.5yeDRe8kqxAwQ5viozr3YnUTHpPhWE79CK' 
WHERE cpf IN ('11111111111', '22222222222', '33333333333');

SELECT cpf, nome, email, LEFT(senha, 30) as senha_hash FROM usuarios LIMIT 3;

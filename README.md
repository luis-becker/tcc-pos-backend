# Serviço Back-end
![Tests](https://github.com/luis-becker/tcc-pos-backend/actions/workflows/test.yml/badge.svg)

Esse serviço faz parte do trabalho de conclusão de curso da pós-graduação de Desenvolvimento Full Stack da PUCRS.

Aluno: Luís Fernando Becker Santos

## Configuração de ambiente local

### Pré-requisitos
- Docker
- Git (Opcional)

### Passo a passo
1. Baixe o repositório ou clone-o utilizando o seguinte comando git `git clone https://github.com/luis-becker/tcc-pos-backend.git`
2. Faça build do projeto com `docker compose build`
3. Installe as dependências do serviço com `docker run -v "$(pwd)":/app tcc-pos-backend-app bash -c "npm install"`
4. Rode o serviço com `docker compose up`

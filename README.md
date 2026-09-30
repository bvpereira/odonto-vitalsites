# Vital Odontologia

Landing page estática para `odonto.vitalsites.com.br`, baseada na referência visual fornecida. HTML, CSS e JavaScript sem dependências de build.

## Estrutura

- `index.html`: seções, textos e espaços das imagens.
- `assets/css/styles.css`: identidade visual e estilos responsivos.
- `assets/js/main.js`: carrossel, comparadores e contatos.
- `assets/images/logo.png`: logo original fornecida.
- `.agents/skills/frontend-design/`: referência local de design.

## Prévia local

O Codex pode iniciar `python -m http.server 4173 --bind 127.0.0.1` na raiz. Acesse `http://127.0.0.1:4173`.

## Vercel

Projeto estático: preset Other, sem comando de build, diretório de saída na raiz. O GitHub já é o repositório de origem; domínio e integração dependem da configuração do painel Vercel.

## Conteúdo pendente

- Fotos principal, atendimento, especialidades, emergência e ambientes.
- Três pares de fotos antes/depois e respectivos títulos.
- Logos dos convênios e depoimentos reais.
- Confirmar se o telefone informado também será usado no WhatsApp e fornecer o perfil do Instagram.
- Substituir o telefone de demonstração `(22) 99999-8888` pelo número definitivo, se necessário.
- Confirmar estatísticas da referência antes de substituir os destaques textuais.

Os textos detalhados das especialidades foram transcritos das imagens fornecidas. O atendimento de emergência 24 horas foi mantido da referência. Textos menores não legíveis foram adaptados à Vital Odontologia.

Configure as URLs oficiais no objeto `clinic` em `assets/js/main.js`. Até lá, os botões apresentam um aviso, sem direcionar a números ou perfis fictícios.

## Imagens e interações

Substitua cada `.placeholder` pela imagem correspondente, preservando o contêiner. Nos comparadores, cada `.comparison-layer` recebe uma imagem de mesmo enquadramento; as camadas `.before` e `.after` já estão sobrepostas e recortadas pelo controle. Use texto alternativo, largura e altura nas imagens. A galeria duplica seu grupo automaticamente para o loop contínuo; altere apenas o primeiro grupo no HTML.

O carrossel pausa ao passar o mouse ou pelo botão. A preferência de movimento reduzido desativa sua animação e permite rolagem manual. Os comparadores aceitam arraste, toque e setas do teclado. Especialidades e perguntas frequentes usam elementos nativos `details`.

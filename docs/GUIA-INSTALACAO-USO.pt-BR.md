# Guia de Instalação e Uso — CrisisTrust v0.4

> Guia passo a passo para iniciantes em Windows, Linux e macOS.
>
> **Original creator, project owner, and primary maintainer: Chris Cruz | h4ckd4d**

Este documento ensina como **baixar, instalar dependências, iniciar, atualizar, testar e usar o CrisisTrust** em um computador local.

O CrisisTrust é um projeto open source, local-first e privacy-first. O cliente de referência é executado em `127.0.0.1`, ou seja, somente no próprio computador por padrão.

## 1. O que você vai instalar

Para apenas abrir o CrisisTrust no navegador, você precisa de:

- Git;
- Python 3.12 ou superior;
- um navegador moderno, como Chrome, Edge ou Firefox.

Para executar também os testes automatizados, instale:

- Node.js LTS.

Resumo:

```text
Git       → baixa e atualiza o projeto
Python    → inicia o servidor local
Navegador → abre a interface
Node.js   → executa os testes automatizados
```

## 2. Onde o CrisisTrust deve ficar no computador

Evite instalar projetos dentro de pastas do sistema como:

```text
C:\Windows\System32
```

No Windows, recomendamos:

```text
C:\Users\SEU_USUARIO\GitHub\CrisisTrust
```

Exemplo:

```text
C:\Users\ADM\GitHub\CrisisTrust
```

No Linux/macOS, um local simples é:

```text
~/GitHub/CrisisTrust
```

## 3. Instalação no Windows — passo a passo

### 3.1 Abra o PowerShell

Você pode usar o PowerShell normal. Não é necessário executar como Administrador para usar o CrisisTrust.

### 3.2 Verifique se o Git existe

Execute:

```powershell
git --version
```

Resultado esperado:

```text
git version 2.x.x.windows.x
```

Se o Git não existir e seu Windows tiver `winget`:

```powershell
winget install -e --id Git.Git
```

Feche e abra novamente o PowerShell depois da instalação.

### 3.3 Verifique o Python

Execute:

```powershell
python --version
```

Resultado esperado:

```text
Python 3.12.x
```

Também é possível testar:

```powershell
py --version
```

Se Python não estiver instalado:

```powershell
winget install -e --id Python.Python.3.12
```

Depois da instalação, **feche completamente o PowerShell e abra uma nova janela**.

### 3.4 Se o Windows disser `Python was not found`

Primeiro procure a instalação real:

```powershell
Get-ChildItem "$env:LOCALAPPDATA\Programs\Python" -Recurse -Filter python.exe -ErrorAction SilentlyContinue
```

Um caminho comum é:

```text
C:\Users\SEU_USUARIO\AppData\Local\Programs\Python\Python312\python.exe
```

Teste diretamente:

```powershell
& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" --version
```

Se funcionar, mas `python --version` não funcionar, o problema é PATH ou o App Execution Alias da Microsoft Store.

Você pode verificar qual executável está sendo encontrado:

```powershell
where.exe python
```

Se aparecer apenas:

```text
C:\Users\SEU_USUARIO\AppData\Local\Microsoft\WindowsApps\python.exe
```

esse é o alias da Microsoft Store, não o executável real.

### 3.5 Crie uma pasta para seus projetos GitHub

```powershell
cd $HOME
mkdir GitHub -ErrorAction SilentlyContinue
cd GitHub
```

### 3.6 Clone o CrisisTrust

```powershell
git clone https://github.com/H4ckD4d/CrisisTrust.git
```

Entre na pasta:

```powershell
cd CrisisTrust
```

Confirme:

```powershell
pwd
```

O caminho deverá ser semelhante a:

```text
C:\Users\ADM\GitHub\CrisisTrust
```

## 4. Iniciando o CrisisTrust

Dentro da pasta do projeto, execute:

```powershell
python scripts\serve_local.py
```

Resultado esperado:

```text
CrisisTrust local MVP: http://127.0.0.1:8771
Loopback only. Press Ctrl+C to stop.
```

**Não feche essa janela enquanto estiver usando o sistema.**

Agora abra no navegador:

```text
http://127.0.0.1:8771
```

Para a tela de verificação de recursos comunitários:

```text
http://127.0.0.1:8771/resources.html
```

## 5. Como parar o servidor

Volte ao PowerShell onde o servidor está em execução e pressione:

```text
Ctrl + C
```

## 6. Primeira demonstração

Abra:

```text
http://127.0.0.1:8771
```

Clique em:

```text
Load synthetic demo
```

A aplicação deve mostrar um alerta sintético com informações como:

- Source;
- Integrity;
- Freshness;
- Trusted Circle;
- Action Card;
- Trust Context.

O conteúdo é de demonstração e **não deve ser tratado como alerta real de emergência**.

## 7. Mudando o idioma

Na área **Accessibility & language**, selecione:

```text
English
Português (Brasil)
Español
```

Ao selecionar `Português (Brasil)`, a interface deve mudar imediatamente para textos como:

```text
Acessibilidade e idioma
Limite de segurança
Carregar um alerta sintético ou normalizado
Círculo de Confiança
Recursos comunitários
```

Se o idioma não mudar depois de uma atualização do projeto, faça um hard refresh no navegador:

```text
Ctrl + F5
```

## 8. Testando os recursos de acessibilidade

Na tela principal, teste individualmente:

```text
High contrast
Larger text
Reduced motion
Low-bandwidth mode
Simple-language companion
```

As preferências valem somente para a sessão atual do navegador e não são armazenadas automaticamente pelo cliente de referência.

## 9. Testando o TrustCheck

Role a página até **TrustCheck**.

O TrustCheck ajuda a avaliar pedidos urgentes sem tratar voz, caller ID, foto de perfil ou pressão emocional como autenticação suficiente.

### Cenário A — não confirmado

Selecione algo semelhante a:

```text
Claim type: Family emergency
Requested action: Transfer money
Independent channel: Not checked
Prearranged challenge: Not used
Trusted Circle: Not asked
```

Clique em:

```text
Evaluate verification state
```

O resultado esperado é:

```text
unresolved
```

### Cenário B — confirmação pelo processo

Use:

```text
Independent channel: Confirmed
Prearranged challenge: Passed
```

Sem evidência conflitante, o resultado pode ser:

```text
verified-by-process
```

Isso significa apenas que o fluxo documentado obteve a corroboração exigida. Não é garantia matemática de identidade, verdade ou segurança.

### Cenário C — conflito

Use:

```text
Independent channel: Confirmed
Prearranged challenge: Failed
```

O resultado esperado é:

```text
conflicting
```

## 10. Testando traduções complementares

Primeiro carregue:

```text
Load synthetic demo
```

Depois clique em:

```text
Demo Portuguese translation
```

ou:

```text
Demo Spanish translation
```

A interface deve mostrar:

```text
Original
+
Companion translation
```

A tradução nunca deve substituir silenciosamente o texto original da fonte.

## 11. Testando Community Resource Verification

Abra:

```text
http://127.0.0.1:8771/resources.html
```

A demonstração mostra recursos sintéticos e seu histórico de verificação.

Observe os estados:

```text
verified
unverified
conflicting
stale
unavailable
```

Uma regra importante do projeto é:

```text
single community report
        ≠
automatic verified resource
```

Um relato comunitário é evidência, mas não se transforma automaticamente em confirmação oficial.

## 12. Validando a estrutura do projeto

Abra um segundo PowerShell e entre na pasta:

```powershell
cd "$HOME\GitHub\CrisisTrust"
```

Execute:

```powershell
python scripts\validate_project.py
```

Resultado esperado:

```text
CrisisTrust project validation passed.
```

Esse validador não acessa a Internet.

## 13. Instalando Node.js para executar os testes

Verifique:

```powershell
node --version
```

Se Node.js não estiver instalado:

```powershell
winget install -e --id OpenJS.NodeJS.LTS
```

Feche e abra novamente o PowerShell.

Confirme:

```powershell
node --version
```

## 14. Executando todos os testes manualmente

Na raiz do projeto:

```powershell
node scripts\test_core.js
node scripts\test_trustcheck.js
node scripts\test_accessibility_i18n.js
node scripts\test_resource_verification.js
```

Resultados esperados incluem:

```text
CrisisTrust core tests passed.
CrisisTrust TrustCheck tests passed.
CrisisTrust accessibility, i18n, and translation tests passed.
CrisisTrust community resource verification tests passed.
```

## 15. Atualizando o CrisisTrust

Pare o servidor com:

```text
Ctrl + C
```

Entre na pasta do projeto:

```powershell
cd "$HOME\GitHub\CrisisTrust"
```

Execute:

```powershell
git pull
```

Depois inicie novamente:

```powershell
python scripts\serve_local.py
```

No navegador, faça:

```text
Ctrl + F5
```

para evitar que arquivos JavaScript antigos permaneçam em cache.

## 16. Erro `Could not resolve host: github.com`

Exemplo:

```text
fatal: unable to access 'https://github.com/...':
Could not resolve host: github.com
```

Isso significa que o Git não conseguiu resolver o domínio `github.com`. Normalmente é um problema de rede, DNS, VPN, proxy ou conexão temporária.

Primeiro teste:

```powershell
Resolve-DnsName github.com
```

Depois:

```powershell
Test-NetConnection github.com -Port 443
```

Se a resolução DNS falhar, tente:

```powershell
ipconfig /flushdns
```

Depois teste novamente:

```powershell
Resolve-DnsName github.com
```

Também verifique se:

- sua Internet está funcionando;
- uma VPN não está bloqueando a resolução;
- um proxy corporativo não está interferindo;
- firewall ou filtro DNS não está bloqueando GitHub.

O CrisisTrust local continuará funcionando mesmo que o GitHub esteja temporariamente inacessível; apenas `git pull`, `git clone` e outras operações remotas ficarão indisponíveis.

## 17. Erro `cannot spawn less`

Exemplo:

```text
error: cannot spawn less: No such file or directory
fatal: unable to execute pager 'less'
```

Esse erro é do paginador configurado no Git, não do CrisisTrust.

Para ver o último commit sem paginador:

```powershell
git --no-pager log -1 --oneline
```

Para desativar o paginador globalmente:

```powershell
git config --global core.pager cat
```

Depois:

```powershell
git log -1 --oneline
```

Para desfazer essa configuração no futuro:

```powershell
git config --global --unset core.pager
```

## 18. Mensagem `favicon.ico 404`

No terminal do servidor você pode ver:

```text
GET /favicon.ico HTTP/1.1 404
```

Isso significa apenas que o navegador procurou um ícone de aba que ainda não existe no projeto.

Esse `404` não impede o funcionamento do CrisisTrust e não indica falha no protocolo, dashboard ou servidor local.

## 19. Erro `Address already in use`

Se a porta `8771` já estiver em uso, provavelmente existe outra instância do servidor ainda aberta.

No Windows, verifique:

```powershell
Get-NetTCPConnection -LocalPort 8771 -ErrorAction SilentlyContinue
```

Pare a janela antiga com:

```text
Ctrl + C
```

Depois inicie novamente.

## 20. Verificando a versão local

Veja o último commit sem paginador:

```powershell
git --no-pager log -1 --oneline
```

Verifique também o estado do repositório:

```powershell
git status
```

O estado ideal é:

```text
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

## 21. Instalação rápida no Linux

Exemplo para Ubuntu/Debian:

```bash
sudo apt update
sudo apt install -y git python3 nodejs npm
mkdir -p ~/GitHub
cd ~/GitHub
git clone https://github.com/H4ckD4d/CrisisTrust.git
cd CrisisTrust
python3 scripts/serve_local.py
```

Abra:

```text
http://127.0.0.1:8771
```

Testes:

```bash
python3 scripts/validate_project.py
node scripts/test_core.js
node scripts/test_trustcheck.js
node scripts/test_accessibility_i18n.js
node scripts/test_resource_verification.js
```

## 22. Instalação rápida no macOS

Com Homebrew instalado:

```bash
brew install git python node
mkdir -p ~/GitHub
cd ~/GitHub
git clone https://github.com/H4ckD4d/CrisisTrust.git
cd CrisisTrust
python3 scripts/serve_local.py
```

Abra:

```text
http://127.0.0.1:8771
```

## 23. Estrutura básica do projeto

```text
CrisisTrust/
├── docs/       documentação técnica
├── examples/   dados sintéticos de demonstração
├── schemas/    contratos JSON do protocolo
├── scripts/    servidor, validadores e testes
├── web/        interface local
├── README.md
├── ROADMAP.md
└── SECURITY.md
```

## 24. Como saber se está tudo funcionando

Checklist mínimo:

```text
[ ] git --version funciona
[ ] python --version funciona
[ ] python scripts/serve_local.py inicia sem erro
[ ] http://127.0.0.1:8771 abre
[ ] cabeçalho mostra CrisisTrust v0.4
[ ] Português (Brasil) muda a interface
[ ] Load synthetic demo funciona
[ ] TrustCheck produz unresolved/conflicting conforme os testes
[ ] tradução complementar mantém o original visível
[ ] /resources.html abre
[ ] python scripts/validate_project.py passa
[ ] testes Node passam
```

## 25. Segurança e privacidade

O cliente de referência foi projetado para execução local e não deve ser interpretado como substituto para autoridades ou serviços de emergência.

Por padrão, ele não deve depender de:

- analytics;
- advertising SDKs;
- cookies;
- armazenamento automático no navegador;
- localização em segundo plano;
- scripts externos em runtime;
- tradução automática online;
- coleta de biometria.

Ao testar ou contribuir, use os fixtures sintéticos existentes e evite colocar dados pessoais reais no repositório.

## 26. Como contribuir

Antes de alterar o código, leia:

```text
CONTRIBUTING.md
DEVELOPERS.md
SECURITY.md
ROADMAP.md
```

Fluxo recomendado:

```text
Issue
  ↓
Branch
  ↓
Commits
  ↓
Pull Request
  ↓
CI / testes
  ↓
Review
  ↓
Merge
```

Contribuições profissionais de desenvolvimento, acessibilidade, localização, tecnologia humanitária, QA, documentação e revisão de protocolo são bem-vindas.

---

**Chris Cruz | h4ckd4d**  
Original creator, project owner, and primary maintainer

**Founder — Project h4ckd4d**  
Technology for Child Protection • OSINT • Threat Intelligence

*"Protect. Detect. Defend."*

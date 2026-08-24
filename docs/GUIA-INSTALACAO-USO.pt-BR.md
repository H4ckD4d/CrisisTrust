# Manual Atualizado — CrisisTrust v0.4

> Instalação local, VS Code, execução, atualização, testes e troubleshooting para iniciantes.
>
> **Original creator, project owner, and primary maintainer: Chris Cruz | h4ckd4d**

Este manual consolida o fluxo real usado para instalar e testar o CrisisTrust no Windows, incluindo as correções encontradas durante a homologação manual do projeto.

## 1. Estado atual do projeto

O cliente de referência CrisisTrust v0.4 é local-first. O servidor de desenvolvimento padrão usa:

```text
http://127.0.0.1:8771
```

A interface principal fica em:

```text
http://127.0.0.1:8771
```

A console de verificação de recursos comunitários fica em:

```text
http://127.0.0.1:8771/resources.html
```

O servidor faz bind somente em `127.0.0.1`, portanto não fica exposto automaticamente para outros dispositivos da rede.

## 2. O que o teste no VS Code confirma

Quando você vê no terminal:

```text
CrisisTrust project validation passed.
```

a validação estrutural e de privacidade terminou com sucesso.

Quando você vê:

```text
CrisisTrust local MVP: http://127.0.0.1:8771
Loopback only. Press Ctrl+C to stop.
```

o servidor está funcionando.

Linhas como:

```text
127.0.0.1 - - [...] "GET / HTTP/1.1" 200 -
127.0.0.1 - - [...] "GET / HTTP/1.1" 304 -
```

são normais. `200` significa que o arquivo foi entregue. `304` significa que o navegador pode reutilizar uma cópia válida do cache.

A mensagem:

```text
GET /favicon.ico HTTP/1.1 404
```

também é inofensiva: significa somente que ainda não existe um favicon configurado.

## 3. Ferramentas necessárias

Para executar o projeto:

```text
Git        -> baixar e atualizar o repositório
Python     -> executar o servidor local e o validador
Navegador  -> abrir a interface
VS Code    -> editar e estudar o projeto
Node.js    -> executar os testes JavaScript
```

Recomendado no Windows:

- Git for Windows
- Python 3.12 ou superior
- Node.js LTS
- Visual Studio Code
- Chrome, Edge ou Firefox

## 4. Instalação rápida no Windows com winget

Abra PowerShell normal.

### 4.1 Instalar Git

```powershell
winget install -e --id Git.Git
```

### 4.2 Instalar Python 3.12

```powershell
winget install -e --id Python.Python.3.12
```

### 4.3 Instalar Node.js LTS

```powershell
winget install -e --id OpenJS.NodeJS.LTS
```

### 4.4 Instalar VS Code

```powershell
winget install -e --id Microsoft.VisualStudioCode
```

Depois de instalações, feche completamente o PowerShell e abra uma nova janela.

## 5. Validar as instalações

```powershell
git --version
python --version
node --version
code --version
```

Exemplos esperados:

```text
git version 2.x
Python 3.12.x
v22.x ou outra versão LTS atual
1.xx.x
```

## 6. Correção: `Python was not found`

Se aparecer:

```text
Python was not found; run without arguments to install from the Microsoft Store...
```

procure o executável real:

```powershell
Get-ChildItem "$env:LOCALAPPDATA\Programs\Python" -Recurse -Filter python.exe -ErrorAction SilentlyContinue
```

Teste um caminho comum:

```powershell
& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" --version
```

Veja o que o Windows encontra:

```powershell
where.exe python
```

Se aparecer apenas:

```text
C:\Users\SEU_USUARIO\AppData\Local\Microsoft\WindowsApps\python.exe
```

isso pode ser o App Execution Alias da Microsoft Store.

Para adicionar a instalação real ao PATH do usuário:

```powershell
$PythonDir = "$env:LOCALAPPDATA\Programs\Python\Python312"
$ScriptsDir = "$PythonDir\Scripts"
$CurrentPath = [Environment]::GetEnvironmentVariable("Path","User")

[Environment]::SetEnvironmentVariable(
    "Path",
    "$PythonDir;$ScriptsDir;$CurrentPath",
    "User"
)
```

Feche o PowerShell, abra outro e teste:

```powershell
python --version
```

## 7. Onde guardar o projeto

Não use:

```text
C:\Windows\System32
```

Use uma pasta de projetos:

```text
C:\Users\SEU_USUARIO\GitHub
```

Exemplo:

```powershell
cd $HOME
mkdir GitHub -ErrorAction SilentlyContinue
cd GitHub
```

## 8. Clonar o CrisisTrust

```powershell
git clone https://github.com/H4ckD4d/CrisisTrust.git
cd CrisisTrust
```

Confirme:

```powershell
pwd
```

Exemplo:

```text
C:\Users\ADM\GitHub\CrisisTrust
```

## 9. Abrir no VS Code

Dentro da pasta:

```powershell
code .
```

O ponto `.` significa: abra a pasta atual.

Se `code` não for reconhecido, abra o VS Code manualmente:

```text
File
-> Open Folder
-> C:\Users\SEU_USUARIO\GitHub\CrisisTrust
```

## 10. Confiar na pasta no VS Code

Se aparecer `Restricted Mode`, clique em:

```text
Restricted Mode
-> Trust
-> Trust this folder
```

Faça isso somente se você confia no repositório que abriu.

## 11. Estrutura que deve aparecer no Explorer

```text
CrisisTrust/
├── .github/
├── docs/
├── examples/
├── schemas/
├── scripts/
├── web/
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── DEVELOPERS.md
├── LICENSE
├── README.md
├── ROADMAP.md
└── SECURITY.md
```

## 12. Abrir o terminal integrado do VS Code

No menu superior:

```text
Terminal
-> New Terminal
```

Atalho:

```text
Ctrl + `
```

O terminal deve abrir em:

```text
C:\Users\SEU_USUARIO\GitHub\CrisisTrust
```

Confirme:

```powershell
pwd
```

## 13. Criar um segundo terminal no VS Code

Quando o servidor estiver rodando, o terminal fica ocupado.

Para abrir outro terminal:

1. Clique no botão `+` no painel Terminal.
2. Ou use `Terminal -> New Terminal`.
3. Mantenha um terminal para o servidor e outro para Git/testes.

Modelo:

```text
Terminal 1 -> python scripts\serve_local.py
Terminal 2 -> git status / testes / git pull
```

## 14. Extensões recomendadas no VS Code

Abra Extensions:

```text
Ctrl + Shift + X
```

Recomendadas:

- Python — Microsoft
- Pylance — Microsoft
- GitHub Pull Requests and Issues — GitHub
- Markdown All in One
- ESLint
- Prettier
- GitLens

Você não precisa de todas para apenas executar o projeto.

## 15. Validar o projeto antes de iniciar

No terminal:

```powershell
python scripts\validate_project.py
```

Esperado:

```text
CrisisTrust project validation passed.
```

Se esse teste falhar, leia a mensagem antes de iniciar o servidor.

## 16. Iniciar o servidor local

```powershell
python scripts\serve_local.py
```

Esperado:

```text
CrisisTrust local MVP: http://127.0.0.1:8771
Loopback only. Press Ctrl+C to stop.
```

Mantenha esse terminal aberto.

## 17. Abrir no navegador

Interface:

```text
http://127.0.0.1:8771
```

Resource Verification:

```text
http://127.0.0.1:8771/resources.html
```

## 18. Parar o servidor

No terminal que está rodando o servidor:

```text
Ctrl + C
```

## 19. Confirmar que a versão visual é v0.4

O topo da interface deve mostrar:

```text
PROJECT h4ckd4d · CRISISTRUST v0.4
```

Se mostrar uma versão antiga:

1. Pare o servidor.
2. Execute `git pull`.
3. Inicie o servidor.
4. Use `Ctrl + F5` no navegador.

## 20. Hard refresh

No Chrome/Edge:

```text
Ctrl + F5
```

Use isso depois de atualizar JavaScript ou CSS.

## 21. Testar idioma

Na área de acessibilidade, selecione:

```text
English
Português (Brasil)
Español
```

Em Português, partes da interface devem mudar para textos como:

```text
Acessibilidade e idioma
Limite de segurança
Carregar um alerta sintético ou normalizado
Círculo de Confiança
Recursos comunitários
```

O bug em que o seletor mudava mas o texto continuava em inglês foi corrigido e possui teste de regressão.

## 22. Testar o alerta sintético

Clique:

```text
Load synthetic demo
```

Confirme:

- Source
- Integrity
- Freshness
- Trusted Circle
- Action Card
- Trust Context

O fixture é sintético e não representa uma emergência real.

## 23. Testar tradução complementar

Após carregar o demo:

```text
Demo Portuguese translation
Demo Spanish translation
```

O sistema deve manter:

```text
Original
+
Companion translation
```

A tradução não deve substituir silenciosamente o texto original.

## 24. Testar TrustCheck

Cenário não confirmado:

```text
Claim type: Family emergency
Requested action: Transfer money
Independent channel: Not checked
Prearranged challenge: Not used
Trusted Circle: Not asked
```

Resultado esperado:

```text
unresolved
```

Cenário corroborado:

```text
Independent channel: Confirmed
Prearranged challenge: Passed
```

Resultado possível:

```text
verified-by-process
```

Cenário conflitante:

```text
Independent channel: Confirmed
Prearranged challenge: Failed
```

Resultado esperado:

```text
conflicting
```

`verified-by-process` não é garantia absoluta de identidade ou veracidade.

## 25. Testar Resource Verification

Abra:

```text
http://127.0.0.1:8771/resources.html
```

Estados possíveis:

```text
verified
unverified
conflicting
stale
unavailable
```

Regra importante:

```text
single community report
        !=
automatic verified resource
```

## 26. Executar os testes Node

```powershell
node scripts\test_core.js
node scripts\test_trustcheck.js
node scripts\test_accessibility_i18n.js
node scripts\test_resource_verification.js
```

Esperado:

```text
CrisisTrust core tests passed.
CrisisTrust TrustCheck tests passed.
CrisisTrust accessibility, i18n, and translation tests passed.
CrisisTrust community resource verification tests passed.
```

## 27. Atualizar o projeto

Pare o servidor:

```text
Ctrl + C
```

Depois:

```powershell
cd "$HOME\GitHub\CrisisTrust"
git status
git pull
```

Reinicie:

```powershell
python scripts\serve_local.py
```

No navegador:

```text
Ctrl + F5
```

## 28. Confirmar o último commit sem `less`

Use:

```powershell
git --no-pager log -1 --oneline
```

Esse comando evita o paginador `less`.

Para desabilitar o pager globalmente:

```powershell
git config --global core.pager cat
```

Para desfazer:

```powershell
git config --global --unset core.pager
```

## 29. Erro `cannot spawn less`

Se aparecer:

```text
error: cannot spawn less: No such file or directory
fatal: unable to execute pager 'less'
```

não é falha do CrisisTrust.

Use:

```powershell
git --no-pager log -1 --oneline
```

ou configure:

```powershell
git config --global core.pager cat
```

## 30. Erro `Could not resolve host: github.com`

Teste DNS:

```powershell
Resolve-DnsName github.com
```

Teste HTTPS:

```powershell
Test-NetConnection github.com -Port 443
```

Limpe o cache DNS:

```powershell
ipconfig /flushdns
```

Depois tente:

```powershell
git pull
```

Se o servidor local já estiver rodando, ele continuará funcionando mesmo sem acesso ao GitHub.

## 31. Confirmar o remote Git

```powershell
git remote -v
```

Esperado:

```text
origin  https://github.com/H4ckD4d/CrisisTrust.git (fetch)
origin  https://github.com/H4ckD4d/CrisisTrust.git (push)
```

## 32. Verificar estado do Git

```powershell
git status
```

Estado ideal:

```text
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

Se houver arquivos modificados, não execute comandos destrutivos sem entender o que mudou.

## 33. O botão `Update` do VS Code

Se aparecer `Update` no canto superior direito do VS Code, é uma atualização do editor.

Ela não é necessária para o CrisisTrust continuar rodando. Você pode atualizar o VS Code em um momento conveniente.

## 34. Triângulo amarelo no terminal do VS Code

Se o terminal está executando os comandos e o servidor funciona, um pequeno ícone de aviso ao lado do nome do terminal não significa automaticamente falha do CrisisTrust.

Confirme primeiro:

```powershell
python --version
python scripts\validate_project.py
```

Se ambos funcionarem, trate o aviso como questão do terminal/extensão até haver mensagem de erro específica.

## 35. `favicon.ico 404`

Mensagem comum:

```text
GET /favicon.ico HTTP/1.1 404
```

É inofensiva. O navegador apenas tentou buscar um ícone de aba que não existe.

## 36. `304 Not Modified`

Exemplo:

```text
GET / HTTP/1.1 304
```

É normal. O navegador está reutilizando cache válido.

Se você acabou de atualizar o projeto e quer garantir arquivos novos:

```text
Ctrl + F5
```

## 37. Porta 8771 ocupada

Verifique:

```powershell
Get-NetTCPConnection -LocalPort 8771 -ErrorAction SilentlyContinue
```

Se existe outra instância do CrisisTrust, volte ao terminal antigo e pressione:

```text
Ctrl + C
```

## 38. Fluxo diário recomendado no VS Code

```text
1. Abrir PowerShell
2. cd "$HOME\GitHub\CrisisTrust"
3. git pull
4. code .
5. Terminal -> New Terminal
6. python scripts\validate_project.py
7. python scripts\serve_local.py
8. Abrir segundo terminal
9. Executar testes ou estudar código
10. Ctrl+C para encerrar o servidor
```

## 39. Fluxo diário quando você pretende editar código

Antes:

```powershell
git status
git pull
```

Depois da edição:

```powershell
git status
git diff
```

Não envie mudanças diretamente para `main` sem revisão. O fluxo profissional é:

```text
branch
-> mudanças
-> testes
-> commit
-> push
-> Pull Request
-> CI
-> merge
```

## 40. Comandos rápidos de referência

```powershell
cd "$HOME\GitHub\CrisisTrust"
git status
git pull
git --no-pager log -1 --oneline
python scripts\validate_project.py
python scripts\serve_local.py
```

Testes:

```powershell
node scripts\test_core.js
node scripts\test_trustcheck.js
node scripts\test_accessibility_i18n.js
node scripts\test_resource_verification.js
```

VS Code:

```powershell
code .
```

## 41. Instalação rápida no Ubuntu/Debian

```bash
sudo apt update
sudo apt install -y git python3 nodejs npm
mkdir -p ~/GitHub
cd ~/GitHub
git clone https://github.com/H4ckD4d/CrisisTrust.git
cd CrisisTrust
python3 scripts/validate_project.py
python3 scripts/serve_local.py
```

VS Code, quando instalado:

```bash
code .
```

## 42. Instalação rápida no macOS

Com Homebrew:

```bash
brew install git python node
mkdir -p ~/GitHub
cd ~/GitHub
git clone https://github.com/H4ckD4d/CrisisTrust.git
cd CrisisTrust
python3 scripts/validate_project.py
python3 scripts/serve_local.py
```

Abra no VS Code:

```bash
code .
```

## 43. Checklist de homologação

```text
[ ] Git funciona
[ ] Python funciona
[ ] Node funciona
[ ] VS Code abre o repositório
[ ] pasta não está em Restricted Mode
[ ] validate_project.py passa
[ ] servidor abre em 127.0.0.1:8771
[ ] cabeçalho mostra v0.4
[ ] Português (Brasil) altera a interface
[ ] demo sintético carrega
[ ] tradução preserva o original
[ ] TrustCheck produz estados coerentes
[ ] resources.html abre
[ ] testes Node passam
[ ] git status está limpo antes de editar
```

## 44. Checklist de diagnóstico rápido

Se a interface não abre:

```text
1. O servidor está rodando?
2. O terminal mostra 127.0.0.1:8771?
3. A porta está livre?
4. Você abriu http://127.0.0.1:8771?
```

Se a interface parece antiga:

```text
1. Ctrl+C
2. git pull
3. python scripts\serve_local.py
4. Ctrl+F5
```

Se GitHub não responde:

```text
1. Resolve-DnsName github.com
2. Test-NetConnection github.com -Port 443
3. ipconfig /flushdns
4. git pull
```

Se Git `log` falha:

```text
git --no-pager log -1 --oneline
```

## 45. Segurança operacional

O CrisisTrust é um projeto em desenvolvimento. Os exemplos e fixtures são sintéticos.

Não use conteúdo de demonstração como instrução real de emergência. Em uma crise real, siga fontes oficiais e serviços de emergência da sua região.

O cliente de referência não substitui autoridades, operadores humanitários ou serviços de emergência.

---

**Chris Cruz | h4ckd4d**  
Cybersecurity • Red Team • Advanced Cyber Defense & Intelligence  
OSCP | CEH | CISSP | MITRE ATT&CK® Contributor

**Founder — Project h4ckd4d**  
Technology for Child Protection • OSINT • Threat Intelligence

*"Protect. Detect. Defend."*

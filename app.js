// ===== SEGURANCA: ESCAPE HTML =====
function esc(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ===== DADOS DAS IAs =====
var IAS = [
    { nome: "ChatGPT", url: "https://chat.openai.com", icon: "\uD83E\uDDE0", desc: "Explicacoes, resumos, exercicios, revisao. Extremamente versatil.", categoria: "estudo", tag: "Uso Geral" },
    { nome: "Perplexity AI", url: "https://www.perplexity.ai", icon: "\uD83D\uDD0E", desc: "Pesquisa com fontes confiaveis. Otimo para trabalhos e TCC.", categoria: "pesquisa", tag: "Pesquisa Academica" },
    { nome: "NotebookLM", url: "https://notebooklm.google.com", icon: "\uD83D\uDCD3", desc: "Suba PDFs, crie resumos, gere perguntas dos seus materiais.", categoria: "estudo", tag: "Seus PDFs" },
    { nome: "DeepSeek", url: "https://chat.deepseek.com", icon: "\u26A1", desc: "Forte em matematica e programacao. Open-source e potente.", categoria: "codigo", tag: "Logica & Codigo" },
    { nome: "Claude", url: "https://claude.ai", icon: "\u270D\uFE0F", desc: "Excelente em redacoes e textos longos. Erra menos em escrita complexa.", categoria: "escrita", tag: "Escrita" },
    { nome: "Gemini", url: "https://gemini.google.com", icon: "\uD83D\uDCCA", desc: "Analisa livros e apostilas grandes. Resumo de PDFs gigantes.", categoria: "estudo", tag: "PDFs Grandes" },
    { nome: "Gamma App", url: "https://gamma.app", icon: "\uD83C\uDFA8", desc: "Cria apresentacoes e slides automaticos com IA.", categoria: "visual", tag: "Slides & Mapas" },
    { nome: "Copilot (Bing)", url: "https://copilot.microsoft.com", icon: "\uD83D\uDE80", desc: "IA da Microsoft com acesso a internet. Bom para pesquisa rapida.", categoria: "pesquisa", tag: "Pesquisa Web" },
    { nome: "Phind", url: "https://www.phind.com", icon: "\uD83D\uDCBB", desc: "Especializada em programacao. Respostas com codigo e exemplos.", categoria: "codigo", tag: "Dev Search" },
    { nome: "You.com", url: "https://you.com", icon: "\uD83C\uDF10", desc: "Busca com IA. Combina resultados da web com respostas inteligentes.", categoria: "pesquisa", tag: "Busca IA" },
    { nome: "Quillbot", url: "https://quillbot.com", icon: "\uD83D\uDD8A\uFE0F", desc: "Parafrasear textos, corrigir gramatica, melhorar escrita.", categoria: "escrita", tag: "Reescrita" },
    { nome: "Canva IA", url: "https://www.canva.com", icon: "\uD83D\uDDBC\uFE0F", desc: "Design com IA. Crie banners, posts e materiais visuais.", categoria: "visual", tag: "Design" },
    { nome: "Grok", url: "https://grok.com", icon: "\uD83E\uDD16", desc: "IA do X (Twitter). Respostas em tempo real com dados da web.", categoria: "pesquisa", tag: "Tempo Real" },
    { nome: "Mistral Le Chat", url: "https://chat.mistral.ai", icon: "\uD83C\uDF0A", desc: "IA europeia open-source. Forte em multiplos idiomas e codigo.", categoria: "codigo", tag: "Open Source" },
    { nome: "Google AI Studio", url: "https://aistudio.google.com", icon: "\uD83E\uDDEA", desc: "Teste modelos Gemini direto. Ideal para experimentar prompts.", categoria: "estudo", tag: "Laboratorio" },
    { nome: "Napkin AI", url: "https://napkin.ai", icon: "\uD83D\uDCC8", desc: "Transforma texto em infograficos e diagramas visuais.", categoria: "visual", tag: "Infograficos" },
    { nome: "Suno AI", url: "https://suno.com", icon: "\uD83C\uDFB5", desc: "Cria musicas e jingles com IA. Otimo para projetos criativos.", categoria: "visual", tag: "Audio & Musica" },
    { nome: "SciSpace", url: "https://typeset.io", icon: "\uD83D\uDD2C", desc: "Encontra, entende e explica papers academicos. Perfeito para pos.", categoria: "pesquisa", tag: "Papers" }
];

// ===== INICIALIZACAO =====
document.addEventListener("DOMContentLoaded", function () {
    renderCards("todas");
    carregarPrompts();
    renderFavoritos();
    renderHistorico();
    renderTemplates();
    renderPlanos();
    atualizarSelectsDecks();
    renderFlashcards();
    atualizarFiltroTags();
    renderLinks();
    atualizarSelectsMaterias();
    renderNotas();
    atualizarDisplayPomodoro();
    renderPomodoroStats();
    autoBackupCheck();
    registerSW();
    renderMetaDiaria();
    initEditor();
    atualizarFormRef();
    renderRefsSalvas();
    renderLeituraHistorico();
    renderCheat();
});

// ===== CONFIRM DIALOG =====
var confirmCallback = null;

function confirmar(msg, callback) {
    document.getElementById("confirmMsg").textContent = msg;
    document.getElementById("confirmDialog").style.display = "flex";
    confirmCallback = callback;
}

function fecharConfirm(aceito) {
    document.getElementById("confirmDialog").style.display = "none";
    if (aceito && confirmCallback) confirmCallback();
    confirmCallback = null;
}

// ===== NAVEGACAO =====
function mostrarSecao(nome, e) {
    document.querySelectorAll(".secao").forEach(function (s) { s.classList.remove("ativa"); });

    var secao = document.getElementById("secao-" + nome);
    if (secao) secao.classList.add("ativa");

    document.querySelectorAll(".nav-btn").forEach(function (btn) { btn.classList.remove("active"); });
    if (e && e.target) e.target.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Clear global search when navigating away
    if (nome !== "busca") {
        document.getElementById("buscaGlobal").value = "";
    }

    if (nome === "favoritos") renderFavoritos();
    if (nome === "historico") renderHistorico();
    if (nome === "stats") renderStats();
    if (nome === "backup") renderBackupResumo();
    if (nome === "templates") { renderTemplates(); fecharTemplate(); }
    if (nome === "plano") renderPlanos();
    if (nome === "flashcards") { atualizarSelectsDecks(); renderFlashcards(); }
    if (nome === "links") { atualizarFiltroTags(); renderLinks(); }
    if (nome === "notas") { atualizarSelectsMaterias(); renderNotas(); }
    if (nome === "pomodoro") renderPomodoroStats();
    if (nome === "editor") { atualizarLinhas(); atualizarSnippetsSelect(); }
    if (nome === "refs") { atualizarFormRef(); renderRefsSalvas(); }
    if (nome === "leitura") renderLeituraHistorico();
    if (nome === "cheat") renderCheat();
}

function mostrarSecaoDirect(nome) {
    document.querySelectorAll(".secao").forEach(function (s) { s.classList.remove("ativa"); });
    var secao = document.getElementById("secao-" + nome);
    if (secao) secao.classList.add("ativa");
    document.querySelectorAll(".nav-btn").forEach(function (btn) { btn.classList.remove("active"); });
}

// ===== RENDER CARDS =====
function renderCards(categoria) {
    var container = document.getElementById("iaContainer");
    container.innerHTML = "";
    var favoritos = getFavoritos();

    var filtradas = IAS;
    if (categoria !== "todas") {
        filtradas = IAS.filter(function (ia) { return ia.categoria === categoria; });
    }

    filtradas.forEach(function (ia) {
        var isFav = favoritos.indexOf(ia.nome) !== -1;
        var card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-cat", ia.categoria);
        card.onclick = function () { abrirIA(ia); };
        card.innerHTML =
            '<button class="card-fav ' + (isFav ? "ativo" : "") + '" onclick="toggleFavorito(event, \'' + esc(ia.nome) + '\')">' +
            (isFav ? "\u2B50" : "\u2606") + "</button>" +
            '<div class="card-icon">' + ia.icon + "</div>" +
            "<h3>" + esc(ia.nome) + "</h3>" +
            "<p>" + esc(ia.desc) + "</p>" +
            '<span class="card-tag">' + esc(ia.tag) + "</span>";
        container.appendChild(card);
    });
}

// ===== FILTROS =====
function filtrar(categoria, e) {
    document.querySelectorAll(".filtro").forEach(function (btn) { btn.classList.remove("active"); });
    if (e && e.target) e.target.classList.add("active");
    renderCards(categoria);
}

// ===== ABRIR IA =====
function abrirIA(ia) {
    window.open(ia.url, "_blank", "noopener,noreferrer");

    var historico = JSON.parse(localStorage.getItem("hubias_historico") || "[]");
    historico.unshift({
        nome: ia.nome,
        icon: ia.icon,
        url: ia.url,
        data: new Date().toLocaleString("pt-BR")
    });
    if (historico.length > 50) historico = historico.slice(0, 50);
    localStorage.setItem("hubias_historico", JSON.stringify(historico));
    toast("Abrindo " + ia.nome + "...");
}

// ===== FAVORITOS =====
function getFavoritos() {
    return JSON.parse(localStorage.getItem("hubias_favoritos") || "[]");
}

function toggleFavorito(e, nome) {
    e.stopPropagation();
    var favoritos = getFavoritos();
    var idx = favoritos.indexOf(nome);
    if (idx === -1) {
        favoritos.push(nome);
        toast(nome + " adicionado aos favoritos!");
    } else {
        favoritos.splice(idx, 1);
        toast(nome + " removido dos favoritos");
    }
    localStorage.setItem("hubias_favoritos", JSON.stringify(favoritos));
    var categoriaAtiva = document.querySelector(".filtro.active");
    var cat = categoriaAtiva ? categoriaAtiva.textContent.toLowerCase() : "todas";
    renderCards(cat);
}

function renderFavoritos() {
    var container = document.getElementById("favoritosContainer");
    var favoritos = getFavoritos();
    if (favoritos.length === 0) {
        container.innerHTML = '<p class="empty-msg">Nenhuma IA favoritada ainda. Clique na estrela em qualquer IA!</p>';
        return;
    }
    container.innerHTML = "";
    IAS.forEach(function (ia) {
        if (favoritos.indexOf(ia.nome) === -1) return;
        var card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-cat", ia.categoria);
        card.onclick = function () { abrirIA(ia); };
        card.innerHTML =
            '<button class="card-fav ativo" onclick="toggleFavorito(event, \'' + esc(ia.nome) + '\')">\u2B50</button>' +
            '<div class="card-icon">' + ia.icon + "</div>" +
            "<h3>" + esc(ia.nome) + "</h3>" +
            "<p>" + esc(ia.desc) + "</p>" +
            '<span class="card-tag">' + esc(ia.tag) + "</span>";
        container.appendChild(card);
    });
}

// ===== HISTORICO =====
function renderHistorico() {
    var container = document.getElementById("historicoContainer");
    var historico = JSON.parse(localStorage.getItem("hubias_historico") || "[]");
    if (historico.length === 0) {
        container.innerHTML = '<p class="empty-msg">Nenhum acesso registrado ainda.</p>';
        return;
    }
    container.innerHTML = "";
    historico.forEach(function (item) {
        var div = document.createElement("div");
        div.className = "historico-item";
        div.innerHTML =
            '<span class="historico-icon">' + esc(item.icon) + "</span>" +
            '<div class="historico-info"><strong>' + esc(item.nome) + "</strong><span>" + esc(item.data) + "</span></div>";
        container.appendChild(div);
    });
}

function limparHistorico() {
    localStorage.removeItem("hubias_historico");
    renderHistorico();
    toast("Historico limpo!");
}

// ===== GERADOR DE PROMPTS =====
function gerarPrompt() {
    var assunto = document.getElementById("inputAssunto").value.trim();
    var nivel = document.getElementById("inputNivel").value;
    var estilo = document.getElementById("inputEstilo").value;
    if (!assunto) { toast("Digite um assunto primeiro!"); return; }

    var nivelTexto = {
        "iniciante": "para um iniciante completo, sem termos tecnicos",
        "intermediario": "para alguem com conhecimento basico, com termos tecnicos explicados",
        "avancado": "para alguem avancado, com profundidade tecnica"
    };
    var estiloTexto = {
        "professor": "Explique como um professor didatico, passo a passo, com linguagem clara.",
        "pratico": "Foque em exemplos praticos do dia a dia. Mostre como aplicar na pratica.",
        "resumo": "Faca um resumo direto e objetivo. Use bullet points e seja conciso.",
        "exercicios": "Crie exercicios progressivos (facil, medio, dificil) com gabarito comentado.",
        "analogias": "Use analogias simples e comparacoes com coisas do cotidiano para explicar."
    };

    var prompt = "Voce e um especialista em " + assunto + ".\n\n" +
        estiloTexto[estilo] + "\n\nNivel do aluno: " + nivelTexto[nivel] + ".\n\n" +
        "Sobre o tema \"" + assunto + "\":\n1. Explique o conceito principal\n2. De 3 exemplos praticos\n3. Crie 3 exercicios com respostas\n4. Faca um resumo final em 5 pontos-chave\n\nFormato: use titulos, bullet points e destaque os termos importantes.";

    document.getElementById("outputPrompt").value = prompt;
    toast("Prompt gerado!");
}

function copiarPrompt() {
    var output = document.getElementById("outputPrompt");
    if (!output.value) { toast("Nenhum prompt para copiar!"); return; }
    navigator.clipboard.writeText(output.value).then(function () {
        toast("Prompt copiado!");
    }).catch(function () { output.select(); document.execCommand("copy"); toast("Prompt copiado!"); });
}

function salvarPrompt() {
    var texto = document.getElementById("outputPrompt").value.trim();
    if (!texto) { toast("Gere um prompt primeiro!"); return; }
    var prompts = JSON.parse(localStorage.getItem("hubias_prompts") || "[]");
    prompts.unshift({ texto: texto, data: new Date().toLocaleString("pt-BR") });
    localStorage.setItem("hubias_prompts", JSON.stringify(prompts));
    carregarPrompts();
    toast("Prompt salvo!");
}

function carregarPrompts() {
    var container = document.getElementById("listaPrompts");
    var prompts = JSON.parse(localStorage.getItem("hubias_prompts") || "[]");
    if (prompts.length === 0) { container.innerHTML = '<p class="empty-msg">Nenhum prompt salvo ainda.</p>'; return; }
    container.innerHTML = "";
    prompts.forEach(function (item, index) {
        var div = document.createElement("div");
        div.className = "prompt-item";
        var preview = item.texto.length > 150 ? item.texto.substring(0, 150) + "..." : item.texto;
        div.innerHTML =
            "<p>" + esc(preview) + "</p>" +
            '<span class="prompt-item-date">' + esc(item.data) + "</span>" +
            '<div class="prompt-item-actions">' +
            '<button class="btn-small" onclick="copiarPromptSalvo(' + index + ')">Copiar</button>' +
            '<button class="btn-small" onclick="usarPromptSalvo(' + index + ')">Usar</button>' +
            '<button class="btn-small danger" onclick="confirmar(\'Excluir este prompt?\', function(){deletarPrompt(' + index + ')})">Excluir</button></div>';
        container.appendChild(div);
    });
}

function copiarPromptSalvo(index) {
    var prompts = JSON.parse(localStorage.getItem("hubias_prompts") || "[]");
    if (prompts[index]) {
        navigator.clipboard.writeText(prompts[index].texto).then(function () { toast("Prompt copiado!"); }).catch(function () { toast("Erro ao copiar"); });
    }
}

function usarPromptSalvo(index) {
    var prompts = JSON.parse(localStorage.getItem("hubias_prompts") || "[]");
    if (prompts[index]) {
        document.getElementById("outputPrompt").value = prompts[index].texto;
        mostrarSecao("prompts");
        toast("Prompt carregado!");
    }
}

function deletarPrompt(index) {
    var prompts = JSON.parse(localStorage.getItem("hubias_prompts") || "[]");
    prompts.splice(index, 1);
    localStorage.setItem("hubias_prompts", JSON.stringify(prompts));
    carregarPrompts();
    toast("Prompt excluido");
}

// ===== BUSCA GLOBAL =====
function buscarGlobal() {
    var termo = document.getElementById("buscaGlobal").value.toLowerCase().trim();
    var container = document.getElementById("buscaResultados");

    if (!termo) {
        container.innerHTML = '<p class="empty-msg">Digite algo para buscar em notas, links, flashcards e prompts.</p>';
        return;
    }

    var resultados = [];

    // Buscar em notas
    getNotas().forEach(function (n) {
        if (n.titulo.toLowerCase().indexOf(termo) !== -1 || n.conteudo.toLowerCase().indexOf(termo) !== -1) {
            resultados.push({ tipo: "Nota", titulo: n.titulo, desc: n.conteudo.substring(0, 100), secao: "notas" });
        }
    });

    // Buscar em links
    getLinks().forEach(function (l) {
        if (l.titulo.toLowerCase().indexOf(termo) !== -1 || l.url.toLowerCase().indexOf(termo) !== -1 || (l.desc && l.desc.toLowerCase().indexOf(termo) !== -1)) {
            resultados.push({ tipo: "Link", titulo: l.titulo, desc: l.url, secao: "links" });
        }
    });

    // Buscar em flashcards
    getFlashcards().forEach(function (f) {
        if (f.pergunta.toLowerCase().indexOf(termo) !== -1 || f.resposta.toLowerCase().indexOf(termo) !== -1) {
            resultados.push({ tipo: "Flashcard", titulo: f.pergunta, desc: f.resposta.substring(0, 80), secao: "flashcards" });
        }
    });

    // Buscar em prompts salvos
    JSON.parse(localStorage.getItem("hubias_prompts") || "[]").forEach(function (p) {
        if (p.texto.toLowerCase().indexOf(termo) !== -1) {
            resultados.push({ tipo: "Prompt", titulo: p.texto.substring(0, 60), desc: p.data, secao: "prompts" });
        }
    });

    if (resultados.length === 0) {
        container.innerHTML = '<p class="empty-msg">Nenhum resultado para "' + esc(termo) + '".</p>';
        return;
    }

    container.innerHTML = '<p style="color:#94a3b8;margin-bottom:15px;font-size:0.85rem;">' + resultados.length + ' resultado(s) para "' + esc(termo) + '"</p>';
    resultados.forEach(function (r) {
        var div = document.createElement("div");
        div.className = "busca-item";
        div.onclick = function () { mostrarSecao(r.secao); };
        div.innerHTML = '<h4>' + esc(r.titulo) + '<span class="busca-item-tipo">' + esc(r.tipo) + '</span></h4><p>' + esc(r.desc) + '</p>';
        container.appendChild(div);
    });
}

// ===== ESTATISTICAS =====
function renderStats() {
    var pomDados = JSON.parse(localStorage.getItem("hubias_pomodoro") || "{}");
    var totalSessoes = 0, totalMinutos = 0;
    Object.keys(pomDados).forEach(function (dia) {
        totalSessoes += pomDados[dia].sessoes || 0;
        totalMinutos += pomDados[dia].minutos || 0;
    });

    var sequencia = 0, d = new Date();
    while (true) {
        var key = d.toISOString().split("T")[0];
        if (pomDados[key] && pomDados[key].sessoes > 0) { sequencia++; d.setDate(d.getDate() - 1); }
        else break;
    }

    document.getElementById("statSequencia").textContent = sequencia;
    document.getElementById("statPomodoroTotal").textContent = totalSessoes;
    document.getElementById("statMinutosTotal").textContent = totalMinutos;
    document.getElementById("statNotasTotal").textContent = getNotas().length;
    document.getElementById("statFlashcardsTotal").textContent = getFlashcards().length;
    document.getElementById("statLinksTotal").textContent = getLinks().length;

    // IAs mais usadas
    var historico = JSON.parse(localStorage.getItem("hubias_historico") || "[]");
    var contagem = {}, iconMap = {};
    historico.forEach(function (h) { contagem[h.nome] = (contagem[h.nome] || 0) + 1; iconMap[h.nome] = h.icon; });
    var ranking = Object.keys(contagem).map(function (nome) { return { nome: nome, count: contagem[nome], icon: iconMap[nome] }; }).sort(function (a, b) { return b.count - a.count; }).slice(0, 6);

    var iaContainer = document.getElementById("statsIAsMaisUsadas");
    if (ranking.length === 0) {
        iaContainer.innerHTML = '<p class="empty-msg" style="padding:10px;">Nenhum uso registrado ainda.</p>';
    } else {
        var maxCount = ranking[0].count;
        iaContainer.innerHTML = "";
        ranking.forEach(function (item) {
            var pct = Math.round((item.count / maxCount) * 100);
            var div = document.createElement("div");
            div.className = "stats-ia-item";
            div.innerHTML = '<span>' + esc(item.icon) + '</span><span class="stats-ia-nome">' + esc(item.nome) + '</span><div class="stats-ia-barra-bg"><div class="stats-ia-barra" style="width:' + pct + '%"></div></div><span class="stats-ia-count">' + item.count + '</span>';
            iaContainer.appendChild(div);
        });
    }

    // Ultimos 7 dias
    var semanaContainer = document.getElementById("statsSemana");
    semanaContainer.innerHTML = "";
    var diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    var maxMin = 1, ultimos7 = [];
    for (var i = 6; i >= 0; i--) {
        var dt = new Date(); dt.setDate(dt.getDate() - i);
        var k = dt.toISOString().split("T")[0];
        var min = (pomDados[k] && pomDados[k].minutos) || 0;
        if (min > maxMin) maxMin = min;
        ultimos7.push({ dia: diasSemana[dt.getDay()], min: min });
    }
    ultimos7.forEach(function (item) {
        var altPct = Math.max((item.min / maxMin) * 100, 3);
        var div = document.createElement("div");
        div.className = "stats-dia";
        div.innerHTML = '<span class="stats-dia-val">' + item.min + 'min</span><div class="stats-dia-barra" style="height:' + altPct + '%"></div><span class="stats-dia-label">' + item.dia + '</span>';
        semanaContainer.appendChild(div);
    });
}

// ===== BACKUP =====
var BACKUP_KEYS = [
    "hubias_favoritos", "hubias_historico", "hubias_prompts",
    "hubias_notas", "hubias_materias", "hubias_links",
    "hubias_flashcards", "hubias_decks", "hubias_planos",
    "hubias_pomodoro", "hubias_snippets", "hubias_meta_diaria", "hubias_refs", "hubias_leitura",
    "hubias_editor_html", "hubias_editor_javascript", "hubias_editor_python"
];

function exportarDados() {
    var dados = {};
    BACKUP_KEYS.forEach(function (key) {
        var val = localStorage.getItem(key);
        if (val) dados[key] = JSON.parse(val);
    });
    dados._backup_date = new Date().toISOString();

    var blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "hubias_backup_" + new Date().toISOString().split("T")[0] + ".json";
    a.click();
    URL.revokeObjectURL(url);

    localStorage.setItem("hubias_ultimo_backup", new Date().toISOString());
    document.getElementById("backupWarning").style.display = "none";
    toast("Backup exportado com sucesso!");
}

function importarDados(event) {
    var file = event.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function (e) {
        try {
            var dados = JSON.parse(e.target.result);
            var importados = 0;
            BACKUP_KEYS.forEach(function (key) {
                if (dados[key] !== undefined) {
                    localStorage.setItem(key, JSON.stringify(dados[key]));
                    importados++;
                }
            });
            renderCards("todas"); carregarPrompts(); renderFavoritos(); renderHistorico();
            atualizarSelectsMaterias(); renderNotas(); atualizarFiltroTags(); renderLinks();
            atualizarSelectsDecks(); renderFlashcards(); renderPlanos(); renderPomodoroStats(); renderBackupResumo();
            toast("Backup importado! " + importados + " itens restaurados.");
        } catch (err) { toast("Erro: arquivo invalido!"); }
    };
    reader.readAsText(file);
    event.target.value = "";
}

function renderBackupResumo() {
    var container = document.getElementById("backupResumo");
    var itens = [
        { label: "Favoritos", key: "hubias_favoritos" },
        { label: "Historico", key: "hubias_historico" },
        { label: "Prompts", key: "hubias_prompts" },
        { label: "Notas", key: "hubias_notas" },
        { label: "Links", key: "hubias_links" },
        { label: "Flashcards", key: "hubias_flashcards" },
        { label: "Plano", key: "hubias_planos" }
    ];
    container.innerHTML = "";
    itens.forEach(function (item) {
        var dados = JSON.parse(localStorage.getItem(item.key) || "[]");
        var qtd = Array.isArray(dados) ? dados.length : Object.keys(dados).length;
        var div = document.createElement("div");
        div.className = "backup-resumo-item";
        div.innerHTML = "<span>" + item.label + "</span><span>" + qtd + "</span>";
        container.appendChild(div);
    });

    var ultimo = localStorage.getItem("hubias_ultimo_backup");
    var info = document.getElementById("ultimoBackupInfo");
    if (ultimo) {
        info.textContent = "Ultimo backup: " + new Date(ultimo).toLocaleString("pt-BR");
    } else {
        info.textContent = "Nenhum backup realizado ainda.";
    }
}

function autoBackupCheck() {
    var ultimo = localStorage.getItem("hubias_ultimo_backup");
    var temDados = BACKUP_KEYS.some(function (k) {
        var v = localStorage.getItem(k);
        return v && v !== "[]" && v !== "{}";
    });

    if (!temDados) return;

    var diasSemBackup = ultimo ? Math.floor((Date.now() - new Date(ultimo).getTime()) / (1000 * 60 * 60 * 24)) : 999;
    if (diasSemBackup >= 7) {
        document.getElementById("backupWarning").style.display = "flex";
    }
}

function dispensarBackupWarning() {
    document.getElementById("backupWarning").style.display = "none";
}

// ===== TEMPLATES =====
var TEMPLATES = [
    { nome: "Resumir Artigo Cientifico", icon: "\uD83D\uDCC4", desc: "Gera um resumo estruturado de um artigo ou paper academico.", placeholder: "Titulo ou tema do artigo",
      gerar: function (v) { return "Resuma o seguinte artigo cientifico de forma estruturada:\n\nArtigo: \"" + v + "\"\n\nEstruture o resumo com:\n1. Objetivo do estudo\n2. Metodologia utilizada\n3. Principais resultados\n4. Conclusoes dos autores\n5. Limitacoes do estudo\n6. Relevancia para a area\n\nUse linguagem academica mas acessivel."; }
    },
    { nome: "Comparar Teorias", icon: "\u2696\uFE0F", desc: "Compara duas ou mais teorias/conceitos de forma academica.", placeholder: "Teorias para comparar (ex: Piaget vs Vygotsky)",
      gerar: function (v) { return "Faca uma comparacao academica detalhada entre: " + v + "\n\nEstruture assim:\n1. Breve introducao de cada teoria\n2. Quadro comparativo (semelhancas e diferencas)\n3. Contexto historico\n4. Aplicacoes praticas\n5. Criticas e limitacoes\n6. Qual e mais adequada para cada situacao\n7. Conclusao sintetica\n\nUse referencias quando possivel."; }
    },
    { nome: "Gerar Questoes de Prova", icon: "\uD83D\uDCDD", desc: "Cria questoes variadas sobre um tema para revisao.", placeholder: "Tema das questoes",
      gerar: function (v) { return "Crie um simulado completo sobre: \"" + v + "\"\n\nInclua:\n- 5 questoes de multipla escolha (com gabarito)\n- 3 questoes de verdadeiro ou falso (com justificativa)\n- 2 questoes dissertativas (com resposta modelo)\n- 1 questao de estudo de caso\n\nNivel: pos-graduacao\nApos cada questao, coloque a resposta correta e uma breve explicacao."; }
    },
    { nome: "Explicar Metodologia", icon: "\uD83D\uDD2C", desc: "Explica uma metodologia de pesquisa de forma didatica.", placeholder: "Nome da metodologia",
      gerar: function (v) { return "Explique a metodologia de pesquisa \"" + v + "\" de forma completa:\n\n1. Definicao e origem\n2. Quando usar\n3. Etapas passo a passo\n4. Vantagens e desvantagens\n5. Exemplos de pesquisas\n6. Erros comuns\n7. Dicas para TCC/dissertacao\n\nNivel: pos-graduacao."; }
    },
    { nome: "Revisar Texto Academico", icon: "\uD83D\uDD0D", desc: "Pede revisao detalhada de texto cientifico.", placeholder: "Tipo do texto (ex: introducao do TCC)",
      gerar: function (v) { return "Vou colar um texto academico para revisao. E um(a) \"" + v + "\".\n\nRevise considerando:\n1. Coerencia e coesao\n2. Norma culta\n3. Linguagem academica\n4. Clareza da argumentacao\n5. Estrutura dos paragrafos\n6. Conectivos\n7. Sugestoes de melhoria\n\n[COLE SEU TEXTO AQUI ABAIXO]\n\n"; }
    },
    { nome: "Criar Mapa Conceitual", icon: "\uD83D\uDDFA\uFE0F", desc: "Gera estrutura de mapa conceitual/mental.", placeholder: "Tema central do mapa",
      gerar: function (v) { return "Crie a estrutura de um mapa conceitual sobre: \"" + v + "\"\n\nFormato:\n- Conceito central\n  - Ramo 1\n    - Detalhe 1.1\n    - Detalhe 1.2\n  - Ramo 2\n    - Detalhe 2.1\n\nInclua minimo 5 ramos principais com conexoes e hierarquia clara."; }
    },
    { nome: "Fichamento de Livro", icon: "\uD83D\uDCDA", desc: "Estrutura um fichamento academico.", placeholder: "Titulo do livro/capitulo e autor",
      gerar: function (v) { return "Faca um fichamento academico de: \"" + v + "\"\n\nEstrutura:\n1. Referencia bibliografica (ABNT)\n2. Ideia central\n3. Principais argumentos\n4. Citacoes relevantes\n5. Resumo critico\n6. Palavras-chave\n7. Relacao com outros autores\n8. Aplicabilidade\n\nFormato academico, nivel pos-graduacao."; }
    },
    { nome: "Elaborar Introducao", icon: "\u270D\uFE0F", desc: "Ajuda a estruturar a introducao de trabalho academico.", placeholder: "Tema do trabalho",
      gerar: function (v) { return "Elabore a introducao de um trabalho academico sobre: \"" + v + "\"\n\nDeve conter:\n1. Contextualizacao (2-3 paragrafos)\n2. Problematica\n3. Justificativa\n4. Objetivo geral\n5. Objetivos especificos (3-4)\n6. Breve descricao da metodologia\n7. Estrutura do trabalho\n\nNivel: pos-graduacao. Linguagem academica formal."; }
    }
];

var templateAtual = null;

function renderTemplates() {
    var container = document.getElementById("templatesGrid");
    container.innerHTML = "";
    TEMPLATES.forEach(function (tpl, index) {
        var div = document.createElement("div");
        div.className = "template-card";
        div.onclick = function () { abrirTemplate(index); };
        div.innerHTML = '<div class="template-card-icon">' + tpl.icon + '</div><h4>' + esc(tpl.nome) + '</h4><p>' + esc(tpl.desc) + '</p>';
        container.appendChild(div);
    });
}

function abrirTemplate(index) {
    templateAtual = TEMPLATES[index];
    document.getElementById("templateInput").style.display = "block";
    document.getElementById("templatesGrid").style.display = "none";
    document.getElementById("templateNome").textContent = templateAtual.icon + " " + templateAtual.nome;
    document.getElementById("templateDesc").textContent = templateAtual.desc;
    document.getElementById("templateCampo").placeholder = templateAtual.placeholder;
    document.getElementById("templateCampo").value = "";
    document.getElementById("templateOutput").value = "";
    document.getElementById("templateCampo").focus();
}

function fecharTemplate() {
    document.getElementById("templateInput").style.display = "none";
    document.getElementById("templatesGrid").style.display = "grid";
    templateAtual = null;
}

function gerarTemplate() {
    var valor = document.getElementById("templateCampo").value.trim();
    if (!valor) { toast("Preencha o campo!"); return; }
    document.getElementById("templateOutput").value = templateAtual.gerar(valor);
    toast("Prompt gerado! Copie e cole em qualquer IA.");
}

function copiarTemplate() {
    var output = document.getElementById("templateOutput");
    if (!output.value) { toast("Gere o prompt primeiro!"); return; }
    navigator.clipboard.writeText(output.value).then(function () { toast("Prompt copiado!"); }).catch(function () { output.select(); document.execCommand("copy"); toast("Prompt copiado!"); });
}

// ===== PLANO DE ESTUDOS =====
function getPlanos() { return JSON.parse(localStorage.getItem("hubias_planos") || "[]"); }

function adicionarPlano() {
    var materia = document.getElementById("planoMateria").value.trim();
    var data = document.getElementById("planoData").value;
    if (!materia) { toast("Digite o nome da materia!"); return; }
    var planos = getPlanos();
    planos.push({ id: Date.now(), materia: materia, dataProva: data || null, topicos: [] });
    localStorage.setItem("hubias_planos", JSON.stringify(planos));
    document.getElementById("planoMateria").value = "";
    document.getElementById("planoData").value = "";
    renderPlanos();
    toast("Materia adicionada!");
}

function renderPlanos() {
    var container = document.getElementById("planoContainer");
    var planos = getPlanos();
    if (planos.length === 0) { container.innerHTML = '<p class="empty-msg">Nenhuma materia no plano ainda.</p>'; return; }
    container.innerHTML = "";
    planos.forEach(function (plano) {
        var total = plano.topicos.length;
        var feitos = plano.topicos.filter(function (t) { return t.feito; }).length;
        var pct = total > 0 ? Math.round((feitos / total) * 100) : 0;

        var prazoHtml = "";
        if (plano.dataProva) {
            var diasRestantes = Math.ceil((new Date(plano.dataProva + "T23:59:59") - new Date()) / (1000 * 60 * 60 * 24));
            var classPrazo = diasRestantes <= 3 ? "urgente" : diasRestantes <= 7 ? "proximo" : "";
            var texPrazo = diasRestantes < 0 ? "Vencido!" : diasRestantes === 0 ? "Hoje!" : diasRestantes + " dias restantes";
            prazoHtml = '<span class="plano-card-prazo ' + classPrazo + '">' + texPrazo + '</span>';
        }

        var topicosHtml = "";
        plano.topicos.forEach(function (t, i) {
            topicosHtml += '<div class="plano-topico"><input type="checkbox" ' + (t.feito ? "checked" : "") + ' onchange="toggleTopico(' + plano.id + ',' + i + ')"><span class="' + (t.feito ? "feito" : "") + '">' + esc(t.nome) + '</span><button class="btn-small danger" onclick="confirmar(\'Remover topico?\', function(){removerTopico(' + plano.id + ',' + i + ')})" style="padding:2px 6px;">x</button></div>';
        });

        var div = document.createElement("div");
        div.className = "plano-card";
        div.innerHTML =
            '<div class="plano-card-header"><h3>' + esc(plano.materia) + '</h3>' + prazoHtml + '</div>' +
            '<div class="plano-barra-container"><div class="plano-barra" style="width:' + pct + '%"></div></div>' +
            '<div class="plano-progresso-text">' + feitos + ' de ' + total + ' topicos (' + pct + '%)</div>' +
            '<div class="plano-topicos">' + topicosHtml + '</div>' +
            '<div class="plano-topico-add"><input type="text" id="topicoInput-' + plano.id + '" placeholder="Novo topico..." onkeydown="if(event.key===\'Enter\')adicionarTopico(' + plano.id + ')"><button class="btn-secondary" onclick="adicionarTopico(' + plano.id + ')">+ Topico</button></div>' +
            '<div class="plano-card-actions"><button class="btn-small danger" onclick="confirmar(\'Excluir materia e todos os topicos?\', function(){deletarPlano(' + plano.id + ')})">Excluir materia</button></div>';
        container.appendChild(div);
    });
}

function adicionarTopico(planoId) {
    var input = document.getElementById("topicoInput-" + planoId);
    var nome = input.value.trim();
    if (!nome) return;
    var planos = getPlanos();
    var plano = planos.find(function (p) { return p.id === planoId; });
    if (plano) { plano.topicos.push({ nome: nome, feito: false }); localStorage.setItem("hubias_planos", JSON.stringify(planos)); renderPlanos(); }
}

function toggleTopico(planoId, idx) {
    var planos = getPlanos();
    var plano = planos.find(function (p) { return p.id === planoId; });
    if (plano && plano.topicos[idx] !== undefined) { plano.topicos[idx].feito = !plano.topicos[idx].feito; localStorage.setItem("hubias_planos", JSON.stringify(planos)); renderPlanos(); }
}

function removerTopico(planoId, idx) {
    var planos = getPlanos();
    var plano = planos.find(function (p) { return p.id === planoId; });
    if (plano) { plano.topicos.splice(idx, 1); localStorage.setItem("hubias_planos", JSON.stringify(planos)); renderPlanos(); }
}

function deletarPlano(planoId) {
    var planos = getPlanos().filter(function (p) { return p.id !== planoId; });
    localStorage.setItem("hubias_planos", JSON.stringify(planos));
    renderPlanos();
    toast("Materia removida");
}

// ===== FLASHCARDS =====
var fcModo = "estudo", fcAtualIndex = 0, fcFila = [];

function getFlashcards() { return JSON.parse(localStorage.getItem("hubias_flashcards") || "[]"); }
function getDecks() { return JSON.parse(localStorage.getItem("hubias_decks") || '["Geral"]'); }

function atualizarSelectsDecks() {
    var decks = getDecks();
    var s1 = document.getElementById("fcDeck"), s2 = document.getElementById("fcFiltroDeck");
    s1.innerHTML = ""; s2.innerHTML = '<option value="">Todos os decks</option>';
    decks.forEach(function (d) { s1.innerHTML += '<option value="' + esc(d) + '">' + esc(d) + '</option>'; s2.innerHTML += '<option value="' + esc(d) + '">' + esc(d) + '</option>'; });
}

function adicionarDeck() {
    var nome = prompt("Nome do novo deck:");
    if (!nome || !nome.trim()) return;
    nome = nome.trim();
    var decks = getDecks();
    if (decks.indexOf(nome) !== -1) { toast("Deck ja existe!"); return; }
    decks.push(nome);
    localStorage.setItem("hubias_decks", JSON.stringify(decks));
    atualizarSelectsDecks();
    document.getElementById("fcDeck").value = nome;
    toast("Deck criado!");
}

function salvarFlashcard() {
    var p = document.getElementById("fcPergunta").value.trim();
    var r = document.getElementById("fcResposta").value.trim();
    var d = document.getElementById("fcDeck").value;
    if (!p || !r) { toast("Preencha pergunta e resposta!"); return; }
    var cards = getFlashcards();
    cards.push({ id: Date.now(), pergunta: p, resposta: r, deck: d, nivel: 0, proximaRevisao: Date.now() });
    localStorage.setItem("hubias_flashcards", JSON.stringify(cards));
    document.getElementById("fcPergunta").value = "";
    document.getElementById("fcResposta").value = "";
    renderFlashcards();
    toast("Flashcard criado!");
}

function setModoFC(modo, btn) {
    fcModo = modo;
    document.querySelectorAll(".fc-modo-btn").forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    if (modo === "estudo") { document.getElementById("fcEstudo").style.display = "flex"; document.getElementById("fcLista").style.display = "none"; iniciarEstudoFC(); }
    else { document.getElementById("fcEstudo").style.display = "none"; document.getElementById("fcLista").style.display = "grid"; renderListaFC(); }
}

function renderFlashcards() { if (fcModo === "estudo") iniciarEstudoFC(); else renderListaFC(); }

function iniciarEstudoFC() {
    var cards = getFlashcards();
    var filtro = document.getElementById("fcFiltroDeck").value;
    var agora = Date.now();
    fcFila = cards.filter(function (c) { return (!filtro || c.deck === filtro) && c.proximaRevisao <= agora; });
    fcFila.sort(function (a, b) { return a.nivel - b.nivel; });
    fcAtualIndex = 0;
    mostrarCardFC();
}

function mostrarCardFC() {
    var info = document.getElementById("fcEstudoInfo");
    var wrapper = document.getElementById("fcCardWrapper");
    var btns = document.getElementById("fcEstudoBtns");

    btns.style.display = "none";

    if (fcFila.length === 0) {
        info.textContent = "Nenhum card para revisar agora!";
        wrapper.innerHTML = '<div class="fc-empty">Todos em dia ou nenhum criado ainda.</div>';
        return;
    }
    if (fcAtualIndex >= fcFila.length) {
        info.textContent = "Revisao concluida!";
        wrapper.innerHTML = '<div class="fc-empty">Parabens! Todos os cards revisados.</div>';
        return;
    }

    var fc = fcFila[fcAtualIndex];
    info.textContent = "Card " + (fcAtualIndex + 1) + " de " + fcFila.length + " | Deck: " + fc.deck;
    wrapper.innerHTML = '<div class="fc-card" id="fcCard" onclick="virarFlashcard()"><div class="fc-card-frente">' + esc(fc.pergunta) + '</div><div class="fc-card-verso">' + esc(fc.resposta) + '</div></div>';
}

function virarFlashcard() {
    var card = document.getElementById("fcCard");
    if (!card) return;
    card.classList.toggle("virado");
    if (card.classList.contains("virado")) document.getElementById("fcEstudoBtns").style.display = "flex";
}

// Better SRS intervals
var SRS_INTERVALOS = [1, 10, 60, 480, 1440, 4320, 10080]; // minutos: 1min, 10min, 1h, 8h, 1d, 3d, 7d

function responderFC(nivel) {
    var fc = fcFila[fcAtualIndex];
    var cards = getFlashcards();
    var idx = cards.findIndex(function (c) { return c.id === fc.id; });
    if (idx !== -1) {
        if (nivel === "errei") { cards[idx].nivel = 0; }
        else if (nivel === "dificil") { cards[idx].nivel = Math.max(0, cards[idx].nivel); }
        else { cards[idx].nivel = Math.min(cards[idx].nivel + 1, SRS_INTERVALOS.length - 1); }
        var intervalo = SRS_INTERVALOS[cards[idx].nivel] || 10080;
        cards[idx].proximaRevisao = Date.now() + intervalo * 60 * 1000;
        localStorage.setItem("hubias_flashcards", JSON.stringify(cards));
    }
    fcAtualIndex++;
    document.getElementById("fcEstudoBtns").style.display = "none";
    mostrarCardFC();
}

function renderListaFC() {
    var container = document.getElementById("fcLista");
    var cards = getFlashcards();
    var filtro = document.getElementById("fcFiltroDeck").value;
    var filtrados = cards.filter(function (c) { return !filtro || c.deck === filtro; });
    if (filtrados.length === 0) { container.innerHTML = '<p class="empty-msg" style="grid-column:1/-1;">Nenhum flashcard criado.</p>'; return; }
    container.innerHTML = "";
    filtrados.forEach(function (fc) {
        var div = document.createElement("div");
        div.className = "fc-lista-card";
        div.innerHTML = '<h4>' + esc(fc.pergunta) + '</h4><p>' + esc(fc.resposta) + '</p><div class="fc-lista-card-footer"><span class="fc-deck-tag">' + esc(fc.deck) + '</span><div style="display:flex;gap:4px;"><button class="btn-small" onclick="editarFlashcard(' + fc.id + ')">Editar</button><button class="btn-small danger" onclick="confirmar(\'Excluir flashcard?\', function(){deletarFC(' + fc.id + ')})">Excluir</button></div></div>';
        container.appendChild(div);
    });
}

function editarFlashcard(id) {
    var cards = getFlashcards();
    var fc = cards.find(function (c) { return c.id === id; });
    if (!fc) return;
    var novaPergunta = prompt("Pergunta:", fc.pergunta);
    if (novaPergunta === null) return;
    var novaResposta = prompt("Resposta:", fc.resposta);
    if (novaResposta === null) return;
    fc.pergunta = novaPergunta.trim() || fc.pergunta;
    fc.resposta = novaResposta.trim() || fc.resposta;
    localStorage.setItem("hubias_flashcards", JSON.stringify(cards));
    renderFlashcards();
    toast("Flashcard atualizado!");
}

function importarFlashcardsEmLote() {
    var texto = document.getElementById("fcImportTexto").value.trim();
    var deck = document.getElementById("fcDeck").value;
    if (!texto) { toast("Cole as perguntas e respostas!"); return; }

    var linhas = texto.split("\n").filter(function (l) { return l.trim(); });
    var cards = getFlashcards();
    var count = 0;

    linhas.forEach(function (linha) {
        var partes = linha.split(";");
        if (partes.length >= 2) {
            var pergunta = partes[0].trim();
            var resposta = partes.slice(1).join(";").trim();
            if (pergunta && resposta) {
                cards.push({ id: Date.now() + count, pergunta: pergunta, resposta: resposta, deck: deck, nivel: 0, proximaRevisao: Date.now() });
                count++;
            }
        }
    });

    if (count === 0) { toast("Nenhum card valido. Use o formato: pergunta;resposta"); return; }

    localStorage.setItem("hubias_flashcards", JSON.stringify(cards));
    document.getElementById("fcImportTexto").value = "";
    renderFlashcards();
    toast(count + " flashcard(s) importado(s)!");
}

function deletarFC(id) {
    var cards = getFlashcards().filter(function (c) { return c.id !== id; });
    localStorage.setItem("hubias_flashcards", JSON.stringify(cards));
    renderFlashcards();
    toast("Flashcard excluido");
}

// ===== BIBLIOTECA DE LINKS =====
function getLinks() { return JSON.parse(localStorage.getItem("hubias_links") || "[]"); }

function getTagsLinks() {
    var tags = [];
    getLinks().forEach(function (l) { if (l.tag && tags.indexOf(l.tag) === -1) tags.push(l.tag); });
    return tags.sort();
}

function atualizarFiltroTags() {
    var tags = getTagsLinks();
    var select = document.getElementById("linkFiltroTag");
    var datalist = document.getElementById("linkTagsList");
    select.innerHTML = '<option value="">Todas as tags</option>';
    datalist.innerHTML = "";
    tags.forEach(function (t) { select.innerHTML += '<option value="' + esc(t) + '">' + esc(t) + '</option>'; datalist.innerHTML += '<option value="' + esc(t) + '">'; });
}

function salvarLink() {
    var url = document.getElementById("linkUrl").value.trim();
    var titulo = document.getElementById("linkTitulo").value.trim();
    var desc = document.getElementById("linkDesc").value.trim();
    var tag = document.getElementById("linkTag").value.trim();
    if (!url) { toast("Cole uma URL!"); return; }
    if (url.indexOf("http") !== 0) url = "https://" + url;
    var links = getLinks();
    links.unshift({ id: Date.now(), url: url, titulo: titulo || url, desc: desc, tag: tag, data: new Date().toLocaleString("pt-BR") });
    localStorage.setItem("hubias_links", JSON.stringify(links));
    document.getElementById("linkUrl").value = "";
    document.getElementById("linkTitulo").value = "";
    document.getElementById("linkDesc").value = "";
    document.getElementById("linkTag").value = "";
    atualizarFiltroTags(); renderLinks();
    toast("Link salvo!");
}

function renderLinks() {
    var container = document.getElementById("linksContainer");
    var links = getLinks();
    var busca = document.getElementById("linkBusca").value.toLowerCase();
    var filtroTag = document.getElementById("linkFiltroTag").value;
    var filtrados = links.filter(function (l) {
        var matchBusca = !busca || l.titulo.toLowerCase().indexOf(busca) !== -1 || l.url.toLowerCase().indexOf(busca) !== -1 || (l.desc && l.desc.toLowerCase().indexOf(busca) !== -1);
        return matchBusca && (!filtroTag || l.tag === filtroTag);
    });
    if (filtrados.length === 0) { container.innerHTML = '<p class="empty-msg">Nenhum link salvo.</p>'; return; }
    container.innerHTML = "";
    filtrados.forEach(function (link) {
        var div = document.createElement("div");
        div.className = "link-card";
        var iconMap = { "video": "\uD83C\uDFAC", "paper": "\uD83D\uDCC4", "artigo": "\uD83D\uDCF0", "curso": "\uD83C\uDF93", "doc": "\uD83D\uDCD8", "ferramenta": "\uD83D\uDD27" };
        var icon = iconMap[link.tag] || "\uD83D\uDD17";
        var tagHtml = link.tag ? '<span class="link-card-tag">' + esc(link.tag) + '</span>' : '';
        var descHtml = link.desc ? '<p class="link-card-desc">' + esc(link.desc) + '</p>' : '';
        div.innerHTML =
            '<span class="link-card-icon">' + icon + '</span>' +
            '<div class="link-card-info"><h4><a href="' + esc(link.url) + '" target="_blank" rel="noopener noreferrer">' + esc(link.titulo) + '</a></h4>' + descHtml +
            '<div class="link-card-meta">' + tagHtml + '<span class="link-card-date">' + esc(link.data) + '</span></div></div>' +
            '<div class="link-card-actions"><button class="btn-small danger" onclick="confirmar(\'Excluir link?\', function(){deletarLink(' + link.id + ')})">Excluir</button></div>';
        container.appendChild(div);
    });
}

function deletarLink(id) {
    var links = getLinks().filter(function (l) { return l.id !== id; });
    localStorage.setItem("hubias_links", JSON.stringify(links));
    atualizarFiltroTags(); renderLinks();
    toast("Link excluido");
}

// ===== BLOCO DE NOTAS =====
var notaEditandoId = null;

function getMaterias() { return JSON.parse(localStorage.getItem("hubias_materias") || '["Geral"]'); }
function salvarMaterias(m) { localStorage.setItem("hubias_materias", JSON.stringify(m)); }

function atualizarSelectsMaterias() {
    var materias = getMaterias();
    var s1 = document.getElementById("notaMateria"), s2 = document.getElementById("notaFiltroMateria");
    s1.innerHTML = '<option value="">Sem materia</option>';
    s2.innerHTML = '<option value="">Todas as materias</option>';
    materias.forEach(function (m) { s1.innerHTML += '<option value="' + esc(m) + '">' + esc(m) + '</option>'; s2.innerHTML += '<option value="' + esc(m) + '">' + esc(m) + '</option>'; });
}

function adicionarMateria() {
    var nome = prompt("Nome da nova materia:");
    if (!nome || !nome.trim()) return;
    nome = nome.trim();
    var materias = getMaterias();
    if (materias.indexOf(nome) !== -1) { toast("Materia ja existe!"); return; }
    materias.push(nome);
    salvarMaterias(materias);
    atualizarSelectsMaterias();
    document.getElementById("notaMateria").value = nome;
    toast("Materia adicionada!");
}

function getNotas() { return JSON.parse(localStorage.getItem("hubias_notas") || "[]"); }

function salvarNota() {
    var titulo = document.getElementById("notaTitulo").value.trim();
    var conteudo = document.getElementById("notaConteudo").value.trim();
    var materia = document.getElementById("notaMateria").value;
    if (!conteudo) { toast("Escreva algo na nota!"); return; }

    var notas = getNotas();

    if (notaEditandoId) {
        // Editando nota existente
        var idx = notas.findIndex(function (n) { return n.id === notaEditandoId; });
        if (idx !== -1) {
            notas[idx].titulo = titulo || "Sem titulo";
            notas[idx].conteudo = conteudo;
            notas[idx].materia = materia;
            notas[idx].editado = new Date().toLocaleString("pt-BR");
        }
        cancelarEdicaoNota();
        toast("Nota atualizada!");
    } else {
        notas.unshift({ id: Date.now(), titulo: titulo || "Sem titulo", conteudo: conteudo, materia: materia, data: new Date().toLocaleString("pt-BR") });
        toast("Nota salva!");
    }

    localStorage.setItem("hubias_notas", JSON.stringify(notas));
    document.getElementById("notaTitulo").value = "";
    document.getElementById("notaConteudo").value = "";
    renderNotas();
}

function editarNota(id) {
    var notas = getNotas();
    var nota = notas.find(function (n) { return n.id === id; });
    if (!nota) return;

    notaEditandoId = id;
    document.getElementById("notaTitulo").value = nota.titulo;
    document.getElementById("notaConteudo").value = nota.conteudo;
    document.getElementById("notaMateria").value = nota.materia || "";
    document.getElementById("btnSalvarNota").textContent = "Atualizar Nota";
    document.getElementById("btnCancelarEdicaoNota").style.display = "block";

    window.scrollTo({ top: document.querySelector(".notas-topo").offsetTop - 80, behavior: "smooth" });
}

function cancelarEdicaoNota() {
    notaEditandoId = null;
    document.getElementById("notaTitulo").value = "";
    document.getElementById("notaConteudo").value = "";
    document.getElementById("btnSalvarNota").textContent = "Salvar Nota";
    document.getElementById("btnCancelarEdicaoNota").style.display = "none";
}

function renderNotas() {
    var container = document.getElementById("notasContainer");
    var notas = getNotas();
    var busca = document.getElementById("notaBusca").value.toLowerCase();
    var filtroMateria = document.getElementById("notaFiltroMateria").value;
    var filtradas = notas.filter(function (n) {
        var matchBusca = !busca || n.titulo.toLowerCase().indexOf(busca) !== -1 || n.conteudo.toLowerCase().indexOf(busca) !== -1;
        return matchBusca && (!filtroMateria || n.materia === filtroMateria);
    });
    filtradas.sort(function (a, b) { return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0); });
    if (filtradas.length === 0) { container.innerHTML = '<p class="empty-msg">Nenhuma nota encontrada.</p>'; return; }
    container.innerHTML = "";
    filtradas.forEach(function (nota) {
        var div = document.createElement("div");
        div.className = "nota-card";
        var materiaTag = nota.materia ? '<span class="nota-card-materia">' + esc(nota.materia) + '</span>' : '';
        var editadoInfo = nota.editado ? ' (editado ' + esc(nota.editado) + ')' : '';
        div.innerHTML =
            '<div class="nota-card-header"><h4>' + esc(nota.titulo) + '</h4>' + materiaTag + '</div>' +
            '<div class="nota-card-body" id="notaBody-' + nota.id + '">' + esc(nota.conteudo) + '</div>' +
            '<div class="nota-card-footer"><span class="nota-card-date">' + esc(nota.data) + editadoInfo + '</span>' +
            '<div class="nota-card-actions">' +
            '<button class="btn-small" onclick="expandirNota(' + nota.id + ')">Expandir</button>' +
            '<button class="btn-small" onclick="copiarNota(' + nota.id + ')">Copiar</button>' +
            '<button class="btn-small" onclick="togglePinNota(' + nota.id + ')">' + (nota.pinned ? 'Desafixar' : 'Fixar') + '</button>' +
            '<button class="btn-small" onclick="editarNota(' + nota.id + ')">Editar</button>' +
            '<button class="btn-small danger" onclick="confirmar(\'Excluir esta nota?\', function(){deletarNota(' + nota.id + ')})">Excluir</button></div></div>';
        container.appendChild(div);
    });
}

function expandirNota(id) { document.getElementById("notaBody-" + id).classList.toggle("expandida"); }

function copiarNota(id) {
    var nota = getNotas().find(function (n) { return n.id === id; });
    if (nota) { navigator.clipboard.writeText(nota.conteudo).then(function () { toast("Nota copiada!"); }).catch(function () { toast("Erro ao copiar"); }); }
}

function deletarNota(id) {
    var notas = getNotas().filter(function (n) { return n.id !== id; });
    localStorage.setItem("hubias_notas", JSON.stringify(notas));
    renderNotas();
    toast("Nota excluida");
}

// ===== POMODORO TIMER =====
var pomodoroInterval = null, pomodoroRodando = false;
var pomodoroSegundos = 25 * 60, pomodoroTotal = 25 * 60;
var pomodoroModo = "foco";
var CIRCUNFERENCIA = 2 * Math.PI * 90;

function atualizarDisplayPomodoro() {
    var min = Math.floor(pomodoroSegundos / 60);
    var seg = pomodoroSegundos % 60;
    document.getElementById("pomodoroTime").textContent = (min < 10 ? "0" : "") + min + ":" + (seg < 10 ? "0" : "") + seg;
    var progresso = pomodoroSegundos / pomodoroTotal;
    var el = document.getElementById("pomodoroProgress");
    el.style.strokeDashoffset = CIRCUNFERENCIA - (CIRCUNFERENCIA * progresso);
    if (pomodoroModo === "foco") el.classList.remove("pausa"); else el.classList.add("pausa");
    if (pomodoroRodando) document.title = (min < 10 ? "0" : "") + min + ":" + (seg < 10 ? "0" : "") + seg + " - Hub PRO";
}

function togglePomodoro() { if (pomodoroRodando) pausarPomodoro(); else iniciarPomodoro(); }

function iniciarPomodoro() {
    pomodoroRodando = true;
    document.getElementById("btnPomodoro").textContent = "Pausar";
    pomodoroInterval = setInterval(function () {
        pomodoroSegundos--;
        atualizarDisplayPomodoro();
        if (pomodoroSegundos <= 0) {
            clearInterval(pomodoroInterval);
            pomodoroRodando = false;
            document.getElementById("btnPomodoro").textContent = "Iniciar";
            document.title = "Hub PRO de IAs - Estudos";
            playSound();
            if (pomodoroModo === "foco") {
                registrarSessaoPomodoro();
                toast("Sessao de foco concluida!");
                tentarNotificacao("Pomodoro concluido!", "Hora de descansar!");
            } else {
                toast("Pausa encerrada! Volte ao foco.");
                tentarNotificacao("Pausa encerrada!", "Hora de voltar aos estudos!");
            }
        }
    }, 1000);
}

function pausarPomodoro() {
    clearInterval(pomodoroInterval);
    pomodoroRodando = false;
    document.getElementById("btnPomodoro").textContent = "Continuar";
    document.title = "Hub PRO de IAs - Estudos";
}

function resetPomodoro() {
    clearInterval(pomodoroInterval);
    pomodoroRodando = false;
    document.getElementById("btnPomodoro").textContent = "Iniciar";
    document.title = "Hub PRO de IAs - Estudos";
    var tempos = { foco: 25, curta: 5, longa: 15 };
    pomodoroSegundos = tempos[pomodoroModo] * 60;
    pomodoroTotal = pomodoroSegundos;
    atualizarDisplayPomodoro();
}

function setModoPomodoro(modo, btn) {
    pomodoroModo = modo;
    document.querySelectorAll(".pomodoro-mode").forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    document.getElementById("pomodoroLabel").textContent = { foco: "Foco", curta: "Pausa Curta", longa: "Pausa Longa" }[modo];
    resetPomodoro();
}

function registrarSessaoPomodoro() {
    var hoje = new Date().toISOString().split("T")[0];
    var dados = JSON.parse(localStorage.getItem("hubias_pomodoro") || "{}");
    if (!dados[hoje]) dados[hoje] = { sessoes: 0, minutos: 0, lista: [] };
    dados[hoje].sessoes++;
    dados[hoje].minutos += Math.round(pomodoroTotal / 60);
    dados[hoje].lista.unshift(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    localStorage.setItem("hubias_pomodoro", JSON.stringify(dados));
    renderPomodoroStats();
}

function renderPomodoroStats() {
    var hoje = new Date().toISOString().split("T")[0];
    var dados = JSON.parse(localStorage.getItem("hubias_pomodoro") || "{}");
    var dadosHoje = dados[hoje] || { sessoes: 0, minutos: 0, lista: [] };
    document.getElementById("pomSessoesHoje").textContent = dadosHoje.sessoes;
    document.getElementById("pomMinutosHoje").textContent = dadosHoje.minutos;

    var sequencia = 0, d = new Date();
    while (true) {
        var key = d.toISOString().split("T")[0];
        if (dados[key] && dados[key].sessoes > 0) { sequencia++; d.setDate(d.getDate() - 1); } else break;
    }
    document.getElementById("pomSequencia").textContent = sequencia;

    var container = document.getElementById("pomodoroHistorico");
    if (dadosHoje.lista.length === 0) { container.innerHTML = '<p class="empty-msg" style="padding:15px;">Nenhuma sessao hoje.</p>'; }
    else {
        container.innerHTML = "";
        dadosHoje.lista.forEach(function (hora, i) {
            var div = document.createElement("div");
            div.className = "pomodoro-hist-item";
            div.innerHTML = "<span>Sessao " + (dadosHoje.lista.length - i) + "</span><span>" + esc(hora) + "</span>";
            container.appendChild(div);
        });
    }
}

function tentarNotificacao(titulo, corpo) {
    if ("Notification" in window && Notification.permission === "granted") new Notification(titulo, { body: corpo });
    else if ("Notification" in window && Notification.permission !== "denied") Notification.requestPermission();
}

// Som de alerta via Web Audio API
function playSound() {
    try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        [0, 200, 400].forEach(function (delay) {
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.frequency.value = 800;
            gain.gain.value = 0.3;
            osc.start(ctx.currentTime + delay / 1000);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay / 1000 + 0.3);
            osc.stop(ctx.currentTime + delay / 1000 + 0.3);
        });
    } catch (e) { /* browser sem suporte */ }
}

// ===== CALCULADORA CIENTIFICA =====
function calcular() {
    var input = document.getElementById("calcInput").value.trim();
    if (!input) return;
    var resultado = document.getElementById("calcResultado");
    try {
        // Replace math functions with Math equivalents
        var expr = input
            .replace(/\bsqrt\b/g, "Math.sqrt").replace(/\babs\b/g, "Math.abs")
            .replace(/\bpow\b/g, "Math.pow").replace(/\blog\b(?!2|10)/g, "Math.log")
            .replace(/\blog2\b/g, "Math.log2").replace(/\blog10\b/g, "Math.log10")
            .replace(/\bsin\b/g, "Math.sin").replace(/\bcos\b/g, "Math.cos")
            .replace(/\btan\b/g, "Math.tan").replace(/\basin\b/g, "Math.asin")
            .replace(/\bacos\b/g, "Math.acos").replace(/\batan\b/g, "Math.atan")
            .replace(/\bceil\b/g, "Math.ceil").replace(/\bfloor\b/g, "Math.floor")
            .replace(/\bround\b/g, "Math.round").replace(/\brandom\b/g, "Math.random")
            .replace(/\bPI\b/g, "Math.PI").replace(/\bE\b/g, "Math.E")
            .replace(/\^/g, "**");
        // Safety: only allow math chars
        if (/[^0-9+\-*/.()%,\s\w]/.test(expr.replace(/Math\.\w+/g, ""))) throw new Error("Expressao invalida");
        var val = new Function("return (" + expr + ")")();
        resultado.textContent = val;
        // Historico
        var hist = document.getElementById("calcHistorico");
        var item = document.createElement("div");
        item.className = "calc-historico-item";
        item.innerHTML = "<span>" + esc(input) + "</span><span>= " + val + "</span>";
        hist.insertBefore(item, hist.firstChild);
        if (hist.children.length > 20) hist.removeChild(hist.lastChild);
    } catch (e) {
        resultado.textContent = "Erro: " + e.message;
        resultado.style.color = "#f87171";
        setTimeout(function () { resultado.style.color = "#10b981"; }, 2000);
    }
}

function converterBase() {
    var input = document.getElementById("calcBaseInput").value.trim();
    var container = document.getElementById("calcBaseResult");
    if (!input) return;
    try {
        var num;
        if (input.indexOf("0x") === 0 || input.indexOf("0X") === 0) num = parseInt(input, 16);
        else if (input.indexOf("0b") === 0 || input.indexOf("0B") === 0) num = parseInt(input.substring(2), 2);
        else if (input.indexOf("0o") === 0 || input.indexOf("0O") === 0) num = parseInt(input.substring(2), 8);
        else num = parseInt(input, 10);
        if (isNaN(num)) throw new Error("Numero invalido");
        container.innerHTML =
            '<div class="calc-base-item"><span>Decimal</span><span>' + num + '</span></div>' +
            '<div class="calc-base-item"><span>Binario</span><span>0b' + num.toString(2) + '</span></div>' +
            '<div class="calc-base-item"><span>Octal</span><span>0o' + num.toString(8) + '</span></div>' +
            '<div class="calc-base-item"><span>Hexadecimal</span><span>0x' + num.toString(16).toUpperCase() + '</span></div>' +
            '<div class="calc-base-item"><span>ASCII</span><span>' + (num >= 32 && num <= 126 ? String.fromCharCode(num) : "N/A") + '</span></div>';
    } catch (e) { container.innerHTML = '<p style="color:#f87171;font-size:0.85rem;">Numero invalido</p>'; }
}

// Click to insert ref functions
document.addEventListener("click", function (e) {
    if (e.target.matches(".calc-ref code")) {
        var input = document.getElementById("calcInput");
        var fn = e.target.textContent;
        input.value += fn.indexOf("(") !== -1 ? fn : fn + "(";
        input.focus();
    }
});

// ===== GERADOR DE REFERENCIAS =====
function atualizarFormRef() {
    var tipo = document.getElementById("refTipo").value;
    var extra = document.getElementById("refCamposExtra");
    var campos = {
        livro: '<label>Editora</label><input type="text" id="refEditora" placeholder="Nome da editora"><label>Edicao</label><input type="text" id="refEdicao" placeholder="Ex: 3. ed."><label>Cidade</label><input type="text" id="refCidade" placeholder="Sao Paulo">',
        artigo: '<label>Nome do Periodico</label><input type="text" id="refPeriodico" placeholder="Revista/Journal"><label>Volume / Numero</label><input type="text" id="refVolume" placeholder="v. 10, n. 2"><label>Paginas</label><input type="text" id="refPaginas" placeholder="p. 15-30">',
        site: '<label>URL</label><input type="text" id="refUrl" placeholder="https://..."><label>Data de Acesso</label><input type="text" id="refAcesso" placeholder="20 mar. 2026">',
        tcc: '<label>Tipo</label><input type="text" id="refTipoTcc" placeholder="Dissertacao (Mestrado)"><label>Instituicao</label><input type="text" id="refInstituicao" placeholder="Universidade..."><label>Cidade</label><input type="text" id="refCidade" placeholder="Sao Paulo">'
    };
    extra.innerHTML = campos[tipo] || "";
}

function gerarReferencia(formato) {
    var tipo = document.getElementById("refTipo").value;
    var autor = document.getElementById("refAutor").value.trim();
    var titulo = document.getElementById("refTitulo").value.trim();
    var ano = document.getElementById("refAno").value.trim();
    if (!autor || !titulo) { toast("Preencha pelo menos autor e titulo!"); return; }

    var ref = "";
    var getVal = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };

    if (formato === "abnt") {
        if (tipo === "livro") {
            ref = autor.toUpperCase() + ". <strong>" + titulo + "</strong>. " + (getVal("refEdicao") ? getVal("refEdicao") + " " : "") + (getVal("refCidade") ? getVal("refCidade") + ": " : "") + (getVal("refEditora") ? getVal("refEditora") + ", " : "") + ano + ".";
        } else if (tipo === "artigo") {
            ref = autor.toUpperCase() + ". " + titulo + ". <strong>" + getVal("refPeriodico") + "</strong>, " + (getVal("refVolume") ? getVal("refVolume") + ", " : "") + (getVal("refPaginas") ? getVal("refPaginas") + ", " : "") + ano + ".";
        } else if (tipo === "site") {
            ref = autor.toUpperCase() + ". <strong>" + titulo + "</strong>. " + ano + ". Disponivel em: " + getVal("refUrl") + ". Acesso em: " + (getVal("refAcesso") || "___") + ".";
        } else if (tipo === "tcc") {
            ref = autor.toUpperCase() + ". <strong>" + titulo + "</strong>. " + ano + ". " + (getVal("refTipoTcc") || "Trabalho") + " - " + (getVal("refInstituicao") || "Instituicao") + ", " + (getVal("refCidade") || "Cidade") + ", " + ano + ".";
        }
    } else {
        // APA
        var autorAPA = autor.replace(/;/g, " &");
        if (tipo === "livro") {
            ref = autorAPA + " (" + ano + "). <em>" + titulo + "</em>" + (getVal("refEdicao") ? " (" + getVal("refEdicao") + ")" : "") + ". " + (getVal("refEditora") || "") + ".";
        } else if (tipo === "artigo") {
            ref = autorAPA + " (" + ano + "). " + titulo + ". <em>" + getVal("refPeriodico") + "</em>, " + (getVal("refVolume") || "") + ", " + (getVal("refPaginas") || "") + ".";
        } else if (tipo === "site") {
            ref = autorAPA + " (" + ano + "). <em>" + titulo + "</em>. " + getVal("refUrl");
        } else if (tipo === "tcc") {
            ref = autorAPA + " (" + ano + "). <em>" + titulo + "</em> [" + (getVal("refTipoTcc") || "Trabalho") + "]. " + (getVal("refInstituicao") || "") + ".";
        }
    }

    var container = document.getElementById("refResultado");
    container.innerHTML = '<p style="margin-bottom:8px;font-size:0.72rem;color:#64748b;">' + formato.toUpperCase() + '</p><p>' + ref + '</p>' +
        '<div style="display:flex;gap:6px;margin-top:10px;"><button class="btn-small" onclick="copiarRef()">Copiar</button><button class="btn-small" onclick="salvarRef()">Salvar</button></div>';
    container._texto = ref.replace(/<[^>]+>/g, "");
}

function copiarRef() {
    var texto = document.getElementById("refResultado")._texto;
    if (texto) navigator.clipboard.writeText(texto).then(function () { toast("Referencia copiada!"); });
}

function salvarRef() {
    var texto = document.getElementById("refResultado")._texto;
    if (!texto) return;
    var refs = JSON.parse(localStorage.getItem("hubias_refs") || "[]");
    refs.unshift({ texto: texto, data: new Date().toLocaleString("pt-BR") });
    localStorage.setItem("hubias_refs", JSON.stringify(refs));
    renderRefsSalvas();
    toast("Referencia salva!");
}

function renderRefsSalvas() {
    var container = document.getElementById("refsSalvas");
    var refs = JSON.parse(localStorage.getItem("hubias_refs") || "[]");
    if (refs.length === 0) { container.innerHTML = '<p class="empty-msg" style="padding:15px;">Nenhuma referencia salva.</p>'; return; }
    container.innerHTML = "";
    refs.forEach(function (r, i) {
        var div = document.createElement("div");
        div.className = "ref-item";
        div.innerHTML = '<p>' + esc(r.texto) + '</p><div class="ref-item-actions"><span class="ref-item-tipo">' + esc(r.data) + '</span><button class="btn-small" onclick="navigator.clipboard.writeText(JSON.parse(localStorage.getItem(\'hubias_refs\')||\'[]\')[' + i + '].texto);toast(\'Copiada!\')">Copiar</button><button class="btn-small danger" onclick="confirmar(\'Excluir referencia?\',function(){var r=JSON.parse(localStorage.getItem(\'hubias_refs\')||\'[]\');r.splice(' + i + ',1);localStorage.setItem(\'hubias_refs\',JSON.stringify(r));renderRefsSalvas();toast(\'Removida\')})">Excluir</button></div>';
        container.appendChild(div);
    });
}

// ===== CRONOMETRO DE LEITURA =====
var leituraInterval = null, leituraSegundos = 0, leituraRodando = false, leituraPaginas = 0;

function toggleLeitura() {
    if (leituraRodando) { pausarLeitura(); } else { iniciarLeitura(); }
}

function iniciarLeitura() {
    leituraRodando = true;
    document.getElementById("btnLeitura").textContent = "Pausar";
    leituraInterval = setInterval(function () {
        leituraSegundos++;
        atualizarDisplayLeitura();
    }, 1000);
}

function pausarLeitura() {
    clearInterval(leituraInterval);
    leituraRodando = false;
    document.getElementById("btnLeitura").textContent = "Continuar";
}

function resetLeitura() {
    clearInterval(leituraInterval);
    leituraRodando = false;
    leituraSegundos = 0;
    leituraPaginas = 0;
    document.getElementById("btnLeitura").textContent = "Iniciar";
    document.getElementById("leituraPaginas").textContent = "0";
    atualizarDisplayLeitura();
}

function atualizarDisplayLeitura() {
    var h = Math.floor(leituraSegundos / 3600);
    var m = Math.floor((leituraSegundos % 3600) / 60);
    var s = leituraSegundos % 60;
    document.getElementById("leituraDisplay").textContent =
        (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;

    var stats = document.getElementById("leituraStats");
    if (leituraSegundos > 0 && leituraPaginas > 0) {
        var minutos = leituraSegundos / 60;
        var pagPorMin = (leituraPaginas / minutos).toFixed(1);
        var minPorPag = (minutos / leituraPaginas).toFixed(1);
        stats.innerHTML = '<span>' + pagPorMin + '</span> pag/min | <span>' + minPorPag + '</span> min/pag';
    } else {
        stats.innerHTML = "Inicie o timer e conte as paginas para ver estatisticas.";
    }
}

function ajustarPaginas(delta) {
    leituraPaginas = Math.max(0, leituraPaginas + delta);
    document.getElementById("leituraPaginas").textContent = leituraPaginas;
    atualizarDisplayLeitura();
}

function salvarSessaoLeitura() {
    if (leituraSegundos === 0) { toast("Inicie o timer primeiro!"); return; }
    var sessoes = JSON.parse(localStorage.getItem("hubias_leitura") || "[]");
    sessoes.unshift({
        tempo: leituraSegundos,
        paginas: leituraPaginas,
        data: new Date().toLocaleString("pt-BR")
    });
    if (sessoes.length > 50) sessoes = sessoes.slice(0, 50);
    localStorage.setItem("hubias_leitura", JSON.stringify(sessoes));
    renderLeituraHistorico();
    toast("Sessao de leitura salva!");
}

function renderLeituraHistorico() {
    var container = document.getElementById("leituraHistorico");
    var sessoes = JSON.parse(localStorage.getItem("hubias_leitura") || "[]");
    if (sessoes.length === 0) { container.innerHTML = '<p class="empty-msg" style="padding:15px;">Nenhuma sessao salva.</p>'; return; }
    container.innerHTML = "";
    sessoes.forEach(function (s) {
        var m = Math.floor(s.tempo / 60);
        var div = document.createElement("div");
        div.className = "leitura-hist-item";
        div.innerHTML = '<span>' + esc(s.data) + '</span><strong>' + m + 'min | ' + s.paginas + ' pag</strong>';
        container.appendChild(div);
    });
}

// ===== CHEAT SHEETS =====
var cheatAtual = "git";
var CHEAT_DATA = {
    git: [
        { cmd: "git init", desc: "Inicializa repositorio" },
        { cmd: "git clone <url>", desc: "Clona repositorio remoto" },
        { cmd: "git status", desc: "Mostra estado dos arquivos" },
        { cmd: "git add .", desc: "Adiciona todos os arquivos ao staging" },
        { cmd: "git commit -m ''", desc: "Cria commit com mensagem" },
        { cmd: "git push", desc: "Envia commits para o remoto" },
        { cmd: "git pull", desc: "Baixa e mescla alteracoes do remoto" },
        { cmd: "git branch", desc: "Lista branches" },
        { cmd: "git branch <nome>", desc: "Cria nova branch" },
        { cmd: "git checkout <branch>", desc: "Troca de branch" },
        { cmd: "git checkout -b <nome>", desc: "Cria e troca para nova branch" },
        { cmd: "git merge <branch>", desc: "Mescla branch na atual" },
        { cmd: "git log --oneline", desc: "Historico resumido de commits" },
        { cmd: "git stash", desc: "Salva alteracoes temporariamente" },
        { cmd: "git stash pop", desc: "Restaura alteracoes do stash" },
        { cmd: "git diff", desc: "Mostra diferencas nao-staged" },
        { cmd: "git reset HEAD~1", desc: "Desfaz ultimo commit (mantem arquivos)" },
        { cmd: "git rebase <branch>", desc: "Reaplica commits sobre outra branch" },
        { cmd: "git cherry-pick <hash>", desc: "Aplica commit especifico na branch atual" },
        { cmd: "git remote -v", desc: "Lista repositorios remotos" }
    ],
    http: [
        { cmd: "200 OK", desc: "Requisicao bem-sucedida" },
        { cmd: "201 Created", desc: "Recurso criado com sucesso" },
        { cmd: "204 No Content", desc: "Sucesso sem corpo na resposta" },
        { cmd: "301 Moved", desc: "Redirecionamento permanente" },
        { cmd: "302 Found", desc: "Redirecionamento temporario" },
        { cmd: "304 Not Modified", desc: "Recurso nao foi modificado (cache)" },
        { cmd: "400 Bad Request", desc: "Requisicao mal formada" },
        { cmd: "401 Unauthorized", desc: "Autenticacao necessaria" },
        { cmd: "403 Forbidden", desc: "Acesso negado" },
        { cmd: "404 Not Found", desc: "Recurso nao encontrado" },
        { cmd: "405 Method Not Allowed", desc: "Metodo HTTP nao permitido" },
        { cmd: "409 Conflict", desc: "Conflito com estado do recurso" },
        { cmd: "422 Unprocessable", desc: "Entidade nao processavel" },
        { cmd: "429 Too Many", desc: "Rate limit excedido" },
        { cmd: "500 Internal Error", desc: "Erro interno do servidor" },
        { cmd: "502 Bad Gateway", desc: "Resposta invalida do upstream" },
        { cmd: "503 Unavailable", desc: "Servico indisponivel" },
        { cmd: "GET", desc: "Buscar recurso" },
        { cmd: "POST", desc: "Criar recurso" },
        { cmd: "PUT", desc: "Atualizar recurso completo" },
        { cmd: "PATCH", desc: "Atualizar recurso parcial" },
        { cmd: "DELETE", desc: "Remover recurso" }
    ],
    regex: [
        { cmd: ".", desc: "Qualquer caractere (exceto \\n)" },
        { cmd: "\\d", desc: "Digito [0-9]" },
        { cmd: "\\w", desc: "Alfanumerico [a-zA-Z0-9_]" },
        { cmd: "\\s", desc: "Espaco em branco" },
        { cmd: "^", desc: "Inicio da string" },
        { cmd: "$", desc: "Fim da string" },
        { cmd: "*", desc: "Zero ou mais repeticoes" },
        { cmd: "+", desc: "Uma ou mais repeticoes" },
        { cmd: "?", desc: "Zero ou uma ocorrencia" },
        { cmd: "{n,m}", desc: "De n a m repeticoes" },
        { cmd: "[abc]", desc: "Qualquer um: a, b ou c" },
        { cmd: "[^abc]", desc: "Nenhum: a, b ou c" },
        { cmd: "(grupo)", desc: "Grupo de captura" },
        { cmd: "a|b", desc: "a OU b" },
        { cmd: "(?=x)", desc: "Lookahead positivo" },
        { cmd: "(?!x)", desc: "Lookahead negativo" },
        { cmd: "\\b", desc: "Limite de palavra" },
        { cmd: "/email/", desc: "[\\w.]+@[\\w]+\\.[a-z]{2,}" },
        { cmd: "/telefone/", desc: "\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}" },
        { cmd: "/CPF/", desc: "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}" }
    ],
    js: [
        { cmd: "map()", desc: "Transforma cada elemento do array" },
        { cmd: "filter()", desc: "Filtra elementos por condicao" },
        { cmd: "reduce()", desc: "Reduz array a um valor" },
        { cmd: "find()", desc: "Retorna primeiro que satisfaz condicao" },
        { cmd: "forEach()", desc: "Itera sem retorno" },
        { cmd: "some()", desc: "Verifica se algum satisfaz" },
        { cmd: "every()", desc: "Verifica se todos satisfazem" },
        { cmd: "includes()", desc: "Verifica se contem valor" },
        { cmd: "spread ...", desc: "Espalha array/objeto" },
        { cmd: "destructuring", desc: "const {a, b} = obj" },
        { cmd: "template literal", desc: "`Ola ${nome}`" },
        { cmd: "arrow =>", desc: "(x) => x * 2" },
        { cmd: "async/await", desc: "const r = await fetch(url)" },
        { cmd: "Promise", desc: "new Promise((resolve, reject) => {})" },
        { cmd: "try/catch", desc: "Tratamento de erros" },
        { cmd: "localStorage", desc: "setItem(), getItem(), removeItem()" },
        { cmd: "JSON.parse()", desc: "String -> Objeto" },
        { cmd: "JSON.stringify()", desc: "Objeto -> String" },
        { cmd: "fetch()", desc: "Requisicoes HTTP" },
        { cmd: "querySelector()", desc: "Seleciona elemento do DOM" }
    ],
    python: [
        { cmd: "list comprehension", desc: "[x for x in range(10)]" },
        { cmd: "dict comprehension", desc: "{k:v for k,v in items}" },
        { cmd: "f-string", desc: 'f"Ola {nome}"' },
        { cmd: "lambda", desc: "lambda x: x * 2" },
        { cmd: "map()", desc: "map(func, iteravel)" },
        { cmd: "filter()", desc: "filter(func, iteravel)" },
        { cmd: "enumerate()", desc: "for i, val in enumerate(lista)" },
        { cmd: "zip()", desc: "Combina iteraveis" },
        { cmd: "try/except", desc: "Tratamento de excecoes" },
        { cmd: "with open()", desc: "Leitura segura de arquivos" },
        { cmd: "def / return", desc: "Definir funcao" },
        { cmd: "class", desc: "Definir classe (OOP)" },
        { cmd: "__init__", desc: "Construtor da classe" },
        { cmd: "pip install", desc: "Instalar pacote" },
        { cmd: "venv", desc: "python -m venv env" },
        { cmd: "split()", desc: "'a,b,c'.split(',')" },
        { cmd: "join()", desc: "','.join(['a','b'])" },
        { cmd: "sorted()", desc: "Ordena iteravel" },
        { cmd: "isinstance()", desc: "Verifica tipo do objeto" },
        { cmd: "@decorator", desc: "Decorador de funcao" }
    ],
    sql: [
        { cmd: "SELECT", desc: "SELECT col FROM tabela" },
        { cmd: "WHERE", desc: "Filtrar resultados" },
        { cmd: "JOIN", desc: "Combinar tabelas" },
        { cmd: "LEFT JOIN", desc: "Todos da esquerda + match da direita" },
        { cmd: "GROUP BY", desc: "Agrupar resultados" },
        { cmd: "HAVING", desc: "Filtrar grupos" },
        { cmd: "ORDER BY", desc: "Ordenar resultados" },
        { cmd: "LIMIT", desc: "Limitar numero de resultados" },
        { cmd: "INSERT INTO", desc: "Inserir registro" },
        { cmd: "UPDATE SET", desc: "Atualizar registro" },
        { cmd: "DELETE FROM", desc: "Remover registro" },
        { cmd: "CREATE TABLE", desc: "Criar tabela" },
        { cmd: "ALTER TABLE", desc: "Modificar estrutura" },
        { cmd: "COUNT()", desc: "Contar registros" },
        { cmd: "SUM()", desc: "Somar valores" },
        { cmd: "AVG()", desc: "Media dos valores" },
        { cmd: "DISTINCT", desc: "Valores unicos" },
        { cmd: "LIKE '%x%'", desc: "Busca parcial" },
        { cmd: "IN (a,b,c)", desc: "Valor esta na lista" },
        { cmd: "BETWEEN", desc: "Valor entre dois limites" }
    ],
    ascii: [
        { cmd: "32", desc: "(espaco)" }, { cmd: "48-57", desc: "0-9 (digitos)" },
        { cmd: "65-90", desc: "A-Z (maiusculas)" }, { cmd: "97-122", desc: "a-z (minusculas)" },
        { cmd: "33 !", desc: "Exclamacao" }, { cmd: "34 \"", desc: "Aspas duplas" },
        { cmd: "35 #", desc: "Hash/Cerquilha" }, { cmd: "36 $", desc: "Cifrao" },
        { cmd: "37 %", desc: "Porcentagem" }, { cmd: "38 &", desc: "E-comercial" },
        { cmd: "40 (", desc: "Abre parentese" }, { cmd: "41 )", desc: "Fecha parentese" },
        { cmd: "42 *", desc: "Asterisco" }, { cmd: "43 +", desc: "Mais" },
        { cmd: "45 -", desc: "Hifen" }, { cmd: "46 .", desc: "Ponto" },
        { cmd: "47 /", desc: "Barra" }, { cmd: "58 :", desc: "Dois pontos" },
        { cmd: "59 ;", desc: "Ponto e virgula" }, { cmd: "61 =", desc: "Igual" },
        { cmd: "63 ?", desc: "Interrogacao" }, { cmd: "64 @", desc: "Arroba" },
        { cmd: "91 [", desc: "Abre colchete" }, { cmd: "92 \\", desc: "Barra invertida" },
        { cmd: "93 ]", desc: "Fecha colchete" }, { cmd: "123 {", desc: "Abre chave" },
        { cmd: "125 }", desc: "Fecha chave" }, { cmd: "126 ~", desc: "Til" },
        { cmd: "0 NUL", desc: "Nulo" }, { cmd: "9 TAB", desc: "Tabulacao" },
        { cmd: "10 LF", desc: "Line Feed (\\n)" }, { cmd: "13 CR", desc: "Carriage Return (\\r)" }
    ]
};

function setCheatTab(tab, btn) {
    cheatAtual = tab;
    document.querySelectorAll(".cheat-tab").forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    document.getElementById("cheatBusca").value = "";
    renderCheat();
}

function renderCheat() {
    var container = document.getElementById("cheatContainer");
    var dados = CHEAT_DATA[cheatAtual] || [];
    var busca = (document.getElementById("cheatBusca").value || "").toLowerCase();

    var filtrados = dados.filter(function (d) {
        return !busca || d.cmd.toLowerCase().indexOf(busca) !== -1 || d.desc.toLowerCase().indexOf(busca) !== -1;
    });

    container.innerHTML = "";
    filtrados.forEach(function (d) {
        var div = document.createElement("div");
        div.className = "cheat-item";
        div.innerHTML = '<span class="cheat-cmd">' + esc(d.cmd) + '</span><span class="cheat-desc">' + esc(d.desc) + '</span>';
        container.appendChild(div);
    });
    if (filtrados.length === 0) container.innerHTML = '<p class="empty-msg" style="grid-column:1/-1;">Nenhum resultado.</p>';
}

// ===== EDITOR DE CODIGO =====
var editorLang = "html";
var editorTemplates = {
    html: '<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            min-height: 100vh;\n            margin: 0;\n            background: #1a1a2e;\n            color: #e0e0e0;\n        }\n        h1 { color: #6366f1; }\n    </style>\n</head>\n<body>\n    <div>\n        <h1>Ola Mundo!</h1>\n        <p>Edite este HTML e clique Executar.</p>\n    </div>\n</body>\n</html>',
    javascript: '// Escreva seu JavaScript aqui\n// Use console.log() para ver a saida\n\nfunction fatorial(n) {\n    if (n <= 1) return 1;\n    return n * fatorial(n - 1);\n}\n\nfor (var i = 1; i <= 10; i++) {\n    console.log(i + "! = " + fatorial(i));\n}\n\nconsole.log("\\nArray methods:");\nvar nums = [5, 3, 8, 1, 9, 2];\nconsole.log("Original:", nums);\nconsole.log("Sorted:", nums.slice().sort(function(a,b){return a-b}));\nconsole.log("Filtered >4:", nums.filter(function(n){return n>4}));\nconsole.log("Sum:", nums.reduce(function(a,b){return a+b}, 0));',
    python: '# Escreva seu Python aqui\n# Requer internet para carregar o interpretador\n\ndef fatorial(n):\n    if n <= 1:\n        return 1\n    return n * fatorial(n - 1)\n\nfor i in range(1, 11):\n    print(f"{i}! = {fatorial(i)}")\n\n# Listas\nnums = [5, 3, 8, 1, 9, 2]\nprint(f"\\nOriginal: {nums}")\nprint(f"Sorted: {sorted(nums)}")\nprint(f"Filtered >4: {[n for n in nums if n > 4]}")\nprint(f"Sum: {sum(nums)}")'
};

function initEditor() {
    var code = document.getElementById("editorCode");
    var lines = document.getElementById("editorLines");

    // Carregar ultimo codigo salvo ou template
    var saved = localStorage.getItem("hubias_editor_" + editorLang);
    code.value = saved || editorTemplates[editorLang];
    atualizarLinhas();
    atualizarSnippetsSelect();

    // Sync scroll
    code.addEventListener("scroll", function () {
        lines.scrollTop = code.scrollTop;
    });

    // Line numbers update
    code.addEventListener("input", function () {
        atualizarLinhas();
        localStorage.setItem("hubias_editor_" + editorLang, code.value);
    });

    // Tab support + Ctrl+Enter
    code.addEventListener("keydown", function (e) {
        if (e.key === "Tab") {
            e.preventDefault();
            var start = code.selectionStart;
            var end = code.selectionEnd;
            code.value = code.value.substring(0, start) + "    " + code.value.substring(end);
            code.selectionStart = code.selectionEnd = start + 4;
            code.dispatchEvent(new Event("input"));
        }
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            executarCodigo();
        }
    });
}

function atualizarLinhas() {
    var code = document.getElementById("editorCode");
    var lines = document.getElementById("editorLines");
    var count = code.value.split("\n").length;
    var nums = [];
    for (var i = 1; i <= count; i++) nums.push(i);
    lines.textContent = nums.join("\n");
}

function setEditorLang(lang, btn) {
    // Salvar codigo atual
    localStorage.setItem("hubias_editor_" + editorLang, document.getElementById("editorCode").value);

    editorLang = lang;
    document.querySelectorAll(".editor-lang").forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");

    // Carregar codigo da linguagem
    var saved = localStorage.getItem("hubias_editor_" + lang);
    document.getElementById("editorCode").value = saved || editorTemplates[lang];
    atualizarLinhas();

    // Ajustar output
    var preview = document.getElementById("editorPreview");
    var console_el = document.getElementById("editorConsole");
    var label = document.getElementById("editorOutputLabel");

    if (lang === "html") {
        preview.style.display = "block";
        console_el.style.display = "none";
        label.textContent = "Preview";
    } else {
        preview.style.display = "none";
        console_el.style.display = "block";
        label.textContent = "Console";
    }
}

function executarCodigo() {
    var code = document.getElementById("editorCode").value;

    if (editorLang === "html") {
        executarHTML(code);
    } else if (editorLang === "javascript") {
        executarJS(code);
    } else if (editorLang === "python") {
        executarPython(code);
    }
}

function executarHTML(code) {
    var preview = document.getElementById("editorPreview");
    preview.style.display = "block";
    document.getElementById("editorConsole").style.display = "none";
    preview.srcdoc = code;
    toast("HTML renderizado!");
}

function executarJS(code) {
    var preview = document.getElementById("editorPreview");
    var consoleEl = document.getElementById("editorConsole");
    preview.style.display = "none";
    consoleEl.style.display = "block";
    consoleEl.innerHTML = "";

    function addLog(msg, cls) {
        var line = document.createElement("div");
        line.className = cls || "";
        line.textContent = msg;
        consoleEl.appendChild(line);
    }

    // Override console in a sandboxed way
    var output = [];
    var fakeConsole = {
        log: function () { var args = Array.prototype.slice.call(arguments); addLog(args.map(function(a) { return typeof a === "object" ? JSON.stringify(a, null, 2) : String(a); }).join(" ")); },
        error: function () { var args = Array.prototype.slice.call(arguments); addLog("Error: " + args.join(" "), "log-error"); },
        warn: function () { var args = Array.prototype.slice.call(arguments); addLog("Warn: " + args.join(" "), "log-warn"); },
        info: function () { var args = Array.prototype.slice.call(arguments); addLog("Info: " + args.join(" "), "log-info"); }
    };

    try {
        var fn = new Function("console", code);
        var startTime = performance.now();
        fn(fakeConsole);
        var elapsed = (performance.now() - startTime).toFixed(1);
        addLog("\n--- Executado em " + elapsed + "ms ---", "log-result");
    } catch (err) {
        addLog("Erro: " + err.message, "log-error");
        if (err.stack) {
            var stackLine = err.stack.split("\n")[1];
            if (stackLine) addLog(stackLine.trim(), "log-error");
        }
    }
    toast("JavaScript executado!");
}

function executarPython(code) {
    var preview = document.getElementById("editorPreview");
    var consoleEl = document.getElementById("editorConsole");
    preview.style.display = "none";
    consoleEl.style.display = "block";
    consoleEl.innerHTML = '<div class="log-info">Carregando interpretador Python...</div>';

    loadSkulpt(function () {
        consoleEl.innerHTML = "";

        function outf(text) {
            var line = document.createElement("div");
            line.textContent = text;
            consoleEl.appendChild(line);
        }

        window.Sk.configure({
            output: outf,
            read: function (x) {
                if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles["files"][x] === undefined) {
                    throw "File not found: '" + x + "'";
                }
                return window.Sk.builtinFiles["files"][x];
            }
        });

        var startTime = performance.now();
        window.Sk.misceval.asyncToPromise(function () {
            return window.Sk.importMainWithBody("<stdin>", false, code, true);
        }).then(function () {
            var elapsed = (performance.now() - startTime).toFixed(1);
            var line = document.createElement("div");
            line.className = "log-result";
            line.textContent = "\n--- Executado em " + elapsed + "ms ---";
            consoleEl.appendChild(line);
            toast("Python executado!");
        }).catch(function (err) {
            var line = document.createElement("div");
            line.className = "log-error";
            line.textContent = "Erro: " + err.toString();
            consoleEl.appendChild(line);
        });
    });
}

function loadSkulpt(callback) {
    if (window.Sk) { callback(); return; }
    var s1 = document.createElement("script");
    s1.src = "https://skulpt.org/js/skulpt.min.js";
    s1.onload = function () {
        var s2 = document.createElement("script");
        s2.src = "https://skulpt.org/js/skulpt-stdlib.js";
        s2.onload = callback;
        s2.onerror = function () { toast("Erro ao carregar Python. Verifique sua conexao."); };
        document.head.appendChild(s2);
    };
    s1.onerror = function () {
        document.getElementById("editorConsole").innerHTML = '<div class="log-error">Python requer internet para carregar o interpretador Skulpt.\nUse JavaScript ou HTML no modo offline.</div>';
    };
    document.head.appendChild(s1);
}

function limparOutput() {
    document.getElementById("editorConsole").innerHTML = "";
    document.getElementById("editorPreview").srcdoc = "";
}

// Snippets
function salvarSnippet() {
    var nome = prompt("Nome do snippet:");
    if (!nome || !nome.trim()) return;
    nome = nome.trim();
    var snippets = JSON.parse(localStorage.getItem("hubias_snippets") || "[]");
    snippets.unshift({
        id: Date.now(),
        nome: nome,
        lang: editorLang,
        code: document.getElementById("editorCode").value,
        data: new Date().toLocaleString("pt-BR")
    });
    localStorage.setItem("hubias_snippets", JSON.stringify(snippets));
    atualizarSnippetsSelect();
    toast("Snippet '" + nome + "' salvo!");
}

function atualizarSnippetsSelect() {
    var select = document.getElementById("editorSnippets");
    if (!select) return;
    var snippets = JSON.parse(localStorage.getItem("hubias_snippets") || "[]");
    select.innerHTML = '<option value="">Snippets salvos... (' + snippets.length + ')</option>';
    snippets.forEach(function (s) {
        select.innerHTML += '<option value="' + s.id + '">[' + esc(s.lang.toUpperCase()) + '] ' + esc(s.nome) + '</option>';
    });
}

function carregarSnippet() {
    var select = document.getElementById("editorSnippets");
    var id = parseInt(select.value);
    if (!id) return;
    var snippets = JSON.parse(localStorage.getItem("hubias_snippets") || "[]");
    var snippet = snippets.find(function (s) { return s.id === id; });
    if (!snippet) return;

    // Trocar para a linguagem do snippet
    editorLang = snippet.lang;
    document.querySelectorAll(".editor-lang").forEach(function (b) { b.classList.remove("active"); });
    document.querySelectorAll(".editor-lang").forEach(function (b) {
        if (b.textContent.toLowerCase() === snippet.lang) b.classList.add("active");
    });
    setEditorLang(snippet.lang, document.querySelector(".editor-lang.active"));

    document.getElementById("editorCode").value = snippet.code;
    atualizarLinhas();
    select.value = "";
    toast("Snippet carregado!");
}

// ===== META DIARIA =====
function getMetaDiaria() { return parseInt(localStorage.getItem("hubias_meta_diaria") || "0"); }

function salvarMetaDiaria() {
    var input = document.getElementById("metaDiariaInput");
    var valor = parseInt(input.value) || 0;
    localStorage.setItem("hubias_meta_diaria", valor.toString());
    renderMetaDiaria();
    toast("Meta atualizada: " + valor + " min/dia");
}

function renderMetaDiaria() {
    var meta = getMetaDiaria();
    var container = document.getElementById("metaDiariaContainer");
    if (!container) return;
    if (meta <= 0) {
        container.innerHTML = '<p style="color:#64748b;font-size:0.85rem;">Defina uma meta diaria de estudo no campo acima.</p>';
        return;
    }
    var hoje = new Date().toISOString().split("T")[0];
    var pomDados = JSON.parse(localStorage.getItem("hubias_pomodoro") || "{}");
    var minHoje = (pomDados[hoje] && pomDados[hoje].minutos) || 0;
    var pct = Math.min(Math.round((minHoje / meta) * 100), 100);
    var cor = pct >= 100 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#6366f1";

    container.innerHTML =
        '<div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.85rem;">' +
        '<span style="color:#cbd5e1;">' + minHoje + ' / ' + meta + ' min</span>' +
        '<span style="color:' + cor + ';font-weight:700;">' + pct + '%</span></div>' +
        '<div style="background:#0f172a;border-radius:8px;height:14px;overflow:hidden;">' +
        '<div style="height:100%;border-radius:8px;background:' + cor + ';width:' + pct + '%;transition:width 0.5s;"></div></div>' +
        (pct >= 100 ? '<p style="color:#10b981;font-size:0.85rem;margin-top:8px;text-align:center;font-weight:600;">Meta atingida! Parabens!</p>' : '');
}

// ===== NOTAS FIXADAS =====
function togglePinNota(id) {
    var notas = getNotas();
    var nota = notas.find(function (n) { return n.id === id; });
    if (nota) {
        nota.pinned = !nota.pinned;
        localStorage.setItem("hubias_notas", JSON.stringify(notas));
        renderNotas();
        toast(nota.pinned ? "Nota fixada no topo!" : "Nota desafixada");
    }
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener("keydown", function (e) {
    // Ctrl+K: focus na busca global
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("buscaGlobal").focus();
        mostrarSecaoDirect("busca");
    }

    // Esc: fechar dialog
    if (e.key === "Escape") {
        var dialog = document.getElementById("confirmDialog");
        if (dialog.style.display !== "none") fecharConfirm(false);
    }
});

// ===== TOAST =====
var toastTimer = null;
function toast(msg) {
    var el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2500);
}

// ===== SERVICE WORKER =====
function registerSW() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js").then(function () {
            console.log("SW registered");
        }).catch(function () {});
    }
}

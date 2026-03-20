// ===== HubSync - Sincronizacao na Nuvem via Supabase =====
// Mantem dados sincronizados entre dispositivos usando Supabase (PostgreSQL gratuito)
// Local-first: SQLite local e a fonte primaria, nuvem e backup/sync

var HubSync = (function () {
    var client = null;
    var _configured = false;
    var _loggedIn = false;
    var _syncing = false;
    var _lastSync = null;
    var autoSyncTimer = null;

    var CONFIG_KEY = "hubias_sync_config";
    var SYNC_KEYS = [
        "hubias_favoritos", "hubias_historico", "hubias_prompts",
        "hubias_notas", "hubias_materias", "hubias_links",
        "hubias_flashcards", "hubias_decks", "hubias_planos",
        "hubias_pomodoro", "hubias_cadernos", "hubias_snippets",
        "hubias_meta_diaria", "hubias_refs", "hubias_leitura",
        "hubias_editor_html", "hubias_editor_javascript", "hubias_editor_python"
    ];

    // ===== CONFIGURACAO =====
    function getConfig() {
        try { return JSON.parse(localStorage.getItem(CONFIG_KEY) || "null"); }
        catch (e) { return null; }
    }

    function saveConfig(url, key) {
        localStorage.setItem(CONFIG_KEY, JSON.stringify({ url: url, key: key }));
    }

    function clearConfig() {
        localStorage.removeItem(CONFIG_KEY);
        localStorage.removeItem("hubias_sb_auth");
        localStorage.removeItem("hubias_last_sync");
        _configured = false;
        _loggedIn = false;
        _lastSync = null;
        client = null;
        stopAutoSync();
    }

    // ===== INICIALIZACAO =====
    function init() {
        var config = getConfig();
        if (!config || !config.url || !config.key) return Promise.resolve(false);

        return loadSupabase().then(function () {
            client = window.supabase.createClient(config.url, config.key, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    storageKey: "hubias_sb_auth"
                }
            });
            _configured = true;
            return client.auth.getSession();
        }).then(function (result) {
            if (result.data && result.data.session) {
                _loggedIn = true;
                _lastSync = localStorage.getItem("hubias_last_sync") || null;
                return true;
            }
            return false;
        }).catch(function (err) {
            console.warn("HubSync: Init falhou -", err.message);
            return false;
        });
    }

    function loadSupabase() {
        return new Promise(function (resolve, reject) {
            if (window.supabase && window.supabase.createClient) {
                resolve();
                return;
            }
            var s = document.createElement("script");
            s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
            s.onload = resolve;
            s.onerror = function () {
                reject(new Error("Falha ao carregar Supabase SDK"));
            };
            document.head.appendChild(s);
        });
    }

    function configure(url, key) {
        // Limpar URL (remover barra final)
        url = url.replace(/\/+$/, "");
        saveConfig(url, key);
        return init();
    }

    // ===== AUTENTICACAO =====
    function signup(email, password) {
        if (!client) return Promise.reject(new Error("Nao configurado"));
        return client.auth.signUp({
            email: email,
            password: password
        }).then(function (r) {
            if (r.error) throw r.error;
            if (r.data && r.data.session) _loggedIn = true;
            return r.data;
        });
    }

    function login(email, password) {
        if (!client) return Promise.reject(new Error("Nao configurado"));
        return client.auth.signInWithPassword({
            email: email,
            password: password
        }).then(function (r) {
            if (r.error) throw r.error;
            _loggedIn = true;
            return r.data;
        });
    }

    function logout() {
        if (!client) return Promise.resolve();
        stopAutoSync();
        return client.auth.signOut().then(function () {
            _loggedIn = false;
        });
    }

    function getUserEmail() {
        if (!client || !_loggedIn) return Promise.resolve(null);
        return client.auth.getUser().then(function (r) {
            return (r.data && r.data.user) ? r.data.user.email : null;
        }).catch(function () { return null; });
    }

    // ===== SINCRONIZACAO =====

    // Envia dados locais para a nuvem
    function pushToCloud() {
        if (!client || !_loggedIn) return Promise.reject(new Error("Nao conectado"));
        _syncing = true;

        return client.auth.getUser().then(function (userResult) {
            if (userResult.error) throw userResult.error;
            var userId = userResult.data.user.id;

            var rows = [];
            SYNC_KEYS.forEach(function (key) {
                var value = HubDB.getItem(key);
                if (value) {
                    rows.push({
                        user_id: userId,
                        key: key,
                        value: value,
                        updated_at: new Date().toISOString()
                    });
                }
            });

            if (rows.length === 0) {
                _syncing = false;
                return 0;
            }

            // Enviar em lotes de 50 para evitar payload muito grande
            var batches = [];
            for (var i = 0; i < rows.length; i += 50) {
                batches.push(rows.slice(i, i + 50));
            }

            var chain = Promise.resolve();
            batches.forEach(function (batch) {
                chain = chain.then(function () {
                    return client.from("hubias_sync")
                        .upsert(batch, { onConflict: "user_id,key" })
                        .then(function (result) {
                            if (result.error) throw result.error;
                        });
                });
            });

            return chain.then(function () {
                _syncing = false;
                _lastSync = new Date().toISOString();
                localStorage.setItem("hubias_last_sync", _lastSync);
                return rows.length;
            });
        }).catch(function (err) {
            _syncing = false;
            throw err;
        });
    }

    // Baixa dados da nuvem para o local
    function pullFromCloud() {
        if (!client || !_loggedIn) return Promise.reject(new Error("Nao conectado"));
        _syncing = true;

        return client.from("hubias_sync")
            .select("key, value")
            .then(function (result) {
                _syncing = false;
                if (result.error) throw result.error;
                var count = 0;
                (result.data || []).forEach(function (row) {
                    if (row.key && row.value) {
                        HubDB.setItem(row.key, row.value);
                        count++;
                    }
                });
                if (count > 0) {
                    _lastSync = new Date().toISOString();
                    localStorage.setItem("hubias_last_sync", _lastSync);
                }
                return count;
            }).catch(function (err) {
                _syncing = false;
                throw err;
            });
    }

    // ===== AUTO-SYNC =====
    function startAutoSync(intervalMin) {
        stopAutoSync();
        intervalMin = intervalMin || 5;
        autoSyncTimer = setInterval(function () {
            if (_loggedIn && !_syncing) {
                pushToCloud().catch(function (err) {
                    console.warn("HubSync auto-push falhou:", err.message);
                });
            }
        }, intervalMin * 60 * 1000);
    }

    function stopAutoSync() {
        if (autoSyncTimer) {
            clearInterval(autoSyncTimer);
            autoSyncTimer = null;
        }
    }

    // ===== STATUS =====
    function isConfigured() { return _configured; }
    function isLoggedIn() { return _loggedIn; }
    function isSyncing() { return _syncing; }
    function isAutoSyncing() { return autoSyncTimer !== null; }
    function lastSync() { return _lastSync; }

    return {
        init: init,
        configure: configure,
        signup: signup,
        login: login,
        logout: logout,
        getUserEmail: getUserEmail,
        pushToCloud: pushToCloud,
        pullFromCloud: pullFromCloud,
        startAutoSync: startAutoSync,
        stopAutoSync: stopAutoSync,
        isConfigured: isConfigured,
        isLoggedIn: isLoggedIn,
        isSyncing: isSyncing,
        isAutoSyncing: isAutoSyncing,
        lastSync: lastSync,
        clearConfig: clearConfig,
        getConfig: getConfig
    };
})();

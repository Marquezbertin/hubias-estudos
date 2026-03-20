// ===== HubDB - SQLite Database Layer (sql.js + IndexedDB) =====
// Substitui localStorage por SQLite rodando no browser via WebAssembly
// API compativel: getItem, setItem, removeItem (mesma interface do localStorage)
// Persistencia automatica no IndexedDB (limite ~50MB+ vs ~5MB do localStorage)

var HubDB = (function () {
    var SQL = null;
    var db = null;
    var _ready = false;
    var _dbSizeBytes = 0;
    var IDB_NAME = "hubias_sqlitedb";
    var IDB_STORE = "database";
    var IDB_KEY = "main";
    var persistTimer = null;

    // ===== INICIALIZACAO =====
    function init() {
        return loadSqlJs()
            .then(function (SqlJs) {
                SQL = SqlJs;
                return loadFromIDB();
            })
            .then(function (savedData) {
                if (savedData) {
                    db = new SQL.Database(new Uint8Array(savedData));
                    ensureSchema();
                    _dbSizeBytes = savedData.byteLength || savedData.length || 0;
                    console.log("HubDB: Carregado do IndexedDB (" + formatBytes(_dbSizeBytes) + ")");
                } else {
                    db = new SQL.Database();
                    createSchema();
                    var migrated = migrateFromLocalStorage();
                    if (migrated > 0) {
                        console.log("HubDB: Migrados " + migrated + " itens do localStorage para SQLite");
                    } else {
                        console.log("HubDB: Banco de dados criado (vazio)");
                    }
                    persistToIDB();
                }
                _ready = true;
            });
    }

    function loadSqlJs() {
        return new Promise(function (resolve, reject) {
            // Se ja foi carregado
            if (typeof initSqlJs === "function") {
                initSqlJs({
                    locateFile: function (file) {
                        return "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/" + file;
                    }
                }).then(resolve).catch(reject);
                return;
            }
            // Carregar do CDN
            var script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js";
            script.onload = function () {
                initSqlJs({
                    locateFile: function (file) {
                        return "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/" + file;
                    }
                }).then(resolve).catch(reject);
            };
            script.onerror = function () {
                reject(new Error("Falha ao carregar sql.js do CDN"));
            };
            document.head.appendChild(script);
        });
    }

    // ===== SCHEMA =====
    function createSchema() {
        db.run("CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT)");
    }

    function ensureSchema() {
        createSchema();
    }

    // ===== MIGRACAO DO LOCALSTORAGE =====
    function migrateFromLocalStorage() {
        var count = 0;
        try {
            db.run("BEGIN TRANSACTION");
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key && key.indexOf("hubias_") === 0) {
                    var value = localStorage.getItem(key);
                    if (value !== null) {
                        db.run("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)", [key, value]);
                        count++;
                    }
                }
            }
            db.run("COMMIT");
        } catch (e) {
            try { db.run("ROLLBACK"); } catch (e2) { /* ignore */ }
            console.error("HubDB: Erro na migracao", e);
        }
        return count;
    }

    // ===== API COMPATIVEL COM LOCALSTORAGE =====
    function getItem(key) {
        if (!_ready || !db) return localStorage.getItem(key);
        try {
            var stmt = db.prepare("SELECT value FROM kv WHERE key = ?");
            stmt.bind([key]);
            var val = null;
            if (stmt.step()) val = stmt.get()[0];
            stmt.free();
            return val;
        } catch (e) {
            return localStorage.getItem(key);
        }
    }

    function setItem(key, value) {
        if (!_ready || !db) {
            localStorage.setItem(key, value);
            return;
        }
        try {
            db.run("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)", [key, value]);
            schedulePersist();
        } catch (e) {
            localStorage.setItem(key, value);
        }
    }

    function removeItem(key) {
        if (!_ready || !db) {
            localStorage.removeItem(key);
            return;
        }
        try {
            db.run("DELETE FROM kv WHERE key = ?", [key]);
            schedulePersist();
        } catch (e) {
            localStorage.removeItem(key);
        }
    }

    // ===== PERSISTENCIA NO INDEXEDDB =====
    function schedulePersist() {
        if (persistTimer) clearTimeout(persistTimer);
        persistTimer = setTimeout(persistToIDB, 1000);
    }

    function persistToIDB() {
        if (!db) return Promise.resolve();
        return new Promise(function (resolve) {
            try {
                var data = db.export();
                _dbSizeBytes = data.length;
                var buffer = data.buffer;
                var request = indexedDB.open(IDB_NAME, 1);
                request.onupgradeneeded = function (e) {
                    var idb = e.target.result;
                    if (!idb.objectStoreNames.contains(IDB_STORE)) {
                        idb.createObjectStore(IDB_STORE);
                    }
                };
                request.onsuccess = function (e) {
                    var idb = e.target.result;
                    var tx = idb.transaction(IDB_STORE, "readwrite");
                    tx.objectStore(IDB_STORE).put(buffer, IDB_KEY);
                    tx.oncomplete = function () { resolve(); };
                    tx.onerror = function () { resolve(); };
                };
                request.onerror = function () { resolve(); };
            } catch (e) {
                console.error("HubDB: Erro ao persistir", e);
                resolve();
            }
        });
    }

    function loadFromIDB() {
        return new Promise(function (resolve) {
            try {
                var request = indexedDB.open(IDB_NAME, 1);
                request.onupgradeneeded = function (e) {
                    var idb = e.target.result;
                    if (!idb.objectStoreNames.contains(IDB_STORE)) {
                        idb.createObjectStore(IDB_STORE);
                    }
                };
                request.onsuccess = function (e) {
                    var idb = e.target.result;
                    var tx = idb.transaction(IDB_STORE, "readonly");
                    var getReq = tx.objectStore(IDB_STORE).get(IDB_KEY);
                    getReq.onsuccess = function () {
                        resolve(getReq.result || null);
                    };
                    getReq.onerror = function () { resolve(null); };
                };
                request.onerror = function () { resolve(null); };
            } catch (e) {
                resolve(null);
            }
        });
    }

    // ===== UTILITARIOS =====
    function calcStorageUsed() {
        if (!_ready || !db) return 0;
        try {
            var result = db.exec("SELECT COALESCE(SUM(LENGTH(key) + LENGTH(COALESCE(value,''))), 0) FROM kv WHERE key LIKE 'hubias_%'");
            return (result.length > 0 && result[0].values[0][0]) ? result[0].values[0][0] * 2 : 0;
        } catch (e) { return 0; }
    }

    function getDBFileSize() {
        return _dbSizeBytes;
    }

    function exportDatabase() {
        if (!db) return null;
        try {
            var data = db.export();
            _dbSizeBytes = data.length;
            return data;
        } catch (e) { return null; }
    }

    function importDatabase(data) {
        if (!SQL) return false;
        try {
            var newDb = new SQL.Database(new Uint8Array(data));
            // Verificar se tem a tabela kv
            newDb.exec("SELECT COUNT(*) FROM kv");
            db = newDb;
            ensureSchema();
            _dbSizeBytes = data.byteLength || data.length || 0;
            persistToIDB();
            return true;
        } catch (e) {
            console.error("HubDB: Erro ao importar", e);
            return false;
        }
    }

    function isReady() {
        return _ready;
    }

    function formatBytes(bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }

    return {
        init: init,
        getItem: getItem,
        setItem: setItem,
        removeItem: removeItem,
        calcStorageUsed: calcStorageUsed,
        getDBFileSize: getDBFileSize,
        exportDatabase: exportDatabase,
        importDatabase: importDatabase,
        isReady: isReady,
        persistNow: persistToIDB
    };
})();

function V2rayConfig() {
}

// bind data to view
V2rayConfig.bind = {
    // base
    loglevel: "info",
    sockPort: "",
    httpPort: false,
    dnsServers: "",
    enableUdp: false,
    enableMux: false,
    muxConcurrent: 8,

    // protocol
    serverProtocol: "vmess",

    // vmess
    vmessAddr: "",
    vmessPort: "",
    vmessAlterId: "",
    vmessLevel: "",
    vmessUserId: "",
    vmessSecurity: "",

    // shadowsocks
    shadowsockAddr: "",
    shadowsockPort: "",
    shadowsockPass: "",
    shadowsockMethod: "",

    // socks5
    socks5Addr: "",
    socks5Port: "",
    socks5User: "",
    socks5Pass: "",

    // stream network
    streamNetwork: "tcp",

    // kcp setting
    kcpMtu: "",
    kcpTti: "",
    kcpUplinkCapacity: "",
    kcpDownlinkCapacity: "",
    kcpReadBufferSize: "",
    kcpWriteBufferSize: "",
    kcpHeader: "",
    kcpCongestion: "",

    // tcp
    tcpHeaderType: "",

    // ws
    wsHost: "",
    wsPath: "",

    // h2
    h2Host: "",
    h2Path: "",

    // ds
    dsPath: "",

    // tls
    streamSecurity: "",
    streamAllowSecure: "tls",
    streamTlsServerName: "",
};

// default template
V2rayConfig.default = {
    inboundHttp: {
        "port": "1080",
        "listen": "127.0.0.1",
        "protocol": "http",
        "tab": "",
        "settings": {
            "timeout": 360,
        }
    },
    inboundSocks: {
        "port": 1080,
        "listen": "127.0.0.1",
        "protocol": "socks",
        "udp": false,
        "settings": {
            "auth": "noauth",
            "timeout": 360,
            "udp": true
        }
    },
    outbound: {
        "protocol": "",
        "settings": {},
        "tag": "agentout",
        "streamSettings": {},
        "mux": {}
    },
    outboundFreedom: {
        "protocol": "freedom",
        "settings": {},
        "tag": "direct"
    },
    outboundBlackhole: {
        "tag": "blockout",
        "protocol": "blackhole",
        "settings": {
            "response": {
                "type": "http"
            }
        }
    },
    vmess: {
        "address": "",
        "port": "",
        "users": [{
            "id": "",
            "alterId": 0,
            "security": "auto",
            "level": 0
        }]
    },
    shadowsocks: {
        "address": "127.0.0.1",
        "port": "",
        "method": "",
        "password": "",
        "ota": false,
        "level": 0
    },
    socks: {
        "address": "127.0.0.1",
        "port": 0,
        "users": [
            {
                "user": "",
                "pass": "",
                "level": 0
            }
        ]
    },
    mux: {
        "enabled": false,
        "concurrency": 8
    },
    streamSettings: {
        "network": "tcp",
        "security": "none",
        "tlsSettings": {},
        "tcpSettings": {},
        "kcpSettings": {},
        "wsSettings": {},
        "httpSettings": {},
        "dsSettings": {},
        "sockopt": {
            "mark": 0,
            "tcpFastOpen": false,
            "tproxy": "off"
        }
    },
    tlsSettings: {
        "serverName": "",
        "allowInsecure": false,
    },
    tcpSettings: {
        "header": {
            "type": "none"
        }
    },
    wsSettings: {
        "path": "/",
        "headers": {
            "Host": ""
        }
    },
    httpSettings: {
        "host": [""],
        "path": ""
    },
    dsSettings: {
        "path": ""
    },
    kcpSettings: {
        "mtu": 1350,
        "tti": 20,
        "uplinkCapacity": 5,
        "downlinkCapacity": 20,
        "congestion": false,
        "readBufferSize": 1,
        "writeBufferSize": 1,
        "header": {
            "type": "none"
        }
    },
    routing: {
        "strategy": "rules",
        "settings": {
            "domainStrategy": "IPIfNonMatch",
            "rules": [
                {
                    "type": "field",
                    "outboundTag": "direct",
                    "ip": [
                        "geoip:private"
                    ]
                },
                {
                    "type": "field",
                    "outboundTag": "direct",
                    "domain": [
                        "geosite:cn"
                    ]
                },
                {
                    "type": "field",
                    "outboundTag": "direct",
                    "ip": [
                        "geoip:cn"
                    ]
                }
            ]
        }
    }
};

// v2ray config
V2rayConfig.config = {
    "log": {
        "loglevel": "info",
        "access": "",
        "error": ""
    },
    "dns": {
        "servers": []
    },
    "inbound": {},
    "inboundDetour": [],
    "inbounds": [], // version > 4.0
    "outbounds": [], // version > 4.0
    "outbound": {},
    "outboundDetour": [],
    "routing": {}
};

//  current state
V2rayConfig.state = {
    isValid: true,
    newVersion: false,
    emptyInput: false,  // empty input, new add
};

V2rayConfig.error = "";
V2rayConfig.tmpConfig = {};
V2rayConfig.prototype = {
    // init by json text
    // encode by URI Component
    // call from swift
    init: function (encodeJsonTxt) {
        // reset data
        this.reset();

        if (encodeJsonTxt === "") {
            V2rayConfig.state.emptyInput = true;
            return
        }

        var decodeStr = decodeURIComponent(encodeJsonTxt);
        if (!decodeStr) {
            V2rayConfig.state.emptyInput = true;
            V2rayConfig.error = "error: cannot decode uri";
            return
        }

        try {
            var obj = JSON.parse(decodeStr);
            if (!obj) {
                V2rayConfig.error = "error: cannot parse json";
                return
            }
            V2rayConfig.tmpConfig = obj;

            // parse json
            this.parseData();

            // error occurred
            if (V2rayConfig.error) {
                return ""
            }

            var data = JSON.stringify(V2rayConfig.config, null, 2);

            return data
        } catch (e) {
            V2rayConfig.error = "error: " + e.toString();
        }
    },

    // parse json
    parseData: function () {
        let _this = this;
        try {
            var cfg = V2rayConfig.tmpConfig;
            // loglevel
            if (cfg.log && cfg.log.loglevel) {
                let logLevel = cfg.log.loglevel;
                if (["debug", "info", "warning", "error", "none"].indexOf(logLevel) > -1) {
                    // replace log
                    V2rayConfig.bind.loglevel = logLevel;
                    V2rayConfig.config.log.loglevel = logLevel;
                }
            }

            // dns
            if (cfg.dns && cfg.dns.servers) {
                var dnsServers = cfg.dns.servers;
                if (dnsServers && Array.isArray(dnsServers)) {
                    V2rayConfig.bind.dnsServers = dnsServers.join(",");
                    V2rayConfig.config.dns.servers = dnsServers;
                }
            }

            // routing
            if (cfg.hasOwnProperty("routing")) {
                V2rayConfig.config.routing = cfg.routing
            }

            // api
            if (cfg.hasOwnProperty("api")) {
                V2rayConfig.config.api = cfg.api
            }

            // stats
            if (cfg.hasOwnProperty("stats")) {
                V2rayConfig.config.stats = cfg.stats
            }

            // policy
            if (cfg.hasOwnProperty("policy")) {
                V2rayConfig.config.policy = cfg.policy
            }

            // reverse
            if (cfg.hasOwnProperty("reverse")) {
                V2rayConfig.config.reverse = cfg.reverse
            }

            // transport
            if (cfg.hasOwnProperty("transport")) {
                V2rayConfig.config.transport = cfg.transport
            }

            // --------------------------- inbound start --------------------------
            if (!cfg.inbound && !cfg.inbounds) {
                throw "missing inbound or inbounds"
            }

            // inbounds ( version > 4.0)
            if (cfg.inbounds && Array.isArray(cfg.inbounds)) {
                // new version
                V2rayConfig.state.newVersion = true;

                cfg.inbounds.forEach(function (item, idx) {
                    if (item && item.port && item.protocol) {
                        // get port
                        if (item.protocol === "socks" && !V2rayConfig.bind.sockPort) V2rayConfig.bind.sockPort = item.port;
                        if (item.protocol === "http" && !V2rayConfig.bind.httpPort) V2rayConfig.bind.httpPort = item.port;
                        // append
                        V2rayConfig.config.inbounds.push(item)
                    }
                })
            } else {
                // old version
                V2rayConfig.state.newVersion = false;
                // inbound
                if (!(cfg.inbound.protocol && cfg.inbound.port)) {
                    throw "invalid inbound"
                }

                // get port
                if (cfg.inbound.protocol === "socks" && !V2rayConfig.bind.sockPort) V2rayConfig.bind.sockPort = cfg.inbound.port;
                if (cfg.inbound.protocol === "http" && !V2rayConfig.bind.sockPort) V2rayConfig.bind.httpPort = cfg.inbound.port;
                V2rayConfig.config.inbound = cfg.inbound;

                // inboundDetour
                cfg.inboundDetour.forEach(function (item, idx) {
                    if (item && item.port && item.protocol) {
                        // get port
                        if (item.protocol === "socks" && !V2rayConfig.bind.sockPort) V2rayConfig.bind.sockPort = item.port;
                        if (item.protocol === "http" && !V2rayConfig.bind.httpPort) V2rayConfig.bind.httpPort = item.port;
                        // append
                        V2rayConfig.config.inboundDetour.push(item)
                    }
                })
            }
            // --------------------------- inbound end ---------------------------

            // --------------------------- outbound start ------------------------
            if (!cfg.outbound && !cfg.outbounds) {
                throw "missing outbound or outbounds"
            }
            // outbounds ( version > 4.0)
            if (cfg.outbounds && Array.isArray(cfg.outbounds)) {
                // new version
                V2rayConfig.state.newVersion = true;

                cfg.outbounds.forEach(function (item, index) {
                    _this.parseOutbound(item, "outbounds")
                })
            } else {
                // old version
                V2rayConfig.state.newVersion = false;
                // outbound
                _this.parseOutbound(cfg.outbound, "outbound");

                // outboundDetour
                cfg.outboundDetour.forEach(function (item, index) {
                    _this.parseOutbound(item, "outboundDetour")
                })
            }
            // --------------------------- outbound end --------------------------
        } catch (e) {
            V2rayConfig.isValid = false;
            V2rayConfig.error = "error: " + e.toString()
        }
    },

    // parse outbound data
    parseOutbound: function (item, type) {
        if (!item) return;

        if (item.protocol && item.settings) {
            if (!V2rayConfig.bind.serverProtocol && ["vmess", "socks", "shadowsocks"].indexOf(item.protocol) > 0) {
                V2rayConfig.bind.serverProtocol = item.protocol
            }

            // vmess
            if (item.protocol === "vmess" && Array.isArray(item.settings.vnext)) {
                var hasFound = false;
                item.settings.vnext.forEach(function (vmess) {
                    if (hasFound) return;

                    V2rayConfig.bind.vmessAddr = vmess.address;
                    V2rayConfig.bind.vmessPort = vmess.port;

                    if (Array.isArray(vmess.users) && vmess.users[0]) {
                        V2rayConfig.bind.vmessUserId = vmess.users[0].id;
                        V2rayConfig.bind.vmessAlterId = vmess.users[0].alterId;
                        V2rayConfig.bind.vmessSecurity = vmess.users[0].security;
                        V2rayConfig.bind.vmessLevel = vmess.users[0].level;
                    }

                    hasFound = true;
                });

            }

            // socks
            if (item.protocol === "socks" && Array.isArray(item.settings.servers)) {
                var hasFound = false;
                item.settings.servers.forEach(function (sock) {
                    if (hasFound) return;
                    V2rayConfig.bind.socks5Addr = sock.address;
                    V2rayConfig.bind.socks5Port = sock.port;
                    if (Array.isArray(sock.users) && sock.users[0]) {
                        V2rayConfig.bind.socks5User = sock.users[0].user;
                        V2rayConfig.bind.socks5Pass = sock.users[0].pass;
                    }
                });
            }

            // shadowsocks
            if (item.protocol === "shadowsocks" && Array.isArray(item.settings.servers)) {
                var hasFound = false;
                item.settings.servers.forEach(function (sock) {
                    if (hasFound) return;
                    V2rayConfig.bind.shadowsockAddr = sock.address;
                    V2rayConfig.bind.shadowsockPort = sock.port;
                    V2rayConfig.bind.shadowsockMethod = sock.method;
                    V2rayConfig.bind.shadowsockPass = sock.password;
                });
            }
        }

        // stream setting
        if (item.streamSettings && item.streamSettings.network) {
            var stream = item.streamSettings;
            V2rayConfig.bind.streamSecurity = stream.security;

            if (!V2rayConfig.bind.streamNetwork && ["tcp", "kcp", "ws", "h2", "domainsocket"].indexOf(item.protocol) > 0) {
                V2rayConfig.bind.streamNetwork = stream.network;
            }

            // tls
            if (stream.tlsSettings && stream.tlsSettings.allowInsecure) {
                V2rayConfig.bind.streamAllowSecure = stream.tlsSettings.allowInsecure === "tls" ? "tls" : 'none';
            }

            // tcp
            if (stream.tcpSettings && stream.tcpSettings.header) {
                V2rayConfig.bind.tcpHeaderType = stream.tcpSettings.header.type;
            }

            // kcp
            if (stream.kcpSettings) {
                V2rayConfig.bind.kcpMtu = stream.kcpSettings.mtu;
                V2rayConfig.bind.kcpTti = stream.kcpSettings.tti;
                V2rayConfig.bind.kcpUplinkCapacity = stream.kcpSettings.uplinkCapacity;
                V2rayConfig.bind.kcpDownlinkCapacity = stream.kcpSettings.downlinkCapacity;
                V2rayConfig.bind.kcpCongestion = stream.kcpSettings.congestion;
                V2rayConfig.bind.kcpReadBufferSize = stream.kcpSettings.readBufferSize;
                V2rayConfig.bind.kcpWriteBufferSize = stream.kcpSettings.writeBufferSize;
                if (stream.kcpSettings.header) {
                    V2rayConfig.bind.kcpHeader = stream.kcpSettings.header.type;
                }
            }

            // h2
            if (stream.httpSettings) {
                V2rayConfig.bind.h2Host = stream.httpSettings.host;
                V2rayConfig.bind.path = stream.httpSettings.path;
            }

            // ws
            if (stream.wsSettings) {
                V2rayConfig.bind.wsPath = stream.wsSettings.path;
                if (stream.wsSettings.headers) {
                    V2rayConfig.bind.wsHost = stream.wsSettings.headers.Host;
                }
            }
        }

        // append
        if (type === "outbound") V2rayConfig.config.outbound = item;
        if (type === "outbounds") V2rayConfig.config.outbounds.push(item);
        if (type === "outboundDetour") V2rayConfig.config.outboundDetour.push(item);
    },

    // apply combine
    apply: function () {
        var _this = this;
        // log
        V2rayConfig.config.log.loglevel = V2rayConfig.bind.loglevel;

        // no json text input
        if (V2rayConfig.state.emptyInput) {
            // set all from manual bind data
            // ------------------------ inbound --------------------------------
            var inSocks = V2rayConfig.default.inboundSocks;
            inSocks.port = V2rayConfig.bind.sockPort;
            inSocks.udp = V2rayConfig.bind.enableUdp;
            var inHttp = V2rayConfig.default.inboundHttp;
            inHttp.port = V2rayConfig.bind.httpPort;

            // new version
            if (V2rayConfig.state.newVersion) {
                V2rayConfig.config.inbounds.push(inSocks, inHttp)
            } else {
                V2rayConfig.config.inbound = inSocks;
                console.log("inHttp", inHttp);
                V2rayConfig.config.inboundDetour.push(inHttp);
            }

            // ------------------------ outbound --------------------------------
            if (!(["vmess", "socks", "shadowsocks"].indexOf(V2rayConfig.bind.serverProtocol) > -1)) {
                V2rayConfig.error = "error: not found protocol";
                return
            }

            var outbound = V2rayConfig.default.outbound;
            outbound.protocol = V2rayConfig.bind.serverProtocol;
            var mux = V2rayConfig.default.mux;
            mux.enabled = V2rayConfig.bind.enableMux;
            mux.concurrency = V2rayConfig.bind.muxConcurrent;
            outbound.mux = mux;

            // settings by protocol
            switch (outbound.protocol) {
                case "vmess":
                    var vmessItem = V2rayConfig.default.vmess;
                    vmessItem.address = V2rayConfig.bind.vmessAddr;
                    vmessItem.port = V2rayConfig.bind.vmessPort;
                    vmessItem.users[0].alterId = V2rayConfig.bind.vmessAlterId;
                    vmessItem.users[0].id = V2rayConfig.bind.vmessUserId;
                    vmessItem.users[0].level = V2rayConfig.bind.vmessLevel;
                    vmessItem.users[0].security = V2rayConfig.bind.vmessSecurity;

                    // set outbound
                    outbound.settings = {
                        "vnext": [vmessItem]
                    };
                    break;
                case "socks":
                    var sockItem = V2rayConfig.default.socks;
                    sockItem.address = V2rayConfig.bind.socks5Addr;
                    sockItem.port = V2rayConfig.bind.socks5Port;
                    sockItem.users[0].user = V2rayConfig.bind.socks5User;
                    sockItem.users[0].pass = V2rayConfig.bind.socks5Pass;

                    // set outbound
                    outbound.settings = {
                        "servers": [sockItem]
                    };
                    break;
                case "shadowsocks":
                    var shadowsockItem = V2rayConfig.default.shadowsocks;
                    shadowsockItem.address = V2rayConfig.bind.shadowsockAddr;
                    shadowsockItem.port = V2rayConfig.bind.shadowsockPort;
                    shadowsockItem.method = V2rayConfig.bind.shadowsockMethod;
                    shadowsockItem.password = V2rayConfig.bind.shadowsockPass;

                    // set outbound
                    outbound.settings = {
                        "servers": [shadowsockItem]
                    };
                    break;
            }

            outbound.streamSettings = this.getStreamSetting();

            // new version
            if (V2rayConfig.state.newVersion) {
                V2rayConfig.config.outbounds.push(outbound, V2rayConfig.default.outboundFreedom, V2rayConfig.default.outboundBlackhole)
            } else {
                V2rayConfig.config.outbound = outbound;
                V2rayConfig.config.outboundDetour.push(V2rayConfig.default.outboundFreedom, V2rayConfig.default.outboundBlackhole);
            }
        } else {
            // new version
            if (V2rayConfig.state.newVersion) {
                // inbounds
                V2rayConfig.config.inbounds.forEach(function (item) {
                    if (item.protocol === "socks") {
                        item.port = V2rayConfig.bind.sockPort;
                        item.udp = V2rayConfig.bind.enableUdp;
                    }
                    if (item.protocol === "http") {
                        item.port = V2rayConfig.bind.httpPort;
                    }
                });

                // outbounds
                V2rayConfig.config.outbounds.forEach(function (item, idx) {
                    V2rayConfig.config.outbounds[idx] = _this.replaceOutbound(item)
                });
            } else {
                // inbound
                if (V2rayConfig.config.inbound.protocol === "socks") {
                    V2rayConfig.config.inbound.port = V2rayConfig.bind.sockPort;
                    V2rayConfig.config.inbound.udp = V2rayConfig.bind.enableUdp;
                }
                if (V2rayConfig.config.inbound.protocol === "http") {
                    V2rayConfig.config.inbound.port = V2rayConfig.bind.httpPort;
                }
                // inboundDetour
                V2rayConfig.config.inboundDetour.forEach(function (item) {
                    if (item.protocol === "socks") {
                        item.port = V2rayConfig.bind.sockPort;
                        item.udp = V2rayConfig.bind.enableUdp;
                    }
                    if (item.protocol === "http") {
                        item.port = V2rayConfig.bind.httpPort;
                    }
                });

                // outbounds
                V2rayConfig.config.outbound = _this.replaceOutbound(V2rayConfig.config.outbound);
                // outboundDetour
                V2rayConfig.config.outboundDetour.forEach(function (item, idx) {
                    V2rayConfig.config.outboundDetour[idx] = _this.replaceOutbound(item)
                });
            }
        }

        return  JSON.stringify(V2rayConfig.config, null, 2);
    },

    getStreamSetting: function () {
        // streamSettings
        var streamSettings = V2rayConfig.default.streamSettings;
        streamSettings.network = V2rayConfig.bind.streamNetwork;
        var tlsSettings = V2rayConfig.default.tlsSettings;
        tlsSettings.allowInsecure = V2rayConfig.bind.streamAllowSecure;
        tlsSettings.serverName = V2rayConfig.bind.streamTlsServerName;
        streamSettings.tlsSettings = streamSettings;

        // stream settings by network
        switch (streamSettings.network) {
            case "tcp":
                var tcpSettings = V2rayConfig.default.tcpSettings;
                tcpSettings.header.type = V2rayConfig.bind.tcpHeaderType;
                break;
            case "kcp":
                var kcpSettings = V2rayConfig.default.kcpSettings;
                kcpSettings.mtu = V2rayConfig.bind.kcpMtu;
                kcpSettings.tti = V2rayConfig.bind.kcpTti;
                kcpSettings.uplinkCapacity = V2rayConfig.bind.kcpUplinkCapacity;
                kcpSettings.downlinkCapacity = V2rayConfig.bind.kcpDownlinkCapacity;
                kcpSettings.readBufferSize = V2rayConfig.bind.kcpReadBufferSize;
                kcpSettings.writeBufferSize = V2rayConfig.bind.kcpWriteBufferSize;
                kcpSettings.congestion = V2rayConfig.bind.kcpCongestion;
                kcpSettings.header = V2rayConfig.bind.kcpHeader;
                streamSettings.kcpSettings = tcpSettings;
                break;
            case "h2":
                var httpSettings = V2rayConfig.default.httpSettings;
                httpSettings.host[0] = V2rayConfig.bind.h2Host;
                httpSettings.path = V2rayConfig.bind.h2Path;
                streamSettings.httpSettings = httpSettings;
                break;
            case "ws":
                var wsSettings = V2rayConfig.default.wsSettings;
                wsSettings.headers.Host = V2rayConfig.bind.wsHost;
                wsSettings.path = V2rayConfig.bind.wsPath;
                streamSettings.wsSettings = wsSettings;
                break;
            case "":
                var dsSettings = V2rayConfig.default.dsSettings;
                dsSettings.path = V2rayConfig.bind.dsPath;
                streamSettings.dsSettings = dsSettings;
                break;
        }

        return streamSettings;
    },

    replaceOutbound: function (outbound) {
        try {
            // settings by protocol
            switch (outbound.protocol) {
                case "vmess":
                    outbound.settings.vnext[0].address = V2rayConfig.bind.vmessAddr;
                    outbound.settings.vnext[0].port = V2rayConfig.bind.vmessPort;
                    outbound.settings.vnext[0].users[0].alterId = V2rayConfig.bind.vmessAlterId;
                    outbound.settings.vnext[0].users[0].id = V2rayConfig.bind.vmessUserId;
                    outbound.settings.vnext[0].users[0].level = V2rayConfig.bind.vmessLevel;
                    outbound.settings.vnext[0].users[0].security = V2rayConfig.bind.vmessSecurity;
                    break;
                case "socks":
                    outbound.settings.servers[0].address = V2rayConfig.bind.socks5Addr;
                    outbound.settings.servers[0].port = V2rayConfig.bind.socks5Port;
                    outbound.settings.servers[0].users[0].user = V2rayConfig.bind.socks5User;
                    outbound.settings.servers[0].users[0].pass = V2rayConfig.bind.socks5Pass;
                    break;
                case "shadowsocks":
                    outbound.settings.servers[0].address = V2rayConfig.bind.shadowsockAddr;
                    outbound.settings.servers[0].port = V2rayConfig.bind.shadowsockPort;
                    outbound.settings.servers[0].method = V2rayConfig.bind.shadowsockMethod;
                    outbound.settings.servers[0].password = V2rayConfig.bind.shadowsockPass;
                    break;
                default:
                    return outbound
            }
        } catch (e) {
            V2rayConfig.error = "error:" + e.toString();
            return outbound;
        }


        outbound.streamSettings = this.getStreamSetting();

        return outbound;
    },

    // apply bind data
    setString: function (bindKey, val) {
        let decodeStr = decodeURIComponent(val);

        if (V2rayConfig.bind.hasOwnProperty(bindKey)) {
            V2rayConfig.bind[bindKey] = decodeStr
        }
    },

    // apply bind data
    setBool: function (bindKey, val) {
        if (V2rayConfig.bind.hasOwnProperty(bindKey)) {
            V2rayConfig.bind[bindKey] = !!val
        }
    },

    // reset all data
    reset: function () {
        for (let bindKey in V2rayConfig.bind) {
            if (V2rayConfig.hasOwnProperty(bindKey)) {
                V2rayConfig.bind[bindKey] = "";
            }
        }

        // set default
        V2rayConfig.bind.loglevel = "info";
        V2rayConfig.bind.streamNetwork = "tcp";
        V2rayConfig.bind.serverProtocol = "vmess";
        V2rayConfig.bind.streamAllowSecure = "tls";

        // config
        V2rayConfig.config.log.loglevel = "info";
        V2rayConfig.config.inbound = {};
        V2rayConfig.config.inbounds = [];
        V2rayConfig.config.inboundDetour = [];
        V2rayConfig.config.outbound = {};
        V2rayConfig.config.outbounds = [];
        V2rayConfig.config.outboundDetour = [];
        V2rayConfig.config.routing = V2rayConfig.default.routing
    },
};

var v2ray = new V2rayConfig();
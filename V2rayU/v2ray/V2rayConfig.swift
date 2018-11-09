//
//  V2rayConfig.swift
//  V2rayU
//
//  Created by yanue on 2018/10/25.
//  Copyright © 2018 yanue. All rights reserved.
//

import Foundation
import SwiftyJSON
import JavaScriptCore

class V2rayConfig: NSObject {
    var isValid = false
    let jsContext: JSContext = JSContext()

    // load javascript
    override init() {
        // Specify the path to the v2ray.js file.
        if let jsSourcePath = Bundle.main.path(forResource: "V2rayConfig", ofType: "js") {
            do {
                // Load its contents to a String variable.
                let jsSourceContents = try String(contentsOfFile: jsSourcePath)

                // Add the Javascript code that currently exists in the jsSourceContents to the Javascript Runtime through the jsContext object.
                self.jsContext.evaluateScript(jsSourceContents)
            } catch {
                print("err,", error.localizedDescription)
            }
        }
    }


    // bind key relationship between javascript and view
    enum bindKeyName: String {
        // base
        case sockPort
        case httpPort
        case dnsServers
        case enableUdp
        case enableMux
        case muxConcurrent

        // protocol
        case serverProtocol
        // vmess
        case vmessAddr
        case vmessPort
        case vmessAlterId
        case vmessLevel
        case vmessUserId
        case vmessSecurity

        // shadowsocks
        case shadowsockAddr
        case shadowsockPort
        case shadowsockPass
        case shadowsockMethod

        // socks5
        case socks5Addr
        case socks5Port
        case socks5User
        case socks5Pass

        // network
        case streamNetwork

        // kcp setting
        case kcpMtu
        case kcpTti
        case kcpUplinkCapacity
        case kcpDownlinkCapacity
        case kcpReadBufferSize
        case kcpWriteBufferSize
        case kcpHeader
        case kcpCongestion

        // tcp
        case tcpHeaderType

        // ws
        case wsHost
        case wsPath

        // h2
        case h2Host
        case h2Path

        // ds
        case dsPath

        // tls
        case streamSecurity
        case streamAllowSecure
        case streamTlsServerName
    }


    func getBool(key: bindKeyName) -> Bool {
        // get from V2rayConfig by evaluateScript
        if let res = self.jsContext.evaluateScript("V2rayConfig.bind." + key.rawValue), res.toString() != "undefined" {
            return res.toBool()
        }

        return false
    }

    func getString(key: bindKeyName) -> String {
        // get from V2rayConfig by evaluateScript
        if let res = self.jsContext.evaluateScript("V2rayConfig.bind." + key.rawValue), res.toString() != "undefined" {
            return res.toString()
        }

        return ""
    }

    func getInt(key: bindKeyName) -> Int32 {
        // get from V2rayConfig by evaluateScript
        if let res = self.jsContext.evaluateScript("V2rayConfig.bind." + key.rawValue), res.toString() != "undefined" {
            return res.toInt32()
        }

        return 0
    }

    // set string
    func setString(key: bindKeyName, val: String) {
        // call js init func
        if let escapedString = val.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed) {
            self.jsContext.evaluateScript("v2ray.setString('" + key.rawValue + "','" + escapedString + "')")
        }
        // get javascript parse error

    }

    // set bool
    func setBool(key: bindKeyName, val: Bool) {
        if val {
            // true string
            self.jsContext.evaluateScript("v2ray.setBool('" + key.rawValue + "','true')")
        } else {
            // empty string
            self.jsContext.evaluateScript("v2ray.setBool('" + key.rawValue + "','')")
        }
    }

    // parse imported or edited json text
    // by import tab view
    func parseJson(jsonText: String) -> String {
        // call js init func
        if let escapedString = jsonText.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed) {
            if let result = self.jsContext.evaluateScript("v2ray.init('" + escapedString + "')") {
                // error occurred with prefix "error:"
                if let reStr = result.toString() {
                    // replace json str
                    return reStr
                }
            }
        }

        // get javascript parse error
        return self.jsContext.evaluateScript("V2rayConfig.error").toString()
    }

    // combine
    func combineManualData() -> String {
        // call js init func
        if let result = self.jsContext.evaluateScript("v2ray.apply()") {
            // error occurred with prefix "error:"
            if let reStr = result.toString() {
                // replace json str
                return reStr
            }
        }

        // get javascript parse error
        return self.jsContext.evaluateScript("V2rayConfig.error").toString()
    }

    // create current v2ray server json file
    static func createJsonFile(item: v2rayItem) {
        let jsonText = item.json

        // path: /Application/V2rayU.app/Contents/Resources/config.json
        guard let jsonFile = V2rayServer.getJsonFile() else {
            NSLog("unable get config file path")
            return
        }

        do {
            let jsonFilePath = URL.init(fileURLWithPath: jsonFile)

            // delete before config
            if FileManager.default.fileExists(atPath: jsonFile) {
                try? FileManager.default.removeItem(at: jsonFilePath)
            }

            try jsonText.write(to: jsonFilePath, atomically: true, encoding: String.Encoding.utf8)
        } catch let error {
            // failed to write file – bad permissions, bad filename, missing permissions, or more likely it can't be converted to the encoding
            NSLog("save json file fail: \(error)")
        }
    }
}

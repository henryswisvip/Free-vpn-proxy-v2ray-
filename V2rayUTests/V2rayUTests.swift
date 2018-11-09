//
//  V2rayUTests.swift
//  V2rayUTests
//
//  Created by yanue on 2018/10/25.
//  Copyright © 2018 yanue. All rights reserved.
//

import XCTest
@testable import V2rayU
import SwiftyJSON


class V2rayUTests: XCTestCase {
    func test() {
        let v2ray = V2rayConfig()
        v2ray.parseJson(jsonText: jsonTxt)
        print("b", v2ray.getString(key: .httpPort))
        print("c", v2ray.getBool(key: .httpPort))
        print("d", v2ray.getBool(key: .httpPort))
        print("e", v2ray.setBool(key: .httpPort, val: true))
        print("f", v2ray.getBool(key: .httpPort))
        print("g", v2ray.getString(key: .httpPort))
    }
}

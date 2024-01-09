//
//  String.swift
//  Mealer
//
//  Created by Christensen, Kristoffer Moberg on 08/11/2023.
//

import Foundation

extension String {
    
    func base64Decoded2() -> String? {
        var base64String = self
        if base64String.count % 4 != 0 {
            let padlen = 4 - base64String.count % 4
            base64String.append(contentsOf: repeatElement("=", count: padlen))
        }
        
        guard let data = Data(base64Encoded: base64String, options: .ignoreUnknownCharacters) else { return nil }
        return String(data: data, encoding: .utf8)
    }
}

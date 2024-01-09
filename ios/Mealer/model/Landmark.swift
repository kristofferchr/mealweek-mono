//
//  Landmark.swift
//  Mealer
//
//  Created by Christensen, Kristoffer Moberg on 01/11/2023.
//

import Foundation
import SwiftUI
import MapKit

struct Landmark: Hashable, Codable, Identifiable {
    var id: Int
    var name: String
    var park: String
    var state: String
    var description: String
    var isFavorite: Bool
    
    private var imageName: String
       var image: Image {
           Image(imageName)
       }
    
    
    var locationCoordinate: CLLocationCoordinate2D {
            CLLocationCoordinate2D(
                latitude: coordinates.latitude,
                longitude: coordinates.longitude)
        }
    
    private var coordinates: Coordinates

    struct Coordinates: Hashable, Codable {
        var latitude: Double
        var longitude: Double
    }
}

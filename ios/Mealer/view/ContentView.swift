//
//  ContentView.swift
//  Mealer
//
//  Created by Christensen, Kristoffer Moberg on 01/11/2023.
//

import SwiftUI
import JWTDecode

struct ContentView: View {
    @State var jwtToken : JWT? = nil
    
    @State var client : GrpcClient
    
    init() {
        do {
            let client = try GrpcClient.init(hostName: "192.168.10.182", port: 3334)
            _client = State(initialValue: client)
        } catch {
            exit(1)
        }
    }
    
    var isAuthenticated : Bool {
        guard let jwt = jwtToken else {
            return false
        }
        
        if !jwt.expired {
            return true
        } else {
            return false
        }
    }
    
    var body: some View {
        if(isAuthenticated) {
            TabView {
                PlanningView().tabItem {
                    Label("Planleggeren", systemImage: "calendar.badge.clock")
                }
                MealView(client: $client).tabItem {
                    Label("Middager", systemImage: "fork.knife")
                }
            }
        } else {
            LoginView(client: $client, jwtToken: $jwtToken)
        }
    }
}

#Preview {
    ContentView()
}

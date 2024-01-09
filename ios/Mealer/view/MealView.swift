//
//  MealView.swift
//  Mealer
//
//  Created by Christensen, Kristoffer Moberg on 06/11/2023.
//

import SwiftUI

struct MealView: View {
    @Binding var client: GrpcClient
    
    @State private var middagInput: String = ""
    @State private var meals: [String] = []
    private var sortedMeals : [String] {
        meals.sorted(by: {$0.lowercased() < $1.lowercased()})
    }
    @State private var isEditing = false
    
    
    @FocusState private var isFocused: Bool
    
    func deleteMeal(name: String) async {
        do {
            let _ = try await client.deleteMeal(name: name)
        } catch {
            // TODO Handle error
            print(error)
            print("error deleting meal")
        }
    }
    
    func getMeals() async{
        do {
            let grpcMeals = try await client.getMeals()
            print("Fetched meals")
            
            meals = grpcMeals.map{
                $0.name
            }
        } catch {
            // TODO Handle error
            print("ERROR fetching meals")
            print(error)
        }
    }
    
    var body: some View {
        VStack {
            if(sortedMeals.isEmpty) {
                List{
                    Text("Ingen måltider lagt til.")
                }
            } else {
                NavigationStack {
                    List{
                        ForEach (sortedMeals, id: \.self){ meal in
                            Text(meal)
                        }
                        .onDelete(perform: { indexSet in
                            Task {
                                let mealName = sortedMeals[indexSet.first!]
                                await deleteMeal(name: mealName)
                                meals.removeAll(where: {value in value == mealName})
                            }
                        })
                    }
                    .navigationTitle("Måltider")
                    .toolbar{
                        EditButton()
                    }
                }
                
                HStack{
                    TextField("Legg til middag", text: $middagInput, onCommit: {})
                        .onSubmit {
                            if !middagInput.isEmpty {
                                let meal = middagInput.trimmingCharacters(in: .whitespaces)
                                Task{
                                    do {
                                        try await  client.addMeal(name:meal)
                                        
                                        meals.insert(meal, at: 0)
                                        isFocused = true
                                        self.middagInput = ""
                                    } catch {
                                        print("feilet med å legge til mat")
                                    }
                                }
                            }
                        }
                        .padding()
                        .focused($isFocused)
                        .submitLabel(.done)
//                        .onTapGesture {
//                            isFocused = true
//                        }
                }
            }
            
        }
//        .onTapGesture {
//            //            isFocused = false
////            self.middagInput = ""
//        }
        .task {
            await getMeals()
        }
    }
}

#Preview {
    @Sendable func initClient() async  -> GrpcClient? {
        do {
            let client = try GrpcClient.init(hostName: "localhost", port: 3334)
            
            
            
            let jwt = try await client.login(email: "kris@me.com", password: "toff")
            
            return client
        }
        catch {
            return nil
        }
    }
    
    struct AsyncMealView: View {
        @State private var client: GrpcClient?
        
        var body: some View {
            if let client2 = client {
                MealView(client: .constant(client2))
            } else {
                Text("Ikke logget inn nå").task{
                    client = await initClient()
                }
            }
        }
    }
    return AsyncMealView()
    
}

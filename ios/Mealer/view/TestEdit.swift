//
//  TestEdit.swift
//  Mealer
//
//  Created by Christensen, Kristoffer Moberg on 10/11/2023.
//

import SwiftUI

struct TestEdit: View {
    @State private var users = ["Paul", "Taylor", "Adele"]

    var body: some View {
        NavigationStack {
            List {
                ForEach(users, id: \.self) { user in
                    Text(user)
                }
                .onDelete(perform: delete)
            }
            .toolbar {
                EditButton()
            }
        }
    }

    func delete(at offsets: IndexSet) {
        users.remove(atOffsets: offsets)
    }
}

#Preview {
    TestEdit()
}

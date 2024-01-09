//
//  PlanningView.swift
//  Mealer
//
//  Created by Christensen, Kristoffer Moberg on 10/11/2023.
//

import SwiftUI

struct PlanningView: View {
    @StateObject var weekStore: WeekStore = WeekStore()

    var body: some View {
        InfiniteWeekView()
                    .environmentObject(weekStore)
    }
}

#Preview {
    PlanningView()
}

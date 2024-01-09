//
//  InfiniteWeek.swift
//  Mealer
//
//  Created by Christensen, Kristoffer Moberg on 16/11/2023.
//

import SwiftUI

struct InfiniteWeekView: View {
    @EnvironmentObject var weekStore: WeekStore

    var body: some View {
        GeometryReader { geometry in
            NavigationStack {
                ZStack {
                    VStack {
                        WeekHeaderView()
                        WeeksTabView() { week in
                            WeekView(week: week)
                        }
                        .frame(height: 80, alignment: .top)
                        Text(weekStore.selectedDate.toString(format: "EEEE, dd.MM.yyyy"))
                            .font(.system(size: 10, design: .monospaced))
                            .foregroundColor(Color.gray)
                    }
                    VStack {
                        Spacer()
                        HStack {
                            Spacer()
                            NavigationLink {
                            } label: {
                                Image(systemName: "plus.circle.fill")
                                    .font(.system(size: 50))
                                    .foregroundColor(.accentColor)
                            }
                            .padding()
                        }
                    }
                }
                
            }
        }
    }
}

struct InfinityTabPageWrapperView_Previews: PreviewProvider {
    static var previews: some View {
        InfiniteWeekView()
            .environmentObject(WeekStore())
    }
}

//
//  LoginView.swift
//  Mealer
//
//  Created by Christensen, Kristoffer Moberg on 05/11/2023.
//

import SwiftUI
import GRPC
import NIO
import JWTDecode

struct LoginView: View {
    @Binding var client: GrpcClient
    
    @Binding var jwtToken: JWT?
    
    @State private var emailInput: String = ""
    @State private var passwordInput: String = ""
    
    @State private var isLoggingIn: Bool = false
    
    @State private var errorMessage: String = ""
    @State private var showAlert: Bool = false
    
    var isButtonDisabled: Bool{
        return emailInput.isEmpty || passwordInput.isEmpty
    }
    
    var buttonColor: Color {
        return isButtonDisabled ? .gray : .accentColor
    }
    
    func login() async {
        do {
            jwtToken = try await client.login(email: emailInput, password: passwordInput)
        } catch GrpcClientError.failedLogin(_, let message) {
            print("Failed login")
            errorMessage = message
            showAlert = true
        } catch {
            errorMessage = error.localizedDescription
            showAlert = true
        }
    }
    
    var body: some View {
        VStack {
            VStack(spacing: 16) {
                TextField("Email", text: $emailInput)
                    .submitLabel(.continue)
                    .autocorrectionDisabled()
                    .textInputAutocapitalization(.never)
                
                Divider()
                
                SecureField("Passord", text: $passwordInput)
                    .submitLabel(.send)
            }.padding(.bottom, 16)
            
            
            Button(action:{
                Task {
                    isLoggingIn = true
                    await login()
                    isLoggingIn = false
                }
            })  {
                Text("Login")
                    .font(.system(size: 24, weight: .bold, design: .default))
                    .frame(maxWidth: .infinity, maxHeight: 60)
                    .foregroundColor(Color.white)
                    .background(buttonColor)
                    .cornerRadius(10)
            }
            .frame(maxWidth: .infinity )
            .padding(.top, 16)
            .disabled(isButtonDisabled)
            .alert("Innlogging feilet", isPresented: $showAlert, presenting: errorMessage)  { err in
                Text(err)
                Button("Ok", role: .cancel) { }
            }
        }.padding()
            .blur(radius: isLoggingIn ? 3.0 : 0)
            .overlay{
                if isLoggingIn {
                    VStack {
                        ProgressView{
                            Text("Logger inn...")
                        }
                    }
                }
                
            }
        
    }
}

#Preview {
    do {
        let client = try GrpcClient.init(hostName: "localhost", port: 3334)
        
        return LoginView(client: .constant(client), jwtToken: .constant(nil))
    } catch {
        return VStack {
            Text("Feilet å koble til grpc server")
        }
    }
}

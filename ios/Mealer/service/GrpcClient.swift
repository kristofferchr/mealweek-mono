//
//  GrpcClient.swift
//  Mealer
//
//  Created by Christensen, Kristoffer Moberg on 08/11/2023.
//

import Foundation
import GRPC
import JWTDecode

enum GrpcClientError : Error{
    case failedConnect(errorMessage: String)
    case failedLogin(code: GRPCStatus.Code?, message: String)
    case notLoggedIn
}
class GrpcClient {
    private var jwt: JWT?
    private var channel: GRPCChannel
    init (hostName: String, port: Int)  throws {
        let group = PlatformSupport.makeEventLoopGroup(loopCount: 1)
        
        channel = try GRPCChannelPool.with(
            target: .host(hostName, port: port),
            transportSecurity: .plaintext,
            eventLoopGroup: group
        )
    }
    
    func deleteMeal(name: String) async throws {
        if let jwtString = jwt?.string {
            let callOptions = CallOptions(customMetadata: [
                "Authorization": "Bearer \(jwtString)"
            ])
            
            let client = Meals_V1_MealsServiceNIOClient(channel: channel, defaultCallOptions: callOptions)
            let request : Meals_V1_DeleteMealRequest = .with{
                $0.name = name
            }
            
            do {
                let _ = try await client.deleteMeal(request).response.get()
            } catch {
                // TODO: add specific errors
                throw error
            }
        } else {
            throw GrpcClientError.notLoggedIn
        }
    }
    func addMeal(name: String) async throws {
        if let jwtString = jwt?.string {
            let callOptions = CallOptions(customMetadata: [
                "Authorization": "Bearer \(jwtString)"
            ])
            
            let client = Meals_V1_MealsServiceNIOClient(channel: channel, defaultCallOptions: callOptions)
            let request : Meals_V1_CreateMealRequest = .with{
                $0.name = name
            }
            
            do {
                let _ = try await client.createMeal(request).response.get()
            } catch {
                // TODO: add specific errors
                throw error
            }
        } else {
            throw GrpcClientError.notLoggedIn
        }
    }
    
    func getMeals() async throws -> [Meals_V1_meal]{
        if let jwtString = jwt?.string {
            let callOptions = CallOptions(customMetadata: [
                "Authorization": "Bearer \(jwtString)"
            ])
            
            let client = Meals_V1_MealsServiceNIOClient(channel: channel, defaultCallOptions: callOptions)
            let request = Meals_V1_GetMealsRequest()
            do {
                let mealsResponse = try await client.getMeals(request).response.get()
                return mealsResponse.meals 
            } catch {
                // TODO: add specific errors
                throw error
            }
        } else {
            throw GrpcClientError.notLoggedIn
        }
    }
    
    func login(email: String, password: String) async throws -> JWT {
        let client = Auth_V1_AuthServiceNIOClient(channel:channel)
        let request : Auth_V1_LoginRequest = .with{
            $0.email = email
            $0.password = password
        }
        
        do {
            let loginResponse = try await client.login(request).response.get()
            let jwtToken = loginResponse.token
            let parsedJwt = try JWTDecode.decode(jwt:jwtToken)
            
            jwt = parsedJwt
            
            return parsedJwt
            
        }
        catch is JWTDecodeError {
            throw GrpcClientError.failedLogin(code: nil, message: "Uforventet feil med autentisering. Ikke gyldig JWT token.")
            
        }
        catch {
            if let grpcError = error as? GRPCStatus {
                let message = grpcError.message ?? "Uforventet feil. Vennligst prøv igjen."
                throw GrpcClientError.failedLogin(code: grpcError.code, message: message)
            } else {
                throw GrpcClientError.failedLogin(code: nil, message: error.localizedDescription)
            }
        }
    }
    
    func closeConnection() async throws {
        try await channel.close().get()
    }
}

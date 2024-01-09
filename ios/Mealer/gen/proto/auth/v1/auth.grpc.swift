//
// DO NOT EDIT.
// swift-format-ignore-file
//
// Generated by the protocol buffer compiler.
// Source: proto/auth/v1/auth.proto
//
import GRPC
import NIO
import NIOConcurrencyHelpers
import SwiftProtobuf


/// Usage: instantiate `Auth_V1_AuthServiceClient`, then call methods of this protocol to make API calls.
internal protocol Auth_V1_AuthServiceClientProtocol: GRPCClient {
  var serviceName: String { get }
  var interceptors: Auth_V1_AuthServiceClientInterceptorFactoryProtocol? { get }

  func login(
    _ request: Auth_V1_LoginRequest,
    callOptions: CallOptions?
  ) -> UnaryCall<Auth_V1_LoginRequest, Auth_V1_LoginResponse>

  func register(
    _ request: Auth_V1_RegisterRequest,
    callOptions: CallOptions?
  ) -> UnaryCall<Auth_V1_RegisterRequest, Auth_V1_RegisterResponse>
}

extension Auth_V1_AuthServiceClientProtocol {
  internal var serviceName: String {
    return "auth.v1.AuthService"
  }

  /// Unary call to Login
  ///
  /// - Parameters:
  ///   - request: Request to send to Login.
  ///   - callOptions: Call options.
  /// - Returns: A `UnaryCall` with futures for the metadata, status and response.
  internal func login(
    _ request: Auth_V1_LoginRequest,
    callOptions: CallOptions? = nil
  ) -> UnaryCall<Auth_V1_LoginRequest, Auth_V1_LoginResponse> {
    return self.makeUnaryCall(
      path: Auth_V1_AuthServiceClientMetadata.Methods.login.path,
      request: request,
      callOptions: callOptions ?? self.defaultCallOptions,
      interceptors: self.interceptors?.makeLoginInterceptors() ?? []
    )
  }

  /// Unary call to Register
  ///
  /// - Parameters:
  ///   - request: Request to send to Register.
  ///   - callOptions: Call options.
  /// - Returns: A `UnaryCall` with futures for the metadata, status and response.
  internal func register(
    _ request: Auth_V1_RegisterRequest,
    callOptions: CallOptions? = nil
  ) -> UnaryCall<Auth_V1_RegisterRequest, Auth_V1_RegisterResponse> {
    return self.makeUnaryCall(
      path: Auth_V1_AuthServiceClientMetadata.Methods.register.path,
      request: request,
      callOptions: callOptions ?? self.defaultCallOptions,
      interceptors: self.interceptors?.makeRegisterInterceptors() ?? []
    )
  }
}

@available(*, deprecated)
extension Auth_V1_AuthServiceClient: @unchecked Sendable {}

@available(*, deprecated, renamed: "Auth_V1_AuthServiceNIOClient")
internal final class Auth_V1_AuthServiceClient: Auth_V1_AuthServiceClientProtocol {
  private let lock = Lock()
  private var _defaultCallOptions: CallOptions
  private var _interceptors: Auth_V1_AuthServiceClientInterceptorFactoryProtocol?
  internal let channel: GRPCChannel
  internal var defaultCallOptions: CallOptions {
    get { self.lock.withLock { return self._defaultCallOptions } }
    set { self.lock.withLockVoid { self._defaultCallOptions = newValue } }
  }
  internal var interceptors: Auth_V1_AuthServiceClientInterceptorFactoryProtocol? {
    get { self.lock.withLock { return self._interceptors } }
    set { self.lock.withLockVoid { self._interceptors = newValue } }
  }

  /// Creates a client for the auth.v1.AuthService service.
  ///
  /// - Parameters:
  ///   - channel: `GRPCChannel` to the service host.
  ///   - defaultCallOptions: Options to use for each service call if the user doesn't provide them.
  ///   - interceptors: A factory providing interceptors for each RPC.
  internal init(
    channel: GRPCChannel,
    defaultCallOptions: CallOptions = CallOptions(),
    interceptors: Auth_V1_AuthServiceClientInterceptorFactoryProtocol? = nil
  ) {
    self.channel = channel
    self._defaultCallOptions = defaultCallOptions
    self._interceptors = interceptors
  }
}

internal struct Auth_V1_AuthServiceNIOClient: Auth_V1_AuthServiceClientProtocol {
  internal var channel: GRPCChannel
  internal var defaultCallOptions: CallOptions
  internal var interceptors: Auth_V1_AuthServiceClientInterceptorFactoryProtocol?

  /// Creates a client for the auth.v1.AuthService service.
  ///
  /// - Parameters:
  ///   - channel: `GRPCChannel` to the service host.
  ///   - defaultCallOptions: Options to use for each service call if the user doesn't provide them.
  ///   - interceptors: A factory providing interceptors for each RPC.
  internal init(
    channel: GRPCChannel,
    defaultCallOptions: CallOptions = CallOptions(),
    interceptors: Auth_V1_AuthServiceClientInterceptorFactoryProtocol? = nil
  ) {
    self.channel = channel
    self.defaultCallOptions = defaultCallOptions
    self.interceptors = interceptors
  }
}

@available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
internal protocol Auth_V1_AuthServiceAsyncClientProtocol: GRPCClient {
  static var serviceDescriptor: GRPCServiceDescriptor { get }
  var interceptors: Auth_V1_AuthServiceClientInterceptorFactoryProtocol? { get }

  func makeLoginCall(
    _ request: Auth_V1_LoginRequest,
    callOptions: CallOptions?
  ) -> GRPCAsyncUnaryCall<Auth_V1_LoginRequest, Auth_V1_LoginResponse>

  func makeRegisterCall(
    _ request: Auth_V1_RegisterRequest,
    callOptions: CallOptions?
  ) -> GRPCAsyncUnaryCall<Auth_V1_RegisterRequest, Auth_V1_RegisterResponse>
}

@available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
extension Auth_V1_AuthServiceAsyncClientProtocol {
  internal static var serviceDescriptor: GRPCServiceDescriptor {
    return Auth_V1_AuthServiceClientMetadata.serviceDescriptor
  }

  internal var interceptors: Auth_V1_AuthServiceClientInterceptorFactoryProtocol? {
    return nil
  }

  internal func makeLoginCall(
    _ request: Auth_V1_LoginRequest,
    callOptions: CallOptions? = nil
  ) -> GRPCAsyncUnaryCall<Auth_V1_LoginRequest, Auth_V1_LoginResponse> {
    return self.makeAsyncUnaryCall(
      path: Auth_V1_AuthServiceClientMetadata.Methods.login.path,
      request: request,
      callOptions: callOptions ?? self.defaultCallOptions,
      interceptors: self.interceptors?.makeLoginInterceptors() ?? []
    )
  }

  internal func makeRegisterCall(
    _ request: Auth_V1_RegisterRequest,
    callOptions: CallOptions? = nil
  ) -> GRPCAsyncUnaryCall<Auth_V1_RegisterRequest, Auth_V1_RegisterResponse> {
    return self.makeAsyncUnaryCall(
      path: Auth_V1_AuthServiceClientMetadata.Methods.register.path,
      request: request,
      callOptions: callOptions ?? self.defaultCallOptions,
      interceptors: self.interceptors?.makeRegisterInterceptors() ?? []
    )
  }
}

@available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
extension Auth_V1_AuthServiceAsyncClientProtocol {
  internal func login(
    _ request: Auth_V1_LoginRequest,
    callOptions: CallOptions? = nil
  ) async throws -> Auth_V1_LoginResponse {
    return try await self.performAsyncUnaryCall(
      path: Auth_V1_AuthServiceClientMetadata.Methods.login.path,
      request: request,
      callOptions: callOptions ?? self.defaultCallOptions,
      interceptors: self.interceptors?.makeLoginInterceptors() ?? []
    )
  }

  internal func register(
    _ request: Auth_V1_RegisterRequest,
    callOptions: CallOptions? = nil
  ) async throws -> Auth_V1_RegisterResponse {
    return try await self.performAsyncUnaryCall(
      path: Auth_V1_AuthServiceClientMetadata.Methods.register.path,
      request: request,
      callOptions: callOptions ?? self.defaultCallOptions,
      interceptors: self.interceptors?.makeRegisterInterceptors() ?? []
    )
  }
}

@available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
internal struct Auth_V1_AuthServiceAsyncClient: Auth_V1_AuthServiceAsyncClientProtocol {
  internal var channel: GRPCChannel
  internal var defaultCallOptions: CallOptions
  internal var interceptors: Auth_V1_AuthServiceClientInterceptorFactoryProtocol?

  internal init(
    channel: GRPCChannel,
    defaultCallOptions: CallOptions = CallOptions(),
    interceptors: Auth_V1_AuthServiceClientInterceptorFactoryProtocol? = nil
  ) {
    self.channel = channel
    self.defaultCallOptions = defaultCallOptions
    self.interceptors = interceptors
  }
}

internal protocol Auth_V1_AuthServiceClientInterceptorFactoryProtocol: Sendable {

  /// - Returns: Interceptors to use when invoking 'login'.
  func makeLoginInterceptors() -> [ClientInterceptor<Auth_V1_LoginRequest, Auth_V1_LoginResponse>]

  /// - Returns: Interceptors to use when invoking 'register'.
  func makeRegisterInterceptors() -> [ClientInterceptor<Auth_V1_RegisterRequest, Auth_V1_RegisterResponse>]
}

internal enum Auth_V1_AuthServiceClientMetadata {
  internal static let serviceDescriptor = GRPCServiceDescriptor(
    name: "AuthService",
    fullName: "auth.v1.AuthService",
    methods: [
      Auth_V1_AuthServiceClientMetadata.Methods.login,
      Auth_V1_AuthServiceClientMetadata.Methods.register,
    ]
  )

  internal enum Methods {
    internal static let login = GRPCMethodDescriptor(
      name: "Login",
      path: "/auth.v1.AuthService/Login",
      type: GRPCCallType.unary
    )

    internal static let register = GRPCMethodDescriptor(
      name: "Register",
      path: "/auth.v1.AuthService/Register",
      type: GRPCCallType.unary
    )
  }
}

/// To build a server, implement a class that conforms to this protocol.
internal protocol Auth_V1_AuthServiceProvider: CallHandlerProvider {
  var interceptors: Auth_V1_AuthServiceServerInterceptorFactoryProtocol? { get }

  func login(request: Auth_V1_LoginRequest, context: StatusOnlyCallContext) -> EventLoopFuture<Auth_V1_LoginResponse>

  func register(request: Auth_V1_RegisterRequest, context: StatusOnlyCallContext) -> EventLoopFuture<Auth_V1_RegisterResponse>
}

extension Auth_V1_AuthServiceProvider {
  internal var serviceName: Substring {
    return Auth_V1_AuthServiceServerMetadata.serviceDescriptor.fullName[...]
  }

  /// Determines, calls and returns the appropriate request handler, depending on the request's method.
  /// Returns nil for methods not handled by this service.
  internal func handle(
    method name: Substring,
    context: CallHandlerContext
  ) -> GRPCServerHandlerProtocol? {
    switch name {
    case "Login":
      return UnaryServerHandler(
        context: context,
        requestDeserializer: ProtobufDeserializer<Auth_V1_LoginRequest>(),
        responseSerializer: ProtobufSerializer<Auth_V1_LoginResponse>(),
        interceptors: self.interceptors?.makeLoginInterceptors() ?? [],
        userFunction: self.login(request:context:)
      )

    case "Register":
      return UnaryServerHandler(
        context: context,
        requestDeserializer: ProtobufDeserializer<Auth_V1_RegisterRequest>(),
        responseSerializer: ProtobufSerializer<Auth_V1_RegisterResponse>(),
        interceptors: self.interceptors?.makeRegisterInterceptors() ?? [],
        userFunction: self.register(request:context:)
      )

    default:
      return nil
    }
  }
}

/// To implement a server, implement an object which conforms to this protocol.
@available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
internal protocol Auth_V1_AuthServiceAsyncProvider: CallHandlerProvider, Sendable {
  static var serviceDescriptor: GRPCServiceDescriptor { get }
  var interceptors: Auth_V1_AuthServiceServerInterceptorFactoryProtocol? { get }

  func login(
    request: Auth_V1_LoginRequest,
    context: GRPCAsyncServerCallContext
  ) async throws -> Auth_V1_LoginResponse

  func register(
    request: Auth_V1_RegisterRequest,
    context: GRPCAsyncServerCallContext
  ) async throws -> Auth_V1_RegisterResponse
}

@available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
extension Auth_V1_AuthServiceAsyncProvider {
  internal static var serviceDescriptor: GRPCServiceDescriptor {
    return Auth_V1_AuthServiceServerMetadata.serviceDescriptor
  }

  internal var serviceName: Substring {
    return Auth_V1_AuthServiceServerMetadata.serviceDescriptor.fullName[...]
  }

  internal var interceptors: Auth_V1_AuthServiceServerInterceptorFactoryProtocol? {
    return nil
  }

  internal func handle(
    method name: Substring,
    context: CallHandlerContext
  ) -> GRPCServerHandlerProtocol? {
    switch name {
    case "Login":
      return GRPCAsyncServerHandler(
        context: context,
        requestDeserializer: ProtobufDeserializer<Auth_V1_LoginRequest>(),
        responseSerializer: ProtobufSerializer<Auth_V1_LoginResponse>(),
        interceptors: self.interceptors?.makeLoginInterceptors() ?? [],
        wrapping: { try await self.login(request: $0, context: $1) }
      )

    case "Register":
      return GRPCAsyncServerHandler(
        context: context,
        requestDeserializer: ProtobufDeserializer<Auth_V1_RegisterRequest>(),
        responseSerializer: ProtobufSerializer<Auth_V1_RegisterResponse>(),
        interceptors: self.interceptors?.makeRegisterInterceptors() ?? [],
        wrapping: { try await self.register(request: $0, context: $1) }
      )

    default:
      return nil
    }
  }
}

internal protocol Auth_V1_AuthServiceServerInterceptorFactoryProtocol: Sendable {

  /// - Returns: Interceptors to use when handling 'login'.
  ///   Defaults to calling `self.makeInterceptors()`.
  func makeLoginInterceptors() -> [ServerInterceptor<Auth_V1_LoginRequest, Auth_V1_LoginResponse>]

  /// - Returns: Interceptors to use when handling 'register'.
  ///   Defaults to calling `self.makeInterceptors()`.
  func makeRegisterInterceptors() -> [ServerInterceptor<Auth_V1_RegisterRequest, Auth_V1_RegisterResponse>]
}

internal enum Auth_V1_AuthServiceServerMetadata {
  internal static let serviceDescriptor = GRPCServiceDescriptor(
    name: "AuthService",
    fullName: "auth.v1.AuthService",
    methods: [
      Auth_V1_AuthServiceServerMetadata.Methods.login,
      Auth_V1_AuthServiceServerMetadata.Methods.register,
    ]
  )

  internal enum Methods {
    internal static let login = GRPCMethodDescriptor(
      name: "Login",
      path: "/auth.v1.AuthService/Login",
      type: GRPCCallType.unary
    )

    internal static let register = GRPCMethodDescriptor(
      name: "Register",
      path: "/auth.v1.AuthService/Register",
      type: GRPCCallType.unary
    )
  }
}

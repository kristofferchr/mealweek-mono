import { useAuth } from '../security/hooks/UseAuth';
import dayjs from 'dayjs';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { AuthServiceClient } from '../../gen/proto/auth/v1/auth.client';
import { RpcError } from '@protobuf-ts/runtime-rpc';
import { MealsServiceClient, PlannedMealsserviceClient } from '../../gen/proto/meals/v1/meals.client';
import { Timestamp } from '../../gen/google/protobuf/timestamp';

export class ApiClient {
  private transport = new GrpcWebFetchTransport({
    baseUrl: `/api`
  });

  private authService = new AuthServiceClient(this.transport);
  private mealsService = new MealsServiceClient(this.transport);
  private plannedMealsService = new PlannedMealsserviceClient(this.transport);

  private auth = useAuth();

  private static async handleRpcRequest<T extends Object>(fn: () => Promise<T>): Promise<DataAndErrorResponse<T>> {

    try {
      const response = await fn();
      return {
        data: response
      };
    } catch (e) {
      const rpcError = e as RpcError;

      return {
        error: rpcError.message, message: rpcError.message, httpStatus: parseInt(rpcError.code)
      };
    }
  }

  grpcLogin(email: string, password: string) {
    return ApiClient.handleRpcRequest(() => {
      return this.authService.login({ email: email, password: password }, {}).response;

    });
  }

  grpcRegister(email: string, password: string) {
    return ApiClient.handleRpcRequest(() => {
      return this.authService.register({ email: email, password: password }, {}).response;
    });
  }

  grpcGetAllMeals() {
    return this.withAuth((token) =>
      ApiClient.handleRpcRequest(() => {
        return this.mealsService.getMeals({}, { meta: { Authorization: `Bearer ${token}` } }).response;
      })
    );
  }

  grpcAddNewMeal(name: string) {
    return this.withAuth((token) =>
      ApiClient.handleRpcRequest(() => {
        return this.mealsService.createMeal({ name: name }, { meta: { Authorization: `Bearer ${token}` } }).response;
      })
    );
  }

  grpcNewPlannedMeal(mealId: bigint, date: dayjs.Dayjs) {
    return this.withAuth((token) =>
      ApiClient.handleRpcRequest(() => {
        const timestamp = Timestamp.fromDate(date.toDate());
        return this.plannedMealsService.createPlannedMeal({
          mealId: mealId,
          date: timestamp
        }, { meta: { Authorization: `Bearer ${token}` } }).response;
      })
    );
  }

  grpcGetPlannedMeals(from: dayjs.Dayjs, to: dayjs.Dayjs) {
    return this.withAuth((token) =>
      ApiClient.handleRpcRequest(() => {
        return this.plannedMealsService.getPlannedMeals({
          from: Timestamp.fromDate(from.toDate()),
          to: Timestamp.fromDate(to.toDate())
        }, { meta: { Authorization: `Bearer ${token}` } }).response;
      })
    );
  }

  private withAuth<T>(onToken: (token: string) => Promise<DataAndErrorResponse<T>>): Promise<DataAndErrorResponse<T>> {
    if (this.auth.token !== undefined) {
      const token = this.auth.token.Raw;
      return onToken(token);
    } else {
      return new Promise((resolve, reject): DataAndErrorResponse<any> => {
        return {
          error: 'Not logged in'
        };
      });
    }

  }
}

export interface DataAndErrorResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  httpStatus?: number;
}

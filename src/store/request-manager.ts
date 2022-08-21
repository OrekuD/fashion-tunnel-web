// import store from './index';
import { Dispatch } from "@reduxjs/toolkit";
import { requestActions } from "./slices/request.slice";
import { Request } from "../types";

interface EventEntry {
  type: "before" | "after";
  action: string;
  callback: () => void;
}

/**
 * Holds a list of all requests made.
 *
 * @remarks
 *
 * It has functions that can be used to check if a request
 * is available, pending, rejected, or fulfilled.
 *
 * It also has functions used to consume a request
 * or multiple requests
 */
class RequestManager {
  public readonly listeners: Array<string>;
  private readonly events: Array<EventEntry> = [];

  constructor(
    private readonly state: Request.State,
    private readonly dispatch: Dispatch<any>
  ) {
    this.listeners = state.list.map(({ name }) => name);
  }

  /**
   * Find a request by name
   * @param name - The {@link Request.Info.name | name} of the request
   * @returns The {@link Request.Info | Request Info } object
   */
  public getRequest(name: string) {
    return this.state.list.find((element) => element.name === name);
  }

  /**
   * Check if a request is available.
   * @param name - The {@link Request.Info.name | name} of the request
   */
  public isAvailable(name: string) {
    return !!this.getRequest(name);
  }

  /**
   * Check if the request with the given name has a status of {@link Request.Status.PENDING | pending}.
   * @param name - The {@link Request.Info.name | name} of the request
   */
  public isPending(name: string) {
    const event = this.getRequest(name);
    if (!event) {
      return false;
    }
    return event.status === Request.Status.PENDING;
  }

  public isBeforeRejected(name: string) {
    const event = this.getRequest(name);
    if (!event) {
      return false;
    }
    return event.status !== Request.Status.BEFORE_REJECTED;
  }

  /**
   * Check if the request with the given name has
   * status of {@link Request.Status.REJECTED | rejected}
   * @param name - The {@link Request.Info.name | name} of the request
   */
  public isRejected(name: string) {
    const event = this.getRequest(name);
    if (!event) {
      return false;
    }
    return event.status === Request.Status.REJECTED;
  }

  public isBeforeFulfilled(name: string) {
    const event = this.getRequest(name);
    if (!event) {
      return false;
    }
    return event.status !== Request.Status.BEFORE_FULFILLED;
  }

  /**
   * Check if the request with the given name has
   * status of {@link Request.Status.FULFILLED | fulfilled}
   * @param name - The {@link Request.Info.name | name} of the request
   * @returns The promise object.
   */
  public isFulfilled(name: string) {
    const event = this.getRequest(name);
    if (!event) {
      return false;
    }

    return event.status === Request.Status.FULFILLED;
  }

  /**
   * Check if the request with the given name has
   * status different than {@link Request.Status.PENDING | pending}
   * @param name - The {@link Request.Info.name | name} of the request
   */
  public isFinished(name: string) {
    const event = this.getRequest(name);
    if (!event) {
      return false;
    }
    return event.status !== Request.Status.PENDING;
  }

  /**
   * Check if a given request is consumable i.e. it has a status of
   * either {@link Request.Status.FULFILLED | fulfilled} or {@link Request.Status.REJECTED | rejected}
   * @param request - The {@link Request.Info | request} that is being checked.
   */
  public isConsumable(request: Request.Info) {
    return request.status !== Request.Status.PENDING;
  }

  /**
   * Consume a given request if it is consumable
   * @param name - The {@link Request.Info.name | name} of the request
   */
  public consume(name: string) {
    const request = this.getRequest(name);

    if (request && this.isConsumable(request)) {
      this.dispatch(requestActions.consumed(request.name));
    }
  }

  /**
   * Given a list of request names, consume all consumable requests
   * @param requests - The list of request names
   */
  public async consumeMany(list: Array<string>) {
    for (const name of list) {
      await this.consume(name);
    }
  }
}

export default RequestManager;

export class BaseService {
  static throwError(status, message) {
    const error = new Error(message);
    error.status = status;
    error.exposeMessage = message;
    throw error;
  }

  static notImplemented(moduleName, methodName) {
    this.throwError(501, `${moduleName}.${methodName}.not_implemented`);
  }
}

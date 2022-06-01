export default class ErrorHandler {
    public readonly message: string;
  
    public readonly statusCode: number;
  
    constructor(message: string, statusCode) {
      this.message = message;
      this.statusCode = statusCode;
    }
  }
  
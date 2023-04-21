declare type ApiError = {
  status: number
  data: {
    message: string
  }
}

declare interface ApiResponse<T> {
  message: string
  data: T
}

declare interface ApiResult {
  isError: boolean
  message: string
}

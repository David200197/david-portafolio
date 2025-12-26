import { AxiosResponse } from 'axios'
import toast from 'react-hot-toast'

export class HttpResponseInterceptor {
  handle = (response: AxiosResponse<any, any>) => {
    const { status, config, data } = response

    if (status >= 400) throw response

    const modifyingMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])
    if (modifyingMethods.has(config.method?.toUpperCase() ?? '')) {
      toast.success(data.message || 'Operation carried out successfully')
    }

    return response
  }
}

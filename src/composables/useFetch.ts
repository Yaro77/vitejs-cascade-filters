import axios, { AxiosRequestConfig } from 'axios';
import { ref } from 'vue';

export type Config<T> = Omit<AxiosRequestConfig<T>, 'url'>;

export function useFetch<T>(url: string, config: Config<T>) {
  const data = ref();
  const response = ref();
  const error = ref();
  const loading = ref(false);

  const fetch = async () => {
    loading.value = true;
    try {
      const result = await axios.request({
        url: url,
        ...config,
      });
      response.value = result;
      data.value = result.data;
    } catch (ex) {
      console.log(ex);
    } finally {
      loading.value = false;
    }
  };

  fetch();

  return {
    data,
    response,
    error,
    loading,
  };
}

/* Example
const { data } = useFetch<User[]>('/users', {
  baseURL: 'https://random-data-api.com/api/v2',
  params: {
    size: 100,
    response_type: 'json',
  },
});
*/

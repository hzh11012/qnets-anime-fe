import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    CreateAxiosDefaults,
    InternalAxiosRequestConfig
} from 'axios';
import TokenService from '@/lib/token';
import { toast } from 'sonner';
import RefresherHttpClient from '@/lib/refresherRequest';

const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;

const API_BASEURL = import.meta.env.VITE_API_BASEURL;

const AUTH_BASEURL = import.meta.env.VITE_AUTH_BASEURL;

interface ApiRequest<T> {
    data: T;
    msg: string;
    code: number;
}

class AxiosRequest {
    private instance: AxiosInstance;
    private readonly defaultMaxRetries = 0;
    private readonly defaultTimeout = 30 * 1000;

    constructor(config?: CreateAxiosDefaults) {
        this.instance = axios.create({
            baseURL: API_BASEURL,
            timeout: this.defaultTimeout,
            ...config
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // 请求拦截器
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = TokenService.getAccessToken();
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            Promise.reject
        );

        // 响应拦截器
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                const { code, msg } = response.data;

                if (code !== 200) {
                    toast.error(msg);
                    return Promise.reject(new Error(response.data));
                }

                return response.data;
            },
            async error => {
                // 当状态码为401时，调用刷新token的方法
                if (error.response?.status === 401) {
                    if (
                        !(await RefresherHttpClient.refresh(
                            `${AUTH_BASEURL}/api/sso/refresh`
                        ))
                    ) {
                        window.location.reload();
                        window.location.href = `${LOGIN_URL}?redirect=${encodeURIComponent(window.location.href)}`;
                    }

                    return Promise.reject({ ...error, isRefresh: true });
                }

                setTimeout(() => {
                    toast.error(
                        error.response.data.msg || error.message || '请求失败'
                    );
                });

                return Promise.reject(error);
            }
        );
    }

    private request<T>(
        config: AxiosRequestConfig,
        retryCount: number = this.defaultMaxRetries // 添加重试计数器参数
    ): Promise<ApiRequest<T>> {
        // 当正在刷新token,将当前请求放入暂存队列中
        if (RefresherHttpClient.isRefreshing) {
            return new Promise((resolve, reject) => {
                RefresherHttpClient.temporaryQueue.push(
                    this.instance(config)
                        .then((res: any) => resolve(res))
                        .catch(reject)
                ); // 最后会在promise.allSettled处执行
            });
        }
        return new Promise(resolve => {
            this.instance(config)
                .catch(error => {
                    // 出现非200状态的错误，就重新发请求，最多重试一次
                    if (retryCount < 1 && error.isRefresh) {
                        return this.request(config, retryCount + 1);
                    } else {
                        resolve(error);
                    }
                })
                .then((res: any) => resolve(res));
        });
    }

    async get<T>(
        url: string,
        params?: object,
        config?: AxiosRequestConfig
    ): Promise<ApiRequest<T>> {
        return await this.request<T>({ ...config, url, method: 'get', params });
    }

    async post<T>(
        url: string,
        data?: object,
        config?: AxiosRequestConfig
    ): Promise<ApiRequest<T>> {
        return await this.request<T>({ ...config, url, method: 'post', data });
    }

    async delete<T>(
        url: string,
        data?: object,
        config?: AxiosRequestConfig
    ): Promise<ApiRequest<T>> {
        return await this.request<T>({
            ...config,
            url,
            method: 'delete',
            data
        });
    }

    async patch<T>(
        url: string,
        data?: object,
        config?: AxiosRequestConfig
    ): Promise<ApiRequest<T>> {
        return await this.request<T>({
            ...config,
            url,
            method: 'patch',
            data
        });
    }
}

const HttpClient = new AxiosRequest();

const AuthClient = new AxiosRequest({
    baseURL: AUTH_BASEURL
});

export { HttpClient, AuthClient };

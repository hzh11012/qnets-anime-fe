import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    CreateAxiosDefaults
} from 'axios';
import TokenService from '@/lib/token';

const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;

class RefresherAxiosRequest {
    public refresherInstance: AxiosInstance; // 专门刷新token的axios实例
    public isRefreshing: boolean = false; // 是否正在刷新token
    public temporaryQueue: Array<Promise<any>> = []; // 暂存队列,当处于刷新token的时间中时,后续请求全部push进该队列中
    private readonly defaultTimeout = 30 * 1000;

    constructor(config?: CreateAxiosDefaults) {
        this.refresherInstance = axios.create({
            timeout: this.defaultTimeout,
            ...config
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // 请求拦截器
        this.refresherInstance.interceptors.request.use(
            config => config,
            error => Promise.reject(error)
        );

        // 响应拦截器
        this.refresherInstance.interceptors.response.use(
            response => response.data,
            async error => {
                if (error.response?.status) {
                    this.temporaryQueue = [];
                    window.location.reload();
                    window.location.href = `${LOGIN_URL}?redirect=${encodeURIComponent(window.location.href)}`;
                }
            }
        );
    }

    private request(axiosRequestConfig: AxiosRequestConfig): Promise<any> {
        return this.refresherInstance(axiosRequestConfig);
    }

    // 刷新短token的业务逻辑
    public async refresh(url: string): Promise<boolean> {
        if (this.isRefreshing) {
            return false;
        }

        try {
            const token = TokenService.getRefreshToken();
            this.isRefreshing = true;
            await this.request({
                url,
                method: 'post',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            Promise.allSettled(this.temporaryQueue);
            return Promise.resolve(true);
        } catch (error) {
            this.temporaryQueue = [];
            return Promise.resolve(false);
        } finally {
            // 标记刷新token完成
            this.isRefreshing = false;
        }
    }
}

const RefresherHttpClient = new RefresherAxiosRequest();

export default RefresherHttpClient;

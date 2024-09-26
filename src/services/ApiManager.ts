import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

interface RequestOptions {
  data?: any;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}

export class ApiManager {
    private axiosInstance: AxiosInstance | null = null;

    // Set up Axios instance with base URL and headers
    public setApiRequestContext(baseUrl: string, headers: Record<string, string>) {
        this.axiosInstance = axios.create({
            baseURL: baseUrl,
            headers: headers,
        });
    }

    // Generic request method
    private async makeRequest(method: string, endpoint: string, options?: RequestOptions): Promise<AxiosResponse | null> {
        if (!this.axiosInstance) {
            throw new Error('Axios instance not initialized. Call setApiRequestContext first.');
        }

        try {
            console.log(`${method} Request to endpoint: ${endpoint}`);
            const config: AxiosRequestConfig = {
                method: method,
                url: endpoint,
                ...options,
            };
            return await this.axiosInstance(config);
        } catch (error) {
            console.error(`Error during ${method} request: ${error}`);
            return null;
        }
    }

    public async getRequest(endpoint: string, options?: RequestOptions): Promise<AxiosResponse | null> {
        return this.makeRequest('get', endpoint, options);
    }

    public async postRequest(endpoint: string, options?: RequestOptions): Promise<AxiosResponse | null> {
        return this.makeRequest('post', endpoint, options);
    }

    public async putRequest(endpoint: string, options?: RequestOptions): Promise<AxiosResponse | null> {
        return this.makeRequest('put', endpoint, options);
    }

    public async patchRequest(endpoint: string, options?: RequestOptions): Promise<AxiosResponse | null> {
        return this.makeRequest('patch', endpoint, options);
    }

    public async deleteRequest(endpoint: string, options?: RequestOptions): Promise<AxiosResponse | null> {
        return this.makeRequest('delete', endpoint, options);
    }
}
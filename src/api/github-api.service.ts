import axios, { AxiosResponse } from "axios";

export class GithubApiService {
  baseUrl = 'https://api.github.com';

  getUser(username: string) {
    const path = `/users/${username}`;
    return this.decorateFetchData(
      axios.get(this.buildUrl(path))
    );
  }

  getRepositories(username: string) {
    const path = `/users/${username}/repos`;
    return this.decorateFetchData(
      axios.get(this.buildUrl(path))
    );
  }

  getRepositoryContents(username: string, repository: string) {
    const path = `/repos/${username}/${repository}/contents`;
    return this.decorateFetchData(
      axios.get(this.buildUrl(path))
    );
  }

  getRepositoryReadme(username: string, repository: string) {
    const path = `/repos/${username}/${repository}/readme`;
    return this.decorateFetchData(
      axios.get(this.buildUrl(path))
    );
  }

  getMarkdown(text: string) {
    const path = `/markdown`;
    return this.decorateFetchData(
      axios.post(this.buildUrl(path), { text })
    );
  }

  private buildUrl(path: string) {
    return `${this.baseUrl}${path}`;
  }

  private decorateFetchData(fetchMethodPromise: Promise<AxiosResponse>) {
    return fetchMethodPromise.then(({ data }) => data);
  }
}

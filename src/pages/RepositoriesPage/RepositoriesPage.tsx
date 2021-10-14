import { Alert, Empty, PageHeader } from "antd";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { GithubApiService } from "../../api/github-api.service";
import RepositoriesList from "../../components/RepositoriesList";

interface RepositoriesPageProps {
  username: string;
}

interface RepositoriesPageState {
  items: any[] | undefined;
  loading?: boolean;
  errors?: any | undefined;
}

export default function RepositoriesPage(props: RouteComponentProps<RepositoriesPageProps>) {
  const githubApiService = new GithubApiService();
  const [state, setState] = useState<RepositoriesPageState>({
    items: undefined,
    loading: false,
    errors: undefined,
  });

  useEffect(() => {
    getRepositories();
  }, []);

  const { history, match } = props;
  const handleRepositoryClicked = (repository: any) =>
    history.push(`${process.env.PUBLIC_URL}/${match.params.username}/${repository.name}`);
  const errorsAlert = (
    <Alert
      message="Error"
      description={ state.errors?.message || 'Something went wrong. Please try again later' }
      type="error"
    />
  );
  const repositoriesList = (
    !state.loading && !state.items?.length
      ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      : <RepositoriesList items={state.items} onItemClick={handleRepositoryClicked} loading={state.loading} />
  );
  
  return (
    <>
      <PageHeader
        className="site-page-header"
        title={ `Repositories of ${match.params.username}` }
        subTitle="Select repository"
        onBack={() => history.goBack()}
      />

      <div className="page-content">
        { !state.errors ? repositoriesList : errorsAlert }
      </div>
    </>
  );
  

  function getRepositories() {
    setState({ ...state, loading: true });
    githubApiService.getRepositories(props.match.params.username)
      .then(items => setState({ items, loading: false, errors: undefined }))
      .catch(err => setState({ items: [], loading: false, errors: err.response.data || err }));
  }
}

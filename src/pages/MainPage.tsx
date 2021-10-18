import { Alert, Button, Input, PageHeader } from 'antd';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { GithubApiService } from '../api/github-api.service';
import { ErrorDto } from '../api/models/errors.dto';

interface MainPageState {
  username: string;
  loading: boolean;
  errors: ErrorDto | undefined;
}

export default function MainPage() {
  const [state, setState] = useState<MainPageState>({
    username: '',
    loading: false,
    errors: undefined,
  });
  const githubApiService = new GithubApiService();
  const history = useHistory();
  const errorsAlert = (
    <Alert
      message="Error"
      description={ state.errors?.message || 'Something went wrong. Please try again later' }
      type="error"
      style={{ marginTop: '16px' }}
    />
  );
  
  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Main page"
        subTitle="Select Github user"
      />
      
      <div className="page-content">
        <div style={{ textAlign: 'center' }}>
          <Input size="large" placeholder="Enter user nickname" value={state.username} onChange={updateSearchValue} />
          <Button type="primary" style={{ marginTop: 8 }} onClick={search}>
            Search
          </Button>
        </div>

        { state.errors ? errorsAlert : <></> }
      </div>
    </>
  );

  function updateSearchValue(event: React.BaseSyntheticEvent) {
    setState({
      ...state,
      username: event.target.value,
    });
  }

  function search() {
    githubApiService.getUser(state.username)
      .then(data => {
        history.push(`${process.env.PUBLIC_URL}/${state.username}`, { data });
      })
      .catch(err => setState({ ...state, errors: err.response?.data || err }));
  }
}

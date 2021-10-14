import { Card, Empty, List, PageHeader, Space } from "antd";
import DOMPurify from "dompurify";
import { createElement, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { GithubApiService } from "../../api/github-api.service";
import { FolderOutlined, FileTextOutlined } from '@ant-design/icons';

interface RepositoryContentProps {
  username: string;
  repositoryName: string;
}

interface RepositoryContentPageState {
  files: any[] | undefined;
  readmeMarkdown: any | undefined;
  loading: boolean;
}

export default function RepositoryContentPage(props: RouteComponentProps<RepositoryContentProps>) {
  const githubApiService = new GithubApiService();
  const { history, match } = props;
  const [state, setState] = useState<RepositoryContentPageState>({
    files: undefined,
    readmeMarkdown: undefined,
    loading: false,
  });
  const itemIconByType = ({ type }: any) => {
    return type === 'dir'
      ? createElement(FolderOutlined)
      : createElement(FileTextOutlined);
  }
  const filesCard = (
    <Card title="Files" loading={state.loading}>
      <List
        itemLayout="vertical"
        size="small"
        dataSource={state.files}
        renderItem={ item =>
          <List.Item key={item.name} >
            <List.Item.Meta
              style={{ marginBottom: 0 }}
              avatar={itemIconByType(item)}
              title={item.name}
            />
          </List.Item>
        }
      />
    </Card>
  );
  const readmeCard = (
    <Card title="README.md" loading={state.loading}>
      {
        state.readmeMarkdown
          ? <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(state.readmeMarkdown)}}></div>
          : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
    </Card>
  );

  useEffect(() => {
    getRepositories();
  }, []);

  return (
    <>
      <PageHeader
        className="site-page-header"
        title={ `${match.params.username} / ${match.params.repositoryName}` }
        subTitle="Repository files"
        onBack={() => history.goBack()}
      />
      <div className="page-content">

        <Space direction="vertical" style={{ width: '100%' }}>
          { filesCard }
          { readmeCard }
        </Space>
      </div>
    </>
  );

  function getRepositories() {
    setState({ ...state, loading: true});

    const filesPromise = githubApiService
      .getRepositoryContents(match.params.username, match.params.repositoryName)
      .catch(() => []);
    const readmePromise = getReadmeMarkdown()
      .catch(() => '');

    Promise.all([ filesPromise, readmePromise ])
      .then(([files, readmeMarkdown]) => setState({ files, readmeMarkdown, loading: false }));
  }

  async function getReadmeMarkdown() {  
    const {content} = await githubApiService.getRepositoryReadme(match.params.username, match.params.repositoryName);
    const decodedContent = atob(content);
    try {
      const markdownContent = await githubApiService.getMarkdown(decodedContent);
  
      return markdownContent;
    } catch(err) {
      // If some problem with markdown method - returns decoded content here (plain text)
      return decodedContent;
    }
  }
}

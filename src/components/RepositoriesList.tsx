import { Row, Col } from "antd";
import { RepositoryItemDto } from "../api/models/repository.dto";
import RepositoriesListItem from "./RepositoriesListItem";

interface RepositoriesListProps {
  items: RepositoryItemDto[] | undefined;
  loading?: boolean;
  onItemClick: (item: RepositoryItemDto) => void;
}

export default function RepositoriesList(props: RepositoriesListProps) {
  // Cards for display while loading in process
  const defaultLoadingList = [1, 2, 3];
  const loadingList = (
    <>
      {
        defaultLoadingList.map(item => 
          <Col span={8} key={item} >
            <RepositoriesListItem loading={!!props.loading} />
          </Col>
        )
      }
    </>
  );
  const listItems = (
    <>
      {
        props.items?.map(item =>
          <Col span={8} key={item.id} onClick={() => props.onItemClick(item)} >
            <RepositoriesListItem item={item} loading={!!props.loading} />
          </Col>
        )
      }
    </>
  );

  return (
    <>
      <Row gutter={[10, 10]}>
        { props.loading ? loadingList : listItems }
      </Row>
    </>
  );
}

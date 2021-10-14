import { Row, Col } from "antd";
import RepositoriesListItem from "./RepositoriesListItem";

interface RepositoriesListProps {
  items: any[] | undefined;
  loading?: boolean;
  onItemClick: (item: any) => any;
}

export default function RepositoriesList(props: RepositoriesListProps) {
  const defaultLoadingList = [1, 2, 3];
  const loadingList = (
    <>
      {
        defaultLoadingList.map(item => 
          <Col span={8} key={item} >
            <RepositoriesListItem item={item} loading={!!props.loading} />
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

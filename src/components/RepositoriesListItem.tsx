import { Card } from "antd";
import Meta from "antd/lib/card/Meta";

interface RepositoriesListItemProps {
  item: any;
  loading: boolean;
}

export default function RepositoriesListItem(props: RepositoriesListItemProps) {
  return (
    <>
      <Card loading={props.loading} style={{ cursor: 'pointer' }}>
        <Meta
          title={props.item.name}
          description={props.item.language || '-'}
        />
      </Card>
    </>
  );
}

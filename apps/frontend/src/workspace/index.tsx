import { Layout } from '../components/Layout';
import { LayoutHeader } from '../components/LayoutHeader';
import { Column } from '../components/Column';
import { Card } from '../components/Card';
import { Workspace } from '../types';
import { DateTime } from '../components/DateTime';
import { DetailView } from '../components/DetailView';
import { DetailField } from '../components/DetailView';

const workspaceDetailFields: DetailField<Workspace>[] = [
  {
    label: 'ID',
    accessor: 'id'
  },
  {
    label: 'Created at',
    accessor: (workspace: Workspace) => <DateTime date={workspace.createdAt} />
  },
  {
    label: 'Num devices',
    accessor: 'numDevices'
  },
  {
    label: 'Num images',
    accessor: 'numImages'
  },
  {
    label: 'Default polling time',
    accessor: 'defaultPollingTime'
  },
];

const WorkspaceDetail = () => {
  const DEV_WORKSPACE_ID = '00000000-0000-0000-0000-000000000000';

  return (
    <Layout>
      <LayoutHeader title='Workspace'>
      </LayoutHeader>
      <Column>
        <Card title='Detail'>
          <DetailView<Workspace>
            id={DEV_WORKSPACE_ID}
            endpoint='/workspace'
            queryKey='workspace'
            fields={workspaceDetailFields}
          />
        </Card>
      </Column>
    </Layout>
  );
};

export default WorkspaceDetail;
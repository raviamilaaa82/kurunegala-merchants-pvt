
import TableWrapper from './table-wrapper';

export default async function Table({
  query,
  currentPage,
  submissions,
}: {
  query: string;
  currentPage: number;
  submissions: any[];
}) {
  return <TableWrapper submissions={submissions} />;
}



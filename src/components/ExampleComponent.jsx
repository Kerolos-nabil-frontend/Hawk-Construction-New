import { useExampleQuery } from '../../utils/useExampleQuery';

export default function ExampleComponent() {
  const { data, isLoading, error } = useExampleQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>API Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

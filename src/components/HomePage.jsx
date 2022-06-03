import { EmptyStatePage } from "./EmptyStatePage";

export default function HomePage(props) {
  const { setSelection, setPageType } = props;
  return (
    <EmptyStatePage setSelection={setSelection} setPageType={setPageType} />
  );
}

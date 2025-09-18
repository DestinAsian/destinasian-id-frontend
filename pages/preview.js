import { WordPressTemplate, getNextPreviewProps } from '@faustwp/core';

export default function Preview(props) {
  return <WordPressTemplate {...props} />;
}

export async function getServerSideProps(context) {
  return getNextPreviewProps({ context });
}

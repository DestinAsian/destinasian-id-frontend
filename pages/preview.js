import { WordPressTemplate, getNextServerSideProps } from '@faustwp/core';

export default function Preview(props) {
  return <WordPressTemplate {...props} />;
}

export async function getServerSideProps(ctx) {
  return getNextServerSideProps(ctx, {
    Page: Preview,
    props: {},
  });
}

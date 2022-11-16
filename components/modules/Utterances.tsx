import { useEffect, useRef } from 'react';

const Utterances = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');

    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', 'true');
    script.setAttribute(
      'repo',
      process.env.NEXT_PUBLIC_COMMENT_GITHUB_REPO || ''
    );
    script.setAttribute('issue-term', 'title');
    script.setAttribute('label', 'blog-comment');
    script.setAttribute('theme', 'github-light');
    ref.current?.appendChild(script);
  }, []);

  return <div ref={ref}></div>;
};

export default Utterances;

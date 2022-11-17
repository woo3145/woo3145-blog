import { RefObject, useEffect, useRef } from 'react';

const Utterances = () => {
  const uttLight = useRef<HTMLDivElement>(null);
  const uttDark = useRef<HTMLDivElement>(null);

  const createUtterance = (ref: RefObject<any>, theme: 'dark' | 'light') => {
    const script = document.createElement('script');
    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    script.setAttribute(
      'repo',
      process.env.NEXT_PUBLIC_COMMENT_GITHUB_REPO || ''
    );
    script.setAttribute('issue-term', 'title');
    script.setAttribute('label', 'blog-comment');
    script.setAttribute(
      'theme',
      theme === 'dark' ? 'github-dark' : 'github-light'
    );
    ref.current?.appendChild(script);
  };

  useEffect(() => {
    createUtterance(uttDark, 'dark');
    createUtterance(uttLight, 'light');
  }, []);

  return (
    <div className="border-t pt-8">
      <div ref={uttLight} className="dark:hidden"></div>
      <div ref={uttDark} className="hidden dark:block"></div>
    </div>
  );
};

export default Utterances;

const Footer = () => {
  return (
    <footer className="w-full border-t flex justify-center py-6">
      <p className="text-sm">
        © {new Date().getFullYear()}&nbsp;
        <a
          rel="noreferrer"
          target="_blank"
          href={process.env.NEXT_PUBLIC_USER_GITHUB_URL}
          className="text-blue-500"
        >
          {process.env.NEXT_PUBLIC_USER_NAME}
        </a>
        &nbsp;powered by
        <a
          rel="noreferrer"
          target="_blank"
          href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_REPO}`}
          className="text-blue-500"
        >
          &nbsp;{process.env.NEXT_PUBLIC_GITHUB_REPO}
        </a>
      </p>
    </footer>
  );
};

export default Footer;

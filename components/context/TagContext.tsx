import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface TagContextProps {
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
}

const TagContext = createContext({} as TagContextProps);

export const TagContextProvider = ({ children }: { children: ReactNode }) => {
  const [tags, setTags] = useState<string[]>([]);

  const tagContextValue = {
    tags,
    setTags,
  };

  return (
    <TagContext.Provider value={tagContextValue}>
      {children}
    </TagContext.Provider>
  );
};

export const useTagContext = () => {
  return useContext(TagContext);
};

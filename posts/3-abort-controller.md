---
title: 'AbortController를 사용하여 비동기 API요청 도중에 중단하기'
author: 'woo3145'
date: '2023-6-30'
thumbnail: '3_thumbnail.png'
tags:
  - Javascript
excerpt: 'AbortController를 사용한 API요청 중단'
---

## 서론

요즘같은 웹앱에선 모듈화된 컴포넌트와 그에 따른 여러 요청 API가 굉장히 많이 생긴다.

React에서는 렌더링으로 인해 컴포넌트가 자주 언마운트 되기 때문에 이전 요청을 중단하지 않아 모든 요청을 처리하게 된다면 리소스 낭비가 발생하여 서버 응답시간이 길어지고 그만큼 비용이 발생하게 된다.

이 때 Javascript의 내장 클래스인 AbortController를 사용하면 언마운트될 때 비동기 요청을 취소하여 리소스를 확보 할 수 있다.

## AbortController의 사용법

```ts
// 1. 선언
const controller = new AbortController();

// 2. 할당
// 2-1 fetch를 사용하는 경우
fetch(url, { signal: controller.signal });
// 2-2 axios를 사용하는 경우
axios
  .get('/foo/bar', {
    signal: controller.signal,
  })
  .then((res) => {});
// 2-3 여러 요청을 중단하는 경우
const urls = [];
const results = urls.map((url) =>
  fetch(url, {
    signal: controller.signal,
  })
);

// 3. 요청 중단
controller.abort();

// abort 발생 시 AbortError를 발생시킴
try {
  fetch(url, { signal: controller.signal });
} catch (error) {
  if (error.name === 'AbortError') {
    // 에러 핸들링
  }
}
```

axios의 경우 CancelToken 방식이 있었지만 deprecated되었기 때문에 AbortController를 사용하는게 좋다. [참고](https://github.com/axios/axios#cancellation)

### React에서 응용 예제

게시글 작성 post를 날리는 hook에서 AbortController를 이용하여 아래와 같은 기능을 추가해보자.

1. 중복 요청 방지 (이전 요청 abort)
2. 요청 중간에 취소하기

```ts
// hooks/useCreatePost.ts
import { useState, useCallback, useRef, useEffect } from 'react';

const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState();
  const controller = useRef(null);

  const createPost = useCallback(async (content, config) => {
    setLoading(true);
    setError(null);

    // 이전 요청이 있을 경우 중단
    if (controller.current) {
      controller.current.abort();
    }
    // AbortController 생성 후 할당
    const abortController = new AbortController();
    controller.current = abortController;

    try {
      const url = '요청 url';
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(content),
        headers: {
          'Content-Type': 'application/json',
        },
        ...config,
        signal: controller.signal, // abortController 할당
      });
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트가 소멸하면 abort
  useEffect(() => {
    return () => {
      if (controller.current) {
        controller.current.abort();
      }
    };
  }, []);

  // api 요청을 중단시키는 메소드
  const cancel = useCallback(() => {
    if (controller) {
      controller.abort();
    }
  }, [controller]);

  return { loading, error, data, createPost, cancel };
};

export default useCreatePost;
```

### 정리

JS의 내장 객체 AbortController를 사용하면 이처럼 간단하게 fetch요청을 중단할 수 있으니 리소스와 비용 절감을 위해 반드시 AbortController를 사용하자.

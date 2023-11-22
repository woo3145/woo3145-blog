---
title: '타입스크립트없이 CRA에 shadcn 라이브러리 세팅하기'
author: 'woo3145'
date: '2023-11-22'
thumbnail: '8_thumbnail.png'
tags:
  - React
  - UI
excerpt: ''
---

## shadcn ui가 뭘까?

shadcn ui는 부트스트랩이나 ant Design과 같은 UI 프레임워크가 아니다.
부트스트랩과 같은 프레임워크는 보통 npm을 통해 설치하여 종속성을 가진다.

하지만 shadcn은 **재사용 가능한 컴포넌트**의 모음으로 보통 npx를 통해
필요한 컴포넌트 (ex. Button, Card, Tooltip, Dropdown)를 설치하면
프로젝트 내부의 components/ui 폴더에 재사용 가능한 컴포넌트를 설치하여 사용하는 방식이다.

```cs
$ npx shadcn-ui@latest add button
```

![이미지](/images/8/1.png)

## 이글을 쓰는 이유

기본적으로 shadcn은 typescript에 최적화 되어 제작되어 있기때문에 타입스크립트를 사용하지 못하는 환경에서

사용하려면 추가적인 처리가 필요하다. 따라서 타입스크립트를 사용하지 않는 분들이 shadcn을 사용할 수 있도록

create-react-app부터 shadcn을 설정하여 사용하는 방법을 이글에서 다룬다.

아래는 실제 shadcn의 개발자분의 말씀으로, 자바스크립트 환경에서 사용하려면 타입을 수동으로 변경해야 한다고 하신다
![이미지](/images/8/2.png)

## Installation

### Create React App을 통해 리액트 프로젝트 생성하기

```cs
npx create-react-app my-app
```

### Tailwind Css 설치하기

[공식문서 참고](https://tailwindcss.com/docs/installation)

```cs
npm install -D tailwindcss
```

### Tailwind Init

```cs
npx tailwindcss init
```

tailwind.config.js 수정 (공식문서 보면 나옴)

```cs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### src/globals.css 파일 생성

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### index.js에서 globals.css 임포트

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './globals.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
```

### jsconfig.json 파일 생성

![이미지](/images/8/3.png)

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### shadcn cli 실행

```cs
npx shadcn-ui@latest init
```

아래 설정대로 작성해주고 마지막에 y를 누르면 된다
![이미지](/images/8/4.png)

## 이제 사용하기

[shadcn 공식문서](https://ui.shadcn.com/docs)

위 공식문서에서 필요한 컴포넌트를 클릭하면 다운받는 링크와 사용법이 적혀있다

![이미지](/images/8/7.png)

```cs
npx shadcn-ui@latest add button
```

실제로 위 커맨드로 button을 설치하면 아래와 같이 button 컴포넌트를 받아온다.

![이미지](/images/8/9.png)

하지만 ts가 아닌 환경에서 실제로 사용하려면 추가적인 작업이 필요하다

### 타입스크립트를 안쓰는경우 추가작업

@ 절대경로로 지정된 경로를 컴포넌트를 다운받을 때마다 상대경로로 변경해야한다.

![이미지](/images/8/10.png)

### 실제 사용

![이미지](/images/8/11.png)

![이미지](/images/8/12.png)

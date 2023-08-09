---
title: 'Tailwind CSS 재사용성과 가독성 높이기'
author: 'woo3145'
date: '2023-8-9'
thumbnail: '5_thumbnail.png'
tags:
  - TypeScript
  - Styles
excerpt: 'Tailwind에서 꼭 알아야 할 문제 & 재사용성과 가독성 높이기'
---

## Tailwind에서 꼭 알아야 할 문제

### 가변인자로 스타일 변경 불가

가장 간과하기 쉬운 문제이다. 아래의 코드를 보자

```jsx
// 1번 - 스타일을 가변인자로 변경
const Button = ({ width, height }: Props) => {
  return <button className={`w-${width} h-${height}`}>확인</button>;
};
// 2번 - 임의의 값 스타일을 가변인자로 변경
const Button = ({ width, height }: Props) => {
  return <button className={`w-[${width}px] h-[${height}px]`}>확인</button>;
};

<Button width={10} height={10} />;
```

위 코드를 실행해보면 1번은 잘 동작하고 2번은 동작하지 않는다.

왜냐하면 Tailwind CSS는 빌드타임에 tailwind.config.js의 content에 정의된 파일의 정적 분석하여 임의의 값 클래스가 나온 경우 스타일을 추가하기 때문이다.

**하지만 정말 중요한 문제가 있다. 여기까지만 생각한다면 배포했을 때 스타일이 깨질 것이다.**

**이유는 Tailwind의 동작 방식 때문인데, 프로덕션 환경으로 빌드하면 css파일을 줄이기 위해 쓰지 않은 class 들은 모조리 삭제된다.**

개발 모드에선 저장할 때마다 매번 최적화할 필요는 없기 때문에 기본으로 제공되는 tailwind 스타일에 임의의 값 스타일만 추가하여 빌드한다.

따라서 개발 모드 중에는 기본으로 제공되는 tailwind 스타일을 사용중이라 w-\{10\} h-\{10\}이 동작 **하는 것 처럼** 보인다. (실제 html 상에선 동적으로 평가되어 w-10 h-10으로 나오기 때문에)

하지만 앱 전체에서 정적인 w-10 h-10 이라는 클래스를 한번도 사용하지 않았다면 프로덕션으로 빌드했을때 w-\{width\} h-\{height\}로 분석되어 기본으로 제공되던 w-10 h-10은 최적화로인해 삭제될 것 이다.

아래와 같은 경우는 어떨까?

```tsx
const Button = ({ outline }: Props) => {
  return (
    <button className={`${outline ? 'border-2' : 'border-0'}`}>확인</button>
  );
};
```

위에서 언급한 듯이 Tailwind는 빌드타임때 **정적 분석**을 하기 때문에 위 코드는 빌드 시 양쪽 모두 사용된다고 보고 빌드파일에 포함한다.

아마 regex로 className 속성을 찾고 그 안의 삼항 연산자를 찾아 모든 경우의 수를 추출하여 포함시키는 것 같다.

### 클래스 우선순위 문제

Tailwind CSS를 사용할 때 아래와 같은 경우가 존재한다.

```tsx
<Button className="text-blue-400 text-red-400" />
```

개발을 하다보면 자연스럽게 뒤에 있는 빨강색이 적용될 것 이라고 생각하지만 결과를 보면 파랑색이 표시된다.

왜냐하면 tailwind css가 빌드되면 하나의 css파일을 생성하게 되는데 CSSOM 상에서 같은 노드라면 우선순위가 tailwind css 빌드 파일의 스타일 순서를 따르기 때문이다.

```css
.text-blue-400 {
  // ...
}

// cascading 규칙 중 - 뒤에있는 코드를 우선함
.text-red-400 {
  // ...
}
```

다행히도 VSCode를 사용하면 Tailwind CSS IntelliSense 플러그인으로 className에 중복된 정의가 있다면 Typescript처럼 편집기에서 밑줄로 경고를 해준다.

하지만 동일한 스타일의 아래와 같은 경우는 어떨까?

```tsx
const Button = ({ className, text }: Props) => {
  return <button className={`text-blue-400 ${className}`}>{text}</button>;
};

<Button text="확인" className="text-red-400" />;
```

위와 같은 설계는 컴포넌트를 상황에 맞게 스타일링 하기위해 굉장히 많이 사용된다.

하지만 같은 텍스트상에 정의를 하지 않았기 때문에 편집기의 플러그인이 검출하지 못하며,
설계상 자식 노드처럼 보이기 때문에 쉽게 간과하여 의도치 못한 동작이 발생할 수 있다.

### 클래스 복잡도 문제

tailwind는 모든 스타일을 className으로 정의하기 때문에 조금만 써도 아래와 같이 굉장히 길어진다.

```tsx
const Button = () => {
  return (
    <button className="flex items-center justify-center h-10 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-600/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
      확인
    </button>
  );
};
```

위 코드는 단순한 버튼 스타일에 hover 일때, 탭키로 focus 되었을때, disabled 일때와 같이 3가지 추가 스타일을 정의했다.  
보다시피 focus-visible의 스타일을 정의하기 위해 focus-visible:이라는 접두어를 속성마다 적어주어야 하기 때문에 조금만 작성해도 굉장히 길어진다.

당연하게도 길어질수록 수정할 부분을 찾기에도 어려움이 생기고 개발자가 머리로 스타일을 추적하기 어려워진다.

아래는 이전 Button에서 조금이나마 스타일의 관심사를 분류해둔 예시이다.

```tsx
// 예시
const Button = () => {
  const baseStyle =
    'flex items-center justify-center h-10 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-600/90 transition-colors';
  const focusVisibleStyle =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
  const disabledStyle = 'disabled:pointer-events-none disabled:opacity-50';
  return (
    <button className={`${baseStyle} ${focusVisibleStyle} ${disabledStyle}`}>
      확인
    </button>
  );
};
```

## Tailwind CSS의 재사용성과 가독성 높이기

위와 같은 문제를 주의하면서 Tailwind CSS를 깨끗하고 재사용성 좋게 사용해보자.

### 1. 스타일 정의 순서 규칙 세우기.

다른 방법을 적용하기 전에 반드시 지켜야 할 규칙 하나를 먼저 정의하고 가자.

일반 css 정의를 할 때도 사용하는 규칙인데 외부에서 내부로 스타일링을 하는 것이다.

필자는 아래와 같이 분류했다.

- Layout & Position & Size

- Border & Shape

- Background

- Text

- Interaction

- Transition

### 2. 테마 사용하기

보통 어플리케이션을 보면 주요색과 보조색을 기반으로 사이트의 용도, 목적, 특색등을 표현한다.
따라서 tailwind 설정파일에 해당 컬러를 설정해두고 bg-purple-600 대신 bg-primary를 기반으로 디자인하면 추후 primary color가 변경되어도 모든 purple-600을 찾을 필요 없이 한번에 수정할 수 있게된다.
<a href="https://tailwindcss.com/docs/customizing-colors#using-css-variables" target="_blank">문서 참고</a>

```css
// index.css
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer base {
  :root {
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 20% 98%;
    --secondary: 220 14.3% 95.9%;
    --secondary-foreground: 220.9 39.3% 11%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
  }

  .dark {
    --primary: 263.4 70% 50.4%;
    --primary-foreground: 210 20% 98%;
    --secondary: 215 27.9% 16.9%;
    --secondary-foreground: 210 20% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 20% 98%;
  }
}
```

```js
// tailwind.config.js
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },
    },
  },
};
```

포토샵과 같이 foreground로 전경색, background로 배경색을 정의한다.

### 3. clsx, tailwind-merge, cva 사용하기

- [clsx]('https://www.npmjs.com/package/clsx')

  - 복잡한 인수를 파싱하여 하나의 문자열로 className을 만들어준다.

    ```js
    // 예시
    clsx("a", [b: false, c: true, { [d:false, e:"true"]}]);
    // 결과 "a c e"
    ```

- [tailwind-merge]("https://github.com/dcastil/tailwind-merge")

  - 위에서 언급한 tailwind의 class 우선순위 문제를 해결해준다.
  - 뒤에 나오는 인자가 우선 순위를 가짐

    ```js
    twMerge('px-2 py-1 bg-red hover:bg-dark-red', 'p-3 bg-[#B91C1C]');
    // 결과 'hover:bg-dark-red p-3 bg-[#B91C1C]'
    ```

- [cva]("https://cva.style/docs/getting-started/variants#creating-variants")

  - tailwind의 조건부 스타일링을 더 편하게 만들어준다.

    ```tsx
    // 사용전
    const Button = ({ variant }: { variant: 'default' | 'outline' }) => {
      const baseStyle =
        'flex items-center justify-center h-10 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-600/90 transition-colors';
      const defaultStyle =
        'bg-primary text-primary-foreground hover:bg-primary/90';
      const outlineStyle =
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground';

      return (
        <button
          className={`${baseStyle}
        ${variant === 'default' && defaultStyle}
        ${variant === 'outline' && outlineStyle}`}
        >
          확인
        </button>
      );
    };

    // 사용 후
    const buttonVariants = cva(
      'flex items-center justify-center h-10 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-600/90 transition-colors',
      {
        variants: {
          variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            outline:
              'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
          },
        },
        defaultVariants: {
          variant: 'default',
        },
      }
    );
    interface ButtonProps
      extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

    const Button = ({ variant, className }: ButtonProps) => {
      return (
        <button className={buttonVariants({ variant, className })}>확인</button>
      );
    };
    ```

위 세가지 라이브러리를 조합하면 서로를 보완해줄 수 있다.

```tsx
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

위 코드는 clsx로 복잡한 인자에서 false로 평가된 필드를 지운 뒤 하나의 string으로 만들고 tailwind-merge로 tailwind의 class 우선순위 문제를 해결해주는 함수이다.

```tsx
// ... cva의 예제코드 중
const Button = ({ variant, className }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, className }), 'class 추가 가능')}
    >
      확인
    </button>
  );
};
```

이와 같이 cva함수를 감싸주면 된다.

## 최종 결과

아래는 1,2,3번 규칙을 적용한 Button 컴포넌트이다.

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'src/utils/twUtils';

const buttonVariants = cva(
  [
    // Layout & Position & Size
    'flex items-center justify-center',
    // Border & Shape
    'ring-offset-background',
    // Background

    // Text
    'text-sm font-medium',
    // Interaction
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    // Transition
    'transition-colors',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        false: '',
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

cva의 소스를 까보면 내부에서도 clsx를 사용하고 있기 때문에 너무 길면 배열로 만들어 1번 원칙대로 분류하고,
짧은 경우 1번 규칙의 순서에 맞도록 스타일을 정의한다.

또한 아래와 같이 더 세부적으로 분류 가능하다.

```js
const buttonVariants = cva(
  [
    ...
    // Interaction
    [
        // 탭키로 포커스 되었을때
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // disabled 상태일때
        "disabled:pointer-events-none disabled:opacity-50",
    ]
  ],
  {
    variants: {
      size: {
        ...
        lg: [
            "h-11 px-8 rounded-md",
            // 태블릿
            "lg:h-12 lg:px-10 lg:text-md",
            // 데스크탑
            "2xl:h-14 2xl:px-12 2xl:text-lg",
        ],
        ...
      },
    },
  }
  ...
);

```

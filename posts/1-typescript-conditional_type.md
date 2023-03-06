---
title: 'T extends U ? A : B 를 이해해보자'
author: 'woo3145'
date: '2023-3-6'
thumbnail: 'thumbnail_ts.png'
tags:
  - Typescript
excerpt: 'typescript 부시기 - extends'
---

## 문제의 시작

문득 타입스크립트를 잘 활용하지 못하고 기본적인 기능으로만 대강 넘어가고 있는 나 자신을 발견했다.
타입스크립트를 사용하여 개발하면 아래와 같은 딜레마에 빠지게 된다.

- 타입을 잘못 구현하여 뒷 코드에서 타입에러가 남발되고 결국 any로 퉁쳐버린다.
- 구현해야할 타입이 복잡하여 구현하는 방법조차 떠오르지 않아서 any로 퉁쳐버린다.

요즘 주언어로 타입스크립트를 자주 사용하고 있는데 기타를 못치는 기타리스트가 왠말인가...
타입을 any로 넘어가게 된다면 런타임전에 타입으로 에러를 잡을 수 있는 타입스크립트의 최대의 강점을 버리는 것이다.
따라서 정확한 코드의 흐름의 타입을 작성할 수 있도록 연구하고 문서화를 해야하는 필요성이 느껴졌다.

#### extends... extends... extends...

```ts
export type Expect<T extends true> = T;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;
```

보기만 해도 타입 울렁증이 심해지는 코드이다. 물론 Type의 이름을 통해 유추하여 사용 할 수는 있다.
하지만 그런다면 지금까지와 뭐가 다르겠는가?
이번글에서 위 코드의 동작을 정확하게 이해할 수 있도록 정리해야겠다.

#### extends의 여러 용도

extends는 지금까지 typescript에서 굉장히 많이 쓰던 키워드이다.

```ts
1. Interface 확장
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}

2. Class 확장
class Animal {
  move() {console.log("moving")}
}
class Dog extends Animal {
  woof() {console.log("woof!")}
}

Dog는 Animal에서 확장 된 '서브타입' 이다.
Animal은 Dog의 '슈퍼타입' 이다.

** 타입호환성
타입호환성은 이후 추가로 포스팅 할 예정이므로 여기서는 간단하게 아래와 같이 알아두자
- '서브타입'으로 갈수록 타입이 엄격해 진다! (계속 확장되어 자식이 점점 커짐)
- 엄격한 타입을 덜 엄격한 타입에 할당 가능하다! ('서브타입'을 '슈퍼타입'에 할당 가능)
- 위 처럼 덜 엄격한 타입으로 바꾸는 것, 즉 부모타입인 '슈퍼타입'으로 캐스팅 한다고 해서 '업캐스팅'이라고 한다
```

보통 extend는 "연장/확대하다"라는 영단어 이기에 확장하는데에만 익숙하게 사용했다.
하지만 타입스크립트 문서를 처음 공부하며 분명히 읽었지만 어렵거나, 또는 자주 사용하지 않아 잊혀져버린 '조건부 타입'과 '제한' 하는 용도로 extends를 사용하기도 한다.

```ts
3. 조건부 타입
조건부 타입의 정의는 extends의 왼쪽에 있는 유형이 오른쪽의 서브타입이면
참, 아니라면 거짓 으로 ?분기문에 의해 분기된다.

type Upcastability<T, U> = T extends U ? true : false;

type A = {
  a: string;
};
type B = {
  a: string;
  b: string;
};

A와 B의 관계는 A가 '슈퍼타입', B가 '서브타입' 이므로 아래와 같은 결과가 된다.
type Result1 = Upcastability<A, B>; // false
type Result2 = Upcastability<B, A>; // true

3 - 1. *조건부 분배*
제너릭을 이용하여 조건부 타입을 사용한 경우 '분배'가 일어난다

'분배'은 아래와 같이 작동한다.
type toArray<T> = T extends any ? T[]: never;
type Test = toArray<string | number>; // string[] | number[]

  1. toArray의 제너릭으로 들어온 string, number를 다음과 같이 매핑한다.
   -> toArray<string> | toArray<number>  // string[] | number[]
  2. 결과값을 합쳐 반환한다.
   -> Test = string[] | number[]

만약 '분배'을 원하지 않는다면 아래와 같은 선택지가 있다.
  1. 제너릭을 사용하지 않고 리터럴 타입을 명시
type toArray = string | number extends any ? (string | number)[]: never;
type Test = toArray; // (string | number)[]
  2. 제너릭을 변형
type toArray<T> = T[] extends any[] ? T[]: never;
type Test = toArray<string | number>; // (string | number)[]
```

```ts
4. 타입 제한
제너릭<>안에서 extends가 쓰인경우 '제한'의 용도로 쓰인다.
원리는 위와 같이 왼쪽이 오른쪽의 서브타입인지 확인하는 것인데 확인함으로써 T의 타입을 보장할 수 있다.
type A = {a: string};
type Test<T extends A> = T;

type a = Test<string>; // type error
type b = Test<{a:"good"}>; // b = {a:string}
type c = Test<{a:"good", b: 4}> // c = {a:string, b:number}

위 'type c'와 같이 제너릭이 '서브타입'이면 통과한다.

function a<T extends A>(arg:T):T {
  arg.a; // 가능
  arg.b; // error
  return arg;
}
a<{a: string, b: number}>({a: "good", b:4}); // 가능
a<{a: number}>({a: 4}); // error


```

#### 복잡한 코드 분석

자 그럼 위에서 본 복잡한 코드를 분석해보자.

```ts
1.
export type Expect<T extends true> = T;

Expect 타입은 그저 Expect의 제너릭으로 들어온 타입이 'true'에 '업캐스팅'가능한지 확인하고
불가능하면 타입에러를 내보내는 타입이다. 즉 'true'가 아니라면 에러가 발생한다.
** 추가지식 : 'never' type?
  타입스크립트 타입 계층 트리에선 모든타입의 최상위 슈퍼타입인 'unknown', 최하위 서브타입인 'never'가 존재한다.
  따라서 위코드에서 'true'뿐만 아니라 'never'타입을 넣어도 'true'타입에 업캐스팅이 가능하여
  에러가 발생하지 않는다.

2.
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;


2-1. 위 코드는 두개의 'extends 조건부 타입문'이 하나의 'extends 조건부 타입문'으로 연결되어 있다

- 1. (<T>() => T extends X ? 1 : 2) 부분
- 2. <T>() => T extends Y ? 1 : 2 부분
- 3. ... extends ... ? true : false 부분

- (<T>() => T extends X ? 1 : 2)
  => T가 X의 서브타입이면 1, 서브타입이 아니면 2 (식을 표현하기 위한 괄호로 래핑되어있음)
- <T>() => T extends Y ? 1 : 2
  => T가 Y의 서브타입이면 1, 서브타입이 아니면 2

=> 즉, T가 X와 Y 모두 서브타입을 만족하면 true가 된다.

2-2. 이해

사실 이코드는 잘못 생각하면 이해하기에 굉장히 어색한 느낌이 있다.

일단 '추론'이라는 개념때문에 조금 복잡한데 어렵게 생각한 경우는
첫번째 T를 T===X로 추론하고 하여 1이라 일단 가정하고 두번째 T는 X와 같다고 추론했으니....
다시 T===Y로 추론하여 경우 첫번째 식이 맞는지 체크......
이런식으로 추론과정을 추적하여 생각하려는 것이다. (슈뢰딩거의 고양이도 아니고..)

따라서 '추론'은 타입스크립트 언어에게 맞기고 "추론된 T가 X,Y에 대해 동시에 서브타입을 만족하면 true이다"
라고 생각하면 조금 수월하게 이해할 수 있다.

```

#### 응용해보기

```ts
위 'Equal' 타입은 결국 X와 Y가 서로 서브타입을 만족하는지 체크하면 되는 타입이다.
즉 제너릭타입변수 T를 사용하지 않고 아래와 같이 수정할 수 있다.

type Equal<X, Y> = X extends Y ? (Y extends X ? true : false) : false;

아까보다 직관적으로 ?연산자를 이중으로 사용하여 동시에 서브타입을 만족하는 경우에만
true를 반환하도록 수정하였다.

type Exclude<T, U> = T extends U ? never : T;
type test = Exclude<'a'|'b'|'c', 'c'>; // test = 'a' | 'b'

```

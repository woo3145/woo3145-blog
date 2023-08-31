---
title: 'serverless + typescript를 사용하여AWS Lambda 배포하기'
author: 'woo3145'
date: '2023-8-30'
thumbnail: '6_thumbnail.png'
tags:
  - TypeScript
  - Serverless
  - AWS
excerpt: 'serverless의 typescript 템플릿 구조 파악 및 배포하기'
---

# 목표

이글에선 Serverless Framework의 Typescript 템플릿의 구조를 파악하고 실제 AWS Lambda에 배포하는 과정을 다룬다.

# 📚 앞서서

## Serverless 란?

serverless는 개발자가 서버를 관리하지 않고 클라우드 컴퓨팅을 이용하여 어플리케이션을 빌드하고 실행하는 것을 의미한다.
이러한 서버리스 컴퓨팅 서버를 제공하는 업체가 다양하기 때문에 여러 함수들과 리소스를 관리하고 배포하는 것은 복잡할 수 있다.  
위 문제를 해결하는것이 serverless framework이다.

## Serverless Framework

AWS Lambda, Google Cloud Functions, Azure Functions 등등 다양한 클라우드 서비스 업체의 서버리스 기능을 쉽게 개발하고 배포할 수 있도록 도와주는 오픈소스이다.

<a href="https://www.serverless.com/framework/docs" target="_blank">문서 참고</a>

## AWS Lambda 란?

AWS에서 제공하는 이벤트 기반의 서버리스 컴퓨팅 플랫폼이다.  
작성일 기준으로 매월 3백만건의 요청과 최대 320만초의 컴퓨팅 시간을 무료로 사용할 수 있으며(언제나 무료),  
위 사용량을 초과하면 백만건당 0.20 USD가 결제된다.

Lambda 함수는 이벤트에 응답하여 실행되며, 이벤트는 HTTP요청, 파일 업로드, 스케줄링, DB 업데이트 등 다양하다.
이러한 이벤트로 함수가 호출되면 자동으로 적절한 양의 컴퓨팅 리소스를 할당하고 코드를 실행시킨다.

# ⚙️ Serverless 개발환경 구축

## 1. serverless framework 설치

```cs
npm install -g serverless
```

## 2. 템플릿 설치

### "serverless" 명령어를 입력하여 템플릿을 선택한다.

![이미지](/images/6/1.png)

### 하지만 원하는 타입스크립트 설정이 없음으로 Other 선택

![이미지](/images/6/2.png)

### 안내를 따라 serverless create --help 입력

![이미지](/images/6/3.png)

### 다양한 템플릿이 나오는데 원하는 aws-nodejs-typescript 을 설치

```cs
serverless create --template aws-nodejs-typescript
```

![이미지](/images/6/4.png)

### 다음과 같이 템플릿이 생성되면 "npm install"로 패키지를 설치한다.

# 👀 구조 살펴보기

주석을 따라가면 프로젝트 구조를 파악할 수 있다.

## serverless.ts (메인)

```ts
import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';

const serverlessConfiguration: AWS = {
  service: 'playground',
  frameworkVersion: '3',
  plugins: [
    // Webpack, Bacel과 같은 js or ts 등을 위한 bundler 및 minifier 도구 (default)
    'serverless-esbuild',
    // 사용할 플러그인이 있으면 추가
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      // 환경변수 추가 방법
      // https://www.serverless.com/framework/docs/guides/parameters
      TEST: '${param:TEST_A}',
      // serverless deploy --param="TEST_A=abcdefg"
    },
  },
  // 이 서비스에서 배포할 Lambda 함수 정의 (doc에서 속성 확인)
  // https://www.serverless.com/framework/docs/providers/aws/guide/functions
  functions: { hello },
  package: { individually: true }, // 각 함수를 개별적으로 패키징 할건지
  custom: {
    // 템플릿의 esbuild 설정
    // esbuild - Go 언어를 기반으로 기존 노드기반의 번들러보다 10~100배의 번들링 속도를 가진다.
    // 설정 참고
    // https://www.serverless.com/plugins/serverless-esbuild
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
```

## 🗂️ libs

### libs/api-gateway.ts

```ts
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

// aws-lambda의 HTTP 요청 이벤트 핸들러 타입에 json-schema-to-ts 라이브러리로 body의 타입을 검사함
// 참고 https://github.com/ThomasAribart/json-schema-to-ts

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

// 인풋 객체를 body로 하는 HTTP 응답 객체를 만드는 헬퍼함수
export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
```

### libs/handler-resolver.ts

```ts
// 절대 경로를 입력받아서 현재 디렉토리에서의 상대 경로를 반환하는 함수
// 예시 - /Users/username/folder/project/src/file.ts  => src/file.ts

export const handlerPath = (context: string) => {
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
};
```

### libs/lambda.ts

```ts
import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';

// middy 라이브러리를 사용하여 aws lambda에 사용되는 함수에 미들웨어를 쉽게 추가할 수 있도록 도와줌
// 예시 https://middy.js.org/docs/events/api-gateway-http

export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser());
};
```

## 🗂️ functions

### index.ts

```ts
// functions/hello/index.ts 파일을 hello라는 이름으로 export 시키고 있음.
export { default as hello } from './hello';
```

### hello/index.ts

```ts
import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  // 핸들러 지정 - 현재 디렉토리 경로에서 /handler.ts 파일의 main 변수를 지정하고 있음
  // (index.ts 파일임으로 현재 경로는 .../src/functions/hello 임)
  handler: `${handlerPath(__dirname)}/handler.main`,

  // 핸들링할 이벤트를 지정
  // 참고 https://www.serverless.com/framework/docs/providers/aws/events/http-api
  // {aws lambda endpoint}/hello 의 post 요청을 감지
  events: [
    {
      http: {
        method: 'post',
        path: 'hello',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
```

### hello/schema.ts

```ts
// json-schema-to-ts의 스키마 형식으로 request의 json 스키마 작성
// 참고 https://github.com/ThomasAribart/json-schema-to-ts
export default {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
  required: ['name'],
} as const;
```

### hello/handler.ts

```ts
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

// 감지한 이벤트를 처리하는 핸들러

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  return formatJSONResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    event,
  });
};

// hello/index.ts에서 지정할 핸들러의 이름으로 export
export const main = middyfy(hello);
```

# 🚀 Lambda 배포

## 1. AWS IAM 생성

![이미지](/images/6/5.png)

## 2. 어드민 정책으로 설정

**_serverless 프로젝트에서 필요한 최소 권한으로 정확한 정책을 생성하려면 아래와 같은 정책 생성기로 생성하여 설정해준다._**

<a href="https://open-sl.github.io/serverless-permission-generator" target="_blank">Serverless IAM 정책 생성기</a>

![이미지](/images/6/6.png)

## 3. 액세스 키 만들기

![이미지](/images/6/7.png)

클릭

![이미지](/images/6/8.png)

## 4. 액세스키로 serverless 인증 설정하기

```cs
$ serverless config credentials --provider aws --key {액세스 키 ID} --secret {비밀 액세스 키}
```

## 5. 배포하기

```cs
$ serverless deploy
```

---

# ✈️ Lambda로 배포된 API를 사용하기위한 URL 생성하기

## 1. 구성 -> 함수 URL 생성 클릭

![이미지](/images/6/9.png)

## 2. 클라이언트에서 사용하기 위해 인증유형 NONE 선택

![이미지](/images/6/10.png)

## + CORS 설정이 필요할경우 추가 설정에서 설정

![이미지](/images/6/11.png)

## 3. 사용

```ts
const result = await fetch('생성된URL/hello', {
  method: 'POST',
  body: {
    name: 'woo3145',
  },
});
```

# 마치며

다음글에선 AWS Lambda + AWS MediaConvert를 사용하여 S3에 동영상을 업로드하면 3가지 해상도로 인코딩하고 썸네일을 생성하여 저장하는 작업을 다룬다.

[다음글](7-encoding-with-lambda)

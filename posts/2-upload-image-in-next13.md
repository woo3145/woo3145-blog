---
title: 'Next13의 app directory에서 AWS S3에 이미지 업로드를 하는 방법'
author: 'woo3145'
date: '2023-5-31'
thumbnail: '2_thumbnail.png'
tags:
  - Next
excerpt: 'pages/api -> app/api로 마이그레이션'
---

## 문제

next13.2 에서 app/ 안에 api를 작성할 수 있는 기능이 나와
기존에 pages/api에서 multer와 next-connect를 이용해 s3에 업로드하는 api코드를 마이그레이션 하는중 발생

## Next의 너무 빠른 변화

Next13의 가장 중요한 변화는 app directory라고 볼 수 있다.

Next13 : app/ 내에서 api를 처리하는 시스템이 없어 api는 원래처럼 pages/api에 작성

Next13.2 : api를 app directory에 작성할 수 있도록 Route Handlers가 추가

Next13.4 : 두달 뒤 server actions를 발표하면서 api를 위한 레이어를 생성하지 않고 바로 서버작업을 할 수 있는 기능이 추가

app directory는 파일은 기본적으로 모두 서버 컴포넌트라 서버에서 렌더링이 되고 "use client" 구문이 쓰인 파일만 클라이언트 번들에 추가되어 전송되기 때문에 성능향상과 초기 로드시간이 줄게된다.
자세한 내용은 [공식문서](https://nextjs.org/docs)

## 하지만 여러 문제점

**server actions**: 실험적 옵션을 활성화하면 metadata 기능이 작동하지 않는다.
[이슈](https://github.com/vercel/next.js/issues/49679)

**next-auth**: app/를 사용할 경우 refresh token 구현을 못함

- pages/를 쓸때 getServerSession()의 동작

  - authOptions에서 jwt토큰 확인 후 만료 시 리프레시 -> res에 set-cookie로 받아온 토큰을 세팅 -> 세션 리턴
    하지만 app/에서는 서버컴포넌트에서 쿠키 수정이 불가 (쿠키가 읽기전용, routeHandlers/serverActions 에서만 쿠키 수정 가능)
    [next-auth/nextjs#middleware](https://next-auth.js.org/configuration/nextjs#middleware)

    - pages/ : getServerSession(req,res,authOptions)을 호출하는 시점이 미들웨어 같은 추가 레이어 부분이라 response를 수정이 가능했음 (ex. getServerSideProps, pages/api)

    - app/ : getServerSession(authOptions)를 호출하는 시점이 모두 서버 컴포넌트라 클라이언트에 set-cookie를 할 방법이 없음 (route handlers는 쿠키 수정이 되기때문에 session에 토큰을 받아와 수정 할 수 있지만 getServerSession을 쓸때마다 처리해줘야 하며, page.tsx 에선 쿠키를 수정할 수 없기 때문에 일관성이 없어짐)

### pages/api 에서 app/api로

원래는 serverActions으로 최대한 api없이 작업을 하고 무한 스크롤과 같이 클라이언트 요청이 필요한 api만 작성하려 했다.

하지만 위에서 언급한 metadata 관련 문제로 인해 serverActions은 안정적 버전까지 기다리기로 하고 routeHandlers만 적용시켰다.

일반적인 api는 문제없이 마이그레이션이 가능했지만 기능이 나온지 얼마 안되어서 nextAuth나 multer등을 app/ 내에서 사용할 때 정보가 거의 없어 삽질을 몇일동안 했다.

- app/ 에서 next-auth를 사용하는 방법 [참고 블로그](https://codevoweb.com/setup-and-use-nextauth-in-nextjs-13-app-directory/)

### 👍 app/ 에서 s3에 이미지를 업로드 하는법

```ts
// app/api/upload/image/route.ts
export const POST = async (req: Request) => {
  try {
    // route handlers에선 웹 표준 API Request객체를 따름
    // https://developer.mozilla.org/en-US/docs/Web/API/Request
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return InternalServerError();
    }

    const filePath = await upload(file);

    return NextResponse.json({
      message: 'successful',
      data: filePath,
    });
  } catch (e) {
    return InternalServerError();
  }
};

// libs/s3.ts
export const s3 = new S3Client({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: AWS_REGION,
});

export const upload = async (file: File): Promise<string> => {
  // s3에 업로드 하기 위해 파일 포맷을 변경시켜줌 File => Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 파일 확장자 추출
  const fileExtension = file.name.split('.').pop() || '';
  const fileName = `${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 11)}.${fileExtension}`;

  // 확장자를 기반으로 contentType 생성
  const contentType = getContentType(fileExtension);

  // s3에 업로드
  await s3.send(
    new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      ContentType: contentType,
      ACL: 'public-read',
      Key: fileName,
      Body: buffer,
      ContentLength: file.size,
    })
  );

  const filePath = `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${fileName}`;

  return filePath;
};
```

### 🔧 삽질 기록

request객체에서 formData를 추출하기 위해 multer를 사용

- pages/api에선 next-connect를 이용해 multer를 미들웨어로 연결해서 당연히 req를 파싱해야 하는줄 암

```ts
// libs/multer.ts
export const _upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const POST = async (req: Request) => {

    const parser = _upload.single("image");
    // 애초에 req의 타입이 다르다고 나옴
    parser(req,{} as any, async (err) => {
        const file = req.file; // parsing이 안된다.
        ...
    })
    ...
};
```

- route handlers가 받는 request는 표준 웹 API의 Request객체를 따라 multer나 formidable와 같은 파서로 파싱 할 필요없이 req.formData()를 통해 file을 가져올 수 있다.

- 심지어 app/ 내에서 multer를 불러오면 @aws-sdk/signature-v4-crt 모듈을 찾을 수 없다는 에러까지 나와서 아래 코드로 해결함
  ++ formidable도 어떤 모듈을 찾을 수 없다고 나옴

```ts
// next.config.js
...
  webpack: (config, options) => {
    config.resolve.alias['aws-crt'] = path.join(
      __dirname,
      'node_modules/aws-crt'
    );
    return config;
  },
  ...
```

### 후기

1. next13의 변화를 따라가면서 굉장히 삽질을 많이 했다. 버그를 정말 수도없이 만났는데 정보가 거의 없어 해결하기 위해 하루종일 issue를 찾아보고 생성도 하며 애를 먹었다.

2. 지금 next13을 프로덕트에서 사용하기는 너무 이른감이 있는것같다. 어제 들어간 공식문서와 오늘 들어간 공식문서가 다르고 버그가 너무많다.

3. 하지만 버전을 하나씩 업데이트하며 어떤 버그들이 해결되는지 보는 맛이 있었다.

4. next13의 app/ 은 리액트의 lazy loading처럼 최적화 처리를 하지 않아도 여러 최적화와 스트리밍 덕분에 굉장히 빠른 사이트를 구현 할 수 있었다. (별다른 처리 없이 모든 페이지 Lighthouse 점수가 95~100으로 나옴.)

5. serverActions도 정말 강력해 보이기에 안정적인 버전이 너무나 기다려진다.

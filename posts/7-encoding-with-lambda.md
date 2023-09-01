---
title: 'AWS Lambda로 동영상 인코딩 및 썸네일 추출하기'
author: 'woo3145'
date: '2023-8-31'
thumbnail: '7_thumbnail.png'
tags:
  - TypeScript
  - Serverless
  - AWS
excerpt: '동영상 인코딩 및 썸네일 추출 파이프라인 구축하기'
---

# 목표

이글에선 Serverless Framework의 Typescript 템플릿을 사용하여 S3의 videos/ 폴더의 업로드를 감지하고
썸네일 추출과 3가지 해상도로 인코딩하여 S3에 저장하는 파이프라인을 구축하는 과정을 다룬다.

[이전글 참고](6-deploy-lambda-using-serverless)

# 📚 앞서서

## AWS MideaConvert

미디어 파일의 변환과 처리를 간편하게 수행할 수 있는 AWS 서비스이다.  
다양한 포맷으로 변환가능하며 적응형 비트레이트 스트리밍을 지원하는 포맷(MPEG-DASH, Apple HLS, Microsoft Smooth Streaming, CMAF)의 경우 DRM 암호화를 지원한다.

## DRM(Digital Rights Management)

디지털 컨텐츠의 저작권을 보호하고 관리하기 위한 기술이다.
암호화로 무단복제, 재배포, 수정을 방지하고 라이센스를 발급하여 허용 된 사용자만 컨텐츠를 사용할 수 있도록 제한할 수 있으며  
주로 저작권이 중요한 동영상 스트리밍, 음악 스트리밍, 전자서적(E-book) 등에 DRM기술이 사용된다.

하지만 학습목적으로 DRM을 적용하기엔 다양한 제약사항이 있다.

예를들어 Apple의 Fairplay(HSL)나 Google의 Widevine(DASH)과 같은 상용 DRM 솔루션들은 회사와 계약을 하여 라이센싱 절차를 거쳐야 라이센스 서버가 발급된다.

따라서 개인이 DRM을 적용하고 테스트하기엔 무리가 있으며 DRM을 적용하려면 법률 및 기술 요건 때문에 전문가의 조언을 받는게 중요하다.

# MediaConvert 작업 템플릿 생성하기

Lambda에서 MediaConvert를 연결하여 작업을 실행하기 위해 템플릿을 만들어야한다.

## 1. 이름 설정

![이미지](/images/7/1.png)

## 2. 입력 추가

추가 버튼을 누르고 따로 건들건 없다.
![이미지](/images/7/2.png)

## 3. 출력 그룹 추가 (인코딩)

추가 버튼 -> 파일 그룹 선택

![이미지](/images/7/3.png)

왼쪽 H.264, AAC 선택 -> 컨테이너 및 이름 한정자 설정

![이미지](/images/7/4.png)

아래 QVBR 품질 수준과 최대 비트율을 참고하여 설정

<a href="https://docs.aws.amazon.com/ko_kr/mediaconvert/latest/ug/cbr-vbr-qvbr.html" target="_blank">QVBR 참고</a>

![이미지](/images/7/5.png)

위 방법으로 480p, 360p 추가

![이미지](/images/7/6.png)

## 4. 출력 그룹 추가 (썸네일)

- 1. 위를 참고하여 파일 그룹 추가
- 2. 컨테이너 없음, 확장 jpg, 이름 한정자(선택)
- 3. 코덱 JPEG로 프레임 캡쳐, 크기 설정, 최대 캡쳐 1, 스케일링 출력 늘리기

![이미지](/images/7/7.png)

- 4. 오디오 제거

![이미지](/images/7/8.png)

- 5. 생성

MediaConvert -> 작업 템플릿에서 확인할 수 있다.
![이미지](/images/7/9.png)

# Serverless Framework로 lambda 함수 추가

## 1. 환경변수 추가

### serverless.ts

```ts
...
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
      ENDPOINT_MEDIA_CONVERT: '${param:ENDPOINT_MEDIA_CONVERT}',
      MEDIA_CONVERT_IAM_ROLE: '${param:MEDIA_CONVERT_IAM_ROLE}',
      // 배포시 아래 명령어로 환경변수 추가
      // serverless deploy --param="ENDPOINT_MEDIA_CONVERT=환경변수" --param="MEDIA_CONVERT_IAM_ROLE=환경변수"
    },
  },
```

- ENDPOINT_MEDIA_CONVERT
  - mediaConvert -> 계정
- MEDIA_CONVERT_IAM_ROLE
  - IAM -> 역할 -> `(lambda 이름)-(단계)-(리전)-lambdaRole 선택` 선택 -> ARN

## 2. Lambda 함수 추가

이전 게시글에서 템플릿을 살펴본대로 functions/hello를 참고하여 함수 추가

### functions/encodingAndThumbnail/index.ts

s3 이벤트 트리거 등록 (S3 Bucket/videos/ 폴더에 파일이 생성될때)
<a href="https://www.serverless.com/framework/docs/providers/aws/events/s3" target="_blank">참고</a>

```ts
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.encodingAndThumbail`,
  events: [
    {
      s3: {
        bucket: '생성 할 S3 Bucket 이름',
        event: 's3:ObjectCreated:*',
        rules: [{ prefix: 'videos/' }],
      },
    },
  ],
};
```

### functions/encodingAndThumbnail/handler.ts

```ts
import * as AWS from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import middy from '@middy/core';

// MediaConvert 객체 생성
const mediaconvert = new AWS.MediaConvert({
  endpoint: process.env.ENDPOINT_MEDIA_CONVERT,
});

// 타입 참고 https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html
const handler = async (event: S3Event) => {
  for (const record of event.Records) {
    const bucketName = record.s3.bucket.name;
    const objectKey = decodeURIComponent(
      record.s3.object.key.replace(/\+/g, ' ')
    );

    // 인풋 파일
    const inputLocation = `s3://${bucketName}/${objectKey}`;

    // 아웃풋 폴더 위치
    const thumbnailOutputLocation = `s3://${bucketName}/thumbnails/`;
    const videoOutputLocation = `s3://${bucketName}/encodedVideos/`;

    const params = {
      JobTemplate: 'encodingAndThumbnailTemplate', // 생성한 mediaConvert 템플릿 이름
      Role: process.env.MEDIA_CONVERT_IAM_ROLE,
      Settings: {
        Inputs: [
          {
            FileInput: inputLocation,
          },
        ],
        OutputGroups: [
          // 인코딩 파일 그룹 출력 세팅
          {
            Name: 'File Group - encodedVideos', // 템플릿에 설정된 파일그룹명과 동일해야함
            Outputs: [
              {
                Extension: 'mp4',
              },
            ],
            OutputGroupSettings: {
              Type: 'FILE_GROUP_SETTINGS',
              FileGroupSettings: {
                Destination: `${videoOutputLocation}`, // 아웃풋 위치
              },
            },
          },
          // 썸네일 파일 그룹 출력 세팅
          {
            Name: 'File Group - thumbnail', // 템플릿에 설정된 파일그룹명과 동일해야함
            Outputs: [
              {
                Extension: 'jpg',
              },
            ],
            OutputGroupSettings: {
              Type: 'FILE_GROUP_SETTINGS',
              FileGroupSettings: {
                Destination: `${thumbnailOutputLocation}`,
              },
            },
          },
        ],
      },
    };

    try {
      let data = await mediaconvert.createJob(params).promise();

      // 완료 시 추가 작업이 있다면 추가(메일알림 등)
      console.log(`Job created! ID is ${data.Job.Id}`);
    } catch (error) {
      console.error(`Failed to start job for object "${objectKey}": ${error}`);
    }
    return {};
  }
};

// middy 참고 https://middy.js.org/docs/events/s3
export const encodingAndThumbail = middy()
  .use(eventNormalizerMiddleware())
  .handler(handler);
```

### functions/index.ts

```ts
export { default as hello } from './hello'; // (default)
export { default as encodingAndThumbail } from './encodingAndThumbnail';
```

### serverless.ts

함수 추가

```ts
import encodingAndThumbail from '@functions/encodingAndThumbail';

 ...
  functions: {
    encodingAndThumbail,
  },

```

# Lambda 배포

아래 명령어로 배포
(아직 IAM Role이 생성되지 않았다면 환경변수를 지우고 serverless deploy로 배포하면 IAM 생성됨)

```cs
$ serverless deploy --param="ENDPOINT_MEDIA_CONVERT=환경변수" --param="MEDIA_CONVERT_IAM_ROLE=환경변수"
```

배포 완료 시 AWS에 serverless에서 사용하는 S3 버킷, 이벤트가 등록된 S3 버킷, Lambda 어플리케이션 및 함수, CloudFormation이 생성된다.

# 생성된 IAM Role에 추가 권한 설정

이제 배포된 Lambda 함수가 작업을 하기위해서 필요한 권한을 설정해주어야 한다.

권한 추가하는 법
IAM -> 역할 -> "(lambda 이름)-(단계)-(리전)-lambdaRole 선택" -> 권한 추가 -> 인라인 정책 생성 -> JSON 선택

## 1. S3의 Bucket에 접근하고, 파일을 GET, PUT하는 권한 추가

<a href="https://repost.aws/ko/knowledge-center/s3-console-access-certain-bucket" target="_blank">참고</a>

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": ["arn:aws:s3:::woo3145-test"]
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": ["arn:aws:s3:::woo3145-test/*"]
    }
  ]
}
```

## 2. MediaConvert의 작업을 생성하는 권한 추가

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["mediaconvert:CreateJob"],
      "Resource": "*"
    }
  ]
}
```

## 3. iam:PassRole 추가

iam:PassRole: Lambda가 가진 권한들을 다른 서비스에 전달해줄수 있도록 해준다.

현재 상황을 예로들면 Lambda 함수 이외에도 MediaConvert가 S3에 접근하는 권한이 필요하기 때문에 Lambda가 가진 S3접근 권한을 iam:PassRole을 통해 MediaConvert에 전달해줌으로써 MediaConvert가 S3에서 파일을 가져오고, 저장하는 작업을 수행할 수 있는것이다.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["iam:PassRole"],
      "Resource": "*"
    }
  ]
}
```

## 4. 신뢰 관계 수정

신뢰 관계 탭 -> 신뢰 정책 편집

```ts
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": [
                    "mediaconvert.amazonaws.com",
                    "lambda.amazonaws.com"
                ]
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```

완료된 모습
![이미지](/images/7/10.png)

# 마무리

이제 생성된 S3에 videos 폴더를 생성하고 sample-1.mp4, sample-2.mp4를 업로드하면 정상적으로 썸네일 생성 및 인코딩이 완료된다.

![이미지](/images/7/11.png)

![이미지](/images/7/12.png)

추가로 해당 S3버킷을 CDN 서비스(AWS CloudFront)를 사용해 배포하면 네트워크에 캐싱하기 때문에 성능이 향상되고 비용을 절감할 수 있기 때문에 S3버킷을 바로 사용하지 말고 CloudFront에 배포하여 사용하는 것을 추천한다.

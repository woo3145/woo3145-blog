---
title: 'Node.js의 Stream과 웹서비스에서 활용'
author: 'woo3145'
date: '2023-8-7'
thumbnail: '4_thumbnail.png'
tags:
  - Javascript
  - Node
excerpt: 'Stream 모듈과 프론트엔드 & 백엔드 간의 활용'
---

## 스트림이란?

Stream이란 Node.js에서 데이터를 작은 조각(Chunk) 단위로 처리하는 Node.js의 모듈이다.  
스트림을 사용하면 큰 파일이나 데이터를 한번에 처리하지 않고 나눠 처리하기 때문에 메모리의 부담을 줄여 더 효율적으로 사용할 수 있다.

### 스트림의 기본 동작

스트림은 4가지 주요 유형이 있다.

- #### Readable 스트림: 데이터를 읽을 수 있는 스트림으로, 데이터 소스로부터 데이터를 읽는다.
- #### Writable 스트림: 데이터를 출력할 수 있는 스트림으로, 데이터를 소비할 목적지에 데이터를 쓰는 데 사용된다.

  ```js
  const fs = require('fs');

  const readableStream = fs.createReadStream('./a.json', { highWaterMark: 16 });
  readableStream.on('data', (chunk) => {
    console.log('Readable Strema 청크 크기:', chunk.length);
    console.log('Readable Stream 데이터:', chunk.toString());
  });

  const writableStream = fs.createWriteStream('./b.txt');
  readableStream.pipe(writableStream);

  // console.log
  // Readable Strema 청크 크기: 16
  // Readable Stream 데이터: abcdefghijklmnop
  // Readable Strema 청크 크기: 10
  // Readable Stream 데이터: qrstuvwxyz
  ```

- #### Duplex 스트림: Readable과 Writable 스트림을 결합한 양방향 스트림으로, 동시에 데이터를 읽고 쓸 수 있다.

  - 네트워크 소켓 통신(ex. 채팅)
    Node.js의 net 모듈이 제공하는 Socket 클래스는 Duplex 스트림을 기반함
  - 공유 리소스 작업 (ex. 동시 편집 문서 프로그램)

    ```js
    // server.js
    const net = require("net");

    const clients = []; // 연결된 클라이언트들
    const server = net.createServer((socket) => {
        console.log("클라이언트 연결됨");

        clients.push(socket);

        // 연결 종료 이벤트 처리
        socket.on('end', () => {
            console.log('클라이언트 연결 종료');
            clients.splice(clients.indexOf(socket), 1);
        });
        // 클라이언트 메시지 이벤트 처리
        socket.on('data', (data) => {
            const message = data.toString();
            console.log('받은 메시지:', message);
            // 모든 클라이언트에게 메시지 전송
            clients.forEach(clientSocket => {
                clientSocket.write(message);
            })
        });
    })

    // client.js

    // 클라이언트 소켓 생성
    const net = require('net');

    const client = net.createConnection({ port: 3000 }, () => {
            console.log('서버에 연결됨');
            client.write('안녕하세요 !');
    });

    위 코드는 클라이언트가 메세지를 보내면 서버에서 메세지를 Read 하고 다른 클라이언트에게
    다시 Write를 하는 양방향 처리를 하고있다.
    ```

- #### Transform 스트림: Duplex 스트림의 특별한 유형으로, 입력 받은 데이터를 변환하여 출력하는 데 사용되며 주로 데이터를 압축하거나 암호화하는 데 사용된다.

  - Transform은 위 duplex 예제와 비슷하지만 좀더 데이터의 변환에 초첨을 두면 Transform 스트림이라고 한다.

## 웹서비스에서의 스트림 사용

웹서비스에서 주로 스트림을 사용하는 경우는 크게 다음과 같은 경우들이 있다.

- 네트워크 소켓 통신
- 큰 파일 전송
- 비디오나 오디오 스트리밍
- 데이터의 암호화, 압축 및 복호화, 인코딩

다음은 위 Duplex의 동작 예제에서 언급한 네트워크 소켓 통신 이외에 간단한 예제코드이다.

### 큰 파일 전송

```js
const http = require('http');
const fs = require('fs');

// HTTP 파일 다운로드 서버
const downloadServer = http.createServer((req, res) => {
  const fileStream = fs.createReadStream('./big_video.mp4');
  fileStream.pipe(res);
});

downloadServer.listen(3001, () => {
  console.log('다운로드 서버 포트:', 3001);
});

// HTTP 파일 업로드 서버
const uploadServer = http.createServer((req, res) => {
  if (req.method === 'POST') {
    const fileStream = fs.createWriteStream('./uploaded_video.mp4');
    req.pipe(fileStream);

    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('업로드 완료');
    });
  }
});

uploadServer.listen(3002, () => {
  console.log('업로드 서버 포트:', 3002);
});

// 클라이언트 측
const response = await fetch('http://localhost:3002', {
  method: 'POST',
  body: formData, // 동영상
});

서버에서 Writable 스트림을 연결하면 클라이언트에서 fetch를 보낼때
body의 데이터를 스트림에 입력시킨다.
```

**만약 Stream을 사용하지 않고 서버에서 큰 파일을 클라이언트에 전송하게 되면,  
서버는 보내기전 큰 파일을 메모리에 모두 올려두어야 하기 때문에 메모리에 그대로 1기가가 올라가게 된다.**

### 비디오나 오디오 스트리밍

[깃허브 참고](https://github.com/woo3145/video-streaming-app/blob/master/server/app.js)

브라우저는 video, audio 태그에 대해 자동으로 HTTP Range요청을 통한 스트리밍 및 재생처리를 해준다.

### 데이터 암호화&압축 및 복호화

```js
// 암호화
const fs = require('fs');
const crypto = require('crypto');
const zlib = require('zlib');

const ALGORITHM = 'aes-256-cbc';
const PASSWORD = '파일 암호화 Key';
const KEY_SIZE = 32;
const IV_SIZE = 16;
// 암호화 및 복호화에 사용되는 비밀번호
const key = crypto.scryptSync(PASSWORD, 'salt', KEY_SIZE);
// 초기화 백터 (암호화 알고리즘에서 사용되는 난수화된 바이트 데이터)
const iv = crypto.randomBytes(IV_SIZE);

const inputStream = fs.createReadStream('./example.txt');
const outputStream = fs.createWriteStream('./encrypted_example.txt.gz');

// crypto에서 제공하는 transform 스트림 (암호화)
const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
// zlib에서 제공하는 transform 스트림 (압축)
const gzip = zlib.createGzip();

inputStream
  .pipe(cipher)
  .pipe(gzip)
  .pipe(outputStream)
  .on('finish', () => {
    console.log('암호화 및 압축이 완료되었습니다.');
  });

// 위 코드는 inputStream에서 chunk단위로 pipe를 타고
// chunk단위로 암호화 -> 압축 -> outputStream에 chunk 조각 저장이 반복된다
```

```js
// 복호화
// 알고리즘, key, iv가 암호화 할때 사용한 값과 동일해야함
const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
// zlib에서 제공하는 transform 스트림 (압축 해제)
const gunzip = zlib.createGunzip();

const decryptInputStream = fs.createReadStream('./encrypted_example.txt.gz');
const decryptOutputStream = fs.createWriteStream('./decrypted_example.txt'); // 압축 해제 및 복호화된 파일

decryptInputStream
  .pipe(gunzip)
  .pipe(decipher)
  .pipe(decryptOutputStream)
  .on('finish', () => {
    console.log('복호화 및 압축 해제가 완료되었습니다.');
  });

// (암호화->압축)할때 과정과 반대로 (압축 해제->복호화) 순서로 진행되어야한다.
```

## Multer 미들웨어를 사용하지 않아야 할 때

Multer는 파일 업로드를 처리하는 Node.js의 미들웨어이다.  
내부적으로 당연히 Stream을 사용하여 처리하지만, 개발자는 전송이 다 완료된 뒤에야 데이터에 접근할 수 있다. (req.file)  
위 의미는 파일전체가 메모리에 적재되거나 임시 디스크에 저장 된다는 의미이다.  
이러한 구현은 개발자가 스트림 처리에 대해 고민하지 않아 더 편리하게 업로드를 다룰 수 있도록 도와주지만 세부적인 제어를 하지 못하게 된다.

따라서 큰파일을 처리해야 하거나 스트림에 대한 세부 처리가 필요하다면 직접 스트림을 연결하여 처리하는게 더 적절하다.
예를 들면 다음과 같은 경우가 있다.

- 암호화또는 압축을 하여 저장할때

  - Multer를 사용하면 파일을 메모리에 한번 저장한 후 암호화 및 압축을 해야하지만  
    직접 처리를 하면 파일을 받아오는 동시에 암호화 및 압축을 처리할 수 있다.

    ```js
    // 위의 데이터 암호화&압축 및 복호화 예제 참고

    const encryptedFilePath = './encrypted-file.gz';
    const encryptedFileStream = fs.createWriteStream(encryptedFilePath);

    req.pipe(cipher).pipe(gzip).pipe(encryptedFileStream);

    // 클라이언트 fetch의 body 값을 청크단위로 암호화 -> 압축 -> encrypted-file.gz에 저장한다.
    ```

- 이미지 변환 및 리사이징
- 동영상 인코딩

위와 같이 업로드하는 파일에 추가작업이 필요할때 스트림을 직접 구현하면 전송과 동시에 처리해서 더 효율적으로 구현할 수 있다.

## 최종 AWS-S3까지 한번에

위에서 정리한데로 스트림은 이미 매우 많은 라이브러리에 사용되고 있다.  
보통 aws-s3의 업로드 예제를 보면 multer로 req.file을 백엔드에서 받아온 뒤 다시한번 aws-s3에 전송한다.  
이는 작은 파일은 문제 없지만 1GB 단위의 파일을 업로드 한다면 서버는 multer에서 처리한 1GB를 메모리에 적재하는 것이다.

따라서 최종적으로 클라이언트에서 받아온 파일을 서버에서 암호화 -> 압축 -> s3업로드를 해야하는 상황을 구현한 코드로 글을 마무리 하겠다.

```js
const http = require('http');
const AWS = require('aws-sdk');
const fs = require('fs');
const crypto = require('crypto');
const zlib = require('zlib');
const { PassThrough } = require('stream');

const PORT = 3000;
const BUCKET_NAME = 'S3 Bucket 이름';

const ALGORITHM = 'aes-256-cbc';
const PASSWORD = '파일 암호화 Key';
const KEY_SIZE = 32;
const IV_SIZE = 16;
const key = crypto.scryptSync(PASSWORD, 'salt', KEY_SIZE);
const iv = crypto.randomBytes(IV_SIZE);

AWS.config.update({
  accessKeyId: 'your-access-key-id',
  secretAccessKey: 'your-secret-access-key',
  region: 'your-s3-region',
});

const s3 = new AWS.S3();

const uploadServer = http.createServer((req, res) => {
  if (req.method === 'POST') {
    const key = `s3에 저장 할 파일명`;

    // 암호화 및 압축 설정
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const gzip = zlib.createGzip();
    const passThroughStream = new PassThrough();

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: passThroughStream,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading file to S3:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('업로드 에러');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('업로드 성공');
      }
    });

    // Stream 파이프 라인 연결
    req.pipe(cipher).pipe(gzip).pipe(passThroughStream);
  }
});

uploadServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

당연히 클라이언트 또는 백엔드에서 해당 파일을 사용하기전에 복호화 하는 과정이 필요하다.

## 데이터 추가 처리에 대한 고찰

- 보안
  - 암호화 같은 경우는 중간 탈취의 위험이 있음으로 민감한 데이터는 클라이언트에서 암호화를 처리하여 전송하는게 좋을 것 같다.
- 서버 부하
  - 클라이언트에서 암호화, 압축, 인코딩을 하면 서버의 부하를 줄일 수 있다.
  - 반대로 클라이언트 부담이 올라감
- 호환성
  - 클라이언트에서 처리시 상황에 따라 브라우저 지원과 관련된 문제 가능성이 있다.
- 유지보수
  - 서버에서 처리하면 코드 유지보수 및 보안 문제를 해결하기 더 용이하다.

아무리 생각해도 하나의 완벽한 Best Practice는 없는 것 같다.
작업을 백에서 해야할지, 프론트에서 해야할지 결정하려면 위 내용처럼 고려해야할 요소가 굉장히 많기 때문이다.  
100개의 어플리케이션이 있으면 100개의 Best Practice가 존재하는게 아닐까?

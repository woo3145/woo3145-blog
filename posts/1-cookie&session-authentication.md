---
title: '세션&쿠키 인증방식'
author: 'woo3145'
date: '2022-11-16'
thumbnail: '1-georg-bommeli-ybtUqjybcjE-unsplash.jpg'
tags:
  - authentication
excerpt: '세션&쿠키 인증방식'
---

## 쿠키/세션 인증

### 쿠키

**브라우저가 컴퓨터에 저장하는 일종의 텍스트 파일**

- 특정 도메인에서 생성된 쿠키는 동일한 도메인에 요청을 보낼때마다 함께 전송된다.
- 쿠키는 브라우저에서 관리한다.
- 서버에서 응답할때 헤더에 Set-Cookie 헤더를 포함하면 클라이언트에서 브라우저가 쿠키를 저장한다.
- 라이프타임 속성
  - Expires : 정의된 날짜에 쿠키가 삭제된다.
  - Max-Age : 정의된 기간 이후 쿠키가 삭제된다.(초단위) ex) Max-Age=600; = 1분뒤 만료
  - **세션쿠키 : Expires, Max-Age속성이 정의되지 않은 쿠키는 세션쿠키로 브라우저가 종료될때 삭제된다.**
- 보안 속성
  - Secure : HTTPS 요청일 경우에만 쿠키를 전송한다.
  - HttpOnly : 자바스크립트의 document.cookie로 접근하는 것을 막는다. (서버전송 용도로만 사용)

### 세션

**클라이언트와 서버가 연결이 된 상태**

- 1. 클라이언트가 로그인을 요청한다.
- 2. 서버에서 로그인 정보가 일치한지 확인하고 session id를 생성하여 세션 스토리지(ex. redis)에 회원정보와 함께 저장한다.
- 3. 서버에서 session id를 Set-Cookie 헤더에 포함하여 응답을 보낸다. (세션 쿠키로 설정)

이후 클라이언트의 요청에 담긴 쿠키를 확인하여 session id가 서버의 세션 스토리지에 저장된 session id가 일치하는지 확인하여 사용자를 식별한다.

## 장단점

### 장점

- 쿠키가 탈취 당해도 쿠키(session id) 자체엔 유의미한 정보가 담겨있지 않다.
- session id가 일치한지 확인하면서 추가요청 없이 회원정보를 가져올 수 있다.

### 단점

- 세션 하이재킹 문제: 탈취된 쿠키를 실어 서버에 함께 요청하면(세션이 유효한 경우) 해커인지 사용자인지 구분을 못한다.
- 서버에서 세션에 연결 된 사용자 만큼 추가적인 자원을 사용하기 때문에 부하가 생긴다.
- 서버 확장이 어려워짐 : 서버 수를 늘릴 경우 서버1에서 로그인을 해도 서버2에서 인증이 되지않는다.
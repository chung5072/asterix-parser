# asterix-parser
### 기능
**asterix-validator를 활용한 Asterix 데이터 파싱 모듈**

- 모듈로 확인할 수 있는 내용
    - 배열 내의 객체 형태로 Asterix 데이터 파싱 결과. 
    - 현재 구현된 내용: Category 021

**기술 스택**

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

---
### 설치 방법
```
npm install asterix-validator
npm install asterix-parser
```
---
### 사용 예시
```
parse("확인하고_싶은_데이터_문자열");
```
**결과 구조**
```
/* typescript */
[
    {
        '021_010_SAC': 01,
        '021_010_SIC': 01,
    },
    ...
]
```
**예시**
```
console.log(parse("3E0006800102"));
```
---
### 참고 링크
[Asterix CAT021](https://www.eurocontrol.int/publication/cat021-eurocontrol-specification-surveillance-data-exchange-asterix-part-12-category-21)

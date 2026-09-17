# Yunho Cho Portfolio

조윤호의 홈페이지, 프로젝트 상세 페이지, 웹 포트폴리오와 이력서를 하나의 Astro 애플리케이션으로 관리합니다.

## 로컬 실행

```bash
npm install
npm run dev
```

기본 개발 서버는 `http://localhost:4321`에서 실행됩니다.

## 검증과 빌드

```bash
npm run check:astro
npm run check:eslint
npm run build
```

## Docker

```bash
docker compose up --build -d
docker compose ps
```

컨테이너는 `http://localhost:8088`에서 실행됩니다. 다른 포트가 필요하면 `PORT=9090 docker compose up --build -d`처럼 지정할 수 있습니다.

```bash
docker compose down
```

## 주요 경로

- `/`: 홈페이지와 프로젝트 요약
- `/projects/{slug}`: 프로젝트 상세 페이지
- `/portfolio`: 대표 포트폴리오를 바탕으로 정리한 구현 기능·사용 결과
- `/portfolio/yunho-cho-portfolio.pdf`: 9쪽 PDF 포트폴리오
- `/resume`: 웹 이력서
- `/resume/yunho-cho-resume.pdf`: PDF 이력서

## 대표 문서 동기화

현재 문안의 기준은 형제 저장소 `career-docs/3_대표서류`입니다. 대표 MD와 출력 PDF의 본문을 확인한 뒤 아래 명령으로 공개 문서만 동기화합니다.

```bash
node scripts/sync-career-documents.mjs
# 다른 위치의 career-docs를 사용하는 경우
node scripts/sync-career-documents.mjs /absolute/path/to/career-docs
# PDF·이미지를 유지하고 웹 본문만 갱신하는 경우
node scripts/sync-career-documents.mjs /absolute/path/to/career-docs --web-only
```

웹 포트폴리오는 프로젝트를 빠르게 파악하는 요약 페이지입니다. 각 프로젝트의 짧은 소개·개인 역할·대표 화면과 상세 페이지 링크, 홈랩 구성도를 제공합니다. 자세한 구현·검증 기록은 프로젝트 상세와 대표 PDF에서 확인합니다.

스크립트는 `scripts/portfolio-overview.md`를 웹 본문으로 생성하며, 대표 문서에 명시된 공개 이미지와 대표 이력서·포트폴리오 PDF만 복사합니다. 지원 기록과 개인 작성 자료는 복사하지 않습니다. PDF는 재생성하지 않습니다.

`src/documents/portfolio.md`는 생성 파일입니다. 웹 요약은 `scripts/portfolio-overview.md`에서 수정한 뒤 `node scripts/sync-career-documents.mjs --web-only`로 갱신합니다. 동기화해도 긴 대표 문안이 웹에 복원되지 않습니다. 공통 사실의 기준은 career-docs이며, 웹 요약 수정이 대표 MD·PDF를 바꾸지는 않습니다.

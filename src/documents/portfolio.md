---
title: 조윤호 포트폴리오
---

<!-- Generated from scripts/portfolio-overview.md. Edit that source, then sync. -->

## Home Lab

직접 구축하고, 서비스를 운영하는 개인 인프라입니다.

<figure class="home-lab-diagram" id="개인-서비스-운영-환경">
  <a href="/portfolio/diagrams/home-lab.svg" target="_blank" rel="noreferrer" aria-label="홈랩 구성도 크게 보기 (새 탭)">
    <img src="/portfolio/diagrams/home-lab.svg" alt="외부 접속은 OCI와 WireGuard를 거쳐 ORANGE 공개 서비스 영역으로 연결됩니다. IPFire로 관리·테스트·서비스망을 분리하며 Proxmox 3노드에서 Linux VM을 운영합니다." loading="lazy" width="960" height="800" />
  </a>
  <figcaption>Home Lab · 그림을 누르면 크게 볼 수 있습니다.</figcaption>
</figure>

## Heimdall

### 자동 배포 플랫폼

Git 저장소를 등록하면 빌드부터 실행·응답 확인·공개까지 이어주는 배포 플랫폼입니다. 이 홈페이지도 Heimdall로 운영합니다.

**개인 설계·개발** · 배포 자동화 / 버전 전환 / 로그 조회

![Heimdall 배포 관리 화면](/projects/heimdall.png)

[프로젝트 자세히 보기 →](/projects/heimdall) · [GitHub ↗](https://github.com/CodingPenguin-yoon/heimdall_final)

## Gjallar

### Proxmox 자동화 콘솔

VM 사양을 재사용하고, 생성 전 조건부터 실행 후 상태까지 한곳에서 확인하는 운영 도구입니다.

**개인 설계·개발** · VM Profile / 생성 전 검사 / 작업 추적

![Gjallar VM 운영 화면](/projects/gjallar.png)

[프로젝트 자세히 보기 →](/projects/gjallar) · [GitHub ↗](https://github.com/CodingPenguin-yoon/Gjallar)

## K-Le-PaaS

### 자연어 기반 Kubernetes 운영 플랫폼

자연어로 서비스를 제어하고, 배포와 자원 상태를 한곳에서 확인하는 2인 팀 프로젝트입니다.

**담당: 자연어 제어·모니터링** · 요청 해석 / Kubernetes 제어 / 자원 지표 조회

![K-Le-PaaS 모니터링 화면](/projects/klepaas-dashboard.png)

[프로젝트 자세히 보기 →](/projects/klepaas) · [GitHub ↗](https://github.com/K-Le-PaaS/backend-hybrid)

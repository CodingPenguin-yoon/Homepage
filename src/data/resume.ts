export interface ResumeSkillGroup {
  label: string;
  items: string[];
}

export interface ResumeProject {
  id: 'heimdall' | 'gjallar' | 'klepaas';
  period: string;
  type: string;
  role: string;
  title: string;
  summary: string;
  highlights: string[];
  stack: string[];
  evidence?: { label: string; href: string }[];
}

export const resumeProfile = {
  name: '조윤호',
  nameEn: 'Yunho Cho',
  role: 'Platform Engineer',
  secondaryRole: '클라우드·인프라 플랫폼 개발',
  statement: '직접 운영하며 만난 불편을, 다시 쓸 수 있는 도구로 만듭니다.',
  title: '인프라를 이해하고 필요한 기능을 개발합니다.',
  summary:
    '게임 서버 운영에서 출발해, 서버와 네트워크를 직접 구축하고 여러 개인 서비스를 배포·운영해 왔습니다. 그 과정에서 반복하던 VM 설정과 배포 준비를 줄이려고, 화면과 API부터 서버 작업까지 직접 개발했습니다. 현재 Gjallar로 개인 서버의 VM을 관리하고, Heimdall로 홈페이지와 여러 개인 서비스를 배포해 운영하고 있습니다. 직접 쓰면서 발견한 문제를 고치고, 실행 결과가 실제 서비스와 자원에 반영됐는지 확인합니다.',
  location: 'Seoul, Korea',
  updated: 'Updated 2026.09',
} as const;

export const resumeInfrastructure = {
  title: '개인 서비스를 직접 운영하는 홈랩.',
  summary:
    'Proxmox VE 3노드와 Linux VM에서 개인 프로젝트와 서비스를 운영합니다. IPFire로 관리망과 서비스망을 분리하고, NAS/NFS와 WireGuard·OCI를 연결해 스토리지와 외부 접근 경로를 구성했습니다.',
  items: ['Proxmox VE 3노드', 'IPFire 관리망·서비스망 분리', 'NAS / NFS', 'WireGuard / OCI'],
  pocTitle: 'OpenStack 멀티노드 PoC',
  poc: 'Kolla-Ansible로 멀티노드 환경을 구성하고 인스턴스 통신, 테넌트 네트워크·라우터, Floating IP와 Cinder 볼륨 연결을 확인했습니다. 단일 Controller를 사용하는 기능 검증 환경입니다.',
} as const;

export const resumeSkillGroups: ResumeSkillGroup[] = [
  { label: 'Infrastructure', items: ['Linux', 'Proxmox VE', 'Docker', 'Kubernetes'] },
  { label: 'Development', items: ['Python', 'FastAPI', 'PostgreSQL', 'React'] },
  { label: 'Delivery', items: ['Git', 'NGINX', 'GitHub Actions'] },
  { label: 'Monitoring / Network', items: ['Prometheus', 'REST API', 'IPFire', 'WireGuard', 'NAS / NFS'] },
];

export const resumeProjects: ResumeProject[] = [
  {
    id: 'heimdall',
    period: '2026.08 - 현재',
    type: '개인 프로젝트',
    role: '설계·개발·검증 / 배포 API·Worker·React UI',
    title: '반복되는 애플리케이션 배포 준비를 줄이는 도구',
    summary:
      '서비스마다 실행 환경과 접속 경로를 수동으로 준비하던 불편을 줄이기 위해 만들었습니다. 공용 서버에서 저장소를 빌드하고, 새 버전의 응답을 확인한 뒤 서비스 경로를 전환합니다.',
    highlights: [
      '홈페이지와 GitHub 트래커를 비롯한 여러 개인 서비스를 배포해 운영하고 있습니다.',
      '개인 환경에서 서버 준비를 제외한 애플리케이션 배포를 3분 이내에 완료했습니다.',
      '배포할 커밋과 설정을 고정하고, Docker 빌드·실행·응답 확인·NGINX 경로 전환과 프로젝트별 PostgreSQL DB 제공을 연결했습니다.',
    ],
    stack: ['Python', 'FastAPI', 'Docker', 'NGINX', 'PostgreSQL', 'React'],
    evidence: [
      {
        label: '회귀 테스트',
        href: 'https://github.com/CodingPenguin-yoon/heimdall_final/blob/9c4df9e264e274678ffacabc0510aebecb3aeff0/backend/tests/test_nginx_gateway.py',
      },
    ],
  },
  {
    id: 'gjallar',
    period: '2026.05 - 현재',
    type: '개인 프로젝트',
    role: '설계·개발·검증 / Proxmox API 연동·React UI',
    title: 'VM 상태를 확인하고 반복되는 설정을 줄이는 운영 도구',
    summary:
      'VM마다 사양과 IP를 다시 입력하고 주소 충돌을 겪어 만들었습니다. VM Profile로 사양을 재사용하고, Proxmox의 실제 자원과 주소 조건을 생성 전에 확인합니다. 현재 개인 서버의 VM 관리에 사용합니다.',
    highlights: [
      'VM 생성에는 승인과 최종 확인을, VM 시작에는 명시적 확인과 중복 방지를 적용했습니다. 요청 접수 뒤 작업 종료와 실제 VM 상태를 다시 확인합니다.',
      '2026년 6월 홈랩 시험에서 VM 생성·기동, guest-agent 응답, 요청한 IP 설정과 cloud-init 완료를 확인했습니다.',
    ],
    stack: ['Proxmox API', 'Python', 'FastAPI', 'PostgreSQL', 'React'],
    evidence: [
      {
        label: '현재 사전 검사 테스트',
        href: 'https://github.com/CodingPenguin-yoon/Gjallar/blob/ee00450553ff835296f9342528f0f096ad59ca38/backend/tests/vm_create/test_preflight_plan_contract.py',
      },
    ],
  },
  {
    id: 'klepaas',
    period: '2025.09 - 2025.12',
    type: '2인 팀 프로젝트',
    role: '개인 담당 / 자연어 운영 제어·인프라 모니터링',
    title: '자연어 운영 제어와 Git 연동 자동 배포를 제공하는 플랫폼',
    summary:
      '여러 도구와 명령을 익혀야 하는 운영 부담을 줄이기 위해 2인 팀으로 만들었습니다. 웹·Slack의 자연어 요청을 운영 기능에 연결하고, Git 변경에 따른 자동 배포와 자원 상태 확인을 한 플랫폼에서 제공합니다.',
    highlights: [
      '자연어 요청을 구조화하고 허용된 작업으로 제한해, 상태·로그 조회와 재시작·파드 수 조절 API에 연결했습니다.',
      'Prometheus 설치·수집 대상 구성, CPU·메모리·디스크·네트워크 조회 API와 대시보드 연결을 담당했습니다. 화면은 REST API를 10초 간격으로 조회합니다.',
      '팀의 Git 연동 자동 배포 시연에서 서로 다른 두 배포가 1분 58초·4분 30초에 완료됐습니다. 팀 시연 결과이며 평균이나 보장 시간은 아닙니다.',
    ],
    stack: ['Kubernetes', 'NCP', 'Python', 'FastAPI', 'Prometheus'],
    evidence: [
      { label: '배포 시연', href: 'https://www.youtube.com/watch?v=tY4XmxIsDok&t=111s' },
      { label: '자연어 제어 시연', href: 'https://www.youtube.com/watch?v=tY4XmxIsDok&t=571s' },
      { label: '모니터링 구현 PR', href: 'https://github.com/K-Le-PaaS/backend-hybrid/pull/42' },
    ],
  },
];

export const resumeEducation = {
  school: '광운대학교',
  major: '전자통신공학과',
  status: '졸업',
  date: '2026.02',
} as const;

export const resumeCertifications = ['정보처리기사', '리눅스마스터 2급'] as const;

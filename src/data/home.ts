import { getAsset } from '~/utils/permalinks';

export type HomeProjectTone = 'blue' | 'red' | 'green' | 'yellow';

export interface CaseStudyStep {
  title: string;
  description: string;
}

export interface CaseStudyDecision extends CaseStudyStep {
  status: 'Current' | 'Planned' | 'In development' | 'Implemented' | 'Verified';
}

export interface CaseStudyProofItem extends CaseStudyStep {
  badge: string;
  href?: string;
  linkLabel?: string;
}

export interface CaseStudyProof {
  id?: string;
  label?: string;
  title: string;
  introduction: string;
  items: CaseStudyProofItem[];
}

export interface CaseStudyOwnership {
  title: string;
  team: CaseStudyStep;
}

export interface CaseStudyNarrative {
  contextTitle: string;
  context: string[];
  roleTitle: string;
  role: string;
  roleItems: CaseStudyStep[];
  ownership?: CaseStudyOwnership;
  architectureTitle: string;
  architecture: string;
  architectureSteps: CaseStudyStep[];
  decisionsTitle: string;
  decisions: CaseStudyDecision[];
  proof?: CaseStudyProof;
  currentTitle: string;
  current: string;
  nextTitle: string;
  next: string;
  outcomeLabel?: string;
  outcomeTitle?: string;
  currentBadge?: string;
  nextBadge?: string;
}

export interface CaseStudyDetail {
  type: string;
  status: string;
  problemTitle: string;
  problem: string;
  steps: CaseStudyStep[];
  resultTitle: string;
  result: string;
  narrative?: CaseStudyNarrative;
}

export interface HomeProject {
  id: string;
  index: string;
  name: string;
  category: string;
  statement: string;
  description: string;
  caseStudyHref: string;
  repository: string;
  tone: HomeProjectTone;
  tags: string[];
  visual?: {
    src: string;
    alt: string;
    position?: 'top' | 'center';
  };
  flow?: string[];
  flowLabel?: string;
  flowResult?: string;
  detail: CaseStudyDetail;
}

export const homeNavigation = [
  { label: '포트폴리오', href: '/portfolio' },
  { label: '소개', href: '#about' },
  { label: '프로젝트', href: '#projects' },
  { label: '홈랩', href: '#infrastructure' },
  { label: '연락처', href: '#contact' },
] as const;

export const homeHero = {
  eyebrow: '조윤호 / Platform Engineer',
  headline: ['직접 운영하며 발견한 불편을,', '필요한 도구로 만듭니다.'],
  description:
    '서버를 직접 운영하며 반복하던 배포와 VM 설정을 소프트웨어로 만들었습니다. 인프라를 이해하고, 백엔드부터 화면까지 연결하는 플랫폼 개발을 지향합니다. 이 홈페이지도 직접 만든 Heimdall로 배포해 운영하고 있습니다.',
};

const homeProjectOrder = new Map([
  ['heimdall', 0],
  ['gjallar', 1],
  ['klepaas', 2],
]);

const homeProjectSource: HomeProject[] = [
  {
    id: 'heimdall',
    index: '01',
    name: 'Heimdall',
    category: '애플리케이션 배포 · 개인 프로젝트',
    statement: '만든 서비스를, 직접 배포하고 운영합니다.',
    description:
      '서비스마다 반복하던 배포 준비를 하나의 흐름으로 만들었습니다. 새 버전을 따로 실행하고 실제 응답을 확인한 뒤 전환합니다. 이 홈페이지와 개인 서비스들을 배포하는 데 사용하고 있습니다.',
    caseStudyHref: '/projects/heimdall',
    repository: 'https://github.com/CodingPenguin-yoon/heimdall_final',
    tone: 'blue',
    tags: ['Docker', 'NGINX', 'FastAPI', 'PostgreSQL', 'React'],
    visual: {
      src: getAsset('/projects/heimdall.png'),
      alt: 'Heimdall의 프로젝트 목록과 배포 준비 상태 화면',
      position: 'top',
    },
    detail: {
      type: '개인 설계·개발',
      status: '2026.08 – 현재 · 개인 서비스 운영',
      problemTitle: '서비스를 추가할 때마다 반복하던 배포 준비를 줄였습니다.',
      problem:
        '준비된 공용 서버에 저장소와 설정을 등록하면 빌드, 실행, 응답 확인과 접속 경로 전환을 이어서 처리합니다.',
      steps: [
        { title: '설정 고정', description: '배포할 commit과 설정을 snapshot으로 저장합니다.' },
        { title: '후보 실행', description: '새 Docker 이미지를 빌드하고 별도 컨테이너로 실행합니다.' },
        { title: '응답 확인', description: '서비스 상태와 NGINX를 통한 실제 접속을 확인합니다.' },
        { title: '경로 전환', description: '검증을 통과한 후보만 현재 Preview로 연결합니다.' },
      ],
      resultTitle: '검증된 새 버전만 현재 서비스로 전환합니다.',
      result:
        '새 배포 후보를 현재 서비스와 분리하고, 응답을 확인한 뒤 전환합니다. 경로 전환에 실패하면 이전 Gateway 설정과 네트워크를 복원하고 기존 배포 자원을 보존합니다.',
      narrative: {
        contextTitle: '서비스 하나를 올릴 때마다 같은 준비를 반복했습니다.',
        context: [
          '개인 서버에 애플리케이션을 추가할 때마다 VM과 실행 환경을 준비하고, 저장소 빌드부터 외부 접근 경로까지 수동으로 연결했습니다. 이미 준비된 서버에서 이 과정을 처리하면 서비스마다 VM을 새로 만들 필요가 없다고 생각했습니다.',
          '처음에는 VM 생성까지 한 시스템에 넣으려 했습니다. 하지만 향후 MCP로 요청을 받으면 VM 생성과 애플리케이션 배포의 의도·실행 대상이 섞일 수 있다고 판단했습니다. 통합 흐름을 완성하기 전에 VM 운영은 Gjallar로 나누고, Heimdall은 배포에 집중했습니다.',
        ],
        roleTitle: '설정 화면부터 배포 실행과 검증·복구까지 직접 만들었습니다.',
        role: 'React 관리 화면, FastAPI API와 PostgreSQL 상태 관리, Docker Worker, NGINX 경로 전환을 설계·개발했습니다. 실행 명령이 끝난 뒤 실제로 서비스에 접속할 수 있는지까지 확인하도록 연결했습니다.',
        roleItems: [
          {
            title: '설정과 배포 이력',
            description: '저장소의 정확한 commit과 설정을 고정하고, 배포 단계와 이벤트·로그를 조회할 수 있게 했습니다.',
          },
          {
            title: '빌드와 실행',
            description:
              '서비스별 Docker 이미지를 빌드해 새 후보를 실행합니다. 프로젝트별 PostgreSQL DB·role과 연결 정보도 제공합니다.',
          },
          {
            title: '검증과 전환',
            description:
              '서비스 응답과 접속 경로를 확인한 뒤 활성 배포를 확정합니다. 실패 시 기존 경로를 보존하고 원인을 기록합니다.',
          },
        ],
        architectureTitle: '새 버전을 별도로 실행하고, 응답을 확인한 뒤 전환합니다.',
        architecture:
          'FastAPI가 commit·설정·진행 상태를 관리하고 Docker Worker가 빌드와 후보 실행을 맡습니다. 서비스 health check와 NGINX 경로 검증을 거쳐 현재 Preview를 바꿉니다.',
        architectureSteps: [
          { title: 'Register', description: '저장소·서비스·환경변수와 health check를 등록합니다.' },
          { title: 'Snapshot', description: '정확한 commit SHA와 배포 설정을 고정합니다.' },
          { title: 'Build', description: '서비스별 이미지를 빌드하고 격리된 후보를 실행합니다.' },
          { title: 'Verify', description: '서비스와 접속 경로에서 실제 응답을 확인합니다.' },
          { title: 'Activate', description: 'NGINX 경로를 전환하고 검증 후 활성 배포를 확정합니다.' },
        ],
        decisionsTitle: '다시 배포할 때도 기존 서비스를 지키는 구조를 골랐습니다.',
        decisions: [
          {
            status: 'Implemented',
            title: '배포할 소스와 설정 고정',
            description:
              '정확한 commit SHA와 변경 불가능한 설정 snapshot을 남겨, 어떤 소스와 조건으로 배포했는지 추적합니다.',
          },
          {
            status: 'Verified',
            title: '실행 중인 서비스와 후보 분리',
            description:
              '새 후보를 기존 서비스와 별도로 실행하고, 서비스 응답과 접속 경로를 확인한 뒤 Preview를 전환합니다. 검증을 통과하기 전에는 기존 Preview를 유지합니다.',
          },
          {
            status: 'Implemented',
            title: '불확실한 상태는 재확인',
            description:
              '배포 상태가 불분명한 자원을 바로 삭제하지 않습니다. 기존 정상 설정과 자원을 보존하고 재확인할 수 있게 기록합니다.',
          },
        ],
        currentTitle: '이 홈페이지를 배포하는 도구로 사용하고 있습니다.',
        current:
          '단일 VM의 Docker 환경에서 홈페이지와 GitHub 트래커 등 개인 서비스를 배포·운영합니다. 저장소 빌드부터 응답 확인과 Preview 전환까지 이어서 처리하고, 프로젝트별 PostgreSQL DB도 제공합니다.',
        nextTitle: '운영하며 배운 것을 다음 배포 구조로 이어갑니다.',
        next: 'Gateway를 재생성하는 동안 짧은 접속 중단이 생길 수 있습니다. 현재는 Kubernetes를 적용해 단일 VM에 트래픽이 집중되는 구조와 배포 방식을 개선하는 방향을 검토하고 있습니다.',
        outcomeLabel: '06 / 실제 사용과 다음 과제',
        outcomeTitle: '직접 쓰면서 배포 결과를 확인합니다.',
        currentBadge: '현재 사용',
        nextBadge: '검토 중',
      },
    },
  },
  {
    id: 'gjallar',
    index: '02',
    name: 'Gjallar',
    category: 'Proxmox 운영 · 개인 프로젝트',
    statement: '반복 설정을 줄이고, 실제 상태를 확인합니다.',
    description:
      'VM 사양을 다시 입력하고 IP를 수동으로 관리하던 불편에서 시작했습니다. 사양을 재사용하고 생성 조건을 미리 확인하며, 실행 뒤 VM이 준비됐는지까지 살피는 운영 도구입니다.',
    caseStudyHref: '/projects/gjallar',
    repository: 'https://github.com/CodingPenguin-yoon/Gjallar',
    tone: 'red',
    tags: ['Proxmox API', 'FastAPI', 'PostgreSQL', 'React'],
    visual: {
      src: getAsset('/projects/gjallar.png'),
      alt: 'Gjallar의 Proxmox 자원 상태와 VM 운영 화면',
      position: 'top',
    },
    detail: {
      type: '개인 설계·개발',
      status: '2026.05 – 현재 · 홈랩에서 사용',
      problemTitle: '매번 입력하던 VM 사양을 재사용하고, 생성 전에 조건을 확인합니다.',
      problem:
        'Proxmox의 실제 자원과 주소 상태를 조회한 뒤 변경을 실행하고, 작업 종료와 실제 VM 상태를 다시 확인합니다.',
      steps: [
        { title: '상태 조회', description: 'Proxmox 자원과 VM의 현재 상태를 확인합니다.' },
        { title: '사전 검사', description: '사양·IP·네트워크·스토리지 조건을 검사합니다.' },
        { title: '확인·실행', description: '작업별 승인·확인을 거쳐 변경 요청을 보냅니다.' },
        { title: '결과 확인', description: 'Proxmox task와 변경 후 실제 VM 상태를 확인합니다.' },
      ],
      resultTitle: '요청 접수와 작업 완료를 구분합니다.',
      result:
        '시간이 초과되거나 실제 상태가 예상과 다르면 성공으로 확정하지 않습니다. 작업 기록을 남기고 재확인 대상으로 관리합니다.',
      narrative: {
        contextTitle: '같은 VM 사양을 다시 입력하고, IP 충돌을 겪었습니다.',
        context: [
          '홈랩에서 VM을 만들 때마다 vCPU·메모리·디스크를 다시 정했습니다. IP를 수동으로 관리하다 주소 충돌도 겪었습니다. 자원 상태를 한곳에서 보고, 같은 용도의 사양은 재사용할 수 있는 도구가 필요했습니다.',
          'Proxmox 템플릿 위에 VM Profile을 두고, 생성 전에 주소와 자원 조건을 확인하도록 만들었습니다. 현재는 개인 서버에서 VM의 상태를 살피고 생성·시작 등의 작업을 관리하는 데 사용합니다.',
        ],
        roleTitle: '상태 조회부터 변경 요청과 결과 확인까지 직접 구현했습니다.',
        role: 'React 화면과 FastAPI·PostgreSQL을 기반으로 Proxmox inventory, VM Profile, 사전 검사, 작업별 승인·확인과 비동기 task 추적을 만들었습니다.',
        roleItems: [
          {
            title: '자원 상태와 사양 재사용',
            description:
              '노드·VM·템플릿·스토리지·네트워크를 Proxmox API로 조회하고 VM Profile에서 사양을 재사용합니다.',
          },
          {
            title: '변경 전 검사와 통제',
            description:
              'IP와 자원 조건을 검사합니다. 작업별 승인·확인 절차와 idempotency key·PostgreSQL lock으로 중복·충돌 요청을 통제합니다.',
          },
          {
            title: '작업 추적과 사후 확인',
            description:
              'Proxmox task 종료 뒤 실제 VM 상태를 확인합니다. 시간 초과나 상태 불일치를 성공으로 처리하지 않고 기록합니다.',
          },
        ],
        architectureTitle: '현재 상태를 읽고, 변경한 뒤 다시 확인합니다.',
        architecture:
          'Gjallar는 요청과 실행 이력을 관리하고 Proxmox API가 실제 자원 조회·변경을 수행합니다. 비동기 요청을 접수했다는 응답과 VM이 의도한 상태가 됐다는 판단을 분리했습니다.',
        architectureSteps: [
          { title: 'Observe', description: 'Proxmox에서 노드·VM·네트워크와 자원 상태를 조회합니다.' },
          { title: 'Validate', description: 'Profile과 요청값을 실제 주소·디스크·자원 조건에 대조합니다.' },
          { title: 'Confirm', description: '권한을 확인하고 작업 종류에 맞는 승인·확인을 거칩니다.' },
          { title: 'Execute', description: '중복·동시 요청을 통제하고 Proxmox API를 호출합니다.' },
          { title: 'Verify', description: 'task 종료와 실제 VM 상태를 확인하고 결과를 기록합니다.' },
        ],
        decisionsTitle: '필요한 기능과 적용할 환경에 맞춰 구성을 바꿨습니다.',
        decisions: [
          {
            status: 'Implemented',
            title: 'Proxmox API로 필요한 조회·변경 구현',
            description:
              '다른 환경에 적용할 조건을 검토하며 Terraform import와 Ansible SSH 권한 준비가 목적에 비해 과하다고 판단했습니다. API 기반 대시보드를 구현해 PoC에서 발표했습니다.',
          },
          {
            status: 'Verified',
            title: '생성 전에 디스크와 자원 조건 확인',
            description:
              '템플릿의 실제 디스크 크기와 요청값을 비교합니다. 템플릿보다 작은 디스크 요청을 사전에 차단하고, IP·네트워크·스토리지 조건을 확인한 뒤 VM을 생성합니다.',
          },
          {
            status: 'Implemented',
            title: '완료 응답과 실제 상태를 함께 확인',
            description:
              'Proxmox task가 끝났는지 확인한 뒤 VM 상태를 다시 조회합니다. 실행 요청이 접수됐다는 이유만으로 작업을 성공 처리하지 않습니다.',
          },
        ],
        currentTitle: '홈랩의 자원 상태와 VM 변경을 관리합니다.',
        current:
          'VM Profile로 사양을 재사용하고, 생성 전에 IP와 자원 조건을 확인합니다. 생성·시작·정상 종료와 제한된 잠금 해제를 구현하고, 작업 기록과 실제 상태를 함께 조회할 수 있게 했습니다.',
        nextTitle: 'VM 생성부터 사용 준비까지 확인했습니다.',
        next: '2026년 6월 1일 Proxmox API를 사용하는 홈랩 생성 시험에서 clone·start 작업 성공과 실제 running 상태를 확인했습니다. guest-agent 응답, 요청한 IP 설정과 cloud-init 완료도 확인했습니다.',
        outcomeLabel: '06 / 실제 사용과 검증',
        outcomeTitle: '사양 재사용부터 생성 결과 확인까지.',
        currentBadge: '현재 사용',
        nextBadge: '검증 결과',
      },
    },
  },
  {
    id: 'klepaas',
    index: '03',
    name: 'K-Le-PaaS',
    category: 'Kubernetes 운영 · 2인 팀 프로젝트',
    statement: '자연어 요청을 실제 운영 작업에 연결합니다.',
    description:
      '여러 도구와 명령을 익혀야 하는 운영 부담을 줄이고자 만든 팀 플랫폼입니다. 자연어 제어와 인프라 모니터링을 맡아 요청 해석부터 Kubernetes 실행, 지표 조회와 화면 연결까지 구현했습니다.',
    caseStudyHref: '/projects/klepaas',
    repository: 'https://github.com/K-Le-PaaS/backend-hybrid',
    tone: 'green',
    tags: ['Kubernetes', 'Gemini', 'FastAPI', 'Prometheus', 'NCP'],
    visual: {
      src: getAsset('/projects/klepaas-dashboard.png'),
      alt: 'K-Le-PaaS의 클라우드 운영 대시보드',
      position: 'top',
    },
    detail: {
      type: '2인 팀 · 자연어 제어·모니터링 담당',
      status: '2025.09 – 2025.12',
      problemTitle: '명령을 외우는 대신, 하려는 작업을 요청할 수 있도록.',
      problem:
        '자연어를 지원하는 Kubernetes 작업으로 변환하고, 실행 결과와 자원 상태를 확인할 수 있는 기능을 만들었습니다.',
      steps: [
        { title: '요청', description: '웹이나 Slack에서 자연어로 운영 작업을 요청합니다.' },
        { title: '해석·검증', description: '의도와 대상을 구조화하고 지원 작업과 인자를 검증합니다.' },
        { title: '실행', description: '백엔드의 지정된 핸들러가 Kubernetes API를 호출합니다.' },
        { title: '결과 조회', description: '실행 결과와 자원 상태를 확인합니다.' },
      ],
      resultTitle: '자연어로 요청한 파드 수가 실제로 반영되는 것을 확인했습니다.',
      result:
        '팀 시연에서 파드 수를 3개에서 2개로 변경하고 터미널에서 Running 2개·Ready 1/1을 확인했습니다. Git 연동 자동 배포는 별도의 팀 구현 결과입니다.',
      narrative: {
        contextTitle: '운영하려면 여러 도구의 명령과 절차를 알아야 했습니다.',
        context: [
          '재시작과 상태 조회에는 Kubernetes 명령이 필요했고, 배포 진행 상황과 자원 사용량도 각각 확인해야 했습니다. 이 부담을 줄이기 위해 자연어 운영 제어, Git 연동 자동 배포, 상태·지표 확인을 2인 팀으로 한 플랫폼에 모았습니다.',
          '저는 자연어 요청을 실제 운영 작업으로 바꾸는 기능과 인프라 모니터링을 맡았습니다. 자연어 엔진과 Prometheus는 자체 Kubernetes에서 실행했고, 완성 서비스의 배포 환경으로 NKS를 사용했습니다.',
        ],
        roleTitle: '자연어 제어와 인프라 모니터링',
        role: '요청 해석, 상태·로그 조회, 재시작·파드 수 조절 API를 구현했습니다. Prometheus 설치·수집 대상 구성부터 지표 조회 API와 대시보드 연결까지 맡았습니다.',
        roleItems: [
          {
            title: '자연어 → Kubernetes 작업',
            description:
              'Gemini 해석 결과를 CommandRequest로 검증하고, 허용된 CommandPlan의 작업과 인자를 실행 핸들러에 연결했습니다.',
          },
          {
            title: '지표 수집과 조회 API',
            description:
              'Prometheus 설치와 수집 대상을 구성했습니다. 팀원이 만든 초기 client 뼈대에 CPU·메모리·디스크·네트워크 조회 API와 상세 지표를 구현했습니다.',
          },
          {
            title: '화면 연결과 전달 경로',
            description:
              '대시보드는 REST API를 10초 간격으로 조회해 갱신합니다. 별도 WebSocket 전달 경로는 팀원과 공동 구현했습니다.',
          },
        ],
        ownership: {
          title: '팀의 전체 배포 흐름에서, 운영 제어와 모니터링을 맡았습니다.',
          team: {
            title: 'Git 연동 배포와 웹·Slack 운영 플랫폼',
            description:
              '인증, GitHub·NCP 배포 파이프라인, 웹 콘솔, Kubernetes 운영과 Slack 연동을 팀이 나눠 구현했습니다. 버전 롤백은 팀원이 담당했습니다.',
          },
        },
        architectureTitle: '자연어 해석 결과를 검증하고, 허용된 API 작업으로 바꿉니다.',
        architecture:
          'Gemini가 command·parameters JSON을 만들면 입력 형식을 검증합니다. 이를 CommandPlan(tool, args)으로 정규화하고, 지정된 핸들러가 Kubernetes Python Client API를 호출합니다.',
        architectureSteps: [
          { title: 'Request', description: '“K-Le-PaaS/test01 재시작해줘”처럼 운영 의도를 입력합니다.' },
          { title: 'Interpret', description: 'Gemini가 요청을 command·parameters로 해석합니다.' },
          { title: 'Validate', description: 'CommandRequest와 CommandPlan으로 작업·인자를 검증합니다.' },
          { title: 'Execute', description: '지정된 핸들러가 Kubernetes API를 호출합니다.' },
          { title: 'Observe', description: '실행 결과와 실제 자원 상태를 확인합니다.' },
        ],
        decisionsTitle: '해석한 요청을 실행 가능한 범위에 맞춰 연결했습니다.',
        decisions: [
          {
            status: 'Implemented',
            title: '자유 형식 명령 대신 지원 작업 지정',
            description:
              '자연어 응답을 셸 명령으로 바로 실행하지 않습니다. 상태·로그 조회, 재시작과 파드 수 조절을 정해진 API 핸들러로 연결했습니다.',
          },
          {
            status: 'Implemented',
            title: '수집한 지표를 화면에서 쓸 수 있는 API로',
            description:
              'Prometheus 질의 결과를 조회 API로 제공하고 대시보드에 연결했습니다. 사용자는 별도 명령 없이 사용량과 상세 지표를 확인할 수 있습니다.',
          },
          {
            status: 'Current',
            title: 'MCP 확장보다 API 완성에 집중',
            description:
              'API가 미완성인 상황에서 MCP 지원을 넓히기보다 API를 먼저 완성하자고 제안했습니다. 팀원과 이번 범위를 조정하고 모니터링·Kubernetes 명령 기능에 집중했습니다.',
          },
        ],
        proof: {
          id: 'contribution-evidence',
          label: '05 / 구현 근거와 팀 시연',
          title: '요청이 반영되는지, 화면에서 지표를 볼 수 있는지 확인했습니다.',
          introduction:
            '개인 담당은 자연어 제어와 모니터링입니다. 배포 소요 시간은 팀이 완성한 Git 연동 파이프라인의 서로 다른 두 시연 결과입니다.',
          items: [
            {
              badge: '자연어 제어',
              title: '파드 수 변경 요청을 실제 상태로 확인했습니다.',
              description:
                '시연 09:31에 3개, 09:44에 2개로 스케일링을 요청했습니다. 10:42의 터미널에서 Running 2개·Ready 1/1을 확인했습니다.',
              href: 'https://www.youtube.com/watch?v=tY4XmxIsDok&t=571s',
              linkLabel: '자연어 제어 시연',
            },
            {
              badge: '모니터링 구현',
              title: 'REST API를 10초마다 조회해 지표를 갱신합니다.',
              description:
                'CPU·메모리·디스크·네트워크 사용량과 상세 지표를 조회 API에 연결했습니다. 시연에서는 상세 지표와 사용량 요약, Prometheus 기반 경고가 화면에 표시되는 것을 확인했습니다.',
              href: 'https://github.com/K-Le-PaaS/frontend/blob/377180122c403594db32ce1017ca93251360818d/components/real-time-monitoring-dashboard.tsx#L220',
              linkLabel: '대시보드 조회 구현',
            },
            {
              badge: '팀 배포 시연',
              title: '배포 화면에서 1분 58초·4분 30초를 확인했습니다.',
              description:
                'GitHub PR 병합으로 시작한 test01은 1분 58초, 코드 push로 시작한 test03은 4분 30초였습니다. 배포 화면의 Duration 값이며, 두 시연 사례의 기록입니다. 평균·보장 시간이나 수동 대비 단축률을 뜻하지 않습니다.',
              href: 'https://www.youtube.com/watch?v=tY4XmxIsDok',
              linkLabel: '배포 시연 · 01:51 / 04:23',
            },
          ],
        },
        currentTitle: '인프라의 지표를 제품 기능으로 연결했습니다.',
        current:
          '모니터링을 제품 기능으로 만드는 것은 처음이었습니다. 지표를 화면에 전달하는 방법을 이해하려고 WebSocket·SSE·폴링을 공부하고, 수집부터 조회 API와 화면 연결까지 하나씩 구현했습니다.',
        nextTitle: '이 경험을 개인 배포 도구 개발로 이어갔습니다.',
        next: 'K-Le-PaaS를 만들며 프런트엔드·백엔드·DB를 연결하고 실제 배포까지 자동화하고 싶어졌습니다. 이후 Heimdall에서 프로젝트별 DB 제공과 여러 서비스의 배포·검증 흐름을 구현했습니다.',
        outcomeLabel: '07 / 배운 점과 이어진 개발',
        outcomeTitle: '인프라를 다루는 경험에서, 플랫폼을 만드는 경험으로.',
        currentBadge: '구현하며 배운 점',
        nextBadge: '다음 프로젝트로',
      },
    },
  },
];

export const homeProjects = homeProjectSource.sort(
  (left, right) =>
    (homeProjectOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
    (homeProjectOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER)
);

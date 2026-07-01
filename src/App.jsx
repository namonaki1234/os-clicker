import { useMemo, useState } from 'react'
import {
  BadgeCheck,
  Binary,
  BookOpenCheck,
  BrainCircuit,
  Cpu,
  Database,
  FileCode2,
  Flame,
  Globe2,
  HardDrive,
  Layers3,
  Lock,
  MemoryStick,
  MonitorCog,
  Network,
  Play,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Trophy,
} from 'lucide-react'
import './App.css'

const TRACKS = [
  {
    id: 'boot',
    name: 'Boot',
    title: '起動とCPU',
    icon: Cpu,
    color: '#42c6ff',
    summary: '電源投入からカーネルが最初の仕事を始めるまで。',
    lessons: [
      {
        id: 'bios-bootloader',
        title: 'BIOS/UEFI とブートローダ',
        xp: 15,
        concept: 'CPU は最初からOSを知っているわけではなく、ファームウェアが起動デバイスを探してブートローダを読み込みます。',
        visual: ['Power on', 'UEFI', 'Bootloader', 'Kernel image'],
        prompt: 'ブートローダの主な役割として一番近いものは？',
        options: [
          'カーネルをメモリへ読み込み、実行開始の準備をする',
          'ブラウザのCSSを解析して画面を描く',
          'ユーザーのパスワードを常に平文で保存する',
        ],
        answer: 0,
        explanation: 'ブートローダはカーネルを読み込み、起動パラメータを渡してOSの開始地点へ制御を移します。',
      },
      {
        id: 'interrupts',
        title: '割り込み',
        xp: 20,
        concept: 'キーボード入力やタイマーのような外部イベントは、割り込みによってCPUの注意を一時的に切り替えます。',
        visual: ['Program', 'Interrupt', 'Handler', 'Resume'],
        prompt: 'タイマー割り込みがOSにもたらす重要な効果は？',
        options: [
          '実行中の処理を区切り、スケジューラが次の仕事を選べる',
          'すべてのメモリをディスクへ永久保存する',
          'HTMLをJavaScriptへ変換する',
        ],
        answer: 0,
        explanation: 'タイマー割り込みがあるから、OSは長く走る処理からCPUを取り戻して公平に実行できます。',
      },
      {
        id: 'syscall',
        title: 'システムコール',
        xp: 20,
        concept: 'アプリはファイルやネットワークを直接いじらず、システムコールでカーネルに依頼します。',
        visual: ['App', 'syscall', 'Kernel', 'Device'],
        prompt: 'アプリがファイルを読むとき、システムコールが必要な理由は？',
        options: [
          '保護された資源をカーネルが安全に仲介するため',
          'CPUのクロックを必ず2倍にするため',
          'CSSの詳細度を計算するため',
        ],
        answer: 0,
        explanation: '権限境界をまたぐ操作なので、カーネルが検査しながら実行します。',
      },
      {
        id: 'boot-memory-map',
        title: 'メモリマップ',
        xp: 20,
        concept: 'ブート直後のOSは、使ってよいRAM領域、デバイス予約領域、カーネル配置場所を把握する必要があります。',
        visual: ['Firmware map', 'Reserved area', 'Free RAM', 'Kernel heap'],
        prompt: 'メモリマップを読む目的として近いものは？',
        options: [
          'OSが安全に使える物理メモリ範囲を知る',
          'ブラウザの履歴を全部消す',
          'HTTPレスポンスを暗号化する',
        ],
        answer: 0,
        explanation: '物理メモリのどこを使えるか知らないと、デバイス領域やカーネル自身を上書きしてしまいます。',
      },
      {
        id: 'context-switch',
        title: 'コンテキストスイッチ',
        xp: 25,
        concept: 'OSはレジスタやスタック位置などを保存し、別の処理の状態を復元してCPUを切り替えます。',
        visual: ['Save registers', 'Pick next', 'Restore state', 'Run task'],
        prompt: 'コンテキストスイッチで保存・復元される代表例は？',
        options: ['CPUレジスタや実行位置', 'DNSのTTLだけ', 'CSSの色指定だけ'],
        answer: 0,
        explanation: '処理を中断しても戻ってこられるように、CPU上の実行状態を退避します。',
      },
    ],
  },
  {
    id: 'memory',
    name: 'Memory',
    title: 'メモリとプロセス',
    icon: MemoryStick,
    color: '#8ccf57',
    summary: 'プロセス、仮想メモリ、スケジューリングの感覚をつかむ。',
    lessons: [
      {
        id: 'process-thread',
        title: 'プロセスとスレッド',
        xp: 20,
        concept: 'プロセスは隔離された実行環境、スレッドは同じプロセス内で走る実行の流れです。',
        visual: ['Process', 'Address space', 'Thread A', 'Thread B'],
        prompt: 'スレッド同士が同じプロセス内で共有しやすいものは？',
        options: ['アドレス空間', '別PCの電源ボタン', 'DNSのルートサーバー'],
        answer: 0,
        explanation: '同じプロセスのスレッドはメモリ空間を共有するため、速い一方で競合にも注意が必要です。',
      },
      {
        id: 'virtual-memory',
        title: '仮想メモリ',
        xp: 25,
        concept: '各プロセスは自分専用の広いメモリを持つように見え、MMUとページテーブルが物理メモリへ対応付けます。',
        visual: ['Virtual addr', 'Page table', 'Physical frame', 'RAM'],
        prompt: '仮想メモリの強みは？',
        options: [
          'プロセス間の隔離と、物理メモリ管理を扱いやすくする',
          'ネットワークの遅延をゼロにする',
          'HTMLタグを自動で修正する',
        ],
        answer: 0,
        explanation: '仮想アドレスにより、安全な隔離、ページング、効率的なメモリ配置ができます。',
      },
      {
        id: 'scheduler',
        title: 'スケジューラ',
        xp: 25,
        concept: 'OSはCPU時間を短い単位で配り、応答性と公平性のバランスを取ります。',
        visual: ['Ready queue', 'Pick task', 'Run', 'Preempt'],
        prompt: 'プリエンプションとは？',
        options: [
          'OSが実行中の処理を中断して別の処理へCPUを渡すこと',
          'ファイル名を必ず短くすること',
          '画像をPNGからJPEGにすること',
        ],
        answer: 0,
        explanation: 'プリエンプションにより、一つの処理がCPUを独占し続けるのを防げます。',
      },
      {
        id: 'heap-stack',
        title: 'ヒープとスタック',
        xp: 20,
        concept: 'スタックは関数呼び出しの一時領域、ヒープは動的に確保して寿命を管理する領域です。',
        visual: ['Function call', 'Stack frame', 'malloc/new', 'Heap block'],
        prompt: 'ヒープが必要になりやすい場面は？',
        options: [
          '実行中にサイズや寿命が決まるデータを持つ',
          'CPUを物理的に冷却する',
          'HTMLの見出しだけを太くする',
        ],
        answer: 0,
        explanation: 'ヒープは関数をまたいで残したいデータや、実行時に大きさが決まるデータに向きます。',
      },
      {
        id: 'page-fault',
        title: 'ページフォルト',
        xp: 25,
        concept: 'アクセスした仮想ページがまだ物理メモリに対応していないと、CPUは例外を起こしてOSに処理させます。',
        visual: ['Access page', 'Fault', 'OS handler', 'Map or kill'],
        prompt: 'ページフォルト時にOSが行う可能性がある処理は？',
        options: [
          'ページを割り当てる、ディスクから読む、または不正アクセスとして止める',
          '必ずネットワークを切断する',
          'CSSをDOMへ変換する',
        ],
        answer: 0,
        explanation: 'ページフォルトは遅延割り当てやスワップ、保護違反の検出などに使われます。',
      },
    ],
  },
  {
    id: 'storage',
    name: 'Storage',
    title: 'ファイルとストレージ',
    icon: HardDrive,
    color: '#f7b84b',
    summary: 'ファイルシステム、キャッシュ、永続化の考え方。',
    lessons: [
      {
        id: 'filesystem',
        title: 'ファイルシステム',
        xp: 20,
        concept: 'ファイルシステムは、名前、ディレクトリ、メタデータ、実データの対応を管理します。',
        visual: ['Path', 'Inode/metadata', 'Blocks', 'Disk'],
        prompt: 'ファイルシステムが主に管理するものは？',
        options: [
          'パス名と実データブロックの対応',
          'CSSアニメーションのフレームレートだけ',
          'CPUの製造工程',
        ],
        answer: 0,
        explanation: 'ファイル名からメタデータをたどり、ディスク上のブロックを見つけます。',
      },
      {
        id: 'cache',
        title: 'ページキャッシュ',
        xp: 25,
        concept: 'OSは一度読んだディスク内容をメモリに残し、次回アクセスを速くします。',
        visual: ['read()', 'Page cache', 'Disk miss', 'Fast hit'],
        prompt: 'ページキャッシュの効果として正しいものは？',
        options: [
          '同じデータへの読み取りをメモリから返せる',
          '必ずデータを暗号化する',
          'JavaScriptの型エラーを消す',
        ],
        answer: 0,
        explanation: '遅いストレージアクセスを減らし、体感速度を大きく改善します。',
      },
      {
        id: 'journaling',
        title: 'ジャーナリング',
        xp: 25,
        concept: '更新の途中で電源が落ちても壊れにくいよう、変更予定をログとして記録します。',
        visual: ['Intent log', 'Write data', 'Commit', 'Recover'],
        prompt: 'ジャーナリングが守りたいものは？',
        options: [
          'クラッシュ後のファイルシステム整合性',
          'ブラウザタブの色',
          '画面の明るさ',
        ],
        answer: 0,
        explanation: '途中で止まった更新を復旧時に判断できるので、構造の破損を抑えられます。',
      },
      {
        id: 'vfs',
        title: 'VFS',
        xp: 25,
        concept: 'VFSは異なるファイルシステムを同じopen/read/writeの形で扱うための抽象レイヤーです。',
        visual: ['open()', 'VFS', 'ext4/tmpfs', 'Driver'],
        prompt: 'VFSのうれしさは？',
        options: [
          '種類の違うファイルシステムを共通APIで扱える',
          'TLS証明書を発行できる',
          'JavaScriptを常に高速化する',
        ],
        answer: 0,
        explanation: 'アプリは個別の保存形式を意識せず、カーネルの共通インターフェースを使えます。',
      },
      {
        id: 'block-device',
        title: 'ブロックデバイス',
        xp: 20,
        concept: 'SSDやディスクはバイト列ではなく、固定サイズのブロック単位で読み書きされることが多いです。',
        visual: ['Request', 'Block layer', 'Driver queue', 'SSD'],
        prompt: 'ブロック層が吸収したい違いは？',
        options: [
          'デバイスごとの読み書き単位やキュー処理の違い',
          'HTMLタグ名の大文字小文字',
          'ユーザーの画面サイズだけ',
        ],
        answer: 0,
        explanation: 'ファイルシステムはブロック層を通じて、個別デバイスの細部から少し離れて扱えます。',
      },
    ],
  },
  {
    id: 'network',
    name: 'Network',
    title: 'ネットワーク',
    icon: Network,
    color: '#ff7f6e',
    summary: 'DNS、TCP/TLS、HTTPの流れをパケット目線で見る。',
    lessons: [
      {
        id: 'dns',
        title: 'DNS名前解決',
        xp: 20,
        concept: 'ブラウザは example.com のような名前をIPアドレスへ変換してから接続します。',
        visual: ['Domain', 'Resolver', 'Authoritative DNS', 'IP address'],
        prompt: 'DNSが返す代表的な情報は？',
        options: ['ドメインに対応するIPアドレス', 'CPUの温度', 'Reactコンポーネントのprops'],
        answer: 0,
        explanation: '名前から接続先アドレスを得ることで、ブラウザはサーバーへ到達できます。',
      },
      {
        id: 'tcp-tls',
        title: 'TCP と TLS',
        xp: 30,
        concept: 'TCPは順序と再送を担当し、TLSは暗号化と相手確認を担当します。',
        visual: ['TCP handshake', 'TLS handshake', 'Encrypted data', 'HTTP'],
        prompt: 'HTTPSでTLSが主に担当することは？',
        options: [
          '通信の暗号化とサーバー証明書による確認',
          'ファイルを必ず圧縮する',
          'メモリの断片化を完全に消す',
        ],
        answer: 0,
        explanation: 'TLSは盗み見や改ざんを防ぎ、証明書で接続先の正当性を確認します。',
      },
      {
        id: 'http-cache',
        title: 'HTTPキャッシュ',
        xp: 25,
        concept: 'ブラウザはレスポンスヘッダーを見て、再利用できるリソースをキャッシュします。',
        visual: ['Request', 'Cache-Control', 'Browser cache', 'Revalidate'],
        prompt: 'HTTPキャッシュの目的は？',
        options: [
          '不要な再ダウンロードを減らし、表示を速くする',
          'OSの割り込みを無効化する',
          'すべてのCookieを公開する',
        ],
        answer: 0,
        explanation: 'キャッシュ可能なCSSや画像を再利用すると、通信量と待ち時間を減らせます。',
      },
      {
        id: 'socket',
        title: 'ソケット',
        xp: 25,
        concept: 'アプリはソケットを通じて、TCPやUDPの通信端点をファイルのようなAPIで扱います。',
        visual: ['socket()', 'connect()', 'send/recv', 'close()'],
        prompt: 'ソケットが表すものに近いのは？',
        options: [
          'ネットワーク通信の端点',
          'DOMノードの親要素',
          '物理メモリの空きページだけ',
        ],
        answer: 0,
        explanation: 'ソケットはIPアドレス、ポート、プロトコルと結びついた通信口として扱えます。',
      },
      {
        id: 'congestion',
        title: '輻輳制御',
        xp: 30,
        concept: 'TCPはネットワークを詰まらせないよう、送信量を増減させながら帯域を探ります。',
        visual: ['Send window', 'ACK', 'Loss signal', 'Slow down'],
        prompt: '輻輳制御の目的は？',
        options: [
          'ネットワーク全体が混雑しすぎないよう送信量を調整する',
          'OSの特権命令を増やす',
          'CSSセレクタを短くする',
        ],
        answer: 0,
        explanation: '損失や遅延を手がかりに送信ペースを調整し、通信の安定性を保ちます。',
      },
    ],
  },
  {
    id: 'browser',
    name: 'Browser',
    title: 'ブラウザ内部',
    icon: Globe2,
    color: '#b590ff',
    summary: 'HTML/CSS/JSがピクセルになるまでを分解する。',
    lessons: [
      {
        id: 'parser',
        title: 'HTMLパーサ',
        xp: 20,
        concept: 'HTMLはトークン化され、DOMツリーとしてメモリ上の構造になります。',
        visual: ['Bytes', 'Tokens', 'DOM nodes', 'Document'],
        prompt: 'DOMとは何に近い？',
        options: [
          'HTML文書を木構造として表したもの',
          'CPUの命令セットそのもの',
          'ディスクの物理セクタ番号',
        ],
        answer: 0,
        explanation: 'ブラウザはDOMを使って文書構造を扱い、CSSやJSとも連携します。',
      },
      {
        id: 'rendering',
        title: 'レンダリングパイプライン',
        xp: 30,
        concept: 'DOMとCSSOMからレイアウトを計算し、ペイントと合成を経て画面に出します。',
        visual: ['DOM + CSSOM', 'Layout', 'Paint', 'Composite'],
        prompt: 'Layoutフェーズで主に決まるものは？',
        options: [
          '要素の位置とサイズ',
          'TLS証明書の発行者',
          '仮想アドレスのページ番号',
        ],
        answer: 0,
        explanation: 'Layoutではボックスの寸法や配置が計算されます。Paintでは色や影などが描かれます。',
      },
      {
        id: 'event-loop',
        title: 'イベントループ',
        xp: 30,
        concept: 'JavaScriptはタスク、マイクロタスク、レンダリングの順番を意識すると挙動を読みやすくなります。',
        visual: ['Task queue', 'Call stack', 'Microtasks', 'Render'],
        prompt: 'Promiseのthenは一般にどこで処理される？',
        options: ['マイクロタスクキュー', 'ディスクのジャーナル', 'BIOS設定画面'],
        answer: 0,
        explanation: 'Promise反応はマイクロタスクとして扱われ、現在のタスク後に優先して消化されます。',
      },
      {
        id: 'js-engine',
        title: 'JavaScriptエンジン',
        xp: 25,
        concept: 'JSエンジンはソースを解析し、バイトコードやJIT最適化を使って実行します。',
        visual: ['Parse', 'Bytecode', 'JIT', 'Execute'],
        prompt: 'JIT最適化が狙うものは？',
        options: [
          'よく通るコードを実行時情報で速くする',
          'DNSを必ず暗号化する',
          'ファイルシステムを読み取り専用にする',
        ],
        answer: 0,
        explanation: '実行時の型や分岐の傾向を利用して、ホットなコードを機械語へ最適化します。',
      },
      {
        id: 'gpu-composite',
        title: 'GPU合成',
        xp: 25,
        concept: 'ブラウザは一部のレイヤーをGPUで合成し、スクロールやアニメーションを滑らかにします。',
        visual: ['Layer tree', 'Raster', 'GPU texture', 'Composite'],
        prompt: '合成だけで済む更新が軽い理由は？',
        options: [
          'レイアウトやペイントをやり直さず、既存レイヤーを組み合わせられる',
          'HTTP通信が不要になるから',
          'カーネルモードへ入らないから',
        ],
        answer: 0,
        explanation: 'transformやopacity中心の更新は、再レイアウトを避けて合成で処理しやすいです。',
      },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    title: '隔離と安全性',
    icon: ShieldCheck,
    color: '#3dd6a3',
    summary: '権限、サンドボックス、同一オリジンポリシーを学ぶ。',
    lessons: [
      {
        id: 'permission',
        title: '権限とユーザーモード',
        xp: 25,
        concept: 'CPUとOSは特権モードを分け、アプリが危険な命令を直接実行できないようにします。',
        visual: ['User mode', 'Trap', 'Kernel mode', 'Return'],
        prompt: 'ユーザーモードとカーネルモードを分ける理由は？',
        options: [
          'アプリの暴走からシステム全体を守るため',
          '文字を太字にするため',
          'DNS応答を必ず速くするため',
        ],
        answer: 0,
        explanation: '特権操作をカーネルに限定することで、メモリやデバイスを保護します。',
      },
      {
        id: 'browser-sandbox',
        title: 'ブラウザサンドボックス',
        xp: 30,
        concept: 'ブラウザはページやレンダラープロセスを隔離し、Webコンテンツの影響範囲を狭くします。',
        visual: ['Tab', 'Renderer process', 'Sandbox', 'Browser process'],
        prompt: 'ブラウザサンドボックスの狙いは？',
        options: [
          'WebページがOSや他タブへ与える被害を制限する',
          'すべての画像をSVGに変換する',
          'CPUキャッシュを削除する',
        ],
        answer: 0,
        explanation: '不審なページがあっても、権限とプロセス分離で被害を閉じ込めます。',
      },
      {
        id: 'same-origin',
        title: '同一オリジンポリシー',
        xp: 30,
        concept: 'ブラウザはスキーム、ホスト、ポートが異なるページ間の読み取りを制限します。',
        visual: ['https', 'example.com', ':443', 'Allowed?'],
        prompt: '同一オリジンポリシーが守るものは？',
        options: [
          '別サイトの機密データを勝手に読まれないこと',
          'OSのページ置換アルゴリズム',
          'キーボードの配列',
        ],
        answer: 0,
        explanation: 'ログイン済みサイトの情報を、別の悪意あるページが読み取るのを防ぎます。',
      },
      {
        id: 'capability',
        title: 'Capability',
        xp: 25,
        concept: '権限を広く渡すのではなく、必要な操作だけを表す能力として渡すと被害範囲を小さくできます。',
        visual: ['Request', 'Grant token', 'Limited action', 'Audit'],
        prompt: 'Capability設計で重視する考え方は？',
        options: [
          '必要最小限の操作権限だけを渡す',
          'すべての処理をrootで動かす',
          'ブラウザキャッシュを常に無効にする',
        ],
        answer: 0,
        explanation: '小さな権限を渡すほど、漏れたり悪用されたりしたときの被害を狭くできます。',
      },
      {
        id: 'site-isolation',
        title: 'Site Isolation',
        xp: 30,
        concept: 'ブラウザはサイトごとにプロセスを分け、脆弱性があっても別サイトの情報へ届きにくくします。',
        visual: ['Site A', 'Process A', 'Site B', 'Process B'],
        prompt: 'Site Isolationが強めるものは？',
        options: [
          'サイト間のプロセス分離',
          'ディスクの書き込み速度だけ',
          'HTMLのインデント',
        ],
        answer: 0,
        explanation: '同一オリジンポリシーのような論理的制限に加え、プロセス境界でも守ります。',
      },
    ],
  },
]

const LESSONS = TRACKS.flatMap((track) => track.lessons.map((lesson) => ({ ...lesson, trackId: track.id })))

const BUILD_STAGES = [
  {
    id: 'bootable-kernel',
    title: '最小カーネルを起動する',
    area: 'OS',
    requires: ['bios-bootloader', 'boot-memory-map', 'syscall'],
    prompt: '最初に作るべき最小構成は？',
    options: ['ブートローダ、メモリマップ読み取り、最小syscall', 'CSSテーマだけ', 'SNSログインだけ'],
    answer: 0,
    result: '起動できる核ができました。次は割り込みとタスク切り替えでOSらしくします。',
  },
  {
    id: 'multitask-core',
    title: 'タスクを切り替える',
    area: 'OS',
    requires: ['interrupts', 'context-switch', 'scheduler'],
    prompt: '複数タスクを動かすための中心部品は？',
    options: ['タイマー割り込み、コンテキスト保存、スケジューラ', 'HTMLパーサだけ', '画像圧縮だけ'],
    answer: 0,
    result: 'CPU時間を配れるようになりました。OSが一つの処理に固まりにくくなります。',
  },
  {
    id: 'memory-manager',
    title: 'メモリ管理を作る',
    area: 'OS',
    requires: ['virtual-memory', 'heap-stack', 'page-fault'],
    prompt: 'メモリ管理のデモで扱うべき流れは？',
    options: ['仮想アドレス、ヒープ確保、ページフォルト処理', 'DNS問い合わせだけ', 'CSSのhoverだけ'],
    answer: 0,
    result: 'プロセスを隔離しながらメモリを渡せる土台ができました。',
  },
  {
    id: 'storage-stack',
    title: 'ファイルを読めるようにする',
    area: 'OS',
    requires: ['filesystem', 'vfs', 'block-device', 'cache'],
    prompt: 'read("/hello.txt")を通す順番に近いものは？',
    options: ['VFS、ファイルシステム、ページキャッシュ、ブロック層', 'GPU、TLS、DOM、Cookie', 'JIT、CSSOM、DNS、ACK'],
    answer: 0,
    result: 'パスからディスクブロックまでたどる道ができました。',
  },
  {
    id: 'network-browser',
    title: 'URLからHTMLを取る',
    area: 'Browser',
    requires: ['dns', 'socket', 'tcp-tls', 'http-cache'],
    prompt: 'https://example.com を開く最初の流れは？',
    options: ['DNS、TCP/TLS、HTTP、キャッシュ判断', 'ページフォルト、JIT、VFS、Paint', 'UEFI、inode、GPU、Stack'],
    answer: 0,
    result: 'ブラウザがネットワーク越しに文書を取りに行けるようになりました。',
  },
  {
    id: 'render-engine',
    title: 'HTMLを画面にする',
    area: 'Browser',
    requires: ['parser', 'rendering', 'js-engine', 'gpu-composite'],
    prompt: '画面表示の大きな流れとして近いものは？',
    options: ['Parse、DOM/CSSOM、Layout/Paint、Composite', 'syscall、inode、ACK、Trap', 'UEFI、Scheduler、TLS、VFS'],
    answer: 0,
    result: 'HTML/CSS/JSからピクセルまでの簡易レンダラが完成しました。',
  },
  {
    id: 'sandboxed-web',
    title: '安全にWebを動かす',
    area: 'Browser',
    requires: ['permission', 'browser-sandbox', 'same-origin', 'site-isolation'],
    prompt: '危険なページの被害を抑える設計は？',
    options: ['権限分離、サンドボックス、同一オリジン、サイト分離', '全ページをrootで実行', 'キャッシュを永久保存'],
    answer: 0,
    result: 'ブラウザらしい防御層が入り、学習版アーキテクチャが一周しました。',
  },
]

function App() {
  const [activeLessonId, setActiveLessonId] = useState(LESSONS[0].id)
  const [completedLessons, setCompletedLessons] = useState({})
  const [builtStages, setBuiltStages] = useState({})
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedBuildOptions, setSelectedBuildOptions] = useState({})
  const [feedback, setFeedback] = useState('まずは最初のノードを開いて、低レイヤー探検を始めよう。')
  const [buildFeedback, setBuildFeedback] = useState('レッスンをクリアすると、対応するOS/ブラウザ部品を組み立てられるようになります。')
  const [streak, setStreak] = useState(0)

  const activeLesson = LESSONS.find((lesson) => lesson.id === activeLessonId) ?? LESSONS[0]
  const activeTrack = TRACKS.find((track) => track.id === activeLesson.trackId)
  const completedCount = Object.keys(completedLessons).length
  const builtCount = Object.keys(builtStages).length
  const totalXp = useMemo(() => {
    return LESSONS.reduce((sum, lesson) => {
      return completedLessons[lesson.id] ? sum + lesson.xp : sum
    }, 0)
  }, [completedLessons])
  const progress = Math.round((completedCount / LESSONS.length) * 100)
  const activeIndex = LESSONS.findIndex((lesson) => lesson.id === activeLesson.id)
  const isActiveCompleted = Boolean(completedLessons[activeLesson.id])
  const activeBuildStage = BUILD_STAGES.find((stage) => !builtStages[stage.id]) ?? BUILD_STAGES[BUILD_STAGES.length - 1]
  const buildReady = activeBuildStage.requires.every((lessonId) => completedLessons[lessonId])
  const buildProgress = Math.round((builtCount / BUILD_STAGES.length) * 100)

  const selectLesson = (lesson) => {
    setActiveLessonId(lesson.id)
    setSelectedOption(null)
    setFeedback(completedLessons[lesson.id] ? '復習モード。もう一度解いて理解を固めよう。' : '短い概念を読んで、クイズで確認しよう。')
  }

  const answerLesson = (optionIndex) => {
    setSelectedOption(optionIndex)

    if (optionIndex !== activeLesson.answer) {
      setStreak(0)
      setFeedback(`もう一歩。ヒント: ${activeLesson.concept}`)
      return
    }

    setCompletedLessons((prev) => ({ ...prev, [activeLesson.id]: true }))
    setStreak((prev) => prev + 1)
    setFeedback(activeLesson.explanation)
  }

  const goNext = () => {
    const nextLesson = LESSONS[activeIndex + 1] ?? LESSONS[0]
    selectLesson(nextLesson)
  }

  const answerBuildStage = (stage, optionIndex) => {
    setSelectedBuildOptions((prev) => ({ ...prev, [stage.id]: optionIndex }))

    if (!stage.requires.every((lessonId) => completedLessons[lessonId])) {
      setBuildFeedback('まだ材料知識が足りません。左のマップで必要レッスンを先にクリアしよう。')
      return
    }

    if (optionIndex !== stage.answer) {
      setBuildFeedback('惜しいです。実装工程では、依存する部品の順番を意識すると見えてきます。')
      return
    }

    setBuiltStages((prev) => ({ ...prev, [stage.id]: true }))
    setBuildFeedback(stage.result)
  }

  return (
    <main className="app-shell">
      <section className="overview-panel" aria-labelledby="app-title">
        <div className="overview-copy">
          <p className="eyebrow">Low-level quest map</p>
          <h1 id="app-title">OS & Browser Academy</h1>
          <p className="hero-copy">
            OSの起動、メモリ、ファイル、ネットワーク、ブラウザレンダリング、セキュリティを短いレッスンで進める学習ゲーム。
          </p>
        </div>

        <div className="score-board" aria-label="学習ステータス">
          <div>
            <Trophy size={20} />
            <span>XP</span>
            <strong data-testid="total-xp">{totalXp}</strong>
          </div>
          <div>
            <Flame size={20} />
            <span>Streak</span>
            <strong>{streak}</strong>
          </div>
          <div>
            <BookOpenCheck size={20} />
            <span>Lessons</span>
            <strong>
              {completedCount}/{LESSONS.length}
            </strong>
          </div>
          <div>
            <MonitorCog size={20} />
            <span>Build</span>
            <strong>
              {builtCount}/{BUILD_STAGES.length}
            </strong>
          </div>
        </div>

        <div className="progress-shell" aria-label={`全体進捗 ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="builder-panel" aria-labelledby="builder-title">
        <div className="builder-copy">
          <p className="eyebrow">Build mode</p>
          <h2 id="builder-title">ミニOS/ブラウザを組み立てる</h2>
          <p>
            クイズで得た知識を材料にして、実装の順番を選びます。正しい部品を選ぶと、学習用アーキテクチャが少しずつ完成します。
          </p>
        </div>

        <div className="build-meter" aria-label={`ビルド進捗 ${buildProgress}%`}>
          <span style={{ width: `${buildProgress}%` }} />
        </div>

        <div className="build-board">
          <div className="build-stage-card">
            <div className="build-stage-topline">
              <span>{activeBuildStage.area}</span>
              <strong>{builtStages[activeBuildStage.id] ? 'Built' : buildReady ? 'Ready' : 'Locked'}</strong>
            </div>
            <h3>{activeBuildStage.title}</h3>
            <p>{activeBuildStage.prompt}</p>
            <div className="requirement-list">
              {activeBuildStage.requires.map((lessonId) => {
                const lesson = LESSONS.find((item) => item.id === lessonId)
                const done = Boolean(completedLessons[lessonId])
                return (
                  <button
                    className={done ? 'requirement-chip done' : 'requirement-chip'}
                    key={lessonId}
                    type="button"
                    onClick={() => selectLesson(lesson)}
                  >
                    {done ? <BadgeCheck size={15} /> : <Lock size={15} />}
                    {lesson.title}
                  </button>
                )
              })}
            </div>

            <div className="build-options">
              {activeBuildStage.options.map((option, index) => {
                const selected = selectedBuildOptions[activeBuildStage.id] === index
                const isCorrect = activeBuildStage.answer === index
                const reveal = selectedBuildOptions[activeBuildStage.id] !== undefined
                return (
                  <button
                    className={`build-option ${selected ? 'selected' : ''} ${reveal && isCorrect ? 'correct' : ''}`}
                    key={option}
                    type="button"
                    onClick={() => answerBuildStage(activeBuildStage, index)}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="architecture-map" aria-label="完成した部品">
            {BUILD_STAGES.map((stage) => (
              <div className={builtStages[stage.id] ? 'architecture-node built' : 'architecture-node'} key={stage.id}>
                <span>{stage.area}</span>
                <strong>{stage.title}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="feedback-panel compact" role="status" aria-label="ビルドフィードバック">
          <TerminalSquare size={18} />
          <p>{buildFeedback}</p>
        </div>
      </section>

      <section className="learning-layout">
        <aside className="quest-map" aria-label="学習マップ">
          {TRACKS.map((track) => {
            const TrackIcon = track.icon
            return (
              <section className="track-section" key={track.id}>
                <div className="track-header">
                  <span className="track-icon" style={{ '--track-color': track.color }}>
                    <TrackIcon size={18} />
                  </span>
                  <div>
                    <h2>{track.title}</h2>
                    <p>{track.summary}</p>
                  </div>
                </div>

                <div className="lesson-path">
                  {track.lessons.map((lesson) => {
                    const isCompleted = Boolean(completedLessons[lesson.id])
                    const isActive = lesson.id === activeLesson.id
                    return (
                      <button
                        className={`lesson-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                        key={lesson.id}
                        type="button"
                        onClick={() => selectLesson({ ...lesson, trackId: track.id })}
                        aria-pressed={isActive}
                      >
                        <span>{isCompleted ? <BadgeCheck size={18} /> : <Play size={16} />}</span>
                        <strong>{lesson.title}</strong>
                        <small>{lesson.xp} XP</small>
                      </button>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </aside>

        <section className="lesson-panel" aria-labelledby="lesson-title">
          <div className="lesson-topline">
            <span className="lesson-badge" style={{ '--track-color': activeTrack.color }}>
              <Sparkles size={16} />
              {activeTrack.title}
            </span>
            <span className="lesson-count">
              {activeIndex + 1} / {LESSONS.length}
            </span>
          </div>

          <h2 id="lesson-title">{activeLesson.title}</h2>
          <p className="concept-copy">{activeLesson.concept}</p>

          <div className="lab-visual" aria-label="概念の流れ">
            {activeLesson.visual.map((step, index) => (
              <div className="lab-step" key={step}>
                <span className="step-number">{index + 1}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>

          <div className="quiz-card">
            <div className="quiz-heading">
              <BrainCircuit size={20} />
              <h3>{activeLesson.prompt}</h3>
            </div>

            <div className="option-list">
              {activeLesson.options.map((option, index) => {
                const wasSelected = selectedOption === index
                const isCorrect = activeLesson.answer === index
                const reveal = selectedOption !== null
                return (
                  <button
                    className={`option-button ${wasSelected ? 'selected' : ''} ${reveal && isCorrect ? 'correct' : ''} ${
                      reveal && wasSelected && !isCorrect ? 'wrong' : ''
                    }`}
                    key={option}
                    type="button"
                    onClick={() => answerLesson(index)}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    {option}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="feedback-panel" role="status" aria-label="レッスンフィードバック">
            <TerminalSquare size={18} />
            <p>{feedback}</p>
          </div>

          <div className="lesson-actions">
            <button className="primary-button" type="button" onClick={goNext}>
              次のレッスンへ
            </button>
            <span className={isActiveCompleted ? 'complete-note done' : 'complete-note'}>
              {isActiveCompleted ? <BadgeCheck size={16} /> : <Lock size={16} />}
              {isActiveCompleted ? 'クリア済み' : '正解するとXP獲得'}
            </span>
          </div>
        </section>
      </section>

      <section className="codex-console" aria-label="学べる領域">
        <div>
          <Binary size={18} />
          <span>CPU / syscall / interrupt</span>
        </div>
        <div>
          <Database size={18} />
          <span>cache / filesystem / journaling</span>
        </div>
        <div>
          <Layers3 size={18} />
          <span>DOM / layout / paint / event loop</span>
        </div>
        <div>
          <FileCode2 size={18} />
          <span>DNS / TLS / HTTP cache / sandbox</span>
        </div>
        <div>
          <MonitorCog size={18} />
          <span>low-level mental models</span>
        </div>
      </section>
    </main>
  )
}

export default App

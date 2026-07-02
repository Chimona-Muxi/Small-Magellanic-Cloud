const LANGUAGE_KEY = "smc-language";
const THEME_KEY = "smc-theme";

export const languages = [
  { value: "zh-CN", label: "简体中文", htmlLang: "zh-CN" },
  { value: "zh-TW", label: "繁體中文", htmlLang: "zh-Hant" },
  { value: "en", label: "English", htmlLang: "en" },
  { value: "fr", label: "Français", htmlLang: "fr" },
  { value: "ja", label: "日本語", htmlLang: "ja" },
  { value: "ko", label: "한국어", htmlLang: "ko" },
  { value: "ru", label: "Русский", htmlLang: "ru" }
];

const languageSet = new Set(languages.map((item) => item.value));

const copy = {
  "nav.home": {
    "zh-CN": "主页",
    "zh-TW": "首頁",
    en: "Home",
    fr: "Accueil",
    ja: "ホーム",
    ko: "홈",
    ru: "Главная"
  },
  "nav.game": {
    "zh-CN": "游戏",
    "zh-TW": "遊戲",
    en: "Game",
    fr: "Jeux",
    ja: "ゲーム",
    ko: "게임",
    ru: "Игры"
  },
  "nav.study": {
    "zh-CN": "学习工具",
    "zh-TW": "學習工具",
    en: "Study Tools",
    fr: "Outils d'etude",
    ja: "学習ツール",
    ko: "학습 도구",
    ru: "Учебные инструменты"
  },
  "nav.board": {
    "zh-CN": "棋类",
    "zh-TW": "棋類",
    en: "Board Games",
    fr: "Jeux de plateau",
    ja: "ボードゲーム",
    ko: "보드게임",
    ru: "Настольные игры"
  },
  "site.subtitle": {
    "zh-CN": "个人网站",
    "zh-TW": "個人網站",
    en: "personal systems",
    fr: "site personnel",
    ja: "個人サイト",
    ko: "개인 사이트",
    ru: "личный сайт"
  },
  "home.eyebrow": {
    "zh-CN": "私人网站",
    "zh-TW": "私人網站",
    en: "private site",
    fr: "site prive",
    ja: "個人サイト",
    ko: "개인 사이트",
    ru: "личный сайт"
  },
  "home.copy": {
    "zh-CN": "张墨霖的私人网站，用于日常生活、学习，欢迎参观。",
    "zh-TW": "張墨霖的私人網站，用於日常生活、學習，歡迎參觀。",
    en: "Zhang Molin's personal website for daily life and study. Welcome.",
    fr: "Le site personnel de Zhang Molin, pour la vie quotidienne et les etudes. Bienvenue.",
    ja: "張墨霖の個人サイトです。日常生活と学習のために使っています。ようこそ。",
    ko: "장모린의 개인 웹사이트입니다. 일상과 학습을 위해 만들었습니다. 환영합니다.",
    ru: "Личный сайт Чжан Молиня для повседневной жизни и учебы. Добро пожаловать."
  },
  "home.modules.title": {
    "zh-CN": "我的公开创作作品",
    "zh-TW": "我的公開創作作品",
    en: "My Public Works",
    fr: "Mes creations publiques",
    ja: "公開している制作物",
    ko: "나의 공개 창작물",
    ru: "Мои открытые работы"
  },
  "home.modules.copy": {
    "zh-CN": "网站存放了我认为有一定价值的项目，包括游戏、学习工具、资源库等等。",
    "zh-TW": "網站存放了我認為有一定價值的項目，包括遊戲、學習工具、資源庫等等。",
    en: "This site keeps projects I find valuable, including games, study tools, resource libraries and more.",
    fr: "Ce site rassemble des projets que je trouve utiles, dont des jeux, outils d'etude et ressources.",
    ja: "このサイトには、ゲーム、学習ツール、資料庫など、価値があると思うプロジェクトを置いています。",
    ko: "이 사이트에는 게임, 학습 도구, 자료 모음 등 가치 있다고 생각하는 프로젝트를 둡니다.",
    ru: "Здесь собраны проекты, которые я считаю полезными: игры, учебные инструменты, библиотеки ресурсов и другое."
  },
  "module.game.title": {
    "zh-CN": "游戏",
    "zh-TW": "遊戲",
    en: "Game",
    fr: "Jeux",
    ja: "ゲーム",
    ko: "게임",
    ru: "Игры"
  },
  "module.game.copy": {
    "zh-CN": "棋类与互动游戏的集合，目前先收纳棋类模块。",
    "zh-TW": "棋類與互動遊戲的集合，目前先收納棋類模組。",
    en: "A collection of board and interactive games. Board comes first.",
    fr: "Jeux de plateau et jeux interactifs, avec board pour commencer.",
    ja: "ボードゲームとインタラクティブゲームの集合です。まず board から。",
    ko: "보드게임과 인터랙티브 게임 모음입니다. 우선 board부터 시작합니다.",
    ru: "Коллекция настольных и интерактивных игр. Сначала модуль board."
  },
  "module.study.title": {
    "zh-CN": "学习工具",
    "zh-TW": "學習工具",
    en: "Study Tools",
    fr: "Outils d'etude",
    ja: "学習ツール",
    ko: "학습 도구",
    ru: "Учебные инструменты"
  },
  "module.study.copy": {
    "zh-CN": "p-adic 转换、终端工具和后续学习实验会收纳在这里。",
    "zh-TW": "p-adic 轉換、終端工具和後續學習實驗會收納在這裡。",
    en: "p-adic conversion, terminal tools and future study experiments live here.",
    fr: "Conversion p-adic, outils terminal et futurs essais d'etude vivent ici.",
    ja: "p-adic 変換、端末ツール、今後の学習実験をここに置きます。",
    ko: "p-adic 변환, 터미널 도구, 앞으로의 학습 실험을 여기에 둡니다.",
    ru: "Здесь будут p-adic преобразования, терминальные инструменты и учебные опыты."
  },
  "study.copy": {
    "zh-CN": "把可直接使用的小工具放在这里：能下载，也能在浏览器里先试一试。",
    "zh-TW": "把可直接使用的小工具放在這裡：能下載，也能在瀏覽器裡先試一試。",
    en: "Small usable tools live here: downloadable, and often tryable in the browser.",
    fr: "De petits outils utilisables: a telecharger ou a essayer dans le navigateur.",
    ja: "すぐ使える小さなツールを置きます。ダウンロードもブラウザ試用もできます。",
    ko: "바로 쓸 수 있는 작은 도구를 둡니다. 다운로드하거나 브라우저에서 먼저 써볼 수 있습니다.",
    ru: "Небольшие готовые инструменты: скачать или попробовать прямо в браузере."
  },
  "study.padic.title": {
    "zh-CN": "p-adic Converter",
    "zh-TW": "p-adic Converter",
    en: "p-adic Converter",
    fr: "p-adic Converter",
    ja: "p-adic Converter",
    ko: "p-adic Converter",
    ru: "p-adic Converter"
  },
  "study.padic.copy": {
    "zh-CN": "下载终端版安装器，或直接使用网页版 p-adic 有理数转换。",
    "zh-TW": "下載終端版安裝器，或直接使用網頁版 p-adic 有理數轉換。",
    en: "Download the terminal installer, or use the web p-adic rational converter.",
    fr: "Telechargez l'installateur terminal ou utilisez le convertisseur web.",
    ja: "端末版インストーラを入手するか、Web 版 p-adic 有理数変換を使えます。",
    ko: "터미널 설치기를 받거나 웹 p-adic 유리수 변환기를 바로 사용합니다.",
    ru: "Скачайте терминальный установщик или используйте веб-конвертер."
  },
  "padic.copy": {
    "zh-CN": "选择终端安装器，或打开无需安装的网页版转换器。终端版安装器使用 p-adic 仓库的 main2.0 分支。",
    "zh-TW": "選擇終端安裝器，或打開無需安裝的網頁版轉換器。終端版安裝器使用 p-adic 倉庫的 main2.0 分支。",
    en: "Choose a terminal installer or open the no-install web converter. Installers use the p-adic main2.0 branch.",
    fr: "Choisissez l'installateur terminal ou le convertisseur web sans installation. Les installateurs utilisent main2.0.",
    ja: "端末インストーラか、インストール不要の Web 変換器を選べます。インストーラは main2.0 を使います。",
    ko: "터미널 설치기 또는 설치 없는 웹 변환기를 선택합니다. 설치기는 main2.0 브랜치를 사용합니다.",
    ru: "Выберите установщик или веб-конвертер без установки. Установщики используют ветку main2.0."
  },
  "padic.download.title": {
    "zh-CN": "下载安装器",
    "zh-TW": "下載安裝器",
    en: "Download Installers",
    fr: "Telechargements",
    ja: "インストーラ",
    ko: "설치기 다운로드",
    ru: "Установщики"
  },
  "padic.download.copy": {
    "zh-CN": "选择 Linux、macOS 或 Windows，下载后打开对应文件完成安装。",
    "zh-TW": "選擇 Linux、macOS 或 Windows，下載後打開對應檔案完成安裝。",
    en: "Choose Linux, macOS or Windows, then open the downloaded file to install.",
    fr: "Choisissez Linux, macOS ou Windows, puis ouvrez le fichier telecharge.",
    ja: "Linux、macOS、Windows を選び、ダウンロードしたファイルを開いてインストールします。",
    ko: "Linux, macOS, Windows 중 선택하고 내려받은 파일을 열어 설치합니다.",
    ru: "Выберите Linux, macOS или Windows и откройте скачанный файл."
  },
  "padic.download.pageCopy": {
    "zh-CN": "选择你的系统。安装器会先清理旧版本，再安装 main2.0 版本。",
    "zh-TW": "選擇你的系統。安裝器會先清理舊版本，再安裝 main2.0 版本。",
    en: "Choose your system. The installer removes old files first, then installs main2.0.",
    fr: "Choisissez votre systeme. L'installateur retire l'ancienne version puis installe main2.0.",
    ja: "システムを選んでください。古いファイルを削除してから main2.0 をインストールします。",
    ko: "시스템을 선택하세요. 설치기가 이전 파일을 먼저 정리한 뒤 main2.0을 설치합니다.",
    ru: "Выберите систему. Установщик удалит старые файлы и установит main2.0."
  },
  "padic.web.title": {
    "zh-CN": "网页版转换",
    "zh-TW": "網頁版轉換",
    en: "Web Converter",
    fr: "Convertisseur web",
    ja: "Web 変換",
    ko: "웹 변환",
    ru: "Веб-конвертер"
  },
  "padic.web.copy": {
    "zh-CN": "输入表达式和素数 p，在浏览器里生成 p-adic 展开，并可输入 help 查看完整指令。",
    "zh-TW": "輸入表達式和質數 p，在瀏覽器裡生成 p-adic 展開，並可輸入 help 查看完整指令。",
    en: "Enter an expression and prime p to generate a p-adic expansion in the browser. Type help for commands.",
    fr: "Entrez une expression et un nombre premier p. Tapez help pour les commandes.",
    ja: "式と素数 p を入力してブラウザで p-adic 展開を作ります。help で説明を表示します。",
    ko: "표현식과 소수 p를 입력해 브라우저에서 p-adic 전개를 만듭니다. help로 명령을 봅니다.",
    ru: "Введите выражение и простое p, чтобы получить p-adic разложение. help покажет команды."
  },
  "module.lab.title": {
    "zh-CN": "实验室",
    "zh-TW": "實驗室",
    en: "Lab",
    fr: "Labo",
    ja: "ラボ",
    ko: "랩",
    ru: "Лаборатория"
  },
  "module.lab.copy": {
    "zh-CN": "用于保存阶段性作品、算法实验和可复用组件。",
    "zh-TW": "用於保存階段性作品、演算法實驗和可復用元件。",
    en: "A place for drafts, algorithm experiments and reusable components.",
    fr: "Un espace pour les travaux en cours, algorithmes et composants.",
    ja: "途中成果、アルゴリズム実験、再利用部品を保存する場所です。",
    ko: "단계별 작업물, 알고리즘 실험, 재사용 컴포넌트를 모으는 곳입니다.",
    ru: "Место для черновиков, алгоритмов и переиспользуемых компонентов."
  },
  "game.copy": {
    "zh-CN": "互动游戏会按类型收纳。当前启用的是棋类，后续可以继续加入策略、谜题、物理模拟或其他实验。",
    "zh-TW": "互動遊戲會按類型收納。當前啟用的是棋類，後續可以繼續加入策略、謎題、物理模擬或其他實驗。",
    en: "Interactive games are grouped by type. Board is active first; strategy, puzzle and other experiments can follow.",
    fr: "Les jeux interactifs sont classes par type. Board est actif en premier.",
    ja: "インタラクティブゲームを種類別に整理します。まず board を公開しています。",
    ko: "인터랙티브 게임을 유형별로 정리합니다. 지금은 board가 먼저 열려 있습니다.",
    ru: "Игры сгруппированы по типам. Сначала открыт раздел board."
  },
  "board.title": {
    "zh-CN": "棋类",
    "zh-TW": "棋類",
    en: "Board Games",
    fr: "Jeux de plateau",
    ja: "ボードゲーム",
    ko: "보드게임",
    ru: "Настольные игры"
  },
  "board.copy": {
    "zh-CN": "目前的棋类项目以发布版方式收纳在这里，开发仍保留在各自原仓库中。",
    "zh-TW": "目前的棋類項目以發布版方式收納在這裡，開發仍保留在各自原倉庫中。",
    en: "Released board games live here while development stays in their original repositories.",
    fr: "Les versions publiees des jeux sont ici; le developpement reste dans les depots d'origine.",
    ja: "公開版のボードゲームをここにまとめ、開発は各リポジトリに残します。",
    ko: "공개된 보드게임은 여기에 모으고, 개발은 각 원본 저장소에 둡니다.",
    ru: "Опубликованные версии игр здесь, разработка остается в исходных репозиториях."
  },
  "game.board.copy": {
    "zh-CN": "路墙棋、西洋跳棋、土耳其跳棋已经整理到同一个棋类模块。",
    "zh-TW": "路牆棋、西洋跳棋、土耳其跳棋已整理到同一個棋類模組。",
    en: "Wall Road Chess, Checkers and Turkish Draughts are collected in one board module.",
    fr: "Wall Road Chess, les dames et les dames turques sont reunis dans un meme module.",
    ja: "路墙棋、西洋跳棋、土耳其跳棋を同じ board モジュールにまとめています。",
    ko: "루창치, 서양 체커, 터키 체커를 하나의 board 모듈에 모았습니다.",
    ru: "Wall Road Chess, шашки и турецкие шашки собраны в одном модуле."
  },
  "board.luqiangqi.title": {
    "zh-CN": "墙路棋",
    "zh-TW": "牆路棋",
    en: "Wall Road Chess",
    fr: "Wall Road Chess",
    ja: "墙路棋",
    ko: "루창치",
    ru: "Wall Road Chess"
  },
  "board.luqiangqi.copy": {
    "zh-CN": "以通路、围堵和空间压迫为核心，适合慢慢读局。",
    "zh-TW": "以通路、圍堵和空間壓迫為核心，適合慢慢讀局。",
    en: "A spatial duel about routes, walls and pressure.",
    fr: "Un duel spatial de routes, murs et pression.",
    ja: "経路、壁、空間圧力を読む戦略ゲームです。",
    ko: "길, 벽, 공간 압박을 읽는 전략 게임입니다.",
    ru: "Позиционная дуэль маршрутов, стен и давления."
  },
  "board.xiyangtiaoqi.title": {
    "zh-CN": "西洋跳棋",
    "zh-TW": "西洋跳棋",
    en: "Checkers",
    fr: "Dames",
    ja: "チェッカー",
    ko: "체커",
    ru: "Шашки"
  },
  "board.xiyangtiaoqi.copy": {
    "zh-CN": "强制吃子与连跳让每一步都带着交换计算。",
    "zh-TW": "強制吃子與連跳讓每一步都帶著交換計算。",
    en: "Forced captures and chains turn every move into an exchange puzzle.",
    fr: "Prises forcees et enchainements rendent chaque coup tactique.",
    ja: "必須捕獲と連跳で、すべての手が交換計算になります。",
    ko: "강제 포획과 연속 점프로 매 수가 교환 계산이 됩니다.",
    ru: "Обязательный бой и серии делают каждый ход расчетом обменов."
  },
  "board.tuerqitiaoqi.title": {
    "zh-CN": "土耳其跳棋",
    "zh-TW": "土耳其跳棋",
    en: "Turkish Draughts",
    fr: "Dames turques",
    ja: "トルコ式チェッカー",
    ko: "터키 체커",
    ru: "Турецкие шашки"
  },
  "board.tuerqitiaoqi.copy": {
    "zh-CN": "横纵移动、最大吃子和长王路线带来更开阔的战术。",
    "zh-TW": "橫縱移動、最大吃子和長王路線帶來更開闊的戰術。",
    en: "Orthogonal movement and long kings create a wide tactical field.",
    fr: "Mouvements orthogonaux et dames longues ouvrent le jeu tactique.",
    ja: "縦横移動と長い王で、戦術の幅が大きく広がります。",
    ko: "가로세로 이동과 긴 왕이 넓은 전술 공간을 만듭니다.",
    ru: "Ходы по вертикали и горизонтали дают более широкую тактику."
  },
  "footer.built": {
    "zh-CN": "一个持续生长的个人网站。",
    "zh-TW": "一個持續生長的個人網站。",
    en: "Built as a growing personal site.",
    fr: "Un site personnel en evolution.",
    ja: "育っていく個人サイトです。",
    ko: "계속 자라는 개인 사이트입니다.",
    ru: "Личный сайт, который постепенно растет."
  },
  "common.mode.ai": {
    "zh-CN": "人机",
    "zh-TW": "人機",
    en: "AI",
    fr: "IA",
    ja: "AI",
    ko: "AI",
    ru: "AI"
  },
  "common.mode.local": {
    "zh-CN": "同屏",
    "zh-TW": "同屏",
    en: "Local",
    fr: "Local",
    ja: "同画面",
    ko: "같은 화면",
    ru: "Локально"
  },
  "common.mode.online": {
    "zh-CN": "联机",
    "zh-TW": "聯機",
    en: "Online",
    fr: "En ligne",
    ja: "オンライン",
    ko: "온라인",
    ru: "Онлайн"
  },
  "common.caption.ai": {
    "zh-CN": "人机对弈",
    "zh-TW": "人機對弈",
    en: "Play AI",
    fr: "Jouer contre l'IA",
    ja: "AI対局",
    ko: "AI 대국",
    ru: "Игра с AI"
  },
  "common.caption.local": {
    "zh-CN": "同屏对战",
    "zh-TW": "同屏對戰",
    en: "Local match",
    fr: "Partie locale",
    ja: "同画面对局",
    ko: "같은 화면 대국",
    ru: "Локальная игра"
  },
  "common.caption.online": {
    "zh-CN": "房间联机",
    "zh-TW": "房間聯機",
    en: "Online room",
    fr: "Salon en ligne",
    ja: "オンライン部屋",
    ko: "온라인 방",
    ru: "Онлайн-комната"
  },
  "common.language": {
    "zh-CN": "语言",
    "zh-TW": "語言",
    en: "Language",
    fr: "Langue",
    ja: "言語",
    ko: "언어",
    ru: "Язык"
  },
  "settings.label": {
    "zh-CN": "设置",
    "zh-TW": "設定",
    en: "Settings",
    fr: "Reglages",
    ja: "設定",
    ko: "설정",
    ru: "Настройки"
  },
  "settings.language": {
    "zh-CN": "语言：",
    "zh-TW": "語言：",
    en: "Language:",
    fr: "Langue :",
    ja: "言語：",
    ko: "언어:",
    ru: "Язык:"
  },
  "settings.appearance": {
    "zh-CN": "外观：",
    "zh-TW": "外觀：",
    en: "Appearance:",
    fr: "Apparence :",
    ja: "外観：",
    ko: "화면:",
    ru: "Вид:"
  },
  "settings.back": {
    "zh-CN": "返回",
    "zh-TW": "返回",
    en: "Back",
    fr: "Retour",
    ja: "戻る",
    ko: "뒤로",
    ru: "Назад"
  },
  "common.aiStrength": {
    "zh-CN": "AI 强度",
    "zh-TW": "AI 強度",
    en: "AI strength",
    fr: "Niveau IA",
    ja: "AIの強さ",
    ko: "AI 난이도",
    ru: "Сила AI"
  },
  "difficulty.easy": {
    "zh-CN": "轻松",
    "zh-TW": "輕鬆",
    en: "Easy",
    fr: "Souple",
    ja: "やさしい",
    ko: "쉬움",
    ru: "Легко"
  },
  "difficulty.steady": {
    "zh-CN": "稳健",
    "zh-TW": "穩健",
    en: "Steady",
    fr: "Stable",
    ja: "安定",
    ko: "안정",
    ru: "Надежно"
  },
  "difficulty.hard": {
    "zh-CN": "强手",
    "zh-TW": "強手",
    en: "Strong",
    fr: "Fort",
    ja: "強い",
    ko: "강함",
    ru: "Сильно"
  },
  "common.newGame": {
    "zh-CN": "新开一局",
    "zh-TW": "新開一局",
    en: "New game",
    fr: "Nouvelle partie",
    ja: "新しい対局",
    ko: "새 게임",
    ru: "Новая игра"
  },
  "common.nickname": {
    "zh-CN": "昵称",
    "zh-TW": "暱稱",
    en: "Name",
    fr: "Nom",
    ja: "名前",
    ko: "이름",
    ru: "Имя"
  },
  "common.createRoom": {
    "zh-CN": "创建房间",
    "zh-TW": "建立房間",
    en: "Create room",
    fr: "Creer un salon",
    ja: "部屋を作成",
    ko: "방 만들기",
    ru: "Создать комнату"
  },
  "common.joinRoom": {
    "zh-CN": "加入房间",
    "zh-TW": "加入房間",
    en: "Join room",
    fr: "Rejoindre",
    ja: "部屋に参加",
    ko: "방 참가",
    ru: "Войти"
  },
  "common.enterRoom": {
    "zh-CN": "进入房间",
    "zh-TW": "進入房間",
    en: "Enter room",
    fr: "Entrer",
    ja: "入室",
    ko: "입장",
    ru: "Войти"
  },
  "common.back": {
    "zh-CN": "返回",
    "zh-TW": "返回",
    en: "Back",
    fr: "Retour",
    ja: "戻る",
    ko: "뒤로",
    ru: "Назад"
  },
  "common.room": {
    "zh-CN": "房间",
    "zh-TW": "房間",
    en: "Room",
    fr: "Salon",
    ja: "部屋",
    ko: "방",
    ru: "Комната"
  },
  "common.roomCode": {
    "zh-CN": "房间码",
    "zh-TW": "房間碼",
    en: "Room code",
    fr: "Code du salon",
    ja: "部屋コード",
    ko: "방 코드",
    ru: "Код комнаты"
  },
  "common.namePlaceholder": {
    "zh-CN": "我的名字",
    "zh-TW": "我的名字",
    en: "My name",
    fr: "Mon nom",
    ja: "名前",
    ko: "내 이름",
    ru: "Мое имя"
  },
  "common.roomPlaceholder": {
    "zh-CN": "ABCDE",
    "zh-TW": "ABCDE",
    en: "ABCDE",
    fr: "ABCDE",
    ja: "ABCDE",
    ko: "ABCDE",
    ru: "ABCDE"
  },
  "common.roomPlayers": {
    "zh-CN": "房间人数",
    "zh-TW": "房間人數",
    en: "Players",
    fr: "Joueurs",
    ja: "人数",
    ko: "인원",
    ru: "Игроки"
  },
  "common.waitingPlayers": {
    "zh-CN": "等待玩家",
    "zh-TW": "等待玩家",
    en: "Waiting for players",
    fr: "En attente",
    ja: "待機中",
    ko: "대기 중",
    ru: "Ожидание игроков"
  },
  "common.copy": {
    "zh-CN": "复制",
    "zh-TW": "複製",
    en: "Copy",
    fr: "Copier",
    ja: "コピー",
    ko: "복사",
    ru: "Копировать"
  },
  "common.leaveRoom": {
    "zh-CN": "离开房间",
    "zh-TW": "離開房間",
    en: "Leave room",
    fr: "Quitter",
    ja: "退出",
    ko: "나가기",
    ru: "Выйти"
  },
  "common.record": {
    "zh-CN": "记录",
    "zh-TW": "記錄",
    en: "Log",
    fr: "Journal",
    ja: "記録",
    ko: "기록",
    ru: "Журнал"
  },
  "common.move": {
    "zh-CN": "移动",
    "zh-TW": "移動",
    en: "Move",
    fr: "Deplacer",
    ja: "移動",
    ko: "이동",
    ru: "Ход"
  },
  "luqiangqi.hwall": {
    "zh-CN": "横墙",
    "zh-TW": "橫牆",
    en: "Horizontal",
    fr: "Mur horiz.",
    ja: "横壁",
    ko: "가로 벽",
    ru: "Гориз."
  },
  "luqiangqi.vwall": {
    "zh-CN": "竖墙",
    "zh-TW": "豎牆",
    en: "Vertical",
    fr: "Mur vert.",
    ja: "縦壁",
    ko: "세로 벽",
    ru: "Верт."
  },
  "luqiangqi.shortest": {
    "zh-CN": "最短路",
    "zh-TW": "最短路",
    en: "Shortest",
    fr: "Chemin",
    ja: "最短路",
    ko: "최단 경로",
    ru: "Кратчайший"
  },
  "luqiangqi.wallsLeft": {
    "zh-CN": "余墙",
    "zh-TW": "剩牆",
    en: "Walls",
    fr: "Murs",
    ja: "残壁",
    ko: "남은 벽",
    ru: "Стены"
  },
  "common.mustCapture": {
    "zh-CN": "必须吃子",
    "zh-TW": "必須吃子",
    en: "Must capture",
    fr: "Prise forcee",
    ja: "必須捕獲",
    ko: "강제 포획",
    ru: "Бой обязателен"
  },
  "common.maxCapture": {
    "zh-CN": "最多吃子",
    "zh-TW": "最多吃子",
    en: "Max capture",
    fr: "Prise max",
    ja: "最大捕獲",
    ko: "최대 포획",
    ru: "Макс. бой"
  },
  "common.chain": {
    "zh-CN": "连吃",
    "zh-TW": "連吃",
    en: "Chain",
    fr: "Suite",
    ja: "連続",
    ko: "연속",
    ru: "Серия"
  },
  "common.king": {
    "zh-CN": "升王",
    "zh-TW": "升王",
    en: "King",
    fr: "Dame",
    ja: "成王",
    ko: "왕",
    ru: "Дамка"
  },
  "luqiangqi.title": {
    "zh-CN": "墙路棋",
    "zh-TW": "牆路棋",
    en: "Wall Road Chess",
    fr: "Wall Road Chess",
    ja: "墙路棋",
    ko: "루창치",
    ru: "Wall Road Chess"
  },
  "xiyangtiaoqi.title": {
    "zh-CN": "西洋跳棋",
    "zh-TW": "西洋跳棋",
    en: "Checkers",
    fr: "Dames",
    ja: "チェッカー",
    ko: "체커",
    ru: "Шашки"
  },
  "tuerqitiaoqi.title": {
    "zh-CN": "土耳其跳棋",
    "zh-TW": "土耳其跳棋",
    en: "Turkish Draughts",
    fr: "Dames turques",
    ja: "トルコ式チェッカー",
    ko: "터키 체커",
    ru: "Турецкие шашки"
  },
  "theme.dark": {
    "zh-CN": "深色",
    "zh-TW": "深色",
    en: "Dark",
    fr: "Sombre",
    ja: "Dark",
    ko: "Dark",
    ru: "Dark"
  },
  "theme.light": {
    "zh-CN": "浅色",
    "zh-TW": "淺色",
    en: "Light",
    fr: "Clair",
    ja: "Light",
    ko: "Light",
    ru: "Light"
  },
  "theme.toDark": {
    "zh-CN": "切换到深色模式",
    "zh-TW": "切換到深色模式",
    en: "Switch to dark mode",
    fr: "Passer en mode sombre",
    ja: "ダークモードに切り替え",
    ko: "다크 모드로 전환",
    ru: "Переключить на темный режим"
  },
  "theme.toLight": {
    "zh-CN": "切换到浅色模式",
    "zh-TW": "切換到淺色模式",
    en: "Switch to light mode",
    fr: "Passer en mode clair",
    ja: "ライトモードに切り替え",
    ko: "라이트 모드로 전환",
    ru: "Переключить на светлый режим"
  },
  "export.label": {
    "zh-CN": "导出",
    "zh-TW": "匯出",
    en: "Export",
    fr: "Exporter",
    ja: "書き出し",
    ko: "내보내기",
    ru: "Экспорт"
  },
  "export.asPdf": {
    "zh-CN": "导出为 PDF",
    "zh-TW": "匯出為 PDF",
    en: "Export as PDF",
    fr: "Exporter en PDF",
    ja: "PDFで書き出し",
    ko: "PDF로 내보내기",
    ru: "Экспорт в PDF"
  },
  "export.asRecord": {
    "zh-CN": "导出为棋谱",
    "zh-TW": "匯出為棋譜",
    en: "Export notation",
    fr: "Exporter la notation",
    ja: "棋譜を書き出し",
    ko: "기보로 내보내기",
    ru: "Экспорт записи"
  },
  "export.pdf": {
    "zh-CN": "PDF",
    "zh-TW": "PDF",
    en: "PDF",
    fr: "PDF",
    ja: "PDF",
    ko: "PDF",
    ru: "PDF"
  },
  "export.record": {
    "zh-CN": "棋谱",
    "zh-TW": "棋譜",
    en: "Record",
    fr: "Notation",
    ja: "棋譜",
    ko: "기보",
    ru: "Запись"
  },
  "export.empty": {
    "zh-CN": "暂无记录",
    "zh-TW": "暫無記錄",
    en: "No moves yet",
    fr: "Aucun coup",
    ja: "まだ記録がありません",
    ko: "아직 기록이 없습니다",
    ru: "Ходов пока нет"
  },
  "export.saved": {
    "zh-CN": "已导出棋谱",
    "zh-TW": "已匯出棋譜",
    en: "Record exported",
    fr: "Notation exportee",
    ja: "棋譜を書き出しました",
    ko: "기보를 내보냈습니다",
    ru: "Запись экспортирована"
  },
  "export.popupBlocked": {
    "zh-CN": "浏览器拦截了 PDF 窗口",
    "zh-TW": "瀏覽器攔截了 PDF 視窗",
    en: "The PDF window was blocked",
    fr: "La fenetre PDF a ete bloquee",
    ja: "PDFウィンドウがブロックされました",
    ko: "PDF 창이 차단되었습니다",
    ru: "Окно PDF заблокировано"
  },
  "player.you": {
    "zh-CN": "你",
    "zh-TW": "你",
    en: "You",
    fr: "Vous",
    ja: "あなた",
    ko: "나",
    ru: "Вы"
  },
  "player.ai": {
    "zh-CN": "AI",
    "zh-TW": "AI",
    en: "AI",
    fr: "IA",
    ja: "AI",
    ko: "AI",
    ru: "AI"
  },
  "player.one": {
    "zh-CN": "玩家 1",
    "zh-TW": "玩家 1",
    en: "Player 1",
    fr: "Joueur 1",
    ja: "プレイヤー 1",
    ko: "플레이어 1",
    ru: "Игрок 1"
  },
  "player.two": {
    "zh-CN": "玩家 2",
    "zh-TW": "玩家 2",
    en: "Player 2",
    fr: "Joueur 2",
    ja: "プレイヤー 2",
    ko: "플레이어 2",
    ru: "Игрок 2"
  },
  "player.black": {
    "zh-CN": "墨方",
    "zh-TW": "墨方",
    en: "Black",
    fr: "Noirs",
    ja: "黒方",
    ko: "흑",
    ru: "Черные"
  },
  "player.red": {
    "zh-CN": "朱方",
    "zh-TW": "朱方",
    en: "Red",
    fr: "Rouges",
    ja: "赤方",
    ko: "적",
    ru: "Красные"
  },
  "player.south": {
    "zh-CN": "南方",
    "zh-TW": "南方",
    en: "South",
    fr: "Sud",
    ja: "南方",
    ko: "남쪽",
    ru: "Юг"
  },
  "player.north": {
    "zh-CN": "北方",
    "zh-TW": "北方",
    en: "North",
    fr: "Nord",
    ja: "北方",
    ko: "북쪽",
    ru: "Север"
  },
  "status.gameOver": {
    "zh-CN": "对局已结束",
    "zh-TW": "對局已結束",
    en: "Game over",
    fr: "Partie terminee",
    ja: "対局終了",
    ko: "대국 종료",
    ru: "Игра окончена"
  },
  "status.final": {
    "zh-CN": "终局",
    "zh-TW": "終局",
    en: "Final",
    fr: "Fin",
    ja: "終局",
    ko: "종국",
    ru: "Финал"
  },
  "status.round": {
    "zh-CN": "第 {turn} 手",
    "zh-TW": "第 {turn} 手",
    en: "Move {turn}",
    fr: "Coup {turn}",
    ja: "{turn} 手目",
    ko: "{turn}수",
    ru: "Ход {turn}"
  },
  "status.turn": {
    "zh-CN": "轮到 {name}",
    "zh-TW": "輪到 {name}",
    en: "{name}'s turn",
    fr: "A {name}",
    ja: "{name} の番",
    ko: "{name} 차례",
    ru: "Ход: {name}"
  },
  "status.win": {
    "zh-CN": "{name} 获胜",
    "zh-TW": "{name} 獲勝",
    en: "{name} wins",
    fr: "{name} gagne",
    ja: "{name} 勝利",
    ko: "{name} 승리",
    ru: "{name} победил"
  },
  "status.aiThinking": {
    "zh-CN": "AI 思考中",
    "zh-TW": "AI 思考中",
    en: "AI thinking",
    fr: "IA reflechit",
    ja: "AI 考慮中",
    ko: "AI 생각 중",
    ru: "AI думает"
  },
  "status.waitingSeat": {
    "zh-CN": "等待对手入座",
    "zh-TW": "等待對手入座",
    en: "Waiting for opponent",
    fr: "En attente de l'adversaire",
    ja: "相手を待っています",
    ko: "상대 대기 중",
    ru: "Ожидание соперника"
  },
  "status.waitingPlayers": {
    "zh-CN": "等待玩家 {count}/{total}",
    "zh-TW": "等待玩家 {count}/{total}",
    en: "Waiting {count}/{total}",
    fr: "Attente {count}/{total}",
    ja: "待機中 {count}/{total}",
    ko: "대기 {count}/{total}",
    ru: "Ожидание {count}/{total}"
  },
  "status.notYourTurn": {
    "zh-CN": "还没轮到你",
    "zh-TW": "還沒輪到你",
    en: "Not your turn",
    fr: "Pas votre tour",
    ja: "まだあなたの番ではありません",
    ko: "아직 내 차례가 아닙니다",
    ru: "Сейчас не ваш ход"
  },
  "status.illegalMove": {
    "zh-CN": "这步不合法",
    "zh-TW": "這步不合法",
    en: "Illegal move",
    fr: "Coup illegal",
    ja: "不正な手です",
    ko: "불법 수입니다",
    ru: "Недопустимый ход"
  },
  "status.mustCapture": {
    "zh-CN": "这一手必须吃子",
    "zh-TW": "這一手必須吃子",
    en: "You must capture",
    fr: "La prise est obligatoire",
    ja: "捕獲が必要です",
    ko: "반드시 잡아야 합니다",
    ru: "Бой обязателен"
  },
  "status.selectPiece": {
    "zh-CN": "请选择可移动的棋子",
    "zh-TW": "請選擇可移動的棋子",
    en: "Choose a movable piece",
    fr: "Choisissez une piece mobile",
    ja: "動ける駒を選んでください",
    ko: "움직일 수 있는 말을 선택하세요",
    ru: "Выберите доступную шашку"
  },
  "status.roomCreated": {
    "zh-CN": "房间已创建",
    "zh-TW": "房間已建立",
    en: "Room created",
    fr: "Salon cree",
    ja: "部屋を作成しました",
    ko: "방을 만들었습니다",
    ru: "Комната создана"
  },
  "status.roomJoined": {
    "zh-CN": "已加入房间",
    "zh-TW": "已加入房間",
    en: "Joined room",
    fr: "Salon rejoint",
    ja: "部屋に参加しました",
    ko: "방에 참가했습니다",
    ru: "Вы вошли"
  },
  "status.enterRoomCode": {
    "zh-CN": "请输入房间码",
    "zh-TW": "請輸入房間碼",
    en: "Enter room code",
    fr: "Entrez le code",
    ja: "部屋コードを入力",
    ko: "방 코드를 입력하세요",
    ru: "Введите код комнаты"
  },
  "status.roomCodeCopied": {
    "zh-CN": "房间码已复制",
    "zh-TW": "房間碼已複製",
    en: "Room code copied",
    fr: "Code copie",
    ja: "コードをコピーしました",
    ko: "방 코드 복사됨",
    ru: "Код скопирован"
  },
  "status.online": {
    "zh-CN": "在线",
    "zh-TW": "在線",
    en: "online",
    fr: "en ligne",
    ja: "オンライン",
    ko: "온라인",
    ru: "онлайн"
  },
  "status.seated": {
    "zh-CN": "已入座",
    "zh-TW": "已入座",
    en: "seated",
    fr: "assis",
    ja: "着席済み",
    ko: "착석",
    ru: "занят"
  },
  "status.waiting": {
    "zh-CN": "等待",
    "zh-TW": "等待",
    en: "waiting",
    fr: "attente",
    ja: "待機",
    ko: "대기",
    ru: "ожидание"
  },
  "status.emptySeat": {
    "zh-CN": "空位",
    "zh-TW": "空位",
    en: "empty",
    fr: "libre",
    ja: "空席",
    ko: "빈자리",
    ru: "свободно"
  },
  "status.player": {
    "zh-CN": "玩家",
    "zh-TW": "玩家",
    en: "player",
    fr: "joueur",
    ja: "プレイヤー",
    ko: "플레이어",
    ru: "игрок"
  },
  "status.first": {
    "zh-CN": "先手",
    "zh-TW": "先手",
    en: "first",
    fr: "premier",
    ja: "先手",
    ko: "선공",
    ru: "первый"
  },
  "status.second": {
    "zh-CN": "后手",
    "zh-TW": "後手",
    en: "second",
    fr: "second",
    ja: "後手",
    ko: "후공",
    ru: "второй"
  },
  "status.active": {
    "zh-CN": "行动",
    "zh-TW": "行動",
    en: "active",
    fr: "actif",
    ja: "行動",
    ko: "행동",
    ru: "ходит"
  },
  "status.noLog": {
    "zh-CN": "暂无记录",
    "zh-TW": "暫無記錄",
    en: "No log yet",
    fr: "Aucun journal",
    ja: "記録なし",
    ko: "기록 없음",
    ru: "Пока нет записей"
  },
  "status.gameStarted": {
    "zh-CN": "棋局开始",
    "zh-TW": "棋局開始",
    en: "Game started",
    fr: "Partie commencee",
    ja: "対局開始",
    ko: "대국 시작",
    ru: "Игра началась"
  },
  "status.waitingRoomFull": {
    "zh-CN": "等待房间满员",
    "zh-TW": "等待房間滿員",
    en: "Waiting for the room",
    fr: "En attente du salon",
    ja: "部屋が揃うのを待っています",
    ko: "방 인원 대기 중",
    ru: "Ожидание комнаты"
  },
  "luqiangqi.goalNorth": {
    "zh-CN": "目标 北线",
    "zh-TW": "目標 北線",
    en: "goal north",
    fr: "objectif nord",
    ja: "目標 北線",
    ko: "목표 북쪽",
    ru: "цель север"
  },
  "luqiangqi.goalSouth": {
    "zh-CN": "目标 南线",
    "zh-TW": "目標 南線",
    en: "goal south",
    fr: "objectif sud",
    ja: "目標 南線",
    ko: "목표 남쪽",
    ru: "цель юг"
  },
  "luqiangqi.goalWest": {
    "zh-CN": "目标 西线",
    "zh-TW": "目標 西線",
    en: "goal west",
    fr: "objectif ouest",
    ja: "目標 西線",
    ko: "목표 서쪽",
    ru: "цель запад"
  },
  "luqiangqi.goalEast": {
    "zh-CN": "目标 东线",
    "zh-TW": "目標 東線",
    en: "goal east",
    fr: "objectif est",
    ja: "目標 東線",
    ko: "목표 동쪽",
    ru: "цель восток"
  },
  "luqiangqi.wallUnit": {
    "zh-CN": "墙",
    "zh-TW": "牆",
    en: "walls",
    fr: "murs",
    ja: "壁",
    ko: "벽",
    ru: "стен"
  }
};

const gamePieceText = {
  luqiangqi: {
    0: { "zh-CN": "南", "zh-TW": "南", en: "S", fr: "S", ja: "南", ko: "남", ru: "Ю" },
    1: { "zh-CN": "北", "zh-TW": "北", en: "N", fr: "N", ja: "北", ko: "북", ru: "С" },
    2: { "zh-CN": "西", "zh-TW": "西", en: "W", fr: "O", ja: "西", ko: "서", ru: "З" },
    3: { "zh-CN": "东", "zh-TW": "東", en: "E", fr: "E", ja: "東", ko: "동", ru: "В" }
  },
  xiyangtiaoqi: {
    0: { "zh-CN": "墨", "zh-TW": "墨", en: "B", fr: "N", ja: "墨", ko: "흑", ru: "Ч" },
    1: { "zh-CN": "朱", "zh-TW": "朱", en: "R", fr: "R", ja: "朱", ko: "적", ru: "К" }
  },
  tuerqitiaoqi: {
    0: { "zh-CN": "南", "zh-TW": "南", en: "S", fr: "S", ja: "南", ko: "남", ru: "Ю" },
    1: { "zh-CN": "北", "zh-TW": "北", en: "N", fr: "N", ja: "北", ko: "북", ru: "С" }
  }
};

export function currentLanguage() {
  const stored = localStorage.getItem(LANGUAGE_KEY) || "zh-CN";
  return languageSet.has(stored) ? stored : "zh-CN";
}

export function currentTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function t(key, fallback = "") {
  const lang = currentLanguage();
  return copy[key]?.[lang] || copy[key]?.["zh-CN"] || fallback || key;
}

export function pieceLabel(game, owner, fallback = "") {
  const lang = currentLanguage();
  return gamePieceText[game]?.[owner]?.[lang] || gamePieceText[game]?.[owner]?.["zh-CN"] || fallback;
}

function applyLanguage(lang = currentLanguage()) {
  const meta = languages.find((item) => item.value === lang) || languages[0];
  document.documentElement.dataset.lang = meta.value;
  document.documentElement.lang = meta.htmlLang;
  for (const node of document.querySelectorAll("[data-i18n]")) {
    node.textContent = t(node.dataset.i18n, node.textContent);
  }
  for (const node of document.querySelectorAll("[data-i18n-placeholder]")) {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder, node.getAttribute("placeholder") || ""));
  }
  for (const select of document.querySelectorAll("[data-language-select]")) {
    select.value = meta.value;
    const field = select.closest(".settings-field");
    if (field) field.dataset.value = meta.label;
    syncSettingsChoice(select);
  }
  fillThemeSelects();
  for (const button of document.querySelectorAll("[data-settings-toggle]")) {
    button.setAttribute("aria-label", t("settings.label"));
    button.setAttribute("title", t("settings.label"));
  }
}

function applyTheme(theme = currentTheme()) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  for (const button of document.querySelectorAll("[data-theme-toggle]")) {
    button.textContent = theme === "dark" ? t("theme.dark") : t("theme.light");
    button.setAttribute("aria-label", theme === "dark" ? t("theme.toLight") : t("theme.toDark"));
  }
  for (const select of document.querySelectorAll("[data-theme-select]")) {
    select.value = theme;
    const field = select.closest(".settings-field");
    if (field) field.dataset.value = theme === "dark" ? t("theme.dark") : t("theme.light");
    syncSettingsChoice(select);
  }
}

function fillLanguageSelects() {
  for (const select of document.querySelectorAll("[data-language-select]")) {
    if (!select.options.length) {
      for (const lang of languages) {
        select.append(new Option(lang.label, lang.value));
      }
    }
  }
}

function fillThemeSelects() {
  for (const select of document.querySelectorAll("[data-theme-select]")) {
    const value = select.value || currentTheme();
    select.replaceChildren(new Option(t("theme.light"), "light"), new Option(t("theme.dark"), "dark"));
    select.value = value === "dark" ? "dark" : "light";
    const field = select.closest(".settings-field");
    if (field) field.dataset.value = select.value === "dark" ? t("theme.dark") : t("theme.light");
    syncSettingsChoice(select);
  }
}

function settingsChoices(select) {
  if (select.matches("[data-language-select]")) return languages.map(({ value, label }) => ({ value, label }));
  return [
    { value: "light", label: t("theme.light") },
    { value: "dark", label: t("theme.dark") }
  ];
}

function closeSettingsChoices(scope = document) {
  for (const button of scope.querySelectorAll("[data-settings-value]")) button.setAttribute("aria-expanded", "false");
  const popovers = scope.matches?.(".settings-popover.choice-mode")
    ? [scope, ...scope.querySelectorAll(".settings-popover.choice-mode")]
    : [...scope.querySelectorAll(".settings-popover.choice-mode")];
  for (const popover of popovers) popover.classList.remove("choice-mode");
  for (const panel of scope.querySelectorAll("[data-settings-choice-panel]")) {
    panel.hidden = true;
    panel.replaceChildren();
  }
}

function syncSettingsChoice(select) {
  const field = select.closest(".settings-field");
  if (!field) return;
  const button = field.querySelector("[data-settings-value]");
  if (!button) return;

  const choices = settingsChoices(select);
  const current = choices.find((item) => item.value === select.value) || choices[0];
  const fieldLabel = field.querySelector("span")?.textContent?.replace(/[:：]\s*$/, "") || "";
  button.textContent = current?.label || "";
  button.setAttribute("aria-label", fieldLabel ? `${fieldLabel}：${button.textContent}` : button.textContent);
}

function ensureSettingsChoicePanel(popover) {
  let panel = popover.querySelector("[data-settings-choice-panel]");
  if (panel) return panel;
  panel = document.createElement("div");
  panel.className = "settings-choice-panel";
  panel.dataset.settingsChoicePanel = "";
  panel.hidden = true;
  popover.append(panel);
  return panel;
}

function openSettingsChoice(field, select) {
  const popover = field.closest(".settings-popover");
  if (!popover) return;

  closeSettingsChoices(popover);
  const panel = ensureSettingsChoicePanel(popover);
  const fieldLabel = field.querySelector("span")?.textContent?.replace(/[:：]\s*$/, "") || "";
  const choices = settingsChoices(select);

  const header = document.createElement("div");
  header.className = "settings-choice-head";

  const back = document.createElement("button");
  back.type = "button";
  back.className = "settings-back";
  back.setAttribute("aria-label", t("settings.back", "返回"));
  back.textContent = "‹";
  back.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeSettingsChoices(popover);
  });

  const title = document.createElement("strong");
  title.className = "settings-choice-title";
  title.textContent = fieldLabel;
  header.append(back, title);

  const list = document.createElement("div");
  list.className = "settings-choice-list";
  list.setAttribute("role", "listbox");
  list.append(...choices.map((item) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "settings-option";
    option.dataset.settingsOption = item.value;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", item.value === select.value ? "true" : "false");
    option.textContent = item.label;
    option.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      select.value = item.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      closeSettingsChoices(popover);
    });
    return option;
  }));

  panel.replaceChildren(header, list);
  panel.hidden = false;
  popover.classList.add("choice-mode");
  const button = field.querySelector("[data-settings-value]");
  if (button) button.setAttribute("aria-expanded", "true");
}

function enhanceSettingsSelect(select) {
  if (select.dataset.settingsEnhanced) {
    syncSettingsChoice(select);
    return;
  }

  const field = select.closest(".settings-field");
  if (!field) return;
  select.dataset.settingsEnhanced = "true";
  select.tabIndex = -1;
  select.setAttribute("aria-hidden", "true");

  const button = document.createElement("button");
  button.type = "button";
  button.className = "settings-value";
  button.dataset.settingsValue = "";
  button.setAttribute("aria-haspopup", "listbox");
  button.setAttribute("aria-expanded", "false");

  field.append(button);
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openSettingsChoice(field, select);
  });
  syncSettingsChoice(select);
}

function enhanceSettingsSelects() {
  for (const select of document.querySelectorAll("[data-language-select], [data-theme-select]")) enhanceSettingsSelect(select);
}

function setSettingsMenuOpen(menu, open) {
  menu.classList.toggle("open", open);
  if (!open) closeSettingsChoices(menu);
  const button = menu.querySelector("[data-settings-toggle]");
  if (button) button.setAttribute("aria-expanded", open ? "true" : "false");
}

function initSettingsMenus() {
  const menus = [...document.querySelectorAll("[data-settings-menu-root]")];
  if (!menus.length) return;

  for (const menu of menus) {
    const button = menu.querySelector("[data-settings-toggle]");
    if (!button) continue;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = !menu.classList.contains("open");
      for (const other of menus) setSettingsMenuOpen(other, false);
      setSettingsMenuOpen(menu, willOpen);
    });
    menu.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!event.target.closest("[data-settings-value], [data-settings-choice-panel]")) closeSettingsChoices(menu);
    });
  }

  document.addEventListener("click", () => {
    closeSettingsChoices();
    for (const menu of menus) setSettingsMenuOpen(menu, false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeSettingsChoices();
    for (const menu of menus) setSettingsMenuOpen(menu, false);
  });
}

export function setLanguage(lang) {
  const next = languageSet.has(lang) ? lang : "zh-CN";
  localStorage.setItem(LANGUAGE_KEY, next);
  applyLanguage(next);
  applyTheme();
  window.dispatchEvent(new CustomEvent("smc:languagechange", { detail: { language: next } }));
}

export function setTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
  window.dispatchEvent(new CustomEvent("smc:themechange", { detail: { theme: next } }));
}

export function toggleTheme() {
  setTheme(currentTheme() === "dark" ? "light" : "dark");
}

export function initPreferences() {
  fillLanguageSelects();
  fillThemeSelects();
  enhanceSettingsSelects();
  applyLanguage();
  applyTheme();
  initSettingsMenus();

  for (const select of document.querySelectorAll("[data-language-select]")) {
    select.addEventListener("change", () => setLanguage(select.value));
  }

  for (const select of document.querySelectorAll("[data-theme-select]")) {
    select.addEventListener("change", () => setTheme(select.value));
  }

  for (const button of document.querySelectorAll("[data-theme-toggle]")) {
    button.addEventListener("click", toggleTheme);
  }
}

window.SMC_PREFS = {
  languages,
  t,
  pieceLabel,
  currentLanguage,
  currentTheme,
  setLanguage,
  setTheme,
  toggleTheme
};

initPreferences();

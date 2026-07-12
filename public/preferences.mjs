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
  "nav.private": {
    "zh-CN": "私人空间",
    "zh-TW": "私人空間",
    en: "Private Space",
    fr: "Espace prive",
    ja: "プライベート空間",
    ko: "개인 공간",
    ru: "Личное пространство"
  },
  "nav.primary": {
    "zh-CN": "主导航",
    "zh-TW": "主導覽",
    en: "Primary navigation",
    fr: "Navigation principale",
    ja: "メインナビゲーション",
    ko: "주요 탐색",
    ru: "Основная навигация"
  },
  "nav.breadcrumb": {
    "zh-CN": "当前位置",
    "zh-TW": "目前位置",
    en: "Current location",
    fr: "Position actuelle",
    ja: "現在地",
    ko: "현재 위치",
    ru: "Текущее положение"
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
  "page.title.study": {
    "zh-CN": "学习工具 · Small Magellanic Cloud",
    "zh-TW": "學習工具 · Small Magellanic Cloud",
    en: "Study Tools · Small Magellanic Cloud",
    fr: "Outils d'etude · Small Magellanic Cloud",
    ja: "学習ツール · Small Magellanic Cloud",
    ko: "학습 도구 · Small Magellanic Cloud",
    ru: "Учебные инструменты · Small Magellanic Cloud"
  },
  "page.title.padic": {
    "zh-CN": "p进数转换器 · Small Magellanic Cloud",
    "zh-TW": "p進數轉換器 · Small Magellanic Cloud",
    en: "p-adic Converter · Small Magellanic Cloud",
    fr: "Convertisseur p-adique · Small Magellanic Cloud",
    ja: "p進数変換器 · Small Magellanic Cloud",
    ko: "p진수 변환기 · Small Magellanic Cloud",
    ru: "Конвертер p-адических чисел · Small Magellanic Cloud"
  },
  "page.title.padicDownload": {
    "zh-CN": "下载 p进数转换器 · Small Magellanic Cloud",
    "zh-TW": "下載 p進數轉換器 · Small Magellanic Cloud",
    en: "Download p-adic Converter · Small Magellanic Cloud",
    fr: "Telecharger le convertisseur p-adique · Small Magellanic Cloud",
    ja: "p進数変換器をダウンロード · Small Magellanic Cloud",
    ko: "p진수 변환기 다운로드 · Small Magellanic Cloud",
    ru: "Скачать конвертер p-адических чисел · Small Magellanic Cloud"
  },
  "page.title.padicWeb": {
    "zh-CN": "网页版 p进数转换 · Small Magellanic Cloud",
    "zh-TW": "網頁版 p進數轉換 · Small Magellanic Cloud",
    en: "Web p-adic Converter · Small Magellanic Cloud",
    fr: "Convertisseur p-adique web · Small Magellanic Cloud",
    ja: "Web p進数変換 · Small Magellanic Cloud",
    ko: "웹 p진수 변환 · Small Magellanic Cloud",
    ru: "Веб-конвертер p-адических чисел · Small Magellanic Cloud"
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
    "zh-CN": "p进数转换、高等代数、数学分析和后续学习实验会收纳在这里。",
    "zh-TW": "p進數轉換、高等代數、數學分析和後續學習實驗會收納在這裡。",
    en: "p-adic conversion, higher algebra, mathematical analysis and future study experiments live here.",
    fr: "Conversion p-adique, algebre superieure, analyse mathematique et futurs essais d'etude vivent ici.",
    ja: "p進数変換、高等代数、数学解析、今後の学習実験をここに置きます。",
    ko: "p진수 변환, 고등대수, 해석학, 앞으로의 학습 실험을 여기에 둡니다.",
    ru: "Здесь будут p-адические числа, высшая алгебра, матанализ и будущие учебные опыты."
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
    "zh-CN": "p进数转换器",
    "zh-TW": "p進數轉換器",
    en: "p-adic Converter",
    fr: "Convertisseur p-adique",
    ja: "p進数変換器",
    ko: "p진수 변환기",
    ru: "Конвертер p-адических чисел"
  },
  "study.padic.copy": {
    "zh-CN": "下载终端版安装器，或直接使用网页版 p进数有理数转换。",
    "zh-TW": "下載終端版安裝器，或直接使用網頁版 p進數有理數轉換。",
    en: "Download the terminal installer, or use the web p-adic rational converter.",
    fr: "Telechargez l'installateur terminal ou utilisez le convertisseur rationnel p-adique web.",
    ja: "端末版インストーラを入手するか、Web 版 p進数有理数変換を使えます。",
    ko: "터미널 설치기를 받거나 웹 p진수 유리수 변환기를 바로 사용합니다.",
    ru: "Скачайте терминальный установщик или используйте веб-конвертер p-адических рациональных чисел."
  },
  "page.title.algebra": {
    "zh-CN": "高等代数学习辅助器 · Small Magellanic Cloud",
    "zh-TW": "高等代數學習輔助器 · Small Magellanic Cloud",
    en: "Higher Algebra Assistant · Small Magellanic Cloud",
    fr: "Assistant d'algebre superieure · Small Magellanic Cloud",
    ja: "高等代数学習補助 · Small Magellanic Cloud",
    ko: "고등대수 학습 보조기 · Small Magellanic Cloud",
    ru: "Помощник по высшей алгебре · Small Magellanic Cloud"
  },
  "page.title.analysis": {
    "zh-CN": "数学分析学习辅助器 · Small Magellanic Cloud",
    "zh-TW": "數學分析學習輔助器 · Small Magellanic Cloud",
    en: "Mathematical Analysis Assistant · Small Magellanic Cloud",
    fr: "Assistant d'analyse mathematique · Small Magellanic Cloud",
    ja: "数学解析学習補助 · Small Magellanic Cloud",
    ko: "해석학 학습 보조기 · Small Magellanic Cloud",
    ru: "Помощник по математическому анализу · Small Magellanic Cloud"
  },
  "page.title.algebraManual": {
    "zh-CN": "高等代数说明书 · Small Magellanic Cloud",
    "zh-TW": "高等代數說明書 · Small Magellanic Cloud",
    en: "Higher Algebra Manual · Small Magellanic Cloud",
    fr: "Manuel d'algebre superieure · Small Magellanic Cloud",
    ja: "高等代数説明書 · Small Magellanic Cloud",
    ko: "고등대수 설명서 · Small Magellanic Cloud",
    ru: "Руководство по высшей алгебре · Small Magellanic Cloud"
  },
  "page.title.analysisManual": {
    "zh-CN": "数学分析说明书 · Small Magellanic Cloud",
    "zh-TW": "數學分析說明書 · Small Magellanic Cloud",
    en: "Analysis Manual · Small Magellanic Cloud",
    fr: "Manuel d'analyse · Small Magellanic Cloud",
    ja: "数学解析説明書 · Small Magellanic Cloud",
    ko: "해석학 설명서 · Small Magellanic Cloud",
    ru: "Руководство по матанализу · Small Magellanic Cloud"
  },
  "study.algebra.title": {
    "zh-CN": "高等代数学习辅助器",
    "zh-TW": "高等代數學習輔助器",
    en: "Higher Algebra Assistant",
    fr: "Assistant d'algebre superieure",
    ja: "高等代数学習補助",
    ko: "고등대수 학습 보조기",
    ru: "Помощник по высшей алгебре"
  },
  "study.algebra.copy": {
    "zh-CN": "直接调用原 Python/SymPy 项目，处理矩阵、线性方程组、线性空间、对角化、Jordan 线索、多项式、二次型与复习专题。",
    "zh-TW": "直接呼叫原 Python/SymPy 專案，處理矩陣、線性方程組、線性空間、對角化、Jordan 線索、多項式、二次型與複習專題。",
    en: "Runs the original Python/SymPy project for matrices, linear systems, vector spaces, diagonalization, Jordan hints, polynomials, quadratic forms, and review topics.",
    fr: "Execute le projet Python/SymPy d'origine pour matrices, systemes lineaires, espaces vectoriels, diagonalisation, pistes de Jordan, polynomes, formes quadratiques et revisions.",
    ja: "元の Python/SymPy プロジェクトを呼び出し、行列、連立一次方程式、線形空間、対角化、Jordan の手がかり、多項式、二次形式、復習題を扱います。",
    ko: "원래 Python/SymPy 프로젝트를 호출해 행렬, 선형방정식, 선형공간, 대각화, Jordan 단서, 다항식, 이차형식, 복습 주제를 처리합니다.",
    ru: "Запускает исходный проект Python/SymPy для матриц, линейных систем, пространств, диагонализации, подсказок Jordan, многочленов, квадратичных форм и повторения."
  },
  "study.analysis.title": {
    "zh-CN": "数学分析学习辅助器",
    "zh-TW": "數學分析學習輔助器",
    en: "Mathematical Analysis Assistant",
    fr: "Assistant d'analyse mathematique",
    ja: "数学解析学習補助",
    ko: "해석학 학습 보조기",
    ru: "Помощник по математическому анализу"
  },
  "study.analysis.copy": {
    "zh-CN": "直接调用原 GeoGebra CAS 风格 Python 项目，处理极限、导数、积分、级数、方程、ODE、收敛判别、多元函数与 Fourier/Laplace 工具。",
    "zh-TW": "直接呼叫原 GeoGebra CAS 風格 Python 專案，處理極限、導數、積分、級數、方程、ODE、收斂判別、多元函數與 Fourier/Laplace 工具。",
    en: "Runs the original GeoGebra-style Python CAS project for limits, derivatives, integrals, series, equations, ODEs, convergence tests, multivariable calculus, and Fourier/Laplace tools.",
    fr: "Execute le CAS Python d'origine, style GeoGebra, pour limites, derivees, integrales, series, equations, EDO, tests de convergence, calcul multivariable et outils Fourier/Laplace.",
    ja: "GeoGebra CAS 風の元 Python プロジェクトを呼び出し、極限、微分、積分、級数、方程式、ODE、収束判定、多変数関数、Fourier/Laplace ツールを扱います。",
    ko: "GeoGebra CAS 스타일의 원래 Python 프로젝트를 호출해 극한, 미분, 적분, 급수, 방정식, ODE, 수렴 판정, 다변수 함수, Fourier/Laplace 도구를 처리합니다.",
    ru: "Запускает исходный Python CAS в стиле GeoGebra для пределов, производных, интегралов, рядов, уравнений, ОДУ, признаков сходимости, многих переменных и Fourier/Laplace."
  },
  "study.core.eyebrow": {
    "zh-CN": "原项目核心",
    "zh-TW": "原專案核心",
    en: "original core",
    fr: "coeur original",
    ja: "元プロジェクト",
    ko: "원본 코어",
    ru: "исходное ядро"
  },
  "tool.input": {
    "zh-CN": "输入文件内容",
    "zh-TW": "輸入檔案內容",
    en: "Input file",
    fr: "Fichier d'entree",
    ja: "入力ファイル",
    ko: "입력 파일",
    ru: "Входной файл"
  },
  "tool.output": {
    "zh-CN": "运行输出",
    "zh-TW": "執行輸出",
    en: "Output",
    fr: "Sortie",
    ja: "出力",
    ko: "실행 출력",
    ru: "Вывод"
  },
  "tool.run": {
    "zh-CN": "运行",
    "zh-TW": "執行",
    en: "Run",
    fr: "Executer",
    ja: "実行",
    ko: "실행",
    ru: "Запустить"
  },
  "tool.examples": {
    "zh-CN": "示例",
    "zh-TW": "範例",
    en: "Examples",
    fr: "Exemples",
    ja: "例",
    ko: "예시",
    ru: "Примеры"
  },
  "tool.running": {
    "zh-CN": "正在运行，线上首次加载可能需要稍等...",
    "zh-TW": "正在執行，線上首次載入可能需要稍等...",
    en: "Running; first online load may take a moment...",
    fr: "Execution en cours; le premier chargement en ligne peut prendre un moment...",
    ja: "実行中です。オンライン初回読み込みは少し時間がかかる場合があります...",
    ko: "실행 중입니다. 온라인 첫 로드는 잠시 걸릴 수 있습니다...",
    ru: "Выполняется; первый онлайн-запуск может занять немного времени..."
  },
  "tool.empty": {
    "zh-CN": "请输入要执行的内容",
    "zh-TW": "請輸入要執行的內容",
    en: "Enter content to run",
    fr: "Entrez le contenu a executer",
    ja: "実行する内容を入力してください",
    ko: "실행할 내용을 입력하세요",
    ru: "Введите содержимое для запуска"
  },
  "tool.failed": {
    "zh-CN": "学习工具执行失败",
    "zh-TW": "學習工具執行失敗",
    en: "Study tool failed",
    fr: "Echec de l'outil",
    ja: "学習ツールの実行に失敗しました",
    ko: "학습 도구 실행 실패",
    ru: "Учебный инструмент не выполнен"
  },
  "guide.eyebrow": {
    "zh-CN": "使用指南",
    "zh-TW": "使用指南",
    en: "Guide",
    fr: "Guide",
    ja: "ガイド",
    ko: "사용 안내",
    ru: "Руководство"
  },
  "guide.open": {
    "zh-CN": "使用指南",
    "zh-TW": "使用指南",
    en: "User guide",
    fr: "Guide d'utilisation",
    ja: "使い方ガイド",
    ko: "사용 안내",
    ru: "Руководство"
  },
  "guide.algebra.title": {
    "zh-CN": "高等代数说明书",
    "zh-TW": "高等代數說明書",
    en: "Higher Algebra Manual",
    fr: "Manuel d'algebre superieure",
    ja: "高等代数説明書",
    ko: "고등대수 설명서",
    ru: "Руководство по высшей алгебре"
  },
  "guide.analysis.title": {
    "zh-CN": "数学分析说明书",
    "zh-TW": "數學分析說明書",
    en: "Analysis Manual",
    fr: "Manuel d'analyse",
    ja: "数学解析説明書",
    ko: "해석학 설명서",
    ru: "Руководство по матанализу"
  },
  "guide.algebra.nav": {
    "zh-CN": "高等代数使用说明目录",
    "zh-TW": "高等代數使用說明目錄",
    en: "Higher algebra guide menu",
    fr: "Menu du guide d'algebre",
    ja: "高等代数ガイド目次",
    ko: "고등대수 안내 목차",
    ru: "Меню руководства по алгебре"
  },
  "guide.analysis.nav": {
    "zh-CN": "数学分析使用说明目录",
    "zh-TW": "數學分析使用說明目錄",
    en: "Analysis guide menu",
    fr: "Menu du guide d'analyse",
    ja: "数学解析ガイド目次",
    ko: "해석학 안내 목차",
    ru: "Меню руководства по анализу"
  },
  "guide.back.root": {
    "zh-CN": "返回说明书",
    "zh-TW": "返回說明書",
    en: "Back to manual",
    fr: "Retour au manuel",
    ja: "説明書に戻る",
    ko: "설명서로 돌아가기",
    ru: "Назад к руководству"
  },
  "guide.back.start": {
    "zh-CN": "返回快速上手",
    "zh-TW": "返回快速上手",
    en: "Back to quick start",
    fr: "Retour au demarrage",
    ja: "クイック開始に戻る",
    ko: "빠른 시작으로 돌아가기",
    ru: "Назад к быстрому старту"
  },
  "guide.back.matrix": {
    "zh-CN": "返回矩阵计算",
    "zh-TW": "返回矩陣計算",
    en: "Back to matrices",
    fr: "Retour aux matrices",
    ja: "行列計算に戻る",
    ko: "행렬 계산으로 돌아가기",
    ru: "Назад к матрицам"
  },
  "guide.back.cas": {
    "zh-CN": "返回基础 CAS",
    "zh-TW": "返回基礎 CAS",
    en: "Back to CAS basics",
    fr: "Retour aux bases CAS",
    ja: "CAS 基礎に戻る",
    ko: "CAS 기본으로 돌아가기",
    ru: "Назад к основам CAS"
  },
  "guide.start": {
    "zh-CN": "快速上手",
    "zh-TW": "快速上手",
    en: "Quick Start",
    fr: "Demarrage rapide",
    ja: "クイック開始",
    ko: "빠른 시작",
    ru: "Быстрый старт"
  },
  "guide.runExample": {
    "zh-CN": "运行示例",
    "zh-TW": "執行範例",
    en: "Run an Example",
    fr: "Executer un exemple",
    ja: "例を実行",
    ko: "예시 실행",
    ru: "Запустить пример"
  },
  "guide.editOwn": {
    "zh-CN": "改成自己的题",
    "zh-TW": "改成自己的題目",
    en: "Use Your Own Problem",
    fr: "Utiliser son exercice",
    ja: "自分の問題に変える",
    ko: "내 문제로 바꾸기",
    ru: "Своя задача"
  },
  "guide.onlineWait": {
    "zh-CN": "线上等待",
    "zh-TW": "線上等待",
    en: "Online Wait",
    fr: "Attente en ligne",
    ja: "オンライン待機",
    ko: "온라인 대기",
    ru: "Ожидание онлайн"
  },
  "guide.inputFormat": {
    "zh-CN": "输入格式",
    "zh-TW": "輸入格式",
    en: "Input Format",
    fr: "Format d'entree",
    ja: "入力形式",
    ko: "입력 형식",
    ru: "Формат ввода"
  },
  "guide.commonFunctions": {
    "zh-CN": "常用函数",
    "zh-TW": "常用函數",
    en: "Common Functions",
    fr: "Fonctions utiles",
    ja: "よく使う関数",
    ko: "자주 쓰는 함수",
    ru: "Основные функции"
  },
  "guide.algebra.matrix": {
    "zh-CN": "矩阵计算",
    "zh-TW": "矩陣計算",
    en: "Matrices",
    fr: "Matrices",
    ja: "行列計算",
    ko: "행렬 계산",
    ru: "Матрицы"
  },
  "guide.algebra.poly": {
    "zh-CN": "多项式",
    "zh-TW": "多項式",
    en: "Polynomials",
    fr: "Polynomes",
    ja: "多項式",
    ko: "다항식",
    ru: "Многочлены"
  },
  "guide.algebra.linear": {
    "zh-CN": "线性方程组",
    "zh-TW": "線性方程組",
    en: "Linear Systems",
    fr: "Systemes lineaires",
    ja: "連立一次方程式",
    ko: "선형방정식",
    ru: "Линейные системы"
  },
  "guide.algebra.space": {
    "zh-CN": "线性空间与映射",
    "zh-TW": "線性空間與映射",
    en: "Spaces and Maps",
    fr: "Espaces et applications",
    ja: "線形空間と写像",
    ko: "선형공간과 사상",
    ru: "Пространства и отображения"
  },
  "guide.algebra.review": {
    "zh-CN": "复习专题",
    "zh-TW": "複習專題",
    en: "Review Topics",
    fr: "Themes de revision",
    ja: "復習トピック",
    ko: "복습 주제",
    ru: "Темы повторения"
  },
  "guide.algebra.quadratic": {
    "zh-CN": "二次型",
    "zh-TW": "二次型",
    en: "Quadratic Forms",
    fr: "Formes quadratiques",
    ja: "二次形式",
    ko: "이차형식",
    ru: "Квадратичные формы"
  },
  "guide.algebra.runExample.copy": {
    "zh-CN": "点击示例按钮后会自动填入并运行。先看输出格式，再替换数字、矩阵或多项式。",
    "zh-TW": "點擊範例按鈕後會自動填入並執行。先看輸出格式，再替換數字、矩陣或多項式。",
    en: "Click an example button to fill and run it. Read the output shape first, then replace numbers, matrices, or polynomials.",
    fr: "Cliquez sur un exemple pour le remplir et l'executer. Observez la sortie, puis remplacez nombres, matrices ou polynomes.",
    ja: "例ボタンを押すと入力され実行されます。出力形式を見てから数値、行列、多項式を置き換えます。",
    ko: "예시 버튼을 누르면 입력되고 실행됩니다. 출력 형식을 먼저 보고 숫자, 행렬, 다항식을 바꾸세요.",
    ru: "Нажмите пример, чтобы заполнить и запустить его. Сначала посмотрите формат вывода, затем замените числа, матрицы или многочлены."
  },
  "guide.algebra.editOwn.copy": {
    "zh-CN": "每行写一个赋值或输出命令。需要符号变量时先写",
    "zh-TW": "每行寫一個賦值或輸出命令。需要符號變數時先寫",
    en: "Write one assignment or output command per line. For symbolic variables, start with",
    fr: "Ecrivez une affectation ou une commande de sortie par ligne. Pour une variable symbolique, commencez par",
    ja: "1 行に代入または出力コマンドを 1 つ書きます。記号変数が必要なら先に",
    ko: "한 줄에 대입이나 출력 명령을 하나씩 씁니다. 기호 변수가 필요하면 먼저",
    ru: "Пишите одно присваивание или команду вывода на строку. Для символьных переменных начните с"
  },
  "guide.algebra.matrixFormat.copy": {
    "zh-CN": "矩阵用分号分隔行，例如",
    "zh-TW": "矩陣用分號分隔列，例如",
    en: "Use semicolons to separate matrix rows, for example",
    fr: "Separez les lignes de matrice par des points-virgules, par exemple",
    ja: "行列の行はセミコロンで区切ります。例：",
    ko: "행렬의 행은 세미콜론으로 나눕니다. 예:",
    ru: "Строки матрицы разделяются точкой с запятой, например"
  },
  "guide.algebra.det": {
    "zh-CN": "行列式",
    "zh-TW": "行列式",
    en: "determinant",
    fr: "determinant",
    ja: "行列式",
    ko: "행렬식",
    ru: "определитель"
  },
  "guide.algebra.rank": {
    "zh-CN": "秩",
    "zh-TW": "秩",
    en: "rank",
    fr: "rang",
    ja: "階数",
    ko: "랭크",
    ru: "ранг"
  },
  "guide.algebra.inv": {
    "zh-CN": "逆矩阵",
    "zh-TW": "逆矩陣",
    en: "inverse",
    fr: "inverse",
    ja: "逆行列",
    ko: "역행렬",
    ru: "обратная матрица"
  },
  "guide.algebra.charpoly": {
    "zh-CN": "特征多项式",
    "zh-TW": "特徵多項式",
    en: "characteristic polynomial",
    fr: "polynome caracteristique",
    ja: "特性多項式",
    ko: "특성다항식",
    ru: "характеристический многочлен"
  },
  "guide.algebra.poly.copy": {
    "zh-CN": "多项式可以直接写成",
    "zh-TW": "多項式可以直接寫成",
    en: "Write polynomials directly as",
    fr: "Ecrivez les polynomes directement comme",
    ja: "多項式はそのまま次のように書けます",
    ko: "다항식은 바로 이렇게 쓸 수 있습니다",
    ru: "Многочлен можно записать так:"
  },
  "guide.algebra.poly.functions": {
    "zh-CN": "常用函数包括最大公因式、求根和乘法检查。",
    "zh-TW": "常用函數包括最大公因式、求根和乘法檢查。",
    en: "Common functions cover gcd, roots, and multiplication checks.",
    fr: "Les fonctions utiles couvrent pgcd, racines et verification du produit.",
    ja: "よく使う関数は gcd、根、乗法確認です。",
    ko: "자주 쓰는 함수는 최대공약식, 근, 곱셈 확인입니다.",
    ru: "Основные функции: НОД, корни и проверка умножения."
  },
  "guide.algebra.quadratic.copy": {
    "zh-CN": "先定义对称矩阵和列向量，再用",
    "zh-TW": "先定義對稱矩陣和列向量，再用",
    en: "Define a symmetric matrix and a column vector, then use",
    fr: "Definissez une matrice symetrique et un vecteur colonne, puis utilisez",
    ja: "対称行列と列ベクトルを定義してから",
    ko: "대칭행렬과 열벡터를 정의한 뒤",
    ru: "Сначала задайте симметричную матрицу и столбец, затем используйте"
  },
  "guide.algebra.quadratic.more": {
    "zh-CN": "展开二次型，并配合矩阵性质判断函数检查结果。",
    "zh-TW": "展開二次型，並配合矩陣性質判斷函數檢查結果。",
    en: "to expand the quadratic form and pair it with matrix-property checks.",
    fr: "pour developper la forme quadratique et verifier les proprietes de matrice.",
    ja: "で二次形式を展開し、行列性質の判定と組み合わせます。",
    ko: "로 이차형식을 전개하고 행렬 성질 판정과 함께 확인합니다.",
    ru: "чтобы раскрыть квадратичную форму и проверить свойства матрицы."
  },
  "guide.algebra.linear.copy": {
    "zh-CN": "新版核心会给出行最简形、Cramer 法则、线性方程组求解和齐次方程组基础解系，适合直接核对章节题。",
    "zh-TW": "新版核心會給出列最簡形、Cramer 法則、線性方程組求解和齊次方程組基礎解系，適合直接核對章節題。",
    en: "The newer core reports RREF, Cramer's rule, linear-system solutions, and fundamental solutions for homogeneous systems.",
    fr: "Le nouveau noyau donne RREF, regle de Cramer, solutions de systemes lineaires et base des systemes homogenes.",
    ja: "新しいコアは RREF、Cramer の法則、連立一次方程式の解、斉次方程式の基本解系を出します。",
    ko: "새 코어는 RREF, Cramer 법칙, 선형방정식 해, 동차방정식 기본해계를 제공합니다.",
    ru: "Новое ядро выводит RREF, правило Крамера, решения линейных систем и фундаментальные решения однородных систем."
  },
  "guide.algebra.space.copy": {
    "zh-CN": "可检查向量组、坐标、子空间和与交、线性映射核像、对角化、最小多项式与 Jordan 相关线索。",
    "zh-TW": "可檢查向量組、座標、子空間和與交、線性映射核像、對角化、最小多項式與 Jordan 相關線索。",
    en: "Use it for vector sets, coordinates, sums and intersections of subspaces, kernels and images, diagonalization, minimal polynomials, and Jordan clues.",
    fr: "A utiliser pour familles de vecteurs, coordonnees, sommes et intersections, noyau et image, diagonalisation, polynome minimal et pistes Jordan.",
    ja: "ベクトル組、座標、部分空間の和と交わり、核と像、対角化、最小多項式、Jordan 関連の手がかりを確認できます。",
    ko: "벡터 집합, 좌표, 부분공간의 합과 교, 핵과 상, 대각화, 최소다항식, Jordan 단서를 확인할 수 있습니다.",
    ru: "Подходит для систем векторов, координат, сумм и пересечений подпространств, ядра и образа, диагонализации, минимального многочлена и Jordan."
  },
  "guide.algebra.review.copy": {
    "zh-CN": "复习题方法库覆盖 Vandermonde、Woodbury、幂零、实反称矩阵、极分解、Cayley 变换、交换子和 Sylvester 方程等模板。",
    "zh-TW": "複習題方法庫覆蓋 Vandermonde、Woodbury、冪零、實反稱矩陣、極分解、Cayley 變換、交換子和 Sylvester 方程等模板。",
    en: "The review library covers Vandermonde, Woodbury, nilpotent matrices, real skew-symmetric matrices, polar decomposition, Cayley transforms, commutators, and Sylvester equations.",
    fr: "La bibliotheque de revision couvre Vandermonde, Woodbury, nilpotence, matrices antisymetriques reelles, decomposition polaire, transformee de Cayley, commutateurs et equations de Sylvester.",
    ja: "復習ライブラリは Vandermonde、Woodbury、冪零、実反対称行列、極分解、Cayley 変換、交換子、Sylvester 方程式を扱います。",
    ko: "복습 라이브러리는 Vandermonde, Woodbury, 멱영, 실 반대칭행렬, 극분해, Cayley 변환, 교환자, Sylvester 방정식을 다룹니다.",
    ru: "Библиотека повторения охватывает Vandermonde, Woodbury, нильпотентные и вещественные кососимметричные матрицы, полярное разложение, преобразование Cayley, коммутаторы и уравнения Sylvester."
  },
  "guide.analysis.cas": {
    "zh-CN": "基础 CAS",
    "zh-TW": "基礎 CAS",
    en: "CAS Basics",
    fr: "Bases CAS",
    ja: "CAS 基礎",
    ko: "CAS 기본",
    ru: "Основы CAS"
  },
  "guide.analysis.equation": {
    "zh-CN": "方程与 ODE",
    "zh-TW": "方程與 ODE",
    en: "Equations and ODEs",
    fr: "Equations et EDO",
    ja: "方程式と ODE",
    ko: "방정식과 ODE",
    ru: "Уравнения и ОДУ"
  },
  "guide.analysis.fourier": {
    "zh-CN": "傅里叶与特殊函数",
    "zh-TW": "傅立葉與特殊函數",
    en: "Fourier and Special Functions",
    fr: "Fourier et fonctions speciales",
    ja: "Fourier と特殊関数",
    ko: "푸리에와 특수함수",
    ru: "Фурье и спецфункции"
  },
  "guide.analysis.limit": {
    "zh-CN": "极限与导数",
    "zh-TW": "極限與導數",
    en: "Limits and Derivatives",
    fr: "Limites et derivees",
    ja: "極限と導関数",
    ko: "극한과 도함수",
    ru: "Пределы и производные"
  },
  "guide.analysis.integral": {
    "zh-CN": "积分与级数",
    "zh-TW": "積分與級數",
    en: "Integrals and Series",
    fr: "Integrales et series",
    ja: "積分と級数",
    ko: "적분과 급수",
    ru: "Интегралы и ряды"
  },
  "guide.analysis.convergence": {
    "zh-CN": "收敛判别",
    "zh-TW": "收斂判別",
    en: "Convergence Tests",
    fr: "Tests de convergence",
    ja: "収束判定",
    ko: "수렴 판정",
    ru: "Признаки сходимости"
  },
  "guide.analysis.multivar": {
    "zh-CN": "多元函数与场论",
    "zh-TW": "多元函數與場論",
    en: "Multivariable and Fields",
    fr: "Multivariable et champs",
    ja: "多変数と場",
    ko: "다변수와 장",
    ru: "Многие переменные и поля"
  },
  "guide.analysis.runExample.copy": {
    "zh-CN": "点击示例按钮后会自动填入并运行。先看命令格式，再替换表达式。",
    "zh-TW": "點擊範例按鈕後會自動填入並執行。先看命令格式，再替換表達式。",
    en: "Click an example button to fill and run it. Read the command format first, then replace the expression.",
    fr: "Cliquez sur un exemple pour le remplir et l'executer. Observez la commande, puis remplacez l'expression.",
    ja: "例ボタンを押すと入力され実行されます。コマンド形式を見てから式を置き換えます。",
    ko: "예시 버튼을 누르면 입력되고 실행됩니다. 명령 형식을 먼저 보고 식을 바꾸세요.",
    ru: "Нажмите пример, чтобы заполнить и запустить его. Сначала посмотрите формат команды, затем замените выражение."
  },
  "guide.analysis.onlineWait.copy": {
    "zh-CN": "线上首次运行会比本地慢，通常是 Python/SymPy 冷启动。输出区显示运行提示时，等待返回即可。",
    "zh-TW": "線上首次執行會比本機慢，通常是 Python/SymPy 冷啟動。輸出區顯示執行提示時，等待返回即可。",
    en: "The first online run can be slower than local use because Python/SymPy may cold start. Wait while the output panel shows the running message.",
    fr: "Le premier lancement en ligne peut etre plus lent a cause du demarrage a froid de Python/SymPy. Attendez le retour dans la sortie.",
    ja: "オンライン初回実行は Python/SymPy のコールドスタートでローカルより遅い場合があります。出力欄の実行中表示を待ってください。",
    ko: "온라인 첫 실행은 Python/SymPy 콜드 스타트 때문에 로컬보다 느릴 수 있습니다. 출력 영역의 실행 안내가 끝날 때까지 기다리세요.",
    ru: "Первый онлайн-запуск может быть медленнее локального из-за холодного старта Python/SymPy. Дождитесь ответа в панели вывода."
  },
  "guide.analysis.limit.copy": {
    "zh-CN": "极限使用",
    "zh-TW": "極限使用",
    en: "Use",
    fr: "Utilisez",
    ja: "極限は",
    ko: "극한은",
    ru: "Для пределов используйте"
  },
  "guide.analysis.derivative.copy": {
    "zh-CN": "导数使用",
    "zh-TW": "導數使用",
    en: "and derivatives use",
    fr: "et les derivees utilisent",
    ja: "導関数は",
    ko: "도함수는",
    ru: "а для производных"
  },
  "guide.analysis.integral.copy": {
    "zh-CN": "积分使用",
    "zh-TW": "積分使用",
    en: "Use",
    fr: "Utilisez",
    ja: "積分は",
    ko: "적분은",
    ru: "Для интегралов используйте"
  },
  "guide.analysis.series.copy": {
    "zh-CN": "级数展开用",
    "zh-TW": "級數展開用",
    en: "and series expansions use",
    fr: "et les developpements en serie utilisent",
    ja: "級数展開は",
    ko: "급수 전개는",
    ru: "а для разложения в ряд"
  },
  "guide.analysis.equation.copy": {
    "zh-CN": "代数方程可写",
    "zh-TW": "代數方程可寫",
    en: "Write algebraic equations as",
    fr: "Ecrivez les equations algebriques comme",
    ja: "代数方程式は次のように書けます",
    ko: "대수방정식은 이렇게 쓸 수 있습니다",
    ru: "Алгебраические уравнения записываются как"
  },
  "guide.analysis.ode.copy": {
    "zh-CN": "常微分方程可写",
    "zh-TW": "常微分方程可寫",
    en: "and ODEs as",
    fr: "et les EDO comme",
    ja: "常微分方程式は",
    ko: "ODE는",
    ru: "а ОДУ как"
  },
  "guide.analysis.fourier.copy": {
    "zh-CN": "傅里叶级数使用",
    "zh-TW": "傅立葉級數使用",
    en: "Fourier series use",
    fr: "Les series de Fourier utilisent",
    ja: "Fourier 級数は",
    ko: "푸리에 급수는",
    ru: "Для рядов Фурье используйте"
  },
  "guide.analysis.special.copy": {
    "zh-CN": "特殊函数可使用 Gamma、Beta、erf。",
    "zh-TW": "特殊函數可使用 Gamma、Beta、erf。",
    en: "Special functions include Gamma, Beta, and erf.",
    fr: "Les fonctions speciales incluent Gamma, Beta et erf.",
    ja: "特殊関数は Gamma、Beta、erf を使えます。",
    ko: "특수함수는 Gamma, Beta, erf를 사용할 수 있습니다.",
    ru: "Доступны спецфункции Gamma, Beta и erf."
  },
  "guide.analysis.convergence.copy": {
    "zh-CN": "新版核心加入数列极限提示、epsilon-delta 提示、比较/积分/Dirichlet-Abel 判别和幂级数收敛区间。",
    "zh-TW": "新版核心加入數列極限提示、epsilon-delta 提示、比較/積分/Dirichlet-Abel 判別和冪級數收斂區間。",
    en: "The newer core adds sequence-limit hints, epsilon-delta hints, comparison, integral and Dirichlet-Abel tests, plus power-series intervals.",
    fr: "Le nouveau noyau ajoute suites, epsilon-delta, tests de comparaison, integrale et Dirichlet-Abel, ainsi que les intervalles des series entieres.",
    ja: "新しいコアは数列極限、epsilon-delta、比較・積分・Dirichlet-Abel 判定、冪級数の収束区間を追加します。",
    ko: "새 코어는 수열 극한, epsilon-delta, 비교/적분/Dirichlet-Abel 판정, 멱급수 수렴구간을 추가합니다.",
    ru: "Новое ядро добавляет подсказки для последовательностей, epsilon-delta, признаки сравнения, интегральный и Dirichlet-Abel, а также интервалы степенных рядов."
  },
  "guide.analysis.multivar.copy": {
    "zh-CN": "可做多元极限、连续可微、隐函数、Jacobi 矩阵、曲线积分、Green 公式、Gauss 公式和 Stokes 公式等报告。",
    "zh-TW": "可做多元極限、連續可微、隱函數、Jacobi 矩陣、曲線積分、Green 公式、Gauss 公式和 Stokes 公式等報告。",
    en: "It can report on multivariable limits, continuity, differentiability, implicit functions, Jacobians, line integrals, Green, Gauss, and Stokes formulas.",
    fr: "Il produit des rapports sur limites multivariables, continuite, differentiabilite, fonctions implicites, jacobiens, integrales curvilignes, Green, Gauss et Stokes.",
    ja: "多変数極限、連続性、可微性、陰関数、Jacobi 行列、線積分、Green・Gauss・Stokes の公式をレポートできます。",
    ko: "다변수 극한, 연속성, 미분가능성, 음함수, Jacobi 행렬, 선적분, Green, Gauss, Stokes 공식을 보고할 수 있습니다.",
    ru: "Доступны отчеты по пределам многих переменных, непрерывности, дифференцируемости, неявным функциям, якобианам, криволинейным интегралам, формулам Green, Gauss и Stokes."
  },
  "algebra.example.matrix": {
    "zh-CN": "矩阵基础",
    "zh-TW": "矩陣基礎",
    en: "Matrix Basics",
    fr: "Matrices",
    ja: "行列基礎",
    ko: "행렬 기본",
    ru: "Матрицы"
  },
  "algebra.example.linear": {
    "zh-CN": "线性方程组",
    "zh-TW": "線性方程組",
    en: "Linear Systems",
    fr: "Systemes",
    ja: "連立一次",
    ko: "선형방정식",
    ru: "Системы"
  },
  "algebra.example.quadratic": {
    "zh-CN": "二次型",
    "zh-TW": "二次型",
    en: "Quadratic Form",
    fr: "Forme quadratique",
    ja: "二次形式",
    ko: "이차형식",
    ru: "Квадратичная форма"
  },
  "algebra.example.poly": {
    "zh-CN": "多项式",
    "zh-TW": "多項式",
    en: "Polynomials",
    fr: "Polynomes",
    ja: "多項式",
    ko: "다항식",
    ru: "Многочлены"
  },
  "algebra.example.review": {
    "zh-CN": "复习专题",
    "zh-TW": "複習專題",
    en: "Review",
    fr: "Revision",
    ja: "復習",
    ko: "복습",
    ru: "Повторение"
  },
  "analysis.example.cas": {
    "zh-CN": "CAS 基础",
    "zh-TW": "CAS 基礎",
    en: "CAS Basics",
    fr: "Bases CAS",
    ja: "CAS 基礎",
    ko: "CAS 기본",
    ru: "Основы CAS"
  },
  "analysis.example.convergence": {
    "zh-CN": "收敛判别",
    "zh-TW": "收斂判別",
    en: "Convergence",
    fr: "Convergence",
    ja: "収束判定",
    ko: "수렴 판정",
    ru: "Сходимость"
  },
  "analysis.example.series": {
    "zh-CN": "级数与傅里叶",
    "zh-TW": "級數與傅立葉",
    en: "Series & Fourier",
    fr: "Series et Fourier",
    ja: "級数と Fourier",
    ko: "급수와 푸리에",
    ru: "Ряды и Фурье"
  },
  "analysis.example.ode": {
    "zh-CN": "方程与 ODE",
    "zh-TW": "方程與 ODE",
    en: "Equations & ODE",
    fr: "Equations et EDO",
    ja: "方程式と ODE",
    ko: "방정식과 ODE",
    ru: "Уравнения и ОДУ"
  },
  "analysis.example.multivar": {
    "zh-CN": "多元函数",
    "zh-TW": "多元函數",
    en: "Multivariable",
    fr: "Multivariable",
    ja: "多変数",
    ko: "다변수",
    ru: "Многие переменные"
  },
  "padic.copy": {
    "zh-CN": "选择终端安装器，或打开无需安装的网页版转换器。终端版安装器使用 p进数工具仓库的 main2.0 分支。",
    "zh-TW": "選擇終端安裝器，或打開無需安裝的網頁版轉換器。終端版安裝器使用 p進數工具倉庫的 main2.0 分支。",
    en: "Choose a terminal installer or open the no-install web converter. Installers use the p-adic main2.0 branch.",
    fr: "Choisissez l'installateur terminal ou le convertisseur web sans installation. Les installateurs utilisent la branche main2.0 du depot p-adique.",
    ja: "端末インストーラか、インストール不要の Web 変換器を選べます。インストーラは p進数ツールリポジトリの main2.0 を使います。",
    ko: "터미널 설치기 또는 설치 없는 웹 변환기를 선택합니다. 설치기는 p진수 도구 저장소의 main2.0 브랜치를 사용합니다.",
    ru: "Выберите установщик или веб-конвертер без установки. Установщики используют ветку main2.0 репозитория инструмента p-адических чисел."
  },
  "padic.eyebrow": {
    "zh-CN": "学习工具",
    "zh-TW": "學習工具",
    en: "study tool",
    fr: "outil d'etude",
    ja: "学習ツール",
    ko: "학습 도구",
    ru: "учебный инструмент"
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
  "padic.download.linux.copy": {
    "zh-CN": "下载后打开或在终端运行，先清理旧版本，再安装 smc-padic。",
    "zh-TW": "下載後開啟或在終端執行，先清理舊版本，再安裝 smc-padic。",
    en: "Open it after download or run it in Terminal. It removes old files before installing smc-padic.",
    fr: "Ouvrez-le apres le telechargement ou lancez-le dans le terminal. Il nettoie l'ancienne version avant smc-padic.",
    ja: "ダウンロード後に開くか端末で実行します。古いファイルを消してから smc-padic を入れます。",
    ko: "다운로드 후 열거나 터미널에서 실행합니다. 이전 파일을 지운 뒤 smc-padic을 설치합니다.",
    ru: "Откройте после загрузки или запустите в терминале. Старые файлы будут удалены перед установкой smc-padic."
  },
  "padic.download.macos.copy": {
    "zh-CN": "下载后打开，脚本会请求密码授权并自动完成安装。",
    "zh-TW": "下載後開啟，腳本會要求密碼授權並自動完成安裝。",
    en: "Open it after download. The script asks for password authorization and completes installation.",
    fr: "Ouvrez-le apres le telechargement. Le script demandera le mot de passe puis installera l'outil.",
    ja: "ダウンロード後に開きます。スクリプトがパスワード承認を求め、自動でインストールします。",
    ko: "다운로드 후 엽니다. 스크립트가 암호 권한을 요청하고 설치를 마칩니다.",
    ru: "Откройте после загрузки. Скрипт запросит пароль и завершит установку."
  },
  "padic.download.windows.copy": {
    "zh-CN": "下载后双击运行，先清理旧安装目录，再执行 Windows 安装流程。",
    "zh-TW": "下載後雙擊執行，先清理舊安裝目錄，再執行 Windows 安裝流程。",
    en: "Double-click after download. It clears the old install folder before running the Windows setup.",
    fr: "Double-cliquez apres le telechargement. Il nettoie l'ancien dossier avant l'installation Windows.",
    ja: "ダウンロード後にダブルクリックします。古いインストール先を消してから Windows 用の手順を実行します。",
    ko: "다운로드 후 두 번 클릭합니다. 이전 설치 폴더를 정리한 뒤 Windows 설치를 실행합니다.",
    ru: "Дважды щелкните после загрузки. Старый каталог будет очищен перед установкой Windows."
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
    "zh-CN": "输入表达式和素数 p，在浏览器里生成 p进数展开，并可输入 help 查看完整指令。",
    "zh-TW": "輸入表達式和質數 p，在瀏覽器裡生成 p進數展開，並可輸入 help 查看完整指令。",
    en: "Enter an expression and prime p to generate a p-adic expansion in the browser. Type help for commands.",
    fr: "Entrez une expression et un nombre premier p pour generer un developpement p-adique. Tapez help pour les commandes.",
    ja: "式と素数 p を入力してブラウザで p進数展開を作ります。help で説明を表示します。",
    ko: "표현식과 소수 p를 입력해 브라우저에서 p진수 전개를 만듭니다. help로 명령을 봅니다.",
    ru: "Введите выражение и простое p, чтобы получить p-адическое разложение. help покажет команды."
  },
  "padic.web.pageCopy": {
    "zh-CN": "输入类似 1/3 5、3+4*2 5 或 pow(2,10) 7 的指令。输入 help 可查看完整说明。",
    "zh-TW": "輸入類似 1/3 5、3+4*2 5 或 pow(2,10) 7 的指令。輸入 help 可查看完整說明。",
    en: "Enter commands like 1/3 5, 3+4*2 5 or pow(2,10) 7. Type help for the full guide.",
    fr: "Entrez des commandes comme 1/3 5, 3+4*2 5 ou pow(2,10) 7. Tapez help pour le guide complet.",
    ja: "1/3 5、3+4*2 5、pow(2,10) 7 のように入力します。help で説明を表示します。",
    ko: "1/3 5, 3+4*2 5, pow(2,10) 7 같은 명령을 입력합니다. help로 전체 안내를 봅니다.",
    ru: "Введите команды вроде 1/3 5, 3+4*2 5 или pow(2,10) 7. help покажет полную справку."
  },
  "padic.web.command": {
    "zh-CN": "指令",
    "zh-TW": "指令",
    en: "Command",
    fr: "Commande",
    ja: "コマンド",
    ko: "명령",
    ru: "Команда"
  },
  "padic.web.convert": {
    "zh-CN": "转换",
    "zh-TW": "轉換",
    en: "Convert",
    fr: "Convertir",
    ja: "変換",
    ko: "변환",
    ru: "Преобразовать"
  },
  "padic.web.examples": {
    "zh-CN": "示例",
    "zh-TW": "範例",
    en: "Examples",
    fr: "Exemples",
    ja: "例",
    ko: "예시",
    ru: "Примеры"
  },
  "padic.web.noCommand": {
    "zh-CN": "请输入指令",
    "zh-TW": "請輸入指令",
    en: "Enter a command",
    fr: "Entrez une commande",
    ja: "コマンドを入力してください",
    ko: "명령을 입력하세요",
    ru: "Введите команду"
  },
  "padic.web.working": {
    "zh-CN": "计算中...",
    "zh-TW": "計算中...",
    en: "Calculating...",
    fr: "Calcul...",
    ja: "計算中...",
    ko: "계산 중...",
    ru: "Вычисление..."
  },
  "padic.web.error": {
    "zh-CN": "p进数计算失败",
    "zh-TW": "p進數計算失敗",
    en: "p-adic calculation failed",
    fr: "Le calcul p-adique a echoue",
    ja: "p進数計算に失敗しました",
    ko: "p진수 계산에 실패했습니다",
    ru: "Не удалось выполнить p-адическое вычисление"
  },
  "padic.web.tooLong": {
    "zh-CN": "指令过长",
    "zh-TW": "指令過長",
    en: "Command is too long",
    fr: "Commande trop longue",
    ja: "コマンドが長すぎます",
    ko: "명령이 너무 깁니다",
    ru: "Команда слишком длинная"
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
  "module.private.kicker": {
    "zh-CN": "需要密码",
    "zh-TW": "需要密碼",
    en: "Password required",
    fr: "Mot de passe requis",
    ja: "パスワードが必要",
    ko: "비밀번호 필요",
    ru: "Нужен пароль"
  },
  "module.private.title": {
    "zh-CN": "我的私人空间",
    "zh-TW": "我的私人空間",
    en: "My Private Space",
    fr: "Mon espace prive",
    ja: "私のプライベート空間",
    ko: "나의 개인 공간",
    ru: "Мое личное пространство"
  },
  "module.private.copy": {
    "zh-CN": "暂时先放自我简介，后续内容慢慢补进来。",
    "zh-TW": "暫時先放自我簡介，後續內容慢慢補進來。",
    en: "A protected place for the self-introduction first; more can be added later.",
    fr: "Un espace protege pour l'auto-presentation, a completer plus tard.",
    ja: "まず自己紹介を置く保護された場所です。あとで内容を追加できます。",
    ko: "먼저 자기소개를 두는 보호된 공간입니다. 내용은 나중에 더할 수 있습니다.",
    ru: "Защищенное место для автобиографии, остальное можно добавить позже."
  },
  "private.corner": {
    "zh-CN": "私人空间",
    "zh-TW": "私人空間",
    en: "Private",
    fr: "Prive",
    ja: "Private",
    ko: "개인 공간",
    ru: "Личное"
  },
  "private.gate.eyebrow": {
    "zh-CN": "私人空间",
    "zh-TW": "私人空間",
    en: "private space",
    fr: "espace prive",
    ja: "プライベート空間",
    ko: "개인 공간",
    ru: "личное пространство"
  },
  "private.gate.title": {
    "zh-CN": "我的私人空间",
    "zh-TW": "我的私人空間",
    en: "My Private Space",
    fr: "Mon espace prive",
    ja: "私のプライベート空間",
    ko: "나의 개인 공간",
    ru: "Мое личное пространство"
  },
  "private.gate.copy": {
    "zh-CN": "输入密码后进入。这里暂时只放自我简介，后面的内容之后再补。",
    "zh-TW": "輸入密碼後進入。這裡暫時只放自我簡介，後面的內容之後再補。",
    en: "Enter the password to continue. For now it keeps only the self-introduction.",
    fr: "Entrez le mot de passe pour continuer. Pour l'instant, seul le profil est ici.",
    ja: "パスワードを入力して進みます。今は自己紹介だけを置いています。",
    ko: "비밀번호를 입력해 들어갑니다. 지금은 자기소개만 둡니다.",
    ru: "Введите пароль, чтобы продолжить. Пока здесь только автобиография."
  },
  "private.password.label": {
    "zh-CN": "密码",
    "zh-TW": "密碼",
    en: "Password",
    fr: "Mot de passe",
    ja: "パスワード",
    ko: "비밀번호",
    ru: "Пароль"
  },
  "private.password.placeholder": {
    "zh-CN": "输入密码",
    "zh-TW": "輸入密碼",
    en: "Enter password",
    fr: "Entrer le mot de passe",
    ja: "パスワードを入力",
    ko: "비밀번호 입력",
    ru: "Введите пароль"
  },
  "private.password.error": {
    "zh-CN": "密码不正确",
    "zh-TW": "密碼不正確",
    en: "Incorrect password",
    fr: "Mot de passe incorrect",
    ja: "パスワードが正しくありません",
    ko: "비밀번호가 올바르지 않습니다",
    ru: "Неверный пароль"
  },
  "private.password.rateLimited": {
    "zh-CN": "尝试次数过多，请稍后再试",
    "zh-TW": "嘗試次數過多，請稍後再試",
    en: "Too many attempts. Please try again later.",
    fr: "Trop de tentatives. Reessayez plus tard.",
    ja: "試行回数が多すぎます。しばらくしてから再試行してください。",
    ko: "시도 횟수가 너무 많습니다. 잠시 후 다시 시도하세요.",
    ru: "Слишком много попыток. Попробуйте позже."
  },
  "private.remember": {
    "zh-CN": "记住此登录设备",
    "zh-TW": "記住此登入裝置",
    en: "Remember this device",
    fr: "Se souvenir de cet appareil",
    ja: "この端末を記憶",
    ko: "이 기기 기억",
    ru: "Запомнить это устройство"
  },
  "private.enter": {
    "zh-CN": "进入私人空间",
    "zh-TW": "進入私人空間",
    en: "Enter Private Space",
    fr: "Entrer dans l'espace prive",
    ja: "プライベート空間へ",
    ko: "개인 공간 입장",
    ru: "Войти в личное пространство"
  },
  "private.lock": {
    "zh-CN": "退出",
    "zh-TW": "退出",
    en: "Sign out",
    fr: "Deconnexion",
    ja: "ログアウト",
    ko: "로그아웃",
    ru: "Выйти"
  },
  "private.profile.eyebrow": {
    "zh-CN": "自我简介",
    "zh-TW": "自我簡介",
    en: "self introduction",
    fr: "presentation",
    ja: "自己紹介",
    ko: "자기소개",
    ru: "автобиография"
  },
  "private.nav.label": {
    "zh-CN": "私人空间导航",
    "zh-TW": "私人空間導覽",
    en: "Private space navigation",
    fr: "Navigation de l'espace prive",
    ja: "プライベート空間ナビゲーション",
    ko: "개인 공간 탐색",
    ru: "Навигация личного пространства"
  },
  "private.nav.profile": {
    "zh-CN": "自我简介",
    "zh-TW": "自我簡介",
    en: "Profile",
    fr: "Profil",
    ja: "自己紹介",
    ko: "자기소개",
    ru: "Профиль"
  },
  "private.nav.security": {
    "zh-CN": "安全登录",
    "zh-TW": "安全登入",
    en: "Security",
    fr: "Sécurité",
    ja: "セキュリティ",
    ko: "보안",
    ru: "Безопасность"
  },
  "private.nav.mail": {
    "zh-CN": "邮箱管理",
    "zh-TW": "信箱管理",
    en: "Mail",
    fr: "Messagerie",
    ja: "メール管理",
    ko: "메일 관리",
    ru: "Почта"
  },
  "private.nav.data": {
    "zh-CN": "数据管理",
    "zh-TW": "資料管理",
    en: "Data",
    fr: "Données",
    ja: "データ",
    ko: "데이터",
    ru: "Данные"
  },
  "private.profile.edit": {
    "zh-CN": "编辑",
    "zh-TW": "編輯",
    en: "Edit",
    fr: "Modifier",
    ja: "編集",
    ko: "편집",
    ru: "Изменить"
  },
  "private.profile.save": {
    "zh-CN": "保存",
    "zh-TW": "儲存",
    en: "Save",
    fr: "Enregistrer",
    ja: "保存",
    ko: "저장",
    ru: "Сохранить"
  },
  "private.profile.saved": {
    "zh-CN": "已保存",
    "zh-TW": "已儲存",
    en: "Saved",
    fr: "Enregistre",
    ja: "保存しました",
    ko: "저장됨",
    ru: "Сохранено"
  },
  "private.profile.saveError": {
    "zh-CN": "保存失败，请稍后再试",
    "zh-TW": "儲存失敗，請稍後再試",
    en: "Save failed. Please try again later.",
    fr: "Echec de l'enregistrement. Reessayez plus tard.",
    ja: "保存に失敗しました。しばらくしてから再試行してください。",
    ko: "저장에 실패했습니다. 잠시 후 다시 시도하세요.",
    ru: "Не удалось сохранить. Попробуйте позже."
  },
  "private.profile.nameLabel": {
    "zh-CN": "姓名",
    "zh-TW": "姓名",
    en: "Name",
    fr: "Nom",
    ja: "名前",
    ko: "이름",
    ru: "Имя"
  },
  "private.profile.birthLabel": {
    "zh-CN": "出生",
    "zh-TW": "出生",
    en: "Born",
    fr: "Naissance",
    ja: "生年月日",
    ko: "출생",
    ru: "Рождение"
  },
  "private.profile.noteLabel": {
    "zh-CN": "简介",
    "zh-TW": "簡介",
    en: "Profile",
    fr: "Profil",
    ja: "紹介",
    ko: "소개",
    ru: "Профиль"
  },
  "private.mail.eyebrow": {
    "zh-CN": "邮箱总站",
    "zh-TW": "信箱總站",
    en: "mail hub",
    fr: "hub mail",
    ja: "メールハブ",
    ko: "메일 허브",
    ru: "почтовый центр"
  },
  "private.mail.title": {
    "zh-CN": "邮箱登录库",
    "zh-TW": "信箱登入庫",
    en: "Mail Login Vault",
    fr: "Coffre des connexions mail",
    ja: "メールログイン保管庫",
    ko: "메일 로그인 보관함",
    ru: "Хранилище входов в почту"
  },
  "private.mail.hubTitle": {
    "zh-CN": "个人邮箱总站",
    "zh-TW": "個人信箱總站",
    en: "Personal Mail Hub",
    fr: "Centre de messagerie",
    ja: "個人メールハブ",
    ko: "개인 메일 허브",
    ru: "Личный почтовый центр"
  },
  "private.mail.hubCopy": {
    "zh-CN": "集中切换邮箱与查看收件。秘密信息在浏览器内加密后保存，服务端只保存密文。",
    "zh-TW": "集中切換信箱與查看收件。秘密資訊在瀏覽器內加密後保存，服務端只保存密文。",
    en: "Switch mailboxes and read messages in one place. Secrets are encrypted in the browser; the server stores ciphertext only.",
    fr: "Basculez entre vos comptes et consultez les messages au même endroit. Les secrets sont chiffrés dans le navigateur ; le serveur ne conserve que le texte chiffré.",
    ja: "複数のメールを切り替えて受信を確認できます。秘密情報はブラウザ内で暗号化され、サーバーには暗号文だけが保存されます。",
    ko: "여러 메일 계정을 전환하고 받은 메일을 한곳에서 확인합니다. 비밀 정보는 브라우저에서 암호화되며 서버에는 암호문만 저장됩니다.",
    ru: "Переключайтесь между ящиками и читайте входящие в одном месте. Секреты шифруются в браузере; сервер хранит только шифротекст."
  },
  "private.mail.accounts": {
    "zh-CN": "邮箱列表",
    "zh-TW": "信箱列表",
    en: "Mailboxes",
    fr: "Boîtes mail",
    ja: "メール一覧",
    ko: "메일 목록",
    ru: "Почтовые ящики"
  },
  "private.mail.add": {
    "zh-CN": "添加邮箱",
    "zh-TW": "添加信箱",
    en: "Add mailbox",
    fr: "Ajouter une boîte",
    ja: "メールを追加",
    ko: "메일 추가",
    ru: "Добавить ящик"
  },
  "private.mail.sync": {
    "zh-CN": "收取",
    "zh-TW": "收取",
    en: "Fetch",
    fr: "Relever",
    ja: "受信",
    ko: "받기",
    ru: "Получить"
  },
  "private.mail.compose": {
    "zh-CN": "写邮件",
    "zh-TW": "寫郵件",
    en: "Compose",
    fr: "Nouveau message",
    ja: "メール作成",
    ko: "메일 쓰기",
    ru: "Написать"
  },
  "private.mail.inbox": {
    "zh-CN": "收件箱",
    "zh-TW": "收件箱",
    en: "Inbox",
    fr: "Boîte de réception",
    ja: "受信トレイ",
    ko: "받은편지함",
    ru: "Входящие"
  },
  "private.mail.noAccount": {
    "zh-CN": "未选择邮箱",
    "zh-TW": "未選擇信箱",
    en: "No mailbox selected",
    fr: "Aucune boîte sélectionnée",
    ja: "メール未選択",
    ko: "선택한 메일 없음",
    ru: "Ящик не выбран"
  },
  "private.mail.readyTitle": {
    "zh-CN": "邮箱总站已就绪",
    "zh-TW": "信箱總站已就緒",
    en: "Mail hub is ready",
    fr: "La messagerie est prête",
    ja: "メールハブの準備ができました",
    ko: "메일 허브가 준비되었습니다",
    ru: "Почтовый центр готов"
  },
  "private.mail.readyCopy": {
    "zh-CN": "添加邮箱后，这里会显示对应邮箱的收件列表。",
    "zh-TW": "添加信箱後，這裡會顯示對應信箱的收件列表。",
    en: "After adding a mailbox, its inbox will appear here.",
    fr: "Après l'ajout d'une boîte, ses messages apparaîtront ici.",
    ja: "メールを追加すると、受信一覧がここに表示されます。",
    ko: "메일을 추가하면 받은 메일이 여기에 표시됩니다.",
    ru: "После добавления ящика здесь появятся входящие сообщения."
  },
  "private.mail.to": {
    "zh-CN": "收件人",
    "zh-TW": "收件人",
    en: "To",
    fr: "Destinataire",
    ja: "宛先",
    ko: "받는 사람",
    ru: "Получатель"
  },
  "private.mail.subject": {
    "zh-CN": "主题",
    "zh-TW": "主題",
    en: "Subject",
    fr: "Objet",
    ja: "件名",
    ko: "제목",
    ru: "Тема"
  },
  "private.mail.body": {
    "zh-CN": "正文",
    "zh-TW": "正文",
    en: "Message",
    fr: "Message",
    ja: "本文",
    ko: "본문",
    ru: "Текст"
  },
  "private.mail.send": {
    "zh-CN": "发送",
    "zh-TW": "發送",
    en: "Send",
    fr: "Envoyer",
    ja: "送信",
    ko: "보내기",
    ru: "Отправить"
  },
  "private.mail.addEyebrow": {
    "zh-CN": "添加邮箱",
    "zh-TW": "添加信箱",
    en: "add mailbox",
    fr: "ajouter une boîte",
    ja: "メールを追加",
    ko: "메일 추가",
    ru: "добавление ящика"
  },
  "private.mail.addTitle": {
    "zh-CN": "添加邮箱",
    "zh-TW": "添加信箱",
    en: "Add Mailbox",
    fr: "Ajouter une boîte mail",
    ja: "メールを追加",
    ko: "메일 추가",
    ru: "Добавить почтовый ящик"
  },
  "private.mail.addCopy": {
    "zh-CN": "选择邮箱服务，并填写该服务提供的授权码或应用专用密码。不要填写网页登录密码。",
    "zh-TW": "選擇信箱服務，並填寫該服務提供的授權碼或應用程式專用密碼。不要填寫網頁登入密碼。",
    en: "Choose a mail service and enter its authorization code or app password. Do not enter your web sign-in password.",
    fr: "Choisissez un service puis saisissez son code d'autorisation ou son mot de passe d'application. N'utilisez pas le mot de passe du site web.",
    ja: "メールサービスを選び、認証コードまたはアプリパスワードを入力してください。Web ログイン用パスワードは入力しないでください。",
    ko: "메일 서비스를 선택하고 인증 코드나 앱 비밀번호를 입력하세요. 웹 로그인 비밀번호는 입력하지 마세요.",
    ru: "Выберите почтовый сервис и введите код авторизации или пароль приложения. Не вводите пароль веб-входа."
  },
  "private.mail.close": {
    "zh-CN": "关闭",
    "zh-TW": "關閉",
    en: "Close",
    fr: "Fermer",
    ja: "閉じる",
    ko: "닫기",
    ru: "Закрыть"
  },
  "private.mail.closeCompose": {
    "zh-CN": "关闭写信",
    "zh-TW": "關閉寫信",
    en: "Close composer",
    fr: "Fermer le nouveau message",
    ja: "メール作成を閉じる",
    ko: "메일 작성 닫기",
    ru: "Закрыть редактор"
  },
  "private.mail.toPlaceholder": {
    "zh-CN": "to@example.com",
    "zh-TW": "to@example.com",
    en: "to@example.com",
    fr: "destinataire@example.com",
    ja: "to@example.com",
    ko: "to@example.com",
    ru: "to@example.com"
  },
  "private.mail.subjectPlaceholder": {
    "zh-CN": "填写主题",
    "zh-TW": "填寫主題",
    en: "Add a subject",
    fr: "Ajouter un objet",
    ja: "件名を入力",
    ko: "제목 입력",
    ru: "Введите тему"
  },
  "private.mail.bodyPlaceholder": {
    "zh-CN": "写下邮件内容",
    "zh-TW": "寫下郵件內容",
    en: "Write your message",
    fr: "Rédigez votre message",
    ja: "本文を入力",
    ko: "메일 내용 입력",
    ru: "Введите текст сообщения"
  },
  "private.mail.openWebmail": {
    "zh-CN": "打开网页版邮箱",
    "zh-TW": "開啟網頁版信箱",
    en: "Open webmail",
    fr: "Ouvrir le webmail",
    ja: "Web メールを開く",
    ko: "웹메일 열기",
    ru: "Открыть веб-почту"
  },
  "private.mail.receiveOnlyTitle": {
    "zh-CN": "当前部署仅支持直接收件",
    "zh-TW": "目前部署僅支援直接收件",
    en: "This deployment can receive mail directly only",
    fr: "Ce déploiement ne peut recevoir les messages que directement",
    ja: "現在の環境では直接受信のみ利用できます",
    ko: "현재 배포에서는 직접 수신만 지원합니다",
    ru: "В этом развёртывании доступно только прямое получение"
  },
  "private.mail.receiveOnlyCopy": {
    "zh-CN": "Render 免费实例禁止连接 SMTP 发件端口；可继续在这里收件，并用“打开网页版邮箱”完成发送。",
    "zh-TW": "Render 免費執行個體禁止連線 SMTP 發件連接埠；可繼續在這裡收件，並用「開啟網頁版信箱」完成發送。",
    en: "Render's free instance blocks outbound SMTP ports. You can still receive here and use Open webmail to send.",
    fr: "L'instance gratuite de Render bloque les ports SMTP sortants. Vous pouvez toujours recevoir ici et utiliser Ouvrir le webmail pour envoyer.",
    ja: "Render の無料インスタンスは送信用 SMTP ポートを遮断します。ここで受信し、Web メールから送信できます。",
    ko: "Render 무료 인스턴스는 발신 SMTP 포트를 차단합니다. 여기서 메일을 받고 웹메일 열기로 보낼 수 있습니다.",
    ru: "Бесплатный экземпляр Render блокирует исходящие SMTP-порты. Получайте почту здесь, а для отправки откройте веб-почту."
  },
  "private.mail.deviceSync": {
    "zh-CN": "恢复选项",
    "zh-TW": "恢復選項",
    en: "Recovery options",
    fr: "Options de récupération",
    ja: "復旧オプション",
    ko: "복구 옵션",
    ru: "Варианты восстановления"
  },
  "private.mail.deviceSyncEyebrow": {
    "zh-CN": "高级恢复",
    "zh-TW": "進階恢復",
    en: "advanced recovery",
    fr: "récupération avancée",
    ja: "高度な復旧",
    ko: "고급 복구",
    ru: "расширенное восстановление"
  },
  "private.mail.deviceSyncTitle": {
    "zh-CN": "邮箱恢复选项",
    "zh-TW": "信箱恢復選項",
    en: "Mail recovery options",
    fr: "Options de récupération de la messagerie",
    ja: "メールの復旧オプション",
    ko: "메일 복구 옵션",
    ru: "Восстановление почты"
  },
  "private.mail.deviceSyncCopy": {
    "zh-CN": "在其他设备登录私人空间后，邮箱会自动解锁；恢复钥匙仅用于高级恢复。",
    "zh-TW": "在其他裝置登入私人空間後，信箱會自動解鎖；恢復鑰匙僅用於進階恢復。",
    en: "Mail unlocks automatically after sign-in on another device; the recovery key is only for advanced recovery.",
    fr: "La messagerie se déverrouille automatiquement après la connexion sur un autre appareil ; la clé sert uniquement à la récupération avancée.",
    ja: "別の端末でログインするとメールは自動的に解除され、復旧キーは高度な復旧時だけ使用します。",
    ko: "다른 기기에서 로그인하면 메일이 자동으로 잠금 해제되며, 복구 키는 고급 복구에만 사용됩니다.",
    ru: "После входа на другом устройстве почта откроется автоматически; ключ нужен только для расширенного восстановления."
  },
  "private.mail.autoSyncCopy": {
    "zh-CN": "在其他设备登录私人空间后，邮箱会自动解锁。只有迁移旧数据或恢复到其他服务器时，才需要保存恢复钥匙。",
    "zh-TW": "在其他裝置登入私人空間後，信箱會自動解鎖。只有遷移舊資料或恢復到其他伺服器時，才需要保存恢復鑰匙。",
    en: "Mail unlocks automatically after you sign in to the private space on another device. Save the recovery key only for legacy migration or restoration to another server.",
    fr: "La messagerie se déverrouille automatiquement après la connexion à l’espace privé sur un autre appareil. Conservez la clé uniquement pour migrer d’anciennes données ou restaurer vers un autre serveur.",
    ja: "別の端末でプライベートスペースへログインすると、メールは自動的に解除されます。復旧キーは旧データの移行や別サーバーへの復元時だけ保存してください。",
    ko: "다른 기기에서 개인 공간에 로그인하면 메일이 자동으로 잠금 해제됩니다. 복구 키는 이전 데이터 마이그레이션이나 다른 서버로 복원할 때만 보관하세요.",
    ru: "После входа в личное пространство на другом устройстве почта откроется автоматически. Сохраняйте ключ только для переноса старых данных или восстановления на другом сервере."
  },
  "private.mail.manualUnlockCopy": {
    "zh-CN": "这是一份尚未完成自动同步的旧邮箱库。请从仍能打开它的设备复制恢复钥匙。",
    "zh-TW": "這是一份尚未完成自動同步的舊信箱庫。請從仍能開啟它的裝置複製恢復鑰匙。",
    en: "This legacy mail vault has not completed automatic migration. Copy its recovery key from a device that can still open it.",
    fr: "Cet ancien coffre mail n’a pas terminé sa migration automatique. Copiez sa clé depuis un appareil qui peut encore l’ouvrir.",
    ja: "この旧メール保管庫は自動移行が完了していません。まだ開ける端末から復旧キーをコピーしてください。",
    ko: "이 기존 메일 보관함은 자동 마이그레이션을 완료하지 못했습니다. 아직 열 수 있는 기기에서 복구 키를 복사하세요.",
    ru: "Это старое почтовое хранилище ещё не прошло автоматический перенос. Скопируйте ключ с устройства, на котором оно открывается."
  },
  "private.mail.savedKeyMismatch": {
    "zh-CN": "本设备原先保存的钥匙与当前邮箱库不匹配。",
    "zh-TW": "本裝置原先保存的鑰匙與目前信箱庫不相符。",
    en: "The key previously saved on this device does not match the current mail vault.",
    fr: "La clé précédemment enregistrée sur cet appareil ne correspond pas au coffre mail actuel.",
    ja: "この端末に保存されていたキーは、現在のメール保管庫と一致しません。",
    ko: "이 기기에 저장된 기존 키가 현재 메일 보관함과 일치하지 않습니다.",
    ru: "Ранее сохранённый на этом устройстве ключ не подходит к текущему хранилищу."
  },
  "private.mail.copyKey": {
    "zh-CN": "复制恢复钥匙",
    "zh-TW": "複製恢復鑰匙",
    en: "Copy recovery key",
    fr: "Copier la clé de récupération",
    ja: "復旧キーをコピー",
    ko: "복구 키 복사",
    ru: "Скопировать ключ"
  },
  "private.mail.unlockDevice": {
    "zh-CN": "在此设备解锁",
    "zh-TW": "在此裝置解鎖",
    en: "Unlock on this device",
    fr: "Déverrouiller cet appareil",
    ja: "この端末で解除",
    ko: "이 기기에서 잠금 해제",
    ru: "Открыть на этом устройстве"
  },
  "private.mail.unlockCopy": {
    "zh-CN": "旧资料未能自动同步时，可使用高级恢复钥匙解锁。新资料会在登录私人空间后自动解锁。",
    "zh-TW": "舊資料未能自動同步時，可使用進階恢復鑰匙解鎖。新資料會在登入私人空間後自動解鎖。",
    en: "Use the advanced recovery key only when legacy data cannot sync automatically. Current data unlocks after Private Space sign-in.",
    fr: "Utilisez la clé de récupération avancée uniquement si d’anciennes données ne se synchronisent pas. Les données actuelles se déverrouillent après connexion à l’espace privé.",
    ja: "旧データが自動同期できない場合だけ高度な復旧キーを使用してください。現在のデータはプライベートスペースへのログイン後に自動解除されます。",
    ko: "이전 데이터가 자동 동기화되지 않을 때만 고급 복구 키를 사용하세요. 현재 데이터는 개인 공간 로그인 후 자동으로 잠금 해제됩니다.",
    ru: "Используйте ключ расширенного восстановления только для старых данных, которые не синхронизируются автоматически. Актуальные данные открываются после входа в личное пространство."
  },
  "private.mail.emptyHint": {
    "zh-CN": "添加第一个邮箱后即可开始收件。",
    "zh-TW": "添加第一個信箱後即可開始收件。",
    en: "Add your first mailbox to start fetching messages.",
    fr: "Ajoutez votre première boîte pour relever les messages.",
    ja: "最初のメールを追加すると受信できます。",
    ko: "첫 메일 계정을 추가하면 메일을 받을 수 있습니다.",
    ru: "Добавьте первый ящик, чтобы получать сообщения."
  },
  "private.mail.emptyCopy": {
    "zh-CN": "添加邮箱后可在这里切换账号。",
    "zh-TW": "添加信箱後可在這裡切換帳號。",
    en: "Added mailboxes will be available here.",
    fr: "Les boîtes ajoutées seront disponibles ici.",
    ja: "追加したメールはここで切り替えられます。",
    ko: "추가한 메일 계정을 여기서 전환할 수 있습니다.",
    ru: "Добавленные ящики появятся здесь."
  },
  "private.mail.addFirst": {
    "zh-CN": "添加第一个邮箱",
    "zh-TW": "添加第一個信箱",
    en: "Add first mailbox",
    fr: "Ajouter la première boîte",
    ja: "最初のメールを追加",
    ko: "첫 메일 추가",
    ru: "Добавить первый ящик"
  },
  "private.mail.edit": {
    "zh-CN": "编辑",
    "zh-TW": "編輯",
    en: "Edit",
    fr: "Modifier",
    ja: "編集",
    ko: "편집",
    ru: "Изменить"
  },
  "private.mail.copy": {
    "zh-CN": "这里保存各邮箱的登录入口和密钥备注。密钥会先在浏览器内二次加密，服务端只保存密文。",
    "zh-TW": "這裡保存各信箱的登入入口和金鑰備註。金鑰會先在瀏覽器內二次加密，服務端只保存密文。",
    en: "Save mail login links and secret notes here. Secrets are encrypted in the browser first; the server stores only ciphertext.",
    fr: "Enregistrez ici les liens et notes secretes. Le navigateur chiffre d'abord; le serveur ne garde que le chiffre.",
    ja: "メールのログイン先と秘密メモを保存します。秘密情報はブラウザで先に暗号化され、サーバーは暗号文だけを保存します。",
    ko: "메일 로그인 링크와 비밀 메모를 저장합니다. 비밀 정보는 브라우저에서 먼저 암호화되고 서버에는 암호문만 저장됩니다.",
    ru: "Здесь хранятся ссылки входа и секретные заметки. Секреты сначала шифруются в браузере; сервер хранит только шифртекст."
  },
  "private.mail.refresh": {
    "zh-CN": "刷新",
    "zh-TW": "重新整理",
    en: "Refresh",
    fr: "Actualiser",
    ja: "更新",
    ko: "새로고침",
    ru: "Обновить"
  },
  "private.mail.keyLabel": {
    "zh-CN": "高级恢复钥匙",
    "zh-TW": "進階恢復鑰匙",
    en: "Advanced recovery key",
    fr: "Clé de récupération avancée",
    ja: "高度な復旧キー",
    ko: "고급 복구 키",
    ru: "Ключ расширенного восстановления"
  },
  "private.mail.keyPlaceholder": {
    "zh-CN": "粘贴恢复钥匙",
    "zh-TW": "貼上恢復鑰匙",
    en: "Paste the recovery key",
    fr: "Collez la clé de récupération",
    ja: "復旧キーを貼り付け",
    ko: "복구 키 붙여넣기",
    ru: "Вставьте ключ восстановления"
  },
  "private.mail.generateKey": {
    "zh-CN": "生成恢复钥匙",
    "zh-TW": "生成恢復鑰匙",
    en: "Generate recovery key",
    fr: "Générer une clé de récupération",
    ja: "復旧キーを生成",
    ko: "복구 키 생성",
    ru: "Создать ключ восстановления"
  },
  "private.mail.unlock": {
    "zh-CN": "解锁邮箱库",
    "zh-TW": "解鎖信箱庫",
    en: "Unlock Vault",
    fr: "Deverrouiller",
    ja: "保管庫を解除",
    ko: "보관함 잠금 해제",
    ru: "Открыть хранилище"
  },
  "private.mail.keyHint": {
    "zh-CN": "仅在迁移旧数据或恢复到其他服务器时使用。请像密码一样保管，不要分享或截图。",
    "zh-TW": "僅在遷移舊資料或恢復到其他伺服器時使用。請像密碼一樣保管，不要分享或截圖。",
    en: "Use this only to migrate legacy data or restore to another server. Treat it like a password; do not share or screenshot it.",
    fr: "Utilisez-la uniquement pour migrer d’anciennes données ou restaurer vers un autre serveur. Traitez-la comme un mot de passe ; ne la partagez pas et ne la capturez pas.",
    ja: "旧データの移行や別サーバーへの復元時だけ使用します。パスワードと同様に扱い、共有や撮影をしないでください。",
    ko: "이전 데이터 마이그레이션이나 다른 서버로 복원할 때만 사용하세요. 비밀번호처럼 보관하고 공유하거나 캡처하지 마세요.",
    ru: "Используйте ключ только для переноса старых данных или восстановления на другом сервере. Храните как пароль, не делитесь им и не делайте снимки."
  },
  "private.mail.provider": {
    "zh-CN": "邮箱服务",
    "zh-TW": "信箱服務",
    en: "Mail service",
    fr: "Service mail",
    ja: "メールサービス",
    ko: "메일 서비스",
    ru: "Почтовый сервис"
  },
  "private.mail.providerCustom": {
    "zh-CN": "自定义",
    "zh-TW": "自訂",
    en: "Custom",
    fr: "Personnalisé",
    ja: "カスタム",
    ko: "사용자 지정",
    ru: "Другое"
  },
  "private.mail.guide.gmail": {
    "zh-CN": "Gmail 请先开启两步验证并生成 16 位应用专用密码。当前没有完整的“使用 Google 登录”流程；手动 OAuth 访问令牌通常约一小时失效。",
    "zh-TW": "Gmail 請先開啟兩步驗證並生成 16 位應用程式專用密碼。目前沒有完整的「使用 Google 登入」流程；手動 OAuth 存取權杖通常約一小時失效。",
    en: "For Gmail, enable 2-Step Verification and create a 16-digit app password. Full Sign in with Google is not implemented; manually entered OAuth access tokens usually expire in about an hour.",
    fr: "Pour Gmail, activez la validation en deux étapes et créez un mot de passe d'application à 16 chiffres. La connexion Google complète n'est pas disponible ; les jetons OAuth saisis manuellement expirent généralement après environ une heure.",
    ja: "Gmail は 2 段階認証を有効にし、16 桁のアプリパスワードを作成してください。完全な Google ログインは未実装で、手動入力した OAuth トークンは通常約 1 時間で失効します。",
    ko: "Gmail은 2단계 인증을 켠 뒤 16자리 앱 비밀번호를 만드세요. Google 로그인 전체 흐름은 아직 없으며 수동 OAuth 액세스 토큰은 보통 약 1시간 후 만료됩니다.",
    ru: "Для Gmail включите двухэтапную проверку и создайте 16-значный пароль приложения. Полный вход через Google не реализован; вручную введённый токен OAuth обычно истекает примерно через час."
  },
  "private.mail.guide.qq": {
    "zh-CN": "QQ 邮箱请在网页版设置中开启 IMAP/SMTP，并填写生成的授权码，不要填写 QQ 登录密码。收件使用 993 端口，发件使用 465 端口。",
    "zh-TW": "QQ 信箱請在網頁版設定中開啟 IMAP/SMTP，並填寫生成的授權碼，不要填寫 QQ 登入密碼。收件使用 993 連接埠，發件使用 465 連接埠。",
    en: "Enable IMAP/SMTP in QQ Mail settings and enter the generated authorization code, not your QQ password. Receiving uses port 993; sending uses port 465.",
    fr: "Activez IMAP/SMTP dans les réglages de QQ Mail et saisissez le code d'autorisation généré, pas votre mot de passe QQ. La réception utilise le port 993 et l'envoi le port 465.",
    ja: "QQ メール設定で IMAP/SMTP を有効にし、QQ パスワードではなく発行された認証コードを入力してください。受信は 993、送信は 465 ポートです。",
    ko: "QQ 메일 설정에서 IMAP/SMTP를 켜고 QQ 로그인 비밀번호가 아닌 발급된 인증 코드를 입력하세요. 수신은 993, 발신은 465 포트를 사용합니다.",
    ru: "Включите IMAP/SMTP в настройках QQ Mail и введите выданный код авторизации, а не пароль QQ. Для получения используется порт 993, для отправки — 465."
  },
  "private.mail.guide.163": {
    "zh-CN": "163 邮箱请开启 IMAP/SMTP，并填写客户端授权密码。",
    "zh-TW": "163 信箱請開啟 IMAP/SMTP，並填寫用戶端授權密碼。",
    en: "Enable IMAP/SMTP in 163 Mail and enter its client authorization password.",
    fr: "Activez IMAP/SMTP dans 163 Mail et saisissez son mot de passe d'autorisation client.",
    ja: "163 メールで IMAP/SMTP を有効にし、クライアント認証パスワードを入力してください。",
    ko: "163 메일에서 IMAP/SMTP를 켜고 클라이언트 인증 비밀번호를 입력하세요.",
    ru: "Включите IMAP/SMTP в 163 Mail и введите пароль авторизации клиента."
  },
  "private.mail.guide.icloud": {
    "zh-CN": "iCloud 需要 Apple ID 的应用专用密码。",
    "zh-TW": "iCloud 需要 Apple ID 的應用程式專用密碼。",
    en: "iCloud requires an app-specific password from your Apple ID.",
    fr: "iCloud nécessite un mot de passe spécifique à l'application depuis votre identifiant Apple.",
    ja: "iCloud には Apple ID のアプリ用パスワードが必要です。",
    ko: "iCloud는 Apple ID의 앱 전용 비밀번호가 필요합니다.",
    ru: "Для iCloud нужен пароль приложения из Apple ID."
  },
  "private.mail.guide.hrbeu": {
    "zh-CN": "HRBEU 服务器参数尚未配置，暂时不能在本站收发。",
    "zh-TW": "HRBEU 伺服器參數尚未設定，暫時不能在本站收發。",
    en: "HRBEU server settings are not configured yet, so this site cannot fetch or send its mail.",
    fr: "Les paramètres du serveur HRBEU ne sont pas encore configurés ; la réception et l'envoi ne sont donc pas disponibles ici.",
    ja: "HRBEU のサーバー設定は未構成のため、このサイトではまだ送受信できません。",
    ko: "HRBEU 서버 설정이 아직 구성되지 않아 이 사이트에서 송수신할 수 없습니다.",
    ru: "Параметры сервера HRBEU ещё не настроены, поэтому получение и отправка здесь недоступны."
  },
  "private.mail.guide.custom": {
    "zh-CN": "自定义邮箱尚未提供服务器主机与端口输入，暂时不能在本站收发。",
    "zh-TW": "自訂信箱尚未提供伺服器主機與連接埠輸入，暫時不能在本站收發。",
    en: "Custom server host and port fields are not available yet, so custom mail cannot fetch or send here.",
    fr: "Les champs d'hôte et de port personnalisés ne sont pas encore disponibles ; ces comptes ne peuvent donc pas envoyer ni recevoir ici.",
    ja: "カスタムサーバーのホストとポート入力は未実装のため、まだ送受信できません。",
    ko: "사용자 지정 서버 호스트와 포트 입력이 아직 없어 이 사이트에서 송수신할 수 없습니다.",
    ru: "Поля хоста и порта пользовательского сервера ещё не добавлены, поэтому отправка и получение недоступны."
  },
  "private.mail.address": {
    "zh-CN": "邮箱账号",
    "zh-TW": "信箱帳號",
    en: "Mail account",
    fr: "Compte mail",
    ja: "メールアカウント",
    ko: "메일 계정",
    ru: "Почтовый аккаунт"
  },
  "private.mail.addressPlaceholder": {
    "zh-CN": "name@example.com",
    "zh-TW": "name@example.com",
    en: "name@example.com",
    fr: "name@example.com",
    ja: "name@example.com",
    ko: "name@example.com",
    ru: "name@example.com"
  },
  "private.mail.loginUrl": {
    "zh-CN": "登录入口",
    "zh-TW": "登入入口",
    en: "Login link",
    fr: "Lien de connexion",
    ja: "ログイン先",
    ko: "로그인 링크",
    ru: "Ссылка входа"
  },
  "private.mail.loginUrlPlaceholder": {
    "zh-CN": "https://mail.example.com",
    "zh-TW": "https://mail.example.com",
    en: "https://mail.example.com",
    fr: "https://mail.example.com",
    ja: "https://mail.example.com",
    ko: "https://mail.example.com",
    ru: "https://mail.example.com"
  },
  "private.mail.secretType": {
    "zh-CN": "密钥类型",
    "zh-TW": "金鑰類型",
    en: "Secret type",
    fr: "Type de secret",
    ja: "秘密情報の種類",
    ko: "비밀 정보 유형",
    ru: "Тип секрета"
  },
  "private.mail.authType": {
    "zh-CN": "授权方式",
    "zh-TW": "授權方式",
    en: "Authorization",
    fr: "Autorisation",
    ja: "認証方式",
    ko: "인증 방식",
    ru: "Способ авторизации"
  },
  "private.mail.secretAppPassword": {
    "zh-CN": "应用专用密码",
    "zh-TW": "應用專用密碼",
    en: "App password",
    fr: "Mot de passe d'application",
    ja: "アプリ専用パスワード",
    ko: "앱 비밀번호",
    ru: "Пароль приложения"
  },
  "private.mail.secretOauth": {
    "zh-CN": "OAuth 访问令牌（高级）",
    "zh-TW": "OAuth 存取權杖（進階）",
    en: "OAuth access token (advanced)",
    fr: "Jeton d'accès OAuth (avancé)",
    ja: "OAuth アクセストークン（上級）",
    ko: "OAuth 액세스 토큰(고급)",
    ru: "Токен доступа OAuth (для опытных)"
  },
  "private.mail.secretImapSmtp": {
    "zh-CN": "IMAP/SMTP 密钥",
    "zh-TW": "IMAP/SMTP 金鑰",
    en: "IMAP/SMTP authorization code",
    fr: "Code d'autorisation IMAP/SMTP",
    ja: "IMAP/SMTP 認証コード",
    ko: "IMAP/SMTP 인증 코드",
    ru: "Код авторизации IMAP/SMTP"
  },
  "private.mail.secretSecurityKey": {
    "zh-CN": "安全密钥备注",
    "zh-TW": "安全金鑰備註",
    en: "Security key note",
    fr: "Note de cle de securite",
    ja: "セキュリティキーメモ",
    ko: "보안 키 메모",
    ru: "Заметка ключа безопасности"
  },
  "private.mail.secretRecovery": {
    "zh-CN": "恢复信息",
    "zh-TW": "復原資訊",
    en: "Recovery information",
    fr: "Information de recuperation",
    ja: "復元情報",
    ko: "복구 정보",
    ru: "Данные восстановления"
  },
  "private.mail.secret": {
    "zh-CN": "令牌或应用专用密码",
    "zh-TW": "權杖或應用專用密碼",
    en: "Token or app password",
    fr: "Jeton ou mot de passe d'application",
    ja: "トークンまたはアプリパスワード",
    ko: "토큰 또는 앱 비밀번호",
    ru: "Токен или пароль приложения"
  },
  "private.mail.secretPlaceholder": {
    "zh-CN": "粘贴授权令牌、应用专用密码或 IMAP/SMTP 密钥",
    "zh-TW": "貼上授權權杖、應用專用密碼或 IMAP/SMTP 金鑰",
    en: "Paste an OAuth token, app password, or IMAP/SMTP secret",
    fr: "Collez le jeton, le mot de passe d'application ou le code IMAP/SMTP",
    ja: "トークン、アプリパスワード、または IMAP/SMTP 認証コードを貼り付け",
    ko: "토큰, 앱 비밀번호 또는 IMAP/SMTP 인증 코드를 붙여넣으세요",
    ru: "Вставьте токен, пароль приложения или код IMAP/SMTP"
  },
  "private.mail.note": {
    "zh-CN": "备注",
    "zh-TW": "備註",
    en: "Note",
    fr: "Note",
    ja: "メモ",
    ko: "메모",
    ru: "Заметка"
  },
  "private.mail.notePlaceholder": {
    "zh-CN": "例如：学校邮箱、备用 Gmail、QQ 主邮箱",
    "zh-TW": "例如：學校信箱、備用 Gmail、QQ 主信箱",
    en: "Example: school mail, backup Gmail, main QQ mailbox",
    fr: "Exemple : université, Gmail secondaire, boîte QQ principale",
    ja: "例：大学メール、予備 Gmail、メイン QQ メール",
    ko: "예: 학교 메일, 보조 Gmail, 주 QQ 메일",
    ru: "Например: университетская почта, запасной Gmail, основной QQ"
  },
  "private.mail.saveAccount": {
    "zh-CN": "添加邮箱",
    "zh-TW": "添加信箱",
    en: "Add Mailbox",
    fr: "Enregistrer",
    ja: "メールを保存",
    ko: "메일 저장",
    ru: "Сохранить почту"
  },
  "private.mail.clear": {
    "zh-CN": "清空表单",
    "zh-TW": "清空表單",
    en: "Clear Form",
    fr: "Vider le formulaire",
    ja: "フォームを消去",
    ko: "양식 지우기",
    ru: "Очистить форму"
  },
  "private.mail.locked": {
    "zh-CN": "邮箱库未解锁",
    "zh-TW": "信箱庫未解鎖",
    en: "Mail vault is locked",
    fr: "Le coffre mail est verrouille",
    ja: "メール保管庫はロック中です",
    ko: "메일 보관함이 잠겨 있습니다",
    ru: "Почтовое хранилище закрыто"
  },
  "private.mail.empty": {
    "zh-CN": "暂无邮箱账号",
    "zh-TW": "暫無信箱帳號",
    en: "No mail accounts yet",
    fr: "Aucun compte mail",
    ja: "メールアカウントはありません",
    ko: "메일 계정이 없습니다",
    ru: "Почтовых аккаунтов пока нет"
  },
  "private.mail.noAddress": {
    "zh-CN": "未填写账号",
    "zh-TW": "未填寫帳號",
    en: "No account",
    fr: "Aucun compte",
    ja: "アカウント未入力",
    ko: "계정 없음",
    ru: "Нет аккаунта"
  },
  "private.mail.updated": {
    "zh-CN": "更新",
    "zh-TW": "更新",
    en: "Updated",
    fr: "Mis a jour",
    ja: "更新",
    ko: "업데이트",
    ru: "Обновлено"
  },
  "private.mail.open": {
    "zh-CN": "打开登录页",
    "zh-TW": "打開登入頁",
    en: "Open Login",
    fr: "Ouvrir la connexion",
    ja: "ログインを開く",
    ko: "로그인 열기",
    ru: "Открыть вход"
  },
  "private.mail.editing": {
    "zh-CN": "正在编辑邮箱账号",
    "zh-TW": "正在編輯信箱帳號",
    en: "Editing mail account",
    fr: "Modification du compte mail",
    ja: "メールアカウントを編集中",
    ko: "메일 계정 편집 중",
    ru: "Редактирование почтового аккаунта"
  },
  "private.mail.removed": {
    "zh-CN": "邮箱账号已移除",
    "zh-TW": "信箱帳號已移除",
    en: "Mail account removed",
    fr: "Compte mail retire",
    ja: "メールアカウントを削除しました",
    ko: "메일 계정 제거됨",
    ru: "Почтовый аккаунт удален"
  },
  "private.mail.needsUnlock": {
    "zh-CN": "这份旧邮箱库尚未完成自动同步，请在原设备打开一次，或使用高级恢复。",
    "zh-TW": "這份舊信箱庫尚未完成自動同步，請在原裝置開啟一次，或使用進階恢復。",
    en: "This legacy mail vault has not completed automatic migration. Open it once on the original device, or use advanced recovery.",
    fr: "Cet ancien coffre mail n’a pas terminé sa migration automatique. Ouvrez-le une fois sur l’appareil d’origine ou utilisez la récupération avancée.",
    ja: "この旧メール保管庫は自動移行が完了していません。元の端末で一度開くか、高度な復旧を使用してください。",
    ko: "이 기존 메일 보관함은 자동 마이그레이션을 완료하지 못했습니다. 원래 기기에서 한 번 열거나 고급 복구를 사용하세요.",
    ru: "Старое почтовое хранилище ещё не прошло автоматический перенос. Откройте его на исходном устройстве или воспользуйтесь расширенным восстановлением."
  },
  "private.mail.noVault": {
    "zh-CN": "还没有邮箱，请添加第一个邮箱",
    "zh-TW": "還沒有信箱，請添加第一個信箱",
    en: "No mailbox yet. Add your first mailbox.",
    fr: "Aucune boîte mail pour le moment. Ajoutez la première.",
    ja: "メールはまだありません。最初のメールを追加してください。",
    ko: "아직 메일 계정이 없습니다. 첫 메일을 추가하세요.",
    ru: "Почтовых ящиков пока нет. Добавьте первый."
  },
  "private.mail.keyRequired": {
    "zh-CN": "请先输入邮箱库恢复钥匙",
    "zh-TW": "請先輸入信箱庫恢復鑰匙",
    en: "Enter the mail-vault recovery key first",
    fr: "Saisissez d’abord la clé de récupération de la messagerie",
    ja: "先にメール保管庫の復旧キーを入力してください",
    ko: "먼저 메일 보관함 복구 키를 입력하세요",
    ru: "Сначала введите ключ восстановления почты"
  },
  "private.mail.unlocked": {
    "zh-CN": "邮箱库已解锁",
    "zh-TW": "信箱庫已解鎖",
    en: "Mail vault unlocked",
    fr: "Messagerie déverrouillée",
    ja: "メール保管庫を解除しました",
    ko: "메일 보관함 잠금 해제됨",
    ru: "Почтовое хранилище открыто"
  },
  "private.mail.autoSyncEnabled": {
    "zh-CN": "邮箱库已解锁，并已启用自动设备同步",
    "zh-TW": "信箱庫已解鎖，並已啟用自動裝置同步",
    en: "Mail unlocked and automatic device sync enabled",
    fr: "Messagerie déverrouillée et synchronisation automatique activée",
    ja: "メール保管庫を解除し、端末の自動同期を有効にしました",
    ko: "메일 보관함 잠금이 해제되고 자동 기기 동기화가 활성화되었습니다",
    ru: "Почта открыта, автоматическая синхронизация устройств включена"
  },
  "private.mail.unlockFailed": {
    "zh-CN": "恢复钥匙与当前邮箱库不匹配",
    "zh-TW": "恢復鑰匙與目前信箱庫不相符",
    en: "The recovery key does not match the current mail vault.",
    fr: "La clé de récupération est incorrecte ; la messagerie ne peut pas être déchiffrée.",
    ja: "復旧キーが現在のメール保管庫と一致しません。",
    ko: "복구 키가 현재 메일 보관함과 일치하지 않습니다.",
    ru: "Ключ неверный; хранилище нельзя расшифровать."
  },
  "private.mail.loadFailed": {
    "zh-CN": "邮箱库读取失败",
    "zh-TW": "信箱庫讀取失敗",
    en: "Mail vault load failed",
    fr: "Échec du chargement de la messagerie",
    ja: "メール保管庫の読み込みに失敗しました",
    ko: "메일 보관함을 불러오지 못했습니다",
    ru: "Не удалось загрузить почтовое хранилище"
  },
  "private.mail.keyGenerated": {
    "zh-CN": "恢复钥匙已生成，请将它保存在网站之外",
    "zh-TW": "恢復鑰匙已生成，請將它保存在網站之外",
    en: "Recovery key generated. Store it outside this website.",
    fr: "Clé de récupération générée. Conservez-la en dehors de ce site.",
    ja: "復旧キーを生成しました。このサイト以外の場所に保管してください。",
    ko: "복구 키가 생성되었습니다. 이 웹사이트 밖에 보관하세요.",
    ru: "Ключ восстановления создан. Храните его вне сайта."
  },
  "private.mail.unlockFirst": {
    "zh-CN": "请先用恢复钥匙解锁现有邮箱库",
    "zh-TW": "請先用恢復鑰匙解鎖現有信箱庫",
    en: "Unlock the existing mail vault with its recovery key first",
    fr: "Déverrouillez d’abord la messagerie existante avec sa clé de récupération",
    ja: "まず復旧キーで既存のメール保管庫を解除してください",
    ko: "먼저 복구 키로 기존 메일 보관함을 여세요",
    ru: "Сначала откройте хранилище ключом восстановления"
  },
  "private.mail.required": {
    "zh-CN": "请填写邮箱账号和加密保存内容",
    "zh-TW": "請填寫信箱帳號和加密保存內容",
    en: "Fill in the mail account and encrypted content",
    fr: "Renseignez le compte mail et le contenu chiffre",
    ja: "メールアカウントと暗号化保存内容を入力してください",
    ko: "메일 계정과 암호화 저장 내용을 입력하세요",
    ru: "Заполните аккаунт и зашифрованное содержимое"
  },
  "private.mail.saved": {
    "zh-CN": "邮箱已加密保存；在其他设备登录私人空间后会自动同步",
    "zh-TW": "信箱已加密儲存；在其他裝置登入私人空間後會自動同步",
    en: "Mailbox encrypted and saved. It syncs after you sign in to Private Space on another device.",
    fr: "Boîte chiffrée et enregistrée. Elle se synchronise après connexion à l’espace privé sur un autre appareil.",
    ja: "メールを暗号化して保存しました。別の端末でプライベートスペースにログインすると同期されます。",
    ko: "메일을 암호화해 저장했습니다. 다른 기기에서 개인 공간에 로그인하면 동기화됩니다.",
    ru: "Ящик зашифрован и сохранён. Он синхронизируется после входа в личное пространство на другом устройстве."
  },
  "private.mail.keyTooShort": {
    "zh-CN": "恢复钥匙至少需要 24 个字符",
    "zh-TW": "恢復鑰匙至少需要 24 個字元",
    en: "The recovery key must be at least 24 characters",
    fr: "La clé de récupération doit contenir au moins 24 caractères",
    ja: "復旧キーは 24 文字以上必要です",
    ko: "복구 키는 최소 24자여야 합니다",
    ru: "Ключ должен быть не короче 24 символов"
  },
  "private.mail.saveFailed": {
    "zh-CN": "邮箱库保存失败",
    "zh-TW": "信箱庫保存失敗",
    en: "Mail vault save failed",
    fr: "Échec de l'enregistrement de la messagerie",
    ja: "メール保管庫の保存に失敗しました",
    ko: "메일 보관함 저장 실패",
    ru: "Не удалось сохранить почтовое хранилище"
  },
  "private.mail.lockedHint": {
    "zh-CN": "此加密资料库尚未解锁。通常重新登录私人空间即可自动解锁；旧资料才需要高级恢复钥匙。",
    "zh-TW": "此加密資料庫尚未解鎖。通常重新登入私人空間即可自動解鎖；舊資料才需要進階恢復鑰匙。",
    en: "This encrypted vault is locked. Signing in to Private Space again normally unlocks it automatically; only legacy data needs the advanced recovery key.",
    fr: "Ce coffre chiffré est verrouillé. Une nouvelle connexion à l’espace privé le déverrouille normalement ; seules les anciennes données exigent la clé de récupération avancée.",
    ja: "この暗号化保管庫はロック中です。通常はプライベートスペースに再ログインすると自動解除され、旧データだけ高度な復旧キーが必要です。",
    ko: "이 암호화 자료 보관함은 잠겨 있습니다. 보통 개인 공간에 다시 로그인하면 자동으로 해제되며 이전 데이터에만 고급 복구 키가 필요합니다.",
    ru: "Зашифрованное хранилище закрыто. Обычно достаточно снова войти в личное пространство; ключ расширенного восстановления нужен только для старых данных."
  },
  "private.mail.selected": {
    "zh-CN": "当前邮箱",
    "zh-TW": "目前信箱",
    en: "Current mailbox",
    fr: "Boîte actuelle",
    ja: "現在のメール",
    ko: "현재 메일",
    ru: "Текущий ящик"
  },
  "private.mail.unlocking": {
    "zh-CN": "正在解锁邮箱库",
    "zh-TW": "正在解鎖信箱庫",
    en: "Unlocking the mail vault",
    fr: "Déverrouillage de la messagerie",
    ja: "メール保管庫を解除中",
    ko: "메일 보관함 잠금 해제 중",
    ru: "Открытие почтового хранилища"
  },
  "private.mail.deviceUnlocked": {
    "zh-CN": "邮箱库已在此设备解锁",
    "zh-TW": "信箱庫已在此裝置解鎖",
    en: "Mail vault unlocked on this device",
    fr: "Messagerie déverrouillée sur cet appareil",
    ja: "この端末でメール保管庫を解除しました",
    ko: "이 기기에서 메일 보관함 잠금이 해제되었습니다",
    ru: "Почтовое хранилище открыто на этом устройстве"
  },
  "private.mail.keyCopied": {
    "zh-CN": "恢复钥匙已复制",
    "zh-TW": "恢復鑰匙已複製",
    en: "Recovery key copied",
    fr: "Clé de récupération copiée",
    ja: "復旧キーをコピーしました",
    ko: "복구 키가 복사되었습니다",
    ru: "Ключ восстановления скопирован"
  },
  "private.mail.copyKeyFallback": {
    "zh-CN": "请手动复制已选中的恢复钥匙",
    "zh-TW": "請手動複製已選取的恢復鑰匙",
    en: "Copy the selected recovery key manually",
    fr: "Copiez manuellement la clé de récupération sélectionnée",
    ja: "選択された復旧キーを手動でコピーしてください",
    ko: "선택된 복구 키를 직접 복사하세요",
    ru: "Скопируйте выделенный ключ вручную"
  },
  "private.mail.connectorPending": {
    "zh-CN": "收发信连接器待配置：需要为该邮箱完成 OAuth 或 IMAP/SMTP 接入",
    "zh-TW": "收發信連接器待配置：需要為該信箱完成 OAuth 或 IMAP/SMTP 接入",
    en: "Mail connector is not configured yet: this mailbox needs OAuth or IMAP/SMTP setup.",
    fr: "Le connecteur de messagerie n’est pas encore configuré : cette boîte nécessite OAuth ou IMAP/SMTP.",
    ja: "メール接続は未設定です。このメールボックスには OAuth または IMAP/SMTP の設定が必要です。",
    ko: "메일 연결이 아직 구성되지 않았습니다. 이 메일함에는 OAuth 또는 IMAP/SMTP 설정이 필요합니다.",
    ru: "Почтовый коннектор ещё не настроен: для этого ящика требуется OAuth или IMAP/SMTP."
  },
  "private.mail.composeRequired": {
    "zh-CN": "请填写收件人和主题",
    "zh-TW": "請填寫收件人和主題",
    en: "Fill in recipient and subject",
    fr: "Saisissez le destinataire et l'objet",
    ja: "宛先と件名を入力してください",
    ko: "받는 사람과 제목을 입력하세요",
    ru: "Укажите получателя и тему"
  },
  "private.mail.fetching": {
    "zh-CN": "正在收取邮件",
    "zh-TW": "正在收取郵件",
    en: "Fetching mail",
    fr: "Réception des messages",
    ja: "メールを受信中",
    ko: "메일 받는 중",
    ru: "Получение почты"
  },
  "private.mail.fetched": {
    "zh-CN": "邮件已收取",
    "zh-TW": "郵件已收取",
    en: "Mail fetched",
    fr: "Messages reçus",
    ja: "メールを受信しました",
    ko: "메일을 받았습니다",
    ru: "Почта получена"
  },
  "private.mail.fetchFailed": {
    "zh-CN": "收取失败",
    "zh-TW": "收取失敗",
    en: "Fetch failed",
    fr: "Échec de la réception",
    ja: "受信に失敗しました",
    ko: "메일 받기 실패",
    ru: "Не удалось получить почту"
  },
  "private.mail.sending": {
    "zh-CN": "正在发送邮件",
    "zh-TW": "正在發送郵件",
    en: "Sending mail",
    fr: "Envoi du message",
    ja: "メールを送信中",
    ko: "메일 보내는 중",
    ru: "Отправка сообщения"
  },
  "private.mail.sent": {
    "zh-CN": "邮件已发送",
    "zh-TW": "郵件已發送",
    en: "Mail sent",
    fr: "Message envoyé",
    ja: "メールを送信しました",
    ko: "메일을 보냈습니다",
    ru: "Сообщение отправлено"
  },
  "private.mail.sendFailed": {
    "zh-CN": "发送失败",
    "zh-TW": "發送失敗",
    en: "Send failed",
    fr: "Échec de l'envoi",
    ja: "送信に失敗しました",
    ko: "메일 보내기 실패",
    ru: "Не удалось отправить"
  },
  "private.mail.noMessages": {
    "zh-CN": "暂无邮件",
    "zh-TW": "暫無郵件",
    en: "No messages",
    fr: "Aucun message",
    ja: "メールはありません",
    ko: "메일 없음",
    ru: "Нет сообщений"
  },
  "private.mail.noMessagesCopy": {
    "zh-CN": "邮箱连接成功，但当前没有可显示的收件。",
    "zh-TW": "信箱連接成功，但目前沒有可顯示的收件。",
    en: "The mailbox connected, but there are no messages to show.",
    fr: "La boîte est connectée, mais aucun message n'est disponible.",
    ja: "メールには接続できましたが、表示できる受信メールはありません。",
    ko: "메일에 연결되었지만 표시할 받은 메일이 없습니다.",
    ru: "Подключение установлено, но сообщений для отображения нет."
  },
  "private.mail.noSubject": {
    "zh-CN": "无主题",
    "zh-TW": "無主題",
    en: "No subject",
    fr: "Sans objet",
    ja: "件名なし",
    ko: "제목 없음",
    ru: "Без темы"
  },
  "private.mail.readerEyebrow": {
    "zh-CN": "邮件阅读",
    "zh-TW": "郵件閱讀",
    en: "message",
    fr: "message",
    ja: "メール",
    ko: "메일 읽기",
    ru: "сообщение"
  },
  "private.mail.closeMessage": {
    "zh-CN": "关闭邮件",
    "zh-TW": "關閉郵件",
    en: "Close message",
    fr: "Fermer le message",
    ja: "メールを閉じる",
    ko: "메일 닫기",
    ru: "Закрыть сообщение"
  },
  "private.mail.from": {
    "zh-CN": "发件人",
    "zh-TW": "寄件者",
    en: "From",
    fr: "Expéditeur",
    ja: "差出人",
    ko: "보낸 사람",
    ru: "Отправитель"
  },
  "private.mail.receivedAt": {
    "zh-CN": "时间",
    "zh-TW": "時間",
    en: "Date",
    fr: "Date",
    ja: "日時",
    ko: "시간",
    ru: "Дата"
  },
  "private.mail.messageBody": {
    "zh-CN": "正文",
    "zh-TW": "正文",
    en: "Message",
    fr: "Contenu",
    ja: "本文",
    ko: "본문",
    ru: "Текст"
  },
  "private.mail.messageUnavailable": {
    "zh-CN": "无法确定要读取的邮件，请重新收取。",
    "zh-TW": "無法確定要讀取的郵件，請重新收取。",
    en: "This message could not be identified. Fetch the inbox again.",
    fr: "Ce message n’a pas pu être identifié. Relevez à nouveau la boîte.",
    ja: "読み込むメールを特定できません。受信箱を再取得してください。",
    ko: "읽을 메일을 확인할 수 없습니다. 받은편지함을 다시 불러오세요.",
    ru: "Не удалось определить сообщение. Обновите входящие."
  },
  "private.mail.loadingMessage": {
    "zh-CN": "正在读取邮件…",
    "zh-TW": "正在讀取郵件…",
    en: "Loading message…",
    fr: "Chargement du message…",
    ja: "メールを読み込んでいます…",
    ko: "메일을 불러오는 중…",
    ru: "Загрузка сообщения…"
  },
  "private.mail.unknownSender": {
    "zh-CN": "未知发件人",
    "zh-TW": "未知寄件者",
    en: "Unknown sender",
    fr: "Expéditeur inconnu",
    ja: "不明な差出人",
    ko: "알 수 없는 보낸 사람",
    ru: "Неизвестный отправитель"
  },
  "private.mail.unknownDate": {
    "zh-CN": "时间未知",
    "zh-TW": "時間未知",
    en: "Unknown date",
    fr: "Date inconnue",
    ja: "日時不明",
    ko: "시간 정보 없음",
    ru: "Дата неизвестна"
  },
  "private.mail.emptyMessageBody": {
    "zh-CN": "这封邮件没有可显示的纯文本正文。",
    "zh-TW": "這封郵件沒有可顯示的純文字正文。",
    en: "This message has no displayable plain-text body.",
    fr: "Ce message ne contient aucun texte affichable.",
    ja: "表示できるプレーンテキスト本文がありません。",
    ko: "표시할 수 있는 일반 텍스트 본문이 없습니다.",
    ru: "В сообщении нет доступного текстового содержимого."
  },
  "private.mail.messageLoadFailed": {
    "zh-CN": "邮件读取失败",
    "zh-TW": "郵件讀取失敗",
    en: "Message could not be loaded",
    fr: "Échec du chargement du message",
    ja: "メールを読み込めませんでした",
    ko: "메일을 불러오지 못했습니다",
    ru: "Не удалось загрузить сообщение"
  },
  "private.mail.messageTruncated": {
    "zh-CN": "邮件过长，仅显示前一部分。附件不会在这里下载。",
    "zh-TW": "郵件過長，僅顯示前一部分。附件不會在這裡下載。",
    en: "This message is long, so only the first part is shown. Attachments are not downloaded here.",
    fr: "Ce message est long ; seule la première partie est affichée. Les pièces jointes ne sont pas téléchargées ici.",
    ja: "メールが長いため先頭部分のみ表示しています。添付ファイルはここではダウンロードしません。",
    ko: "메일이 길어 앞부분만 표시합니다. 첨부 파일은 여기서 다운로드하지 않습니다.",
    ru: "Сообщение слишком длинное, показана только первая часть. Вложения здесь не загружаются."
  },
  "private.devices.eyebrow": {
    "zh-CN": "可信设备",
    "zh-TW": "可信裝置",
    en: "trusted devices",
    fr: "appareils fiables",
    ja: "信頼済み端末",
    ko: "신뢰 기기",
    ru: "доверенные устройства"
  },
  "private.devices.title": {
    "zh-CN": "登录设备管理",
    "zh-TW": "登入裝置管理",
    en: "Login Device Management",
    fr: "Gestion des appareils",
    ja: "ログイン端末管理",
    ko: "로그인 기기 관리",
    ru: "Управление устройствами"
  },
  "private.devices.refresh": {
    "zh-CN": "刷新",
    "zh-TW": "重新整理",
    en: "Refresh",
    fr: "Actualiser",
    ja: "更新",
    ko: "새로고침",
    ru: "Обновить"
  },
  "private.devices.revokeOthers": {
    "zh-CN": "移除其他设备",
    "zh-TW": "移除其他裝置",
    en: "Remove Other Devices",
    fr: "Retirer les autres",
    ja: "他の端末を削除",
    ko: "다른 기기 제거",
    ru: "Удалить другие"
  },
  "private.devices.revoke": {
    "zh-CN": "移除",
    "zh-TW": "移除",
    en: "Remove",
    fr: "Retirer",
    ja: "削除",
    ko: "제거",
    ru: "Удалить"
  },
  "private.devices.current": {
    "zh-CN": "当前设备",
    "zh-TW": "目前裝置",
    en: "Current device",
    fr: "Appareil actuel",
    ja: "現在の端末",
    ko: "현재 기기",
    ru: "Текущее устройство"
  },
  "private.devices.lastSeen": {
    "zh-CN": "最近活动",
    "zh-TW": "最近活動",
    en: "Last active",
    fr: "Derniere activite",
    ja: "最近の活動",
    ko: "최근 활동",
    ru: "Последняя активность"
  },
  "private.devices.expires": {
    "zh-CN": "到期",
    "zh-TW": "到期",
    en: "Expires",
    fr: "Expire",
    ja: "期限",
    ko: "만료",
    ru: "Истекает"
  },
  "private.devices.empty": {
    "zh-CN": "暂无登录设备",
    "zh-TW": "暫無登入裝置",
    en: "No login devices yet",
    fr: "Aucun appareil connecte",
    ja: "ログイン端末はありません",
    ko: "로그인 기기가 없습니다",
    ru: "Нет устройств входа"
  },
  "private.data.eyebrow": {
    "zh-CN": "数据归档",
    "zh-TW": "資料封存",
    en: "data archive",
    fr: "archive des donnees",
    ja: "データ保管",
    ko: "데이터 보관",
    ru: "архив данных"
  },
  "private.data.title": {
    "zh-CN": "数据管理",
    "zh-TW": "資料管理",
    en: "Data Management",
    fr: "Gestion des donnees",
    ja: "データ管理",
    ko: "데이터 관리",
    ru: "Управление данными"
  },
  "private.data.copy": {
    "zh-CN": "把私人资料下载到当前设备，或从你选择的备份文件恢复。",
    "zh-TW": "把私人資料下載到目前裝置，或從你選擇的備份檔案恢復。",
    en: "Download private data to this device, or restore it from a backup file you choose.",
    fr: "Téléchargez les données privées sur cet appareil ou restaurez-les depuis le fichier de sauvegarde de votre choix.",
    ja: "個人データをこの端末へダウンロードするか、選択したバックアップから復元します。",
    ko: "개인 데이터를 이 기기에 내려받거나 선택한 백업 파일에서 복원합니다.",
    ru: "Скачайте личные данные на это устройство или восстановите их из выбранной резервной копии."
  },
  "private.data.persistenceTitle": {
    "zh-CN": "当前服务器存储不是永久存储",
    "zh-TW": "目前伺服器儲存不是永久儲存",
    en: "Current server storage is not permanent",
    fr: "Le stockage actuel du serveur n'est pas permanent",
    ja: "現在のサーバー保存領域は永続的ではありません",
    ko: "현재 서버 저장소는 영구 저장소가 아닙니다",
    ru: "Текущее хранилище сервера не является постоянным"
  },
  "private.data.persistenceCopy": {
    "zh-CN": "Render 免费实例在重启或重新部署后可能清空服务器文件。请定期下载备份；长期保存需要持久磁盘或外部存储。",
    "zh-TW": "Render 免費執行個體在重新啟動或重新部署後可能清空伺服器檔案。請定期下載備份；長期保存需要持久磁碟或外部儲存。",
    en: "A free Render instance can lose server files after a restart or redeploy. Download backups regularly; long-term storage needs a persistent disk or external storage.",
    fr: "Une instance Render gratuite peut perdre ses fichiers après un redémarrage ou un redéploiement. Téléchargez régulièrement des sauvegardes ; la conservation durable nécessite un disque persistant ou un stockage externe.",
    ja: "Render の無料インスタンスは再起動や再デプロイ後にサーバーファイルを失うことがあります。定期的にバックアップし、長期保存には永続ディスクか外部ストレージを使用してください。",
    ko: "Render 무료 인스턴스는 재시작이나 재배포 후 서버 파일이 사라질 수 있습니다. 정기적으로 백업하고 장기 보관에는 영구 디스크나 외부 저장소를 사용하세요.",
    ru: "Бесплатный экземпляр Render может потерять файлы после перезапуска или повторного развёртывания. Регулярно скачивайте копии; для долгого хранения нужен постоянный диск или внешнее хранилище."
  },
  "private.data.save": {
    "zh-CN": "保存",
    "zh-TW": "儲存",
    en: "Save",
    fr: "Enregistrer",
    ja: "保存",
    ko: "저장",
    ru: "Сохранить"
  },
  "private.data.import": {
    "zh-CN": "导入",
    "zh-TW": "匯入",
    en: "Import",
    fr: "Importer",
    ja: "読み込み",
    ko: "가져오기",
    ru: "Импорт"
  },
  "private.data.exportLocal": {
    "zh-CN": "下载本地备份",
    "zh-TW": "下載本機備份",
    en: "Download backup",
    fr: "Télécharger une sauvegarde",
    ja: "バックアップをダウンロード",
    ko: "백업 다운로드",
    ru: "Скачать резервную копию"
  },
  "private.data.exportLocalCopy": {
    "zh-CN": "ZIP 包含简介以及加密的邮箱、手机号和账目资料；恢复钥匙仅用于高级恢复，请另行保管。",
    "zh-TW": "ZIP 包含簡介以及加密的信箱、手機號碼和帳目資料；恢復鑰匙僅用於進階恢復，請另行保管。",
    en: "The ZIP contains your profile plus encrypted mail, phone, and ledger data. The recovery key is only for advanced recovery; store it separately.",
    fr: "Le ZIP contient le profil ainsi que les données chiffrées de messagerie, téléphones et comptes. La clé, réservée à la récupération avancée, doit être conservée séparément.",
    ja: "ZIP にはプロフィールと暗号化されたメール、電話番号、帳目データが含まれます。復旧キーは高度な復旧専用なので別途保管してください。",
    ko: "ZIP에는 프로필과 암호화된 메일, 전화번호, 장부 데이터가 포함됩니다. 복구 키는 고급 복구에만 사용하므로 별도로 보관하세요.",
    ru: "ZIP содержит профиль и зашифрованные данные почты, телефонов и учёта. Ключ нужен только для расширенного восстановления; храните его отдельно."
  },
  "private.data.download": {
    "zh-CN": "下载备份",
    "zh-TW": "下載備份",
    en: "Download backup",
    fr: "Télécharger",
    ja: "ダウンロード",
    ko: "백업 다운로드",
    ru: "Скачать"
  },
  "private.data.exportSubsite": {
    "zh-CN": "传输信息至子网站",
    "zh-TW": "傳輸資訊至子網站",
    en: "Transfer information to subsite",
    fr: "Transferer au sous-site",
    ja: "サブサイトへ転送",
    ko: "하위 사이트로 전송",
    ru: "Передать на поддомен"
  },
  "private.data.importLocal": {
    "zh-CN": "从备份文件恢复",
    "zh-TW": "從備份檔案恢復",
    en: "Restore from backup",
    fr: "Restaurer une sauvegarde",
    ja: "バックアップから復元",
    ko: "백업에서 복원",
    ru: "Восстановить из копии"
  },
  "private.data.importLocalCopy": {
    "zh-CN": "选择之前下载的 ZIP 文件，恢复简介以及加密的邮箱、手机号和账目资料。",
    "zh-TW": "選擇之前下載的 ZIP 檔案，恢復簡介以及加密的信箱、手機號碼和帳目資料。",
    en: "Choose a downloaded ZIP to restore your profile and encrypted mail, phone, and ledger data.",
    fr: "Choisissez un ZIP téléchargé pour restaurer le profil et les données chiffrées de messagerie, téléphones et comptes.",
    ja: "ダウンロード済みの ZIP を選び、プロフィールと暗号化されたメール、電話番号、帳目データを復元します。",
    ko: "다운로드한 ZIP을 선택해 프로필과 암호화된 메일, 전화번호, 장부 데이터를 복원합니다.",
    ru: "Выберите скачанный ZIP, чтобы восстановить профиль и зашифрованные данные почты, телефонов и учёта."
  },
  "private.data.chooseFile": {
    "zh-CN": "选择备份文件",
    "zh-TW": "選擇備份檔案",
    en: "Choose backup file",
    fr: "Choisir le fichier",
    ja: "バックアップを選択",
    ko: "백업 파일 선택",
    ru: "Выбрать файл"
  },
  "private.data.importSubsite": {
    "zh-CN": "从子网站导入",
    "zh-TW": "從子網站匯入",
    en: "Import from subsite",
    fr: "Importer du sous-site",
    ja: "サブサイトから読み込み",
    ko: "하위 사이트에서 가져오기",
    ru: "Импорт с поддомена"
  },
  "private.data.savedLocal": {
    "zh-CN": "备份已下载：",
    "zh-TW": "備份已下載：",
    en: "Backup downloaded: ",
    fr: "Sauvegarde téléchargée : ",
    ja: "バックアップをダウンロードしました：",
    ko: "백업 다운로드 완료: ",
    ru: "Резервная копия скачана: "
  },
  "private.data.importedLocal": {
    "zh-CN": "已从备份恢复：",
    "zh-TW": "已從備份恢復：",
    en: "Restored from backup: ",
    fr: "Restauration effectuée : ",
    ja: "バックアップから復元しました：",
    ko: "백업에서 복원됨: ",
    ru: "Восстановлено из копии: "
  },
  "private.data.subsite": {
    "zh-CN": "子网站传输",
    "zh-TW": "子網站傳輸",
    en: "Subsite transfer",
    fr: "Transfert vers le sous-site",
    ja: "サブサイト転送",
    ko: "하위 사이트 전송",
    ru: "Передача на поддомен"
  },
  "private.data.subsiteCopy": {
    "zh-CN": "子网站接口已预留，目前尚未配置。",
    "zh-TW": "子網站介面已預留，目前尚未設定。",
    en: "The subsite interface is reserved but not configured yet.",
    fr: "L'interface du sous-site est réservée mais n'est pas encore configurée.",
    ja: "サブサイト連携用インターフェースは予約済みですが、まだ構成されていません。",
    ko: "하위 사이트 인터페이스는 준비되어 있지만 아직 구성되지 않았습니다.",
    ru: "Интерфейс поддомена зарезервирован, но ещё не настроен."
  },
  "private.data.preparing": {
    "zh-CN": "正在准备备份文件",
    "zh-TW": "正在準備備份檔案",
    en: "Preparing backup file",
    fr: "Préparation de la sauvegarde",
    ja: "バックアップを準備中",
    ko: "백업 파일 준비 중",
    ru: "Подготовка резервной копии"
  },
  "private.data.importing": {
    "zh-CN": "正在检查并恢复备份",
    "zh-TW": "正在檢查並恢復備份",
    en: "Checking and restoring the backup",
    fr: "Vérification et restauration de la sauvegarde",
    ja: "バックアップを検証して復元中",
    ko: "백업 확인 및 복원 중",
    ru: "Проверка и восстановление копии"
  },
  "private.data.tooLarge": {
    "zh-CN": "备份文件过大，最大支持 4 MB",
    "zh-TW": "備份檔案過大，最大支援 4 MB",
    en: "The backup is too large; the limit is 4 MB",
    fr: "La sauvegarde est trop volumineuse ; la limite est de 4 Mo",
    ja: "バックアップが大きすぎます。上限は 4 MB です",
    ko: "백업 파일이 너무 큽니다. 최대 4MB까지 지원합니다",
    ru: "Резервная копия слишком велика; максимум 4 МБ"
  },
  "private.data.invalidArchive": {
    "zh-CN": "这不是有效的私人空间备份文件",
    "zh-TW": "這不是有效的私人空間備份檔案",
    en: "This is not a valid private-space backup",
    fr: "Ce fichier n'est pas une sauvegarde valide de l'espace privé",
    ja: "有効なプライベート空間バックアップではありません",
    ko: "올바른 개인 공간 백업 파일이 아닙니다",
    ru: "Это недопустимая резервная копия личного пространства"
  },
  "private.data.subsitePending": {
    "zh-CN": "子网站接口已预留",
    "zh-TW": "子網站介面已預留",
    en: "Subsite interface is reserved",
    fr: "Interface de sous-site reservee",
    ja: "サブサイト連携は予約済みです",
    ko: "하위 사이트 인터페이스를 예약했습니다",
    ru: "Интерфейс поддомена зарезервирован"
  },
  "private.data.failed": {
    "zh-CN": "操作失败，请稍后再试",
    "zh-TW": "操作失敗，請稍後再試",
    en: "Operation failed. Please try again later.",
    fr: "Operation echouee. Reessayez plus tard.",
    ja: "操作に失敗しました。しばらくしてから再試行してください。",
    ko: "작업에 실패했습니다. 잠시 후 다시 시도하세요.",
    ru: "Операция не удалась. Попробуйте позже."
  },
  "private.data.noArchive": {
    "zh-CN": "没有找到本地归档",
    "zh-TW": "找不到本機封存",
    en: "No local archive found",
    fr: "Aucune archive locale trouvee",
    ja: "ローカル保管が見つかりません",
    ko: "로컬 보관 파일을 찾지 못했습니다",
    ru: "Локальный архив не найден"
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
  "settings.languageSelect": {
    "zh-CN": "选择语言",
    "zh-TW": "選擇語言",
    en: "Choose language",
    fr: "Choisir la langue",
    ja: "言語を選択",
    ko: "언어 선택",
    ru: "Выбрать язык"
  },
  "settings.appearanceSelect": {
    "zh-CN": "选择外观",
    "zh-TW": "選擇外觀",
    en: "Choose appearance",
    fr: "Choisir l'apparence",
    ja: "外観を選択",
    ko: "화면 선택",
    ru: "Выбрать вид"
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
  "private.common.cancel": { "zh-CN": "取消", "zh-TW": "取消", en: "Cancel", fr: "Annuler", ja: "キャンセル", ko: "취소", ru: "Отмена" },
  "private.common.delete": { "zh-CN": "删除", "zh-TW": "刪除", en: "Delete", fr: "Supprimer", ja: "削除", ko: "삭제", ru: "Удалить" },
  "private.common.edit": { "zh-CN": "编辑", "zh-TW": "編輯", en: "Edit", fr: "Modifier", ja: "編集", ko: "편집", ru: "Изменить" },
  "private.common.save": { "zh-CN": "保存", "zh-TW": "儲存", en: "Save", fr: "Enregistrer", ja: "保存", ko: "저장", ru: "Сохранить" },
  "private.common.vaultLoadFailed": { "zh-CN": "加密资料库读取失败。", "zh-TW": "加密資料庫讀取失敗。", en: "Could not load the encrypted vault.", fr: "Impossible de charger le coffre chiffré.", ja: "暗号化保管庫を読み込めませんでした。", ko: "암호화 자료 보관함을 불러오지 못했습니다.", ru: "Не удалось загрузить зашифрованное хранилище." },
  "private.common.vaultLocked": { "zh-CN": "加密资料库尚未解锁。请先在邮箱管理中完成解锁。", "zh-TW": "加密資料庫尚未解鎖。請先在信箱管理中完成解鎖。", en: "The encrypted vault is locked. Unlock it in Mail first.", fr: "Le coffre chiffré est verrouillé. Déverrouillez-le d’abord dans Messagerie.", ja: "暗号化保管庫はロック中です。先にメール管理で解除してください。", ko: "암호화 자료 보관함이 잠겨 있습니다. 먼저 메일 관리에서 잠금을 해제하세요.", ru: "Зашифрованное хранилище закрыто. Сначала откройте его в разделе почты." },
  "private.context.label": { "zh-CN": "快捷操作", "zh-TW": "快速操作", en: "Quick actions", fr: "Actions rapides", ja: "クイック操作", ko: "빠른 작업", ru: "Быстрые действия" },
  "private.context.copied": { "zh-CN": "已复制", "zh-TW": "已複製", en: "Copied", fr: "Copié", ja: "コピーしました", ko: "복사됨", ru: "Скопировано" },
  "private.context.copyFailed": { "zh-CN": "复制失败，请使用系统复制功能。", "zh-TW": "複製失敗，請使用系統複製功能。", en: "Copy failed. Use your system copy command.", fr: "Échec de la copie. Utilisez la commande de copie du système.", ja: "コピーできませんでした。システムのコピー機能を使用してください。", ko: "복사하지 못했습니다. 시스템 복사 기능을 사용하세요.", ru: "Не удалось скопировать. Используйте системную команду копирования." },
  "private.context.openMessage": { "zh-CN": "打开邮件", "zh-TW": "開啟郵件", en: "Open message", fr: "Ouvrir le message", ja: "メールを開く", ko: "메일 열기", ru: "Открыть письмо" },
  "private.context.copySender": { "zh-CN": "复制发件人", "zh-TW": "複製寄件者", en: "Copy sender", fr: "Copier l’expéditeur", ja: "送信者をコピー", ko: "보낸 사람 복사", ru: "Скопировать отправителя" },
  "private.context.copySubject": { "zh-CN": "复制主题", "zh-TW": "複製主旨", en: "Copy subject", fr: "Copier l’objet", ja: "件名をコピー", ko: "제목 복사", ru: "Скопировать тему" },
  "private.context.fetchMail": { "zh-CN": "收取此邮箱", "zh-TW": "收取此信箱", en: "Fetch this mailbox", fr: "Relever cette boîte", ja: "このメールを受信", ko: "이 메일함 받기", ru: "Получить почту из ящика" },
  "private.context.scanMailbox": { "zh-CN": "扫描账号与订阅线索", "zh-TW": "掃描帳號與訂閱線索", en: "Scan account and subscription clues", fr: "Analyser les indices de comptes et abonnements", ja: "アカウントと購読の手掛かりを分析", ko: "계정 및 구독 단서 스캔", ru: "Найти признаки аккаунтов и подписок" },
  "private.context.editMailbox": { "zh-CN": "编辑邮箱设置", "zh-TW": "編輯信箱設定", en: "Edit mailbox settings", fr: "Modifier les réglages de la boîte", ja: "メール設定を編集", ko: "메일함 설정 편집", ru: "Изменить настройки ящика" },
  "private.context.copyAddress": { "zh-CN": "复制邮箱地址", "zh-TW": "複製信箱地址", en: "Copy email address", fr: "Copier l’adresse e-mail", ja: "メールアドレスをコピー", ko: "이메일 주소 복사", ru: "Скопировать адрес почты" },
  "private.context.copyPhone": { "zh-CN": "复制手机号", "zh-TW": "複製手機號碼", en: "Copy phone number", fr: "Copier le numéro", ja: "電話番号をコピー", ko: "전화번호 복사", ru: "Скопировать номер" },
  "private.context.editPhone": { "zh-CN": "编辑手机号", "zh-TW": "編輯手機號碼", en: "Edit phone number", fr: "Modifier le numéro", ja: "電話番号を編集", ko: "전화번호 편집", ru: "Изменить номер" },
  "private.context.deletePhone": { "zh-CN": "删除手机号", "zh-TW": "刪除手機號碼", en: "Delete phone number", fr: "Supprimer le numéro", ja: "電話番号を削除", ko: "전화번호 삭제", ru: "Удалить номер" },
  "private.context.editLedger": { "zh-CN": "编辑这笔账目", "zh-TW": "編輯這筆帳目", en: "Edit this entry", fr: "Modifier cette écriture", ja: "この帳目を編集", ko: "이 장부 항목 편집", ru: "Изменить запись" },
  "private.context.copyLedger": { "zh-CN": "复制账目信息", "zh-TW": "複製帳目資訊", en: "Copy entry details", fr: "Copier les détails de l’écriture", ja: "帳目情報をコピー", ko: "장부 항목 정보 복사", ru: "Скопировать данные записи" },
  "private.context.deleteLedger": { "zh-CN": "删除这笔账目", "zh-TW": "刪除這筆帳目", en: "Delete this entry", fr: "Supprimer cette écriture", ja: "この帳目を削除", ko: "이 장부 항목 삭제", ru: "Удалить запись" },
  "private.context.copyService": { "zh-CN": "复制服务线索", "zh-TW": "複製服務線索", en: "Copy service clue", fr: "Copier l’indice de service", ja: "サービスの手掛かりをコピー", ko: "서비스 단서 복사", ru: "Скопировать сведения о сервисе" },
  "private.context.openEvidence": { "zh-CN": "打开证据邮件", "zh-TW": "開啟證據郵件", en: "Open evidence message", fr: "Ouvrir le message associé", ja: "根拠メールを開く", ko: "근거 메일 열기", ru: "Открыть письмо-основание" },
  "private.context.toSubscriptionLedger": { "zh-CN": "转为订阅账目", "zh-TW": "轉為訂閱帳目", en: "Add as subscription entry", fr: "Ajouter comme dépense d’abonnement", ja: "購読の帳目として追加", ko: "구독 장부 항목으로 추가", ru: "Добавить как подписку в учёт" },
  "private.nav.phones": { "zh-CN": "手机号管理", "zh-TW": "手機號碼管理", en: "Phones", fr: "Téléphones", ja: "電話番号", ko: "전화번호", ru: "Телефоны" },
  "private.nav.ledger": { "zh-CN": "账目管理", "zh-TW": "帳目管理", en: "Ledger", fr: "Comptes", ja: "帳目管理", ko: "장부", ru: "Учёт" },
  "private.phones.eyebrow": { "zh-CN": "手机号档案", "zh-TW": "手機號碼檔案", en: "phone registry", fr: "registre des téléphones", ja: "電話番号台帳", ko: "전화번호 목록", ru: "реестр телефонов" },
  "private.phones.title": { "zh-CN": "手机号管理", "zh-TW": "手機號碼管理", en: "Phone Management", fr: "Gestion des téléphones", ja: "電話番号管理", ko: "전화번호 관리", ru: "Управление телефонами" },
  "private.phones.copy": { "zh-CN": "记录号码的用途、运营商和使用状态。内容与邮箱账号一同加密保存。", "zh-TW": "記錄號碼的用途、電訊商和使用狀態。內容與信箱帳號一同加密儲存。", en: "Track each number’s purpose, carrier, and status. Data is encrypted with your mail accounts.", fr: "Notez l’usage, l’opérateur et l’état de chaque numéro. Les données sont chiffrées avec vos comptes mail.", ja: "番号の用途、通信事業者、状態を記録します。メールアカウントと一緒に暗号化されます。", ko: "번호의 용도, 통신사, 사용 상태를 기록합니다. 메일 계정과 함께 암호화됩니다.", ru: "Храните назначение, оператора и статус номера. Данные шифруются вместе с почтовыми аккаунтами." },
  "private.phones.add": { "zh-CN": "添加手机号", "zh-TW": "新增手機號碼", en: "Add phone number", fr: "Ajouter un numéro", ja: "電話番号を追加", ko: "전화번호 추가", ru: "Добавить номер" },
  "private.phones.encryptedTitle": { "zh-CN": "加密资料", "zh-TW": "加密資料", en: "Encrypted data", fr: "Données chiffrées", ja: "暗号化データ", ko: "암호화 데이터", ru: "Зашифрованные данные" },
  "private.phones.encryptedCopy": { "zh-CN": "手机号只会进入当前私人空间的加密资料库，并随登录同步和备份迁移。", "zh-TW": "手機號碼只會進入目前私人空間的加密資料庫，並隨登入同步和備份遷移。", en: "Phone numbers stay in this Private Space’s encrypted vault and travel through sign-in sync and backups.", fr: "Les numéros restent dans le coffre chiffré de cet espace privé et suivent la synchronisation de connexion et les sauvegardes.", ja: "電話番号はこのプライベートスペースの暗号化保管庫にのみ入り、ログイン同期とバックアップで移行します。", ko: "전화번호는 이 개인 공간의 암호화 보관함에만 저장되며 로그인 동기화와 백업으로 이전됩니다.", ru: "Номера хранятся только в зашифрованном хранилище этого личного пространства и переносятся при синхронизации входа и резервном копировании." },
  "private.phones.formEyebrow": { "zh-CN": "号码信息", "zh-TW": "號碼資料", en: "phone details", fr: "détails du numéro", ja: "番号の詳細", ko: "전화번호 정보", ru: "данные номера" },
  "private.phones.close": { "zh-CN": "关闭手机号编辑", "zh-TW": "關閉手機號碼編輯", en: "Close phone editor", fr: "Fermer l’éditeur du numéro", ja: "電話番号編集を閉じる", ko: "전화번호 편집 닫기", ru: "Закрыть редактор номера" },
  "private.phones.addTitle": { "zh-CN": "添加手机号", "zh-TW": "新增手機號碼", en: "Add phone number", fr: "Ajouter un numéro", ja: "電話番号を追加", ko: "전화번호 추가", ru: "Добавить номер" },
  "private.phones.editTitle": { "zh-CN": "编辑手机号", "zh-TW": "編輯手機號碼", en: "Edit phone number", fr: "Modifier le numéro", ja: "電話番号を編集", ko: "전화번호 편집", ru: "Изменить номер" },
  "private.phones.label": { "zh-CN": "名称", "zh-TW": "名稱", en: "Label", fr: "Nom", ja: "名称", ko: "이름", ru: "Название" },
  "private.phones.labelPlaceholder": { "zh-CN": "例如：主号码", "zh-TW": "例如：主要號碼", en: "Example: Primary number", fr: "Exemple : numéro principal", ja: "例：メイン番号", ko: "예: 기본 번호", ru: "Например: основной номер" },
  "private.phones.number": { "zh-CN": "手机号", "zh-TW": "手機號碼", en: "Phone number", fr: "Numéro de téléphone", ja: "電話番号", ko: "전화번호", ru: "Номер телефона" },
  "private.phones.numberPlaceholder": { "zh-CN": "+86 138 0000 0000", "zh-TW": "+886 912 345 678", en: "+1 555 010 0000", fr: "+33 6 00 00 00 00", ja: "+81 90 0000 0000", ko: "+82 10 0000 0000", ru: "+7 900 000-00-00" },
  "private.phones.carrier": { "zh-CN": "运营商", "zh-TW": "電訊商", en: "Carrier", fr: "Opérateur", ja: "通信事業者", ko: "통신사", ru: "Оператор" },
  "private.phones.carrierPlaceholder": { "zh-CN": "例如：中国移动", "zh-TW": "例如：中華電信", en: "Example: Mobile carrier", fr: "Exemple : opérateur mobile", ja: "例：携帯電話会社", ko: "예: 이동통신사", ru: "Например: оператор связи" },
  "private.phones.status": { "zh-CN": "状态", "zh-TW": "狀態", en: "Status", fr: "État", ja: "状態", ko: "상태", ru: "Статус" },
  "private.phones.statusActive": { "zh-CN": "使用中", "zh-TW": "使用中", en: "Active", fr: "Actif", ja: "使用中", ko: "사용 중", ru: "Активен" },
  "private.phones.statusSpare": { "zh-CN": "备用", "zh-TW": "備用", en: "Spare", fr: "De secours", ja: "予備", ko: "예비", ru: "Запасной" },
  "private.phones.statusInactive": { "zh-CN": "已停用", "zh-TW": "已停用", en: "Inactive", fr: "Inactif", ja: "停止済み", ko: "사용 중지", ru: "Неактивен" },
  "private.phones.purpose": { "zh-CN": "用途", "zh-TW": "用途", en: "Purpose", fr: "Usage", ja: "用途", ko: "용도", ru: "Назначение" },
  "private.phones.purposePlaceholder": { "zh-CN": "例如：银行与重要账号验证", "zh-TW": "例如：銀行與重要帳號驗證", en: "Example: banking and important account verification", fr: "Exemple : banque et vérification de comptes importants", ja: "例：銀行や重要アカウントの認証", ko: "예: 은행 및 중요 계정 인증", ru: "Например: банк и проверка важных аккаунтов" },
  "private.phones.note": { "zh-CN": "备注", "zh-TW": "備註", en: "Notes", fr: "Notes", ja: "メモ", ko: "메모", ru: "Заметки" },
  "private.phones.notePlaceholder": { "zh-CN": "补充套餐、漫游或换号安排", "zh-TW": "補充方案、漫遊或換號安排", en: "Plan, roaming, or number-change notes", fr: "Forfait, itinérance ou changement de numéro", ja: "料金プラン、ローミング、番号変更の予定", ko: "요금제, 로밍 또는 번호 변경 메모", ru: "Тариф, роуминг или планы смены номера" },
  "private.phones.empty": { "zh-CN": "暂无手机号。添加后可按用途和状态集中管理。", "zh-TW": "暫無手機號碼。新增後可按用途和狀態集中管理。", en: "No phone numbers yet. Add one to organize numbers by purpose and status.", fr: "Aucun numéro pour le moment. Ajoutez-en un pour les classer par usage et état.", ja: "電話番号はまだありません。追加すると用途や状態で整理できます。", ko: "아직 전화번호가 없습니다. 추가하면 용도와 상태별로 관리할 수 있습니다.", ru: "Номеров пока нет. Добавьте номер, чтобы упорядочить их по назначению и статусу." },
  "private.phones.unnamed": { "zh-CN": "未命名号码", "zh-TW": "未命名號碼", en: "Unnamed number", fr: "Numéro sans nom", ja: "名称未設定の番号", ko: "이름 없는 번호", ru: "Номер без названия" },
  "private.phones.noNumber": { "zh-CN": "未填写号码", "zh-TW": "未填寫號碼", en: "No number entered", fr: "Aucun numéro saisi", ja: "番号未入力", ko: "번호 미입력", ru: "Номер не указан" },
  "private.phones.noDetails": { "zh-CN": "尚未填写运营商或用途", "zh-TW": "尚未填寫電訊商或用途", en: "No carrier or purpose yet", fr: "Aucun opérateur ni usage indiqué", ja: "通信事業者や用途は未入力です", ko: "통신사 또는 용도 미입력", ru: "Оператор и назначение не указаны" },
  "private.phones.edit": { "zh-CN": "编辑手机号", "zh-TW": "編輯手機號碼", en: "Edit phone number", fr: "Modifier le numéro", ja: "電話番号を編集", ko: "전화번호 편집", ru: "Изменить номер" },
  "private.phones.limit": { "zh-CN": "最多可保存 20 个手机号。", "zh-TW": "最多可儲存 20 個手機號碼。", en: "You can save up to 20 phone numbers.", fr: "Vous pouvez enregistrer jusqu’à 20 numéros.", ja: "電話番号は最大 20 件まで保存できます。", ko: "전화번호는 최대 20개까지 저장할 수 있습니다.", ru: "Можно сохранить до 20 номеров." },
  "private.phones.required": { "zh-CN": "请填写名称和手机号。", "zh-TW": "請填寫名稱和手機號碼。", en: "Enter a label and phone number.", fr: "Saisissez un nom et un numéro.", ja: "名称と電話番号を入力してください。", ko: "이름과 전화번호를 입력하세요.", ru: "Укажите название и номер телефона." },
  "private.phones.invalidNumber": { "zh-CN": "手机号格式不正确。", "zh-TW": "手機號碼格式不正確。", en: "The phone number format is invalid.", fr: "Le format du numéro est incorrect.", ja: "電話番号の形式が正しくありません。", ko: "전화번호 형식이 올바르지 않습니다.", ru: "Неверный формат номера." },
  "private.phones.duplicate": { "zh-CN": "这个手机号已经存在。", "zh-TW": "這個手機號碼已經存在。", en: "This phone number already exists.", fr: "Ce numéro existe déjà.", ja: "この電話番号はすでに登録されています。", ko: "이미 등록된 전화번호입니다.", ru: "Этот номер уже существует." },
  "private.phones.saved": { "zh-CN": "手机号已加密保存。", "zh-TW": "手機號碼已加密儲存。", en: "Phone number encrypted and saved.", fr: "Numéro chiffré et enregistré.", ja: "電話番号を暗号化して保存しました。", ko: "전화번호가 암호화되어 저장되었습니다.", ru: "Номер зашифрован и сохранён." },
  "private.phones.saveFailed": { "zh-CN": "手机号保存失败，请稍后再试。", "zh-TW": "手機號碼儲存失敗，請稍後再試。", en: "Could not save the phone number. Try again later.", fr: "Impossible d’enregistrer le numéro. Réessayez plus tard.", ja: "電話番号を保存できませんでした。後でもう一度お試しください。", ko: "전화번호를 저장하지 못했습니다. 나중에 다시 시도하세요.", ru: "Не удалось сохранить номер. Повторите попытку позже." },
  "private.phones.deleteConfirm": { "zh-CN": "确定删除这个手机号吗？此操作会立即保存。", "zh-TW": "確定刪除這個手機號碼嗎？此操作會立即儲存。", en: "Delete this phone number? The change is saved immediately.", fr: "Supprimer ce numéro ? La modification est enregistrée immédiatement.", ja: "この電話番号を削除しますか？変更はすぐに保存されます。", ko: "이 전화번호를 삭제할까요? 변경 사항은 즉시 저장됩니다.", ru: "Удалить этот номер? Изменение сохранится сразу." },
  "private.phones.deleted": { "zh-CN": "手机号已删除。", "zh-TW": "手機號碼已刪除。", en: "Phone number deleted.", fr: "Numéro supprimé.", ja: "電話番号を削除しました。", ko: "전화번호가 삭제되었습니다.", ru: "Номер удалён." },
  "private.ledger.eyebrow": { "zh-CN": "个人账本", "zh-TW": "個人帳本", en: "personal ledger", fr: "comptes personnels", ja: "個人帳簿", ko: "개인 장부", ru: "личный учёт" },
  "private.ledger.title": { "zh-CN": "账目管理", "zh-TW": "帳目管理", en: "Ledger Management", fr: "Gestion des comptes", ja: "帳目管理", ko: "장부 관리", ru: "Управление учётом" },
  "private.ledger.copy": { "zh-CN": "按月记录收支和订阅。不同币种分别统计，不进行推测性汇率换算。", "zh-TW": "按月記錄收支和訂閱。不同幣別分別統計，不進行推測性匯率換算。", en: "Track income, spending, and subscriptions by month. Currencies are totaled separately without guessed exchange rates.", fr: "Suivez revenus, dépenses et abonnements par mois. Les devises sont totalisées séparément, sans taux de change estimé.", ja: "月ごとの収支と購読を記録します。推測の為替換算はせず、通貨ごとに集計します。", ko: "월별 수입, 지출, 구독을 기록합니다. 추정 환율 없이 통화별로 따로 합산합니다.", ru: "Учитывайте доходы, расходы и подписки по месяцам. Валюты суммируются отдельно без приблизительного пересчёта." },
  "private.ledger.add": { "zh-CN": "记一笔", "zh-TW": "記一筆", en: "Add entry", fr: "Ajouter une écriture", ja: "記録を追加", ko: "내역 추가", ru: "Добавить запись" },
  "private.ledger.month": { "zh-CN": "月份", "zh-TW": "月份", en: "Month", fr: "Mois", ja: "月", ko: "월", ru: "Месяц" },
  "private.ledger.allMonths": { "zh-CN": "全部月份", "zh-TW": "全部月份", en: "All months", fr: "Tous les mois", ja: "すべての月", ko: "전체 월", ru: "Все месяцы" },
  "private.ledger.summaryLabel": { "zh-CN": "按币种收支统计", "zh-TW": "按幣別收支統計", en: "Income and spending totals by currency", fr: "Totaux des revenus et dépenses par devise", ja: "通貨別の収支集計", ko: "통화별 수입 및 지출 합계", ru: "Итоги доходов и расходов по валютам" },
  "private.ledger.formEyebrow": { "zh-CN": "账目明细", "zh-TW": "帳目明細", en: "entry details", fr: "détails de l’écriture", ja: "帳目の詳細", ko: "장부 항목 정보", ru: "данные записи" },
  "private.ledger.close": { "zh-CN": "关闭账目编辑", "zh-TW": "關閉帳目編輯", en: "Close ledger editor", fr: "Fermer l’éditeur de compte", ja: "帳目編集を閉じる", ko: "장부 편집 닫기", ru: "Закрыть редактор записи" },
  "private.ledger.addTitle": { "zh-CN": "记录账目", "zh-TW": "記錄帳目", en: "Add ledger entry", fr: "Ajouter une écriture", ja: "帳目を記録", ko: "장부 항목 추가", ru: "Добавить запись" },
  "private.ledger.editTitle": { "zh-CN": "编辑账目", "zh-TW": "編輯帳目", en: "Edit ledger entry", fr: "Modifier l’écriture", ja: "帳目を編集", ko: "장부 항목 편집", ru: "Изменить запись" },
  "private.ledger.date": { "zh-CN": "日期", "zh-TW": "日期", en: "Date", fr: "Date", ja: "日付", ko: "날짜", ru: "Дата" },
  "private.ledger.type": { "zh-CN": "类型", "zh-TW": "類型", en: "Type", fr: "Type", ja: "種類", ko: "유형", ru: "Тип" },
  "private.ledger.typeExpense": { "zh-CN": "支出", "zh-TW": "支出", en: "Expense", fr: "Dépense", ja: "支出", ko: "지출", ru: "Расход" },
  "private.ledger.typeIncome": { "zh-CN": "收入", "zh-TW": "收入", en: "Income", fr: "Revenu", ja: "収入", ko: "수입", ru: "Доход" },
  "private.ledger.category": { "zh-CN": "分类", "zh-TW": "分類", en: "Category", fr: "Catégorie", ja: "分類", ko: "분류", ru: "Категория" },
  "private.ledger.categorySubscription": { "zh-CN": "订阅服务", "zh-TW": "訂閱服務", en: "Subscription", fr: "Abonnement", ja: "購読サービス", ko: "구독 서비스", ru: "Подписка" },
  "private.ledger.categoryFood": { "zh-CN": "餐饮", "zh-TW": "餐飲", en: "Food", fr: "Alimentation", ja: "飲食", ko: "식비", ru: "Питание" },
  "private.ledger.categoryTransport": { "zh-CN": "交通", "zh-TW": "交通", en: "Transport", fr: "Transport", ja: "交通", ko: "교통", ru: "Транспорт" },
  "private.ledger.categoryHousing": { "zh-CN": "居住", "zh-TW": "居住", en: "Housing", fr: "Logement", ja: "住居", ko: "주거", ru: "Жильё" },
  "private.ledger.categoryShopping": { "zh-CN": "购物", "zh-TW": "購物", en: "Shopping", fr: "Achats", ja: "買い物", ko: "쇼핑", ru: "Покупки" },
  "private.ledger.categoryHealth": { "zh-CN": "健康", "zh-TW": "健康", en: "Health", fr: "Santé", ja: "健康", ko: "건강", ru: "Здоровье" },
  "private.ledger.categoryEducation": { "zh-CN": "教育", "zh-TW": "教育", en: "Education", fr: "Éducation", ja: "教育", ko: "교육", ru: "Образование" },
  "private.ledger.categoryEntertainment": { "zh-CN": "娱乐", "zh-TW": "娛樂", en: "Entertainment", fr: "Loisirs", ja: "娯楽", ko: "여가", ru: "Развлечения" },
  "private.ledger.categorySalary": { "zh-CN": "工资", "zh-TW": "薪資", en: "Salary", fr: "Salaire", ja: "給与", ko: "급여", ru: "Зарплата" },
  "private.ledger.categoryTransfer": { "zh-CN": "转账", "zh-TW": "轉帳", en: "Transfer", fr: "Virement", ja: "振替", ko: "이체", ru: "Перевод" },
  "private.ledger.categoryOther": { "zh-CN": "其他", "zh-TW": "其他", en: "Other", fr: "Autre", ja: "その他", ko: "기타", ru: "Другое" },
  "private.ledger.currency": { "zh-CN": "币种", "zh-TW": "幣別", en: "Currency", fr: "Devise", ja: "通貨", ko: "통화", ru: "Валюта" },
  "private.ledger.amount": { "zh-CN": "金额", "zh-TW": "金額", en: "Amount", fr: "Montant", ja: "金額", ko: "금액", ru: "Сумма" },
  "private.ledger.amountPlaceholder": { "zh-CN": "0.00", "zh-TW": "0.00", en: "0.00", fr: "0,00", ja: "0", ko: "0.00", ru: "0,00" },
  "private.ledger.merchant": { "zh-CN": "商户或来源", "zh-TW": "商戶或來源", en: "Merchant or source", fr: "Commerçant ou source", ja: "店舗または入金元", ko: "가맹점 또는 출처", ru: "Продавец или источник" },
  "private.ledger.merchantPlaceholder": { "zh-CN": "例如：Apple、工资", "zh-TW": "例如：Apple、薪資", en: "Example: Apple or salary", fr: "Exemple : Apple ou salaire", ja: "例：Apple、給与", ko: "예: Apple, 급여", ru: "Например: Apple или зарплата" },
  "private.ledger.recurring": { "zh-CN": "周期性账目或订阅", "zh-TW": "週期性帳目或訂閱", en: "Recurring entry or subscription", fr: "Écriture récurrente ou abonnement", ja: "定期的な帳目または購読", ko: "정기 장부 항목 또는 구독", ru: "Регулярный платёж или подписка" },
  "private.ledger.recurringShort": { "zh-CN": "周期性", "zh-TW": "週期性", en: "Recurring", fr: "Récurrent", ja: "定期", ko: "정기", ru: "Регулярно" },
  "private.ledger.note": { "zh-CN": "备注", "zh-TW": "備註", en: "Notes", fr: "Notes", ja: "メモ", ko: "메모", ru: "Заметки" },
  "private.ledger.notePlaceholder": { "zh-CN": "补充账单周期、报销或退款信息", "zh-TW": "補充帳單週期、報銷或退款資訊", en: "Billing cycle, reimbursement, or refund details", fr: "Cycle de facturation, remboursement ou avoir", ja: "請求周期、精算、返金などの情報", ko: "청구 주기, 비용 처리 또는 환불 정보", ru: "Период оплаты, компенсация или возврат" },
  "private.ledger.income": { "zh-CN": "收入", "zh-TW": "收入", en: "Income", fr: "Revenus", ja: "収入", ko: "수입", ru: "Доходы" },
  "private.ledger.expense": { "zh-CN": "支出", "zh-TW": "支出", en: "Expense", fr: "Dépenses", ja: "支出", ko: "지출", ru: "Расходы" },
  "private.ledger.balance": { "zh-CN": "结余", "zh-TW": "結餘", en: "Balance", fr: "Solde", ja: "残高", ko: "잔액", ru: "Баланс" },
  "private.ledger.entries": { "zh-CN": "笔", "zh-TW": "筆", en: "entries", fr: "écritures", ja: "件", ko: "건", ru: "записей" },
  "private.ledger.noSummary": { "zh-CN": "当前月份暂无可统计账目。", "zh-TW": "目前月份暫無可統計帳目。", en: "No entries to total for this month.", fr: "Aucune écriture à totaliser pour ce mois.", ja: "今月は集計できる帳目がありません。", ko: "이번 달에 합산할 장부 항목이 없습니다.", ru: "За этот месяц нет записей для подсчёта." },
  "private.ledger.empty": { "zh-CN": "当前筛选范围暂无账目。", "zh-TW": "目前篩選範圍暫無帳目。", en: "No entries match the current filter.", fr: "Aucune écriture ne correspond au filtre actuel.", ja: "現在の絞り込みに一致する帳目はありません。", ko: "현재 필터에 해당하는 장부 항목이 없습니다.", ru: "Нет записей, соответствующих фильтру." },
  "private.ledger.limit": { "zh-CN": "最多可保存 1000 笔账目。", "zh-TW": "最多可儲存 1000 筆帳目。", en: "You can save up to 1,000 ledger entries.", fr: "Vous pouvez enregistrer jusqu’à 1 000 écritures.", ja: "帳目は最大 1,000 件まで保存できます。", ko: "장부 항목은 최대 1,000건까지 저장할 수 있습니다.", ru: "Можно сохранить до 1000 записей." },
  "private.ledger.invalidAmount": { "zh-CN": "请输入大于 0、最多两位小数的金额。", "zh-TW": "請輸入大於 0、最多兩位小數的金額。", en: "Enter an amount greater than zero with no more than two decimal places.", fr: "Saisissez un montant supérieur à zéro avec au plus deux décimales.", ja: "0 より大きく、小数点以下 2 桁以内の金額を入力してください。", ko: "0보다 크고 소수점 이하 최대 두 자리인 금액을 입력하세요.", ru: "Введите сумму больше нуля, не более чем с двумя знаками после запятой." },
  "private.ledger.invalidAmountJpy": { "zh-CN": "日元金额请输入大于 0 的整数。", "zh-TW": "日圓金額請輸入大於 0 的整數。", en: "Enter a whole-yen amount greater than zero.", fr: "Saisissez un montant en yens entier et supérieur à zéro.", ja: "0 より大きい整数の円金額を入力してください。", ko: "0보다 큰 정수 엔화 금액을 입력하세요.", ru: "Введите целую сумму в иенах больше нуля." },
  "private.ledger.saved": { "zh-CN": "账目已加密保存。", "zh-TW": "帳目已加密儲存。", en: "Ledger entry encrypted and saved.", fr: "Écriture chiffrée et enregistrée.", ja: "帳目を暗号化して保存しました。", ko: "장부 항목이 암호화되어 저장되었습니다.", ru: "Запись зашифрована и сохранена." },
  "private.ledger.saveFailed": { "zh-CN": "账目保存失败，请稍后再试。", "zh-TW": "帳目儲存失敗，請稍後再試。", en: "Could not save the entry. Try again later.", fr: "Impossible d’enregistrer l’écriture. Réessayez plus tard.", ja: "帳目を保存できませんでした。後でもう一度お試しください。", ko: "장부 항목을 저장하지 못했습니다. 나중에 다시 시도하세요.", ru: "Не удалось сохранить запись. Повторите попытку позже." },
  "private.ledger.edit": { "zh-CN": "编辑账目", "zh-TW": "編輯帳目", en: "Edit entry", fr: "Modifier l’écriture", ja: "帳目を編集", ko: "장부 항목 편집", ru: "Изменить запись" },
  "private.ledger.deleteConfirm": { "zh-CN": "确定删除这笔账目吗？此操作会立即保存。", "zh-TW": "確定刪除這筆帳目嗎？此操作會立即儲存。", en: "Delete this ledger entry? The change is saved immediately.", fr: "Supprimer cette écriture ? La modification est enregistrée immédiatement.", ja: "この帳目を削除しますか？変更はすぐに保存されます。", ko: "이 장부 항목을 삭제할까요? 변경 사항은 즉시 저장됩니다.", ru: "Удалить эту запись? Изменение сохранится сразу." },
  "private.ledger.deleted": { "zh-CN": "账目已删除。", "zh-TW": "帳目已刪除。", en: "Ledger entry deleted.", fr: "Écriture supprimée.", ja: "帳目を削除しました。", ko: "장부 항목이 삭제되었습니다.", ru: "Запись удалена." },
  "private.mail.viewsLabel": { "zh-CN": "邮箱视图", "zh-TW": "信箱檢視", en: "Mailbox views", fr: "Vues de la boîte", ja: "メール表示", ko: "메일함 보기", ru: "Представления почты" },
  "private.mail.insightsTab": { "zh-CN": "账号与订阅线索", "zh-TW": "帳號與訂閱線索", en: "Accounts & subscription clues", fr: "Indices de comptes et abonnements", ja: "アカウントと購読の手掛かり", ko: "계정 및 구독 단서", ru: "Признаки аккаунтов и подписок" },
  "private.mail.insightsEyebrow": { "zh-CN": "邮件线索分析", "zh-TW": "郵件線索分析", en: "mail clue analysis", fr: "analyse des indices mail", ja: "メールの手掛かり分析", ko: "메일 단서 분석", ru: "анализ почтовых признаков" },
  "private.mail.insightsTitle": { "zh-CN": "账号与订阅线索", "zh-TW": "帳號與訂閱線索", en: "Account and subscription clues", fr: "Indices de comptes et abonnements", ja: "アカウントと購読の手掛かり", ko: "계정 및 구독 단서", ru: "Признаки аккаунтов и подписок" },
  "private.mail.insightsCopy": { "zh-CN": "根据邮件头推断可能注册过的服务、购买记录与订阅线索，并按类别整理。", "zh-TW": "根據郵件標頭推斷可能註冊過的服務、購買記錄與訂閱線索，並按類別整理。", en: "Infer possible registered services, purchases, and subscription clues from message headers and organize them by category.", fr: "Déduisez des services potentiellement enregistrés, achats et abonnements à partir des en-têtes, puis classez les indices.", ja: "メールヘッダーから登録サービス、購入、購読の可能性を推測し、分類して整理します。", ko: "메일 헤더에서 가입 서비스, 구매 및 구독 가능성을 추론해 분류합니다.", ru: "Определяет возможные регистрации, покупки и подписки по заголовкам писем и группирует признаки." },
  "private.mail.scanThisMailbox": { "zh-CN": "扫描此邮箱", "zh-TW": "掃描此信箱", en: "Scan this mailbox", fr: "Analyser cette boîte", ja: "このメールを分析", ko: "이 메일함 스캔", ru: "Проверить этот ящик" },
  "private.mail.clearInsights": { "zh-CN": "清除结果", "zh-TW": "清除結果", en: "Clear results", fr: "Effacer les résultats", ja: "結果を消去", ko: "결과 지우기", ru: "Очистить результаты" },
  "private.mail.insightsPrivacyTitle": { "zh-CN": "只分析邮件头，不读取正文", "zh-TW": "只分析郵件標頭，不讀取正文", en: "Headers only; message bodies are not read", fr: "En-têtes uniquement ; le corps des messages n’est pas lu", ja: "ヘッダーのみを分析し、本文は読みません", ko: "메일 헤더만 분석하며 본문은 읽지 않음", ru: "Анализируются только заголовки, без чтения текста писем" },
  "private.mail.insightsPrivacyCopy": { "zh-CN": "只检查发件人、主题、日期和邮件列表标记；结果仅留在当前页面内存中，刷新或关闭后即清除。", "zh-TW": "只檢查寄件者、主旨、日期和郵件列表標記；結果僅留在目前頁面記憶體中，重新整理或關閉後即清除。", en: "Only sender, subject, date, and mailing-list markers are checked. Results remain in this page’s memory and clear on refresh or close.", fr: "Seuls l’expéditeur, l’objet, la date et les marqueurs de liste sont vérifiés. Les résultats restent en mémoire sur cette page et disparaissent à l’actualisation ou à la fermeture.", ja: "送信者、件名、日付、メーリングリストの印だけを確認します。結果はこのページのメモリにのみ残り、更新または終了時に消去されます。", ko: "보낸 사람, 제목, 날짜 및 메일링 리스트 표시만 확인합니다. 결과는 현재 페이지 메모리에만 남고 새로고침하거나 닫으면 지워집니다.", ru: "Проверяются только отправитель, тема, дата и метки рассылок. Результаты остаются в памяти страницы и удаляются при обновлении или закрытии." },
  "private.mail.insightsDisclaimer": { "zh-CN": "以下内容均为邮件线索推断，可能遗漏或误判；营销邮件订阅不等于付费订阅，请以服务商账号与实际账单为准。", "zh-TW": "以下內容均為郵件線索推斷，可能遺漏或誤判；行銷郵件訂閱不等於付費訂閱，請以服務商帳號與實際帳單為準。", en: "Everything below is inferred from email clues and may be incomplete or wrong. A marketing mailing-list subscription is not the same as a paid subscription; verify with the service account and actual bills.", fr: "Tout ce qui suit est déduit d’indices d’e-mails et peut être incomplet ou erroné. Une inscription à une liste marketing n’est pas un abonnement payant ; vérifiez le compte du service et les factures réelles.", ja: "以下はすべてメールの手掛かりからの推測で、見落としや誤判定の可能性があります。マーケティングメールの購読は有料契約と同じではありません。サービスのアカウントと実際の請求を確認してください。", ko: "아래 내용은 모두 메일 단서에 따른 추론으로 누락되거나 틀릴 수 있습니다. 마케팅 메일 구독은 유료 구독과 같지 않으므로 서비스 계정과 실제 청구서를 확인하세요.", ru: "Все сведения ниже выведены из почтовых признаков и могут быть неполными или ошибочными. Маркетинговая рассылка не равна платной подписке; сверяйтесь с аккаунтом сервиса и фактическими счетами." },
  "private.mail.insightsEmptyTitle": { "zh-CN": "尚未扫描此邮箱", "zh-TW": "尚未掃描此信箱", en: "This mailbox has not been scanned", fr: "Cette boîte n’a pas encore été analysée", ja: "このメールはまだ分析されていません", ko: "이 메일함은 아직 스캔되지 않았습니다", ru: "Этот ящик ещё не проверен" },
  "private.mail.insightsEmptyCopy": { "zh-CN": "扫描结果是邮件线索推断，不代表你仍持有账号或正在付费。", "zh-TW": "掃描結果是郵件線索推斷，不代表你仍持有帳號或正在付費。", en: "Results are inferences from email clues; they do not prove you still have an account or pay for a service.", fr: "Les résultats sont déduits d’indices d’e-mails ; ils ne prouvent pas que vous avez encore un compte ni que vous payez un service.", ja: "結果はメールの手掛かりからの推測で、現在もアカウントを保有または支払っている証明ではありません。", ko: "결과는 메일 단서에 따른 추론이며 현재도 계정을 보유하거나 결제 중임을 뜻하지 않습니다.", ru: "Результаты — лишь выводы из писем; они не доказывают наличие аккаунта или действующей оплаты." },
  "private.mail.scanningInsights": { "zh-CN": "正在扫描此邮箱的邮件头…", "zh-TW": "正在掃描此信箱的郵件標頭…", en: "Scanning message headers…", fr: "Analyse des en-têtes…", ja: "メールヘッダーを分析中…", ko: "메일 헤더 스캔 중…", ru: "Анализ заголовков писем…" },
  "private.mail.scanningInsightsTitle": { "zh-CN": "正在寻找账号与订阅线索", "zh-TW": "正在尋找帳號與訂閱線索", en: "Looking for account and subscription clues", fr: "Recherche d’indices de comptes et abonnements", ja: "アカウントと購読の手掛かりを検索中", ko: "계정 및 구독 단서 찾는 중", ru: "Поиск признаков аккаунтов и подписок" },
  "private.mail.scanningInsightsCopy": { "zh-CN": "只读取发件人、主题、日期和邮件列表标记，不读取正文。", "zh-TW": "只讀取寄件者、主旨、日期和郵件列表標記，不讀取正文。", en: "Only sender, subject, date, and mailing-list markers are read; message bodies are not.", fr: "Seuls l’expéditeur, l’objet, la date et les marqueurs de liste sont lus, pas le corps des messages.", ja: "送信者、件名、日付、メーリングリストの印だけを読み、本文は読みません。", ko: "보낸 사람, 제목, 날짜 및 메일링 리스트 표시만 읽고 본문은 읽지 않습니다.", ru: "Читаются только отправитель, тема, дата и метки рассылок, но не текст писем." },
  "private.mail.insightsScanned": { "zh-CN": "扫描完成", "zh-TW": "掃描完成", en: "Scan complete", fr: "Analyse terminée", ja: "分析完了", ko: "스캔 완료", ru: "Проверка завершена" },
  "private.mail.insightsFailed": { "zh-CN": "扫描失败", "zh-TW": "掃描失敗", en: "Scan failed", fr: "Échec de l’analyse", ja: "分析に失敗しました", ko: "스캔 실패", ru: "Ошибка проверки" },
  "private.mail.messageHeaders": { "zh-CN": "封邮件头", "zh-TW": "封郵件標頭", en: "message headers", fr: "en-têtes", ja: "件のメールヘッダー", ko: "개 메일 헤더", ru: "заголовков писем" },
  "private.mail.clues": { "zh-CN": "项线索", "zh-TW": "項線索", en: "clues", fr: "indices", ja: "件の手掛かり", ko: "개 단서", ru: "признаков" },
  "private.mail.scannedHeaders": { "zh-CN": "已分析邮件头", "zh-TW": "已分析郵件標頭", en: "Headers analyzed", fr: "En-têtes analysés", ja: "分析済みヘッダー", ko: "분석한 메일 헤더", ru: "Проанализировано заголовков" },
  "private.mail.noInsightsTitle": { "zh-CN": "没有发现明确线索", "zh-TW": "沒有發現明確線索", en: "No clear clues found", fr: "Aucun indice clair trouvé", ja: "明確な手掛かりは見つかりませんでした", ko: "명확한 단서를 찾지 못했습니다", ru: "Явных признаков не найдено" },
  "private.mail.noInsightsCopy": { "zh-CN": "这不代表没有注册账号或订阅；当前扫描只覆盖收件箱邮件头。", "zh-TW": "這不代表沒有註冊帳號或訂閱；目前掃描只涵蓋收件箱郵件標頭。", en: "This does not mean there are no accounts or subscriptions; the scan covers inbox headers only.", fr: "Cela ne signifie pas qu’il n’existe aucun compte ni abonnement ; l’analyse couvre uniquement les en-têtes de la boîte de réception.", ja: "アカウントや購読がないとは限りません。現在の分析対象は受信トレイのヘッダーのみです。", ko: "계정이나 구독이 없다는 뜻은 아닙니다. 현재 스캔은 받은편지함 헤더만 다룹니다.", ru: "Это не означает отсутствие аккаунтов или подписок: проверяются только заголовки входящих писем." },
  "private.mail.insightCategoryRecurring": { "zh-CN": "周期订阅", "zh-TW": "週期訂閱", en: "Recurring subscription", fr: "Abonnement récurrent", ja: "定期購読", ko: "정기 구독", ru: "Регулярная подписка" },
  "private.mail.insightCategoryAccount": { "zh-CN": "注册账号", "zh-TW": "註冊帳號", en: "Registered account", fr: "Compte enregistré", ja: "登録アカウント", ko: "가입 계정", ru: "Зарегистрированный аккаунт" },
  "private.mail.insightCategoryPurchase": { "zh-CN": "购买记录", "zh-TW": "購買記錄", en: "Purchase", fr: "Achat", ja: "購入記録", ko: "구매 기록", ru: "Покупка" },
  "private.mail.insightCategoryNewsletter": { "zh-CN": "邮件简报", "zh-TW": "郵件簡報", en: "Newsletter", fr: "Lettre d’information", ja: "メールニュース", ko: "뉴스레터", ru: "Рассылка" },
  "private.mail.insightCategoryOther": { "zh-CN": "其他线索", "zh-TW": "其他線索", en: "Other clue", fr: "Autre indice", ja: "その他の手掛かり", ko: "기타 단서", ru: "Другой признак" },
  "private.mail.insightStatusActive": { "zh-CN": "可能仍在续费", "zh-TW": "可能仍在續費", en: "Possibly still renewing", fr: "Renouvellement possiblement actif", ja: "継続更新中の可能性", ko: "계속 갱신 중일 수 있음", ru: "Возможно, продлевается" },
  "private.mail.insightStatusFailed": { "zh-CN": "付款可能失败", "zh-TW": "付款可能失敗", en: "Payment may have failed", fr: "Paiement peut-être échoué", ja: "支払い失敗の可能性", ko: "결제가 실패했을 수 있음", ru: "Возможно, платёж не прошёл" },
  "private.mail.insightStatusCancelled": { "zh-CN": "可能已取消", "zh-TW": "可能已取消", en: "Possibly cancelled", fr: "Possiblement annulé", ja: "解約済みの可能性", ko: "취소되었을 수 있음", ru: "Возможно, отменено" },
  "private.mail.insightStatusCompleted": { "zh-CN": "购买可能完成", "zh-TW": "購買可能完成", en: "Purchase may be complete", fr: "Achat possiblement terminé", ja: "購入完了の可能性", ko: "구매가 완료되었을 수 있음", ru: "Возможно, покупка завершена" },
  "private.mail.insightStatusPossible": { "zh-CN": "有相关线索", "zh-TW": "有相關線索", en: "Related clue found", fr: "Indice associé trouvé", ja: "関連する手掛かりあり", ko: "관련 단서 발견", ru: "Найден связанный признак" },
  "private.mail.confidence": { "zh-CN": "置信度", "zh-TW": "可信度", en: "Confidence", fr: "Confiance", ja: "確信度", ko: "신뢰도", ru: "Уверенность" },
  "private.mail.confidenceHigh": { "zh-CN": "较高", "zh-TW": "較高", en: "high", fr: "élevée", ja: "高い", ko: "높음", ru: "высокая" },
  "private.mail.confidenceMedium": { "zh-CN": "中等", "zh-TW": "中等", en: "medium", fr: "moyenne", ja: "中程度", ko: "중간", ru: "средняя" },
  "private.mail.confidenceLow": { "zh-CN": "较低", "zh-TW": "較低", en: "low", fr: "faible", ja: "低い", ko: "낮음", ru: "низкая" },
  "private.mail.unknownService": { "zh-CN": "未知服务", "zh-TW": "未知服務", en: "Unknown service", fr: "Service inconnu", ja: "不明なサービス", ko: "알 수 없는 서비스", ru: "Неизвестный сервис" },
  "private.mail.insightItems": { "zh-CN": "项", "zh-TW": "項", en: "items", fr: "éléments", ja: "件", ko: "개", ru: "элементов" },
  "private.mail.inferredFromMail": { "zh-CN": "邮件推断", "zh-TW": "郵件推斷", en: "Inferred from email", fr: "Déduit des e-mails", ja: "メールからの推測", ko: "메일에서 추론", ru: "Выведено из писем" },
  "private.mail.evidenceMessages": { "zh-CN": "封证据邮件", "zh-TW": "封證據郵件", en: "evidence messages", fr: "messages associés", ja: "件の根拠メール", ko: "개 근거 메일", ru: "писем-оснований" },
  "private.mail.evidence": { "zh-CN": "证据邮件", "zh-TW": "證據郵件", en: "Evidence messages", fr: "Messages associés", ja: "根拠メール", ko: "근거 메일", ru: "Письма-основания" },
  "private.mail.recoveryOptions": { "zh-CN": "高级恢复选项", "zh-TW": "進階恢復選項", en: "Advanced recovery options", fr: "Options de récupération avancée", ja: "高度な復旧オプション", ko: "고급 복구 옵션", ru: "Расширенное восстановление" },
  "private.mail.reloginSync": { "zh-CN": "重新登录以恢复自动同步", "zh-TW": "重新登入以恢復自動同步", en: "Sign in again to restore automatic sync", fr: "Reconnectez-vous pour rétablir la synchronisation automatique", ja: "再ログインして自動同期を復元", ko: "자동 동기화를 복원하려면 다시 로그인", ru: "Войдите снова, чтобы восстановить автосинхронизацию" },
  "private.mail.reloginSyncCopy": { "zh-CN": "当前登录早于自动同步功能。退出并重新登录私人空间后，邮箱、手机号和账目会在其他设备自动解锁。", "zh-TW": "目前登入早於自動同步功能。登出並重新登入私人空間後，信箱、手機號碼和帳目會在其他裝置自動解鎖。", en: "This session predates automatic sync. Sign out and back in to Private Space so mail, phone, and ledger data unlock automatically on other devices.", fr: "Cette session est antérieure à la synchronisation automatique. Déconnectez-vous puis reconnectez-vous à l’espace privé afin que la messagerie, les téléphones et les comptes se déverrouillent sur vos autres appareils.", ja: "このセッションは自動同期の導入前に作成されました。プライベートスペースから一度ログアウトして再ログインすると、メール、電話番号、帳目が他の端末で自動解除されます。", ko: "이 세션은 자동 동기화 기능보다 이전에 생성되었습니다. 개인 공간에서 로그아웃한 뒤 다시 로그인하면 다른 기기에서 메일, 전화번호, 장부가 자동으로 잠금 해제됩니다.", ru: "Эта сессия создана до появления автосинхронизации. Выйдите и войдите в личное пространство снова, чтобы почта, телефоны и учёт автоматически открывались на других устройствах." },
  "private.mail.resetVault": { "zh-CN": "清空加密资料库", "zh-TW": "清空加密資料庫", en: "Reset encrypted vault", fr: "Réinitialiser le coffre chiffré", ja: "暗号化保管庫をリセット", ko: "암호화 자료 보관함 초기화", ru: "Сбросить зашифрованное хранилище" },
  "private.mail.resetVaultConfirm": { "zh-CN": "确定清空加密资料库吗？所有邮箱、手机号和账目都会被永久删除，且无法撤销。", "zh-TW": "確定清空加密資料庫嗎？所有信箱、手機號碼和帳目都會被永久刪除，且無法復原。", en: "Reset the encrypted vault? All mailboxes, phone numbers, and ledger entries will be permanently deleted. This cannot be undone.", fr: "Réinitialiser le coffre chiffré ? Toutes les boîtes mail, tous les numéros et toutes les écritures seront définitivement supprimés. Cette action est irréversible.", ja: "暗号化保管庫をリセットしますか？すべてのメール、電話番号、帳目が完全に削除され、元に戻せません。", ko: "암호화 자료 보관함을 초기화할까요? 모든 메일함, 전화번호, 장부 항목이 영구 삭제되며 되돌릴 수 없습니다.", ru: "Сбросить зашифрованное хранилище? Все почтовые ящики, номера телефонов и записи учёта будут удалены без возможности восстановления." },
  "private.mail.resettingVault": { "zh-CN": "正在清空加密资料库…", "zh-TW": "正在清空加密資料庫…", en: "Resetting encrypted vault…", fr: "Réinitialisation du coffre chiffré…", ja: "暗号化保管庫をリセット中…", ko: "암호화 자료 보관함 초기화 중…", ru: "Сброс зашифрованного хранилища…" },
  "private.mail.vaultReset": { "zh-CN": "加密资料库已清空。", "zh-TW": "加密資料庫已清空。", en: "Encrypted vault reset.", fr: "Coffre chiffré réinitialisé.", ja: "暗号化保管庫をリセットしました。", ko: "암호화 자료 보관함이 초기화되었습니다.", ru: "Зашифрованное хранилище сброшено." },
  "private.mail.vaultResetFailed": { "zh-CN": "加密资料库清空失败，请稍后再试。", "zh-TW": "加密資料庫清空失敗，請稍後再試。", en: "Could not reset the encrypted vault. Try again later.", fr: "Impossible de réinitialiser le coffre chiffré. Réessayez plus tard.", ja: "暗号化保管庫をリセットできませんでした。後でもう一度お試しください。", ko: "암호화 자료 보관함을 초기화하지 못했습니다. 나중에 다시 시도하세요.", ru: "Не удалось сбросить хранилище. Повторите попытку позже." },
  "private.mail.reloginPrompt": { "zh-CN": "请重新登录一次，以自动解锁邮箱、手机号和账目资料。", "zh-TW": "請重新登入一次，以自動解鎖信箱、手機號碼和帳目資料。", en: "Sign in again once so mail, phone, and ledger data can unlock automatically.", fr: "Reconnectez-vous une fois pour que la messagerie, les téléphones et les comptes se déverrouillent automatiquement.", ja: "メール、電話番号、帳目を自動解除できるよう、一度ログインし直してください。", ko: "메일, 전화번호, 장부 자료가 자동으로 잠금 해제되도록 한 번 다시 로그인하세요.", ru: "Войдите ещё раз, чтобы почта, телефоны и учёт открывались автоматически." },
  "private.ledger.addFromInsightTitle": { "zh-CN": "从邮件线索添加订阅", "zh-TW": "從郵件線索新增訂閱", en: "Add subscription from mail clue", fr: "Ajouter un abonnement depuis un indice mail", ja: "メールの手掛かりから購読を追加", ko: "메일 단서에서 구독 추가", ru: "Добавить подписку из почтового признака" },
  "private.ledger.copyTitle": { "zh-CN": "复制账目", "zh-TW": "複製帳目", en: "Copy ledger entry", fr: "Copier l’écriture", ja: "帳目を複製", ko: "장부 항목 복사", ru: "Копировать запись" },
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
  for (const node of document.querySelectorAll("[data-i18n-aria-label]")) {
    node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel, node.getAttribute("aria-label") || ""));
  }
  for (const node of document.querySelectorAll("[data-i18n-title]")) {
    node.setAttribute("title", t(node.dataset.i18nTitle, node.getAttribute("title") || ""));
  }
  for (const select of document.querySelectorAll("[data-language-select]")) {
    select.value = meta.value;
    select.setAttribute("aria-label", t("settings.languageSelect"));
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
    select.setAttribute("aria-label", t("settings.appearanceSelect"));
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

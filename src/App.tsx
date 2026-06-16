import React, { useState, useEffect } from 'react';
import { 
  Truck, Building2, Users, MapPin, Calendar, Bell, PlusCircle, 
  ArrowRight, ChevronRight, CheckCircle, Languages, Shield, 
  Database, Code, TrendingUp, Clock, ArrowUpRight, Check, X, Clipboard, Phone,
  Lock, LogOut, User
} from 'lucide-react';

// --- Types ---
interface DemoAccount {
  email: string;
  password: string;
  nameJa: string;
  nameEn: string;
  role: 'MARUICHI_STAFF' | 'SHINWA_STAFF' | 'SUBCONTRACTOR_STAFF' | 'DRIVER';
  companyJa: string;
  companyEn: string;
  badgeJa: string;
  badgeEn: string;
  avatar: string;
  id: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: "maruichi@maruichi.co.jp",
    password: "password123",
    nameJa: "斉藤 健一郎 (丸一担当者)",
    nameEn: "Kenichiro Saito (Maruichi Staff)",
    role: "MARUICHI_STAFF",
    companyJa: "丸一倉庫株式会社・東京本部",
    companyEn: "Maruichi Souko HQ",
    badgeJa: "荷主 (Shipper)",
    badgeEn: "Shipper (荷主)",
    avatar: "M1",
    id: "SH-M0418"
  },
  {
    email: "shinwa@shinwa-express.co.jp",
    password: "password123",
    nameJa: "高橋 統括運行管理者 (信和元請)",
    nameEn: "Takahashi (Shinwa Dispatcher)",
    role: "SHINWA_STAFF",
    companyJa: "信和運輸株式会社・関東配車管制センター",
    companyEn: "Shinwa Transport Control",
    badgeJa: "元請運送会社 (Primary)",
    badgeEn: "Primary Carrier (元請)",
    avatar: "S1",
    id: "CA-S2001"
  },
  {
    email: "subcontractor@kanto-express.co.jp",
    password: "password123",
    nameJa: "佐藤 運行管理課長 (下請運送)",
    nameEn: "Sato (Subcontractor Manager)",
    role: "SUBCONTRACTOR_STAFF",
    companyJa: "関東第一急行株式会社・首都圏営業部",
    companyEn: "Kanto Express (Partner)",
    badgeJa: "下請協力会社 (Partner)",
    badgeEn: "Subcontractor (下請協力社)",
    avatar: "S2",
    id: "SC-K4092"
  },
  {
    email: "driver@shinwa-express.co.jp",
    password: "password123",
    nameJa: "野沢 保 (運行ドライバー)",
    nameEn: "Tamotsu Nozawa (Active Driver)",
    role: "DRIVER",
    companyJa: "信和・下請 運行ドライバー班",
    companyEn: "Active Carrier Fleet",
    badgeJa: "乗務員 (Driver)",
    badgeEn: "Driver (乗務員)",
    avatar: "DR",
    id: "DRV-SAT0819"
  }
];

// --- Types ---
interface TransportRequest {
  id: string;
  orderNumber: string;
  origin: string;
  destination: string;
  cargoType: string;
  cargoWeight: number;
  vehicleType: string;
  vehicleCount: number;
  status: 'PENDING' | 'SHINWA_ACCEPTED' | 'SUBCONTRACTED' | 'DRIVER_ASSIGNED' | 'DISPATCHED' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';
  createdBy: string;
  createdAt: string;
  subContractorId?: string;
  driverName?: string;
  vehiclePlate?: string;
  driverId?: string;
  dispatchedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
}

interface SystemNotification {
  id: string;
  titleJa: string;
  titleEn: string;
  descJa: string;
  descEn: string;
  time: string;
}

// --- Dictionaries ---
const ja = {
  // Navigation
  appName: "丸一倉庫 × 信和運輸",
  appSub: "B2B運送統合物流管理システム",
  roleLabel: "表示中のロール切り替え:",
  langLabel: "Language",
  toastNewOrder: "【丸一倉庫】新規配送依頼が作成されました！信和運輸にリアルタイム通知されました。",
  toastAccept: "【信和運輸】案件を受領しました。自社配車を行いました。",
  toastSub: "【信和運輸】下請会社へ案件を委託・転送しました。",
  toastDriver: "【配車】運送トラックにドライバーと車両を割り当てました。",
  toastStep: "【運行ステータス更新】ドライバーがマイルストーンを更新しました。",

  // Roles
  MARUICHI_STAFF: "丸一倉庫 担当者 (荷主)",
  SHINWA_STAFF: "信和運輸 担当者 (元請)",
  SUBCONTRACTOR_STAFF: "下請運送会社 担当者",
  DRIVER: "ドライバー専用画面 (信和/下請)",

  // Statuses
  PENDING: "配車依頼中",
  SHINWA_ACCEPTED: "元請受付済",
  SUBCONTRACTED: "下請委託済",
  DRIVER_ASSIGNED: "配車済 / 運転手決定",
  DISPATCHED: "運行開始 / 出発済",
  PICKED_UP: "荷受積込完了",
  DELIVERED: "降ろし完了 / 配送完了",
  CANCELLED: "キャンセル",

  // Inputs & Common
  origin: "発地 (積込場所)",
  destination: "着地 (納品場所)",
  cargoType: "荷姿・貨物種別",
  cargoWeight: "総重量 (t)",
  vehicleType: "希望トラック要件",
  vehicleCount: "台数",
  submitRequest: "配送依頼を送信 (リアルタイム通知)",
  reqList: "配送状況動態ボード",
  orderNo: "注文番号",
  actions: "アクション",
  acceptOwn: "自社便で受託 (ドライバー割当)",
  subcontractTo: "下請会社へ委託して転送",
  assignDriver: "ドライバー・車両を配車",
  driverName: "運転手名",
  vehiclePlate: "車両ナンバー",
  completedOk: "本日も配送ありがとうございました。ご安全に！",
  activeJob: "現在運行中の仕事",
  milestoneStart: "運行開始 (ボタンをタップ)",
  milestonePickup: "荷受完了・積込完了を送信",
  milestoneDeliver: "配達完了・受領書確認",
  completedHistory: "直近の運行実績 logs",
  analyticsTitle: "信和・下請 委託分析 KPI 状況 (シミュレーション値)",
  completedCount: "完了済件数",
  delayRatio: "配送遅延率",
  subcontractRatio: "下請依存率 (アウトソーシング比)",
  internalHandling: "自社運行比率",
  noActiveJob: "現在、割り当てられた運行案件はありません。",
  roleDriver: "乗務員 / 運行ドライバー",
  newRequest: "新規配送案件登録 (FAX/電話代替)",

  // Login
  loginTitle: "統合ポータル ログイン",
  loginSubtitle: "丸一倉庫（荷主）× 信和運輸（元請）運送パートナーシップ管理システム",
  emailLabel: "メールアドレス / ID",
  passwordLabel: "パスワード",
  loginBtn: "ログインしてポータルを開く",
  logoutBtn: "安全にログアウト",
  demoInfoTitle: "デモ用アカウント選択（ワンタップ自動入力）",
  demoClickAutofill: "簡単自動入力してログイン",
  authError: "認証エラー: メールアドレスまたはパスワードが正しくありません。デモ用アカウントの中から選択してください。",
  loggedUserLabel: "ログイン中: "
};

const en = {
  // Navigation
  appName: "Maruichi × Shinwa",
  appSub: "B2B Logistics & Fleet Management Portal",
  roleLabel: "Switch View Role:",
  langLabel: "Language",
  toastNewOrder: "[Maruichi] A new transport request was submitted. Shinwa dispatchers alerted in real-time.",
  toastAccept: "[Shinwa] Order accepted. Dedicated internal driver allocated.",
  toastSub: "[Shinwa] Order subcontracted & forwarded to third-party carrier.",
  toastDriver: "[Dispatch] Driver and truck license plate successfully assigned.",
  toastStep: "[Status Update] Driver successfully logged a transit milestone.",

  // Roles
  MARUICHI_STAFF: "Maruichi Staff (Shipper)",
  SHINWA_STAFF: "Shinwa Staff (Carrier)",
  SUBCONTRACTOR_STAFF: "Subcontractor Staff",
  DRIVER: "Driver's Mobile Web App",

  // Statuses
  PENDING: "Pending Alert",
  SHINWA_ACCEPTED: "Shinwa Accepted",
  SUBCONTRACTED: "Subcontracted",
  DRIVER_ASSIGNED: "Driver Assigned",
  DISPATCHED: "Dispatched",
  PICKED_UP: "Picked Up",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",

  // Inputs & Common
  origin: "Origin Terminal",
  destination: "Destination Terminal",
  cargoType: "Cargo Description",
  cargoWeight: "Weight (Tons)",
  vehicleType: "Vehicle Class / Requirements",
  vehicleCount: "Qty",
  submitRequest: "Submit Request (Real-Time SSE)",
  reqList: "Dispatched Fleet Live Matrix",
  orderNo: "Order ID",
  actions: "Actions",
  acceptOwn: "Accept Order (Assign Shinwa Driver)",
  subcontractTo: "Subcontract Order (Forward)",
  assignDriver: "Assign Driver & License Plate",
  driverName: "Driver Name",
  vehiclePlate: "License Plate",
  completedOk: "Delivery confirmed. Have safe travels!",
  activeJob: "Active Job Milestone Control",
  milestoneStart: "Tap to Start Trip",
  milestonePickup: "Confirm Pickup & Cargo Loaded",
  milestoneDeliver: "Confirm Successful Delivery",
  completedHistory: "Completed Run Log",
  analyticsTitle: "Subcontracting & Outsource Ratio KPI Monitor",
  completedCount: "Completed Orders",
  delayRatio: "On-Time Ratio Gap",
  subcontractRatio: "Subcontract Outsource Ratio",
  internalHandling: "Shinwa Internal Handling",
  noActiveJob: "No active dispatch orders assigned currently.",
  roleDriver: "Active Carrier Driver",
  newRequest: "Log New Transit Order Dispatch",

  // Login
  loginTitle: "Corporate Portal Login",
  loginSubtitle: "Maruichi (Shipper) & Shinwa (Primary Carrier) Integrated Platform",
  emailLabel: "Email Address / ID",
  passwordLabel: "Password",
  loginBtn: "Authenticate & Open Dashboard",
  logoutBtn: "Secure Log Out",
  demoInfoTitle: "Product Evaluation Accounts (Tap to Autofill)",
  demoClickAutofill: "Autofill & Login",
  authError: "Authentication Failed: Please use a valid evaluation credential below.",
  loggedUserLabel: "Active Session: "
};

// --- Mock Initial Data ---
const initialRequests: TransportRequest[] = [
  {
    id: "req-1",
    orderNumber: "MR-2026-001",
    origin: "丸一倉庫 東京大田第一倉庫 (Ota, Tokyo)",
    destination: "信和運輸 大阪南港配送センター (Suminoe, Osaka)",
    cargoType: "精密機械部品 (Precision Parts)",
    cargoWeight: 8.5,
    vehicleType: "10t ウィングエアサス車",
    vehicleCount: 1,
    status: "DELIVERED",
    createdBy: "斉藤 健一郎 (Maruichi Staff)",
    createdAt: "2026-06-15 09:30",
    driverName: "佐藤 義光 (Sato)",
    vehiclePlate: "品川 100 か 48-12",
    dispatchedAt: "2026-06-15 11:00",
    pickedUpAt: "2026-06-15 12:45",
    deliveredAt: "2026-06-15 18:20"
  },
  {
    id: "req-2",
    orderNumber: "MR-2026-002",
    origin: "丸一 横浜本牧ふ頭物流センター (Honmoku, Yokohama)",
    destination: "関東マテリアル 埼玉川越工場 (Kawagoe, Saitama)",
    cargoType: "建材パネル・樹脂パレット (Plastics & Wood Panels)",
    cargoWeight: 14.0,
    vehicleType: "15t 低床平ボディ車",
    vehicleCount: 1,
    status: "DRIVER_ASSIGNED",
    createdBy: "斉藤 健一郎 (Maruichi Staff)",
    createdAt: "2026-06-16 10:15",
    subContractorId: "sub-kanto",
    driverName: "田中 健二 (Tanaka - Kanto Sub)",
    vehiclePlate: "大宮 130 あ 88-91",
    driverId: "drv-sub-1"
  },
  {
    id: "req-3",
    orderNumber: "MR-2026-003",
    origin: "丸一倉庫 千葉習志野デポ (Narashino, Chiba)",
    destination: "信和運輸 仙台営業所 (Miyagino, Sendai)",
    cargoType: "アルミ缶パレット (Beverage Cans)",
    cargoWeight: 5.2,
    vehicleType: "4t 冷蔵ウィング車",
    vehicleCount: 1,
    status: "PENDING",
    createdBy: "斉藤 健一郎 (Maruichi Staff)",
    createdAt: "2026-06-16 11:40"
  }
];

export default function App() {
  const [lang, setLang] = useState<'ja' | 'en'>('ja');
  const [activeRole, setActiveRole] = useState<'MARUICHI_STAFF' | 'SHINWA_STAFF' | 'SUBCONTRACTOR_STAFF' | 'DRIVER'>('MARUICHI_STAFF');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<DemoAccount | null>(null);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const account = DEMO_ACCOUNTS.find(
      acc => acc.email.toLowerCase() === loginEmail.trim().toLowerCase() && acc.password === loginPassword
    );
    if (account) {
      setIsLoggedIn(true);
      setCurrentUser(account);
      setActiveRole(account.role);
      setLoginError(null);
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setLoginError(lang === 'ja' ? '認証エラー: メールアドレスまたはパスワードが正しくありません。' : 'Authentication Failed: Invalid email or password.');
    }
  };

  const handleAutofillLogin = (account: DemoAccount) => {
    setLoginEmail(account.email);
    setLoginPassword(account.password);
    setIsLoggedIn(true);
    setCurrentUser(account);
    setActiveRole(account.role);
    setLoginError(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const [requests, setRequests] = useState<TransportRequest[]>(initialRequests);
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: "not-1",
      titleJa: "新規配車依頼の通知",
      titleEn: "New Dispatch Request Alert",
      descJa: "丸一倉庫より精密機械部品の配送依頼(MR-2026-003)が起票されました。",
      descEn: "Maruichi filed a new dispatch request (MR-2026-003).",
      time: "11:41"
    }
  ]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form Inputs for Maruichi
  const [formOrigin, setFormOrigin] = useState('丸一 川崎デポ第3 (Kawasaki Depot)');
  const [formDest, setFormDest] = useState('信和運輸 静岡支店 (Shizuoka Terminal)');
  const [formCargo, setFormCargo] = useState('飲料製品パレット (Beverage Cases)');
  const [formWeight, setFormWeight] = useState(12);
  const [formVehicle, setFormVehicle] = useState('10t 冷凍車');

  // Trigger Action State Modals
  const [subcontractModalReqId, setSubcontractModalReqId] = useState<string | null>(null);
  const [selectedSubcompany, setSelectedSubcompany] = useState('sub-kanto');

  const [assignModalReqId, setAssignModalReqId] = useState<string | null>(null);
  const [assignDriverName, setAssignDriverName] = useState('野沢 保 (Nozawa - Shinwa)');
  const [assignPlate, setAssignPlate] = useState('品川 100 ぬ 77-52');

  const t = lang === 'ja' ? ja : en;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 5000);
  };

  // 1. Submit Request (Maruichi)
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newReqNumber = `MR-2026-${String(requests.length + 1).padStart(3, '0')}`;
    const newReq: TransportRequest = {
      id: `req-${Date.now()}`,
      orderNumber: newReqNumber,
      origin: formOrigin,
      destination: formDest,
      cargoType: formCargo,
      cargoWeight: Number(formWeight),
      vehicleType: formVehicle,
      vehicleCount: 1,
      status: 'PENDING',
      createdBy: "斉藤 健一郎 (Maruichi Staff)",
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setRequests(prev => [newReq, ...prev]);
    
    // Simulate real-time SSE trigger notification
    const newNotif: SystemNotification = {
      id: `not-${Date.now()}`,
      titleJa: "【リアルタイム】配車依頼受信",
      titleEn: "[Realtime] Received Transport Job",
      descJa: `丸一倉庫が ${newReq.origin}発 の新規便を発注しました。確認してください。`,
      descEn: `Maruichi logged a new route from ${newReq.origin}. Verification needed.`,
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(t.toastNewOrder);
  };

  // 2. Accept Order internally (Shinwa)
  const handleShinwaAccept = (reqId: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status: 'SHINWA_ACCEPTED',
          driverName: "小林 茂 (Kobayashi - Shinwa)",
          vehiclePlate: "足立 100 え 12-34",
          driverId: "drv-shinwa-1"
        };
      }
      return r;
    }));
    
    const newNotif: SystemNotification = {
      id: `not-${Date.now()}`,
      titleJa: "信和運輸で自社配車完了",
      titleEn: "Shinwa Own-Fleet Assigned",
      descJa: `案件 ${reqId} は信和運輸にて小林運転手に割り当てられました。`,
      descEn: `Order ${reqId} locked into Shinwa primary operator (Kobayashi).`,
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(t.toastAccept);
  };

  // 3. Subcontract / Forward (Shinwa)
  const handleOpenSubcontractModal = (reqId: string) => {
    setSubcontractModalReqId(reqId);
  };

  const submitSubcontract = () => {
    if (!subcontractModalReqId) return;
    setRequests(prev => prev.map(r => {
      if (r.id === subcontractModalReqId) {
        return {
          ...r,
          status: 'SUBCONTRACTED',
          subContractorId: selectedSubcompany,
          driverName: selectedSubcompany === 'sub-kanto' ? "未指定 (Kanto Fleet Pool)" : "未指定 (Kansai Fleet Pool)"
        };
      }
      return r;
    }));

    const newNotif: SystemNotification = {
      id: `not-${Date.now()}`,
      titleJa: "下請運送会社へ委託手続",
      titleEn: "Job Subcontracted Offline",
      descJa: `信和運輸は、協力会社である「${selectedSubcompany === 'sub-kanto' ? '関東第一急行 (Kanto)' : '関西エクスプレス (Kansai)'}」に運行を委託しました。`,
      descEn: `Shinwa forwarded shipment to partner subcontractor company.`,
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev]);
    setSubcontractModalReqId(null);
    showToast(t.toastSub);
  };

  // 4. Assign subcontractor driver
  const handleOpenAssignModal = (reqId: string) => {
    setAssignModalReqId(reqId);
    if (activeRole === 'SUBCONTRACTOR_STAFF') {
      setAssignDriverName("高橋 優一 (Takahashi - Sub)");
      setAssignPlate("多摩 100 や 65-43");
    }
  };

  const submitDriverAssignment = () => {
    if (!assignModalReqId) return;
    setRequests(prev => prev.map(r => {
      if (r.id === assignModalReqId) {
        return {
          ...r,
          status: 'DRIVER_ASSIGNED',
          driverName: assignDriverName,
          vehiclePlate: assignPlate,
          driverId: activeRole === 'SUBCONTRACTOR_STAFF' ? "drv-sub-1" : "drv-shinwa-1"
        };
      }
      return r;
    }));

    const newNotif: SystemNotification = {
      id: `not-${Date.now()}`,
      titleJa: "運行乗務員への配車完了",
      titleEn: "Driver Linked to Route",
      descJa: `乗務員: ${assignDriverName} / 車両: ${assignPlate} が配車ボードに登録されました。`,
      descEn: `Driver ${assignDriverName} marked on active fleet roster.`,
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev]);
    setAssignModalReqId(null);
    showToast(t.toastDriver);
  };

  // 5. Driver updates milestone
  const handleDriverMilestoneUpdate = (reqId: string, currentStatus: string) => {
    let nextStatus: 'DISPATCHED' | 'PICKED_UP' | 'DELIVERED' = 'DISPATCHED';
    let labelJa = "";
    let labelEn = "";
    const rightNow = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (currentStatus === 'DRIVER_ASSIGNED') {
      nextStatus = 'DISPATCHED';
      labelJa = "運行開始 (点呼・アルコール検知完了)";
      labelEn = "Vehicle Dispatched - Safety logs cleared";
    } else if (currentStatus === 'DISPATCHED') {
      nextStatus = 'PICKED_UP';
      labelJa = "荷受完了 (発地受領印確認済)";
      labelEn = "Cargo Loaded & Origin Check complete";
    } else if (currentStatus === 'PICKED_UP') {
      nextStatus = 'DELIVERED';
      labelJa = "配送完了 (納品先・検収確認書受領)";
      labelEn = "Delivery Confirmed - Customer Signature received";
    }

    setRequests(prev => prev.map(r => {
      if (r.id === reqId) {
        const updated = {
          ...r,
          status: nextStatus,
        };
        if (nextStatus === 'DISPATCHED') updated.dispatchedAt = rightNow;
        if (nextStatus === 'PICKED_UP') updated.pickedUpAt = rightNow;
        if (nextStatus === 'DELIVERED') updated.deliveredAt = rightNow;
        return updated;
      }
      return r;
    }));

    const newNotif: SystemNotification = {
      id: `not-${Date.now()}`,
      titleJa: `運行ステータス更新 (${nextStatus})`,
      titleEn: `Milestone Status Change (${nextStatus})`,
      descJa: `ドライバーよりマイルストーン連絡: ${labelJa}`,
      descEn: `Driver updated status: ${labelEn}`,
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(t.toastStep);
  };

  // Mock computations for KPIs
  const totalCompleted = requests.filter(r => r.status === 'DELIVERED').length;
  const totalSubcontracted = requests.filter(r => r.subContractorId).length;
  const ratioSubcontracted = requests.length > 0 ? Math.round((totalSubcontracted / requests.length) * 100) : 40;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-indigo-100">
        {/* Top Warning/Meta Header */}
        <div className="bg-indigo-50 border-b border-indigo-100 px-4 md:px-8 py-2 text-xs text-indigo-900 flex flex-wrap justify-between items-center gap-2 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span><strong>B2B Logistics Platform</strong> • Portal Access Protection Gate</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[10px]">
            <span>{lang === 'ja' ? 'セキュリティ状態: アクティブ' : 'Security Status: ACTIVE'}</span>
            <span>UTC: 2026-06-16</span>
          </div>
        </div>

        {/* Minimal Header */}
        <header className="bg-white border-b border-slate-200/80 py-4 px-4 md:px-8 flex justify-between items-center z-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 text-slate-700 p-2.5 rounded-xl border border-slate-200/50">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2">
                {t.appName}
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-normal mt-0.5">{t.appSub}</p>
            </div>
          </div>
          
          <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200/60">
            <button 
              id="login-lang-ja-btn"
              onClick={() => setLang('ja')}
              className={`px-3 py-1.5 text-xs rounded-full font-semibold transition-all flex items-center gap-1 cursor-pointer ${lang === 'ja' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              JA
            </button>
            <button 
              id="login-lang-en-btn"
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 text-xs rounded-full font-semibold transition-all flex items-center gap-1 cursor-pointer ${lang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              EN
            </button>
          </div>
        </header>

        {/* Login Split Screen Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col lg:grid lg:grid-cols-12 gap-8 items-center justify-center my-auto">
          {/* Left Block: Login Card */}
          <div className="lg:col-span-7 w-full space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  SECURITY GATE
                </span>
                <h2 className="text-xl md:text-2.5xl font-black text-slate-950 mt-3 tracking-tight">
                  {t.loginTitle}
                </h2>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {t.loginSubtitle}
                </p>
              </div>

              {loginError && (
                <div id="login-error-alert" className="p-4 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-2xl font-medium flex items-start gap-2.5 leading-relaxed animate-fade-in">
                  <span className="mt-0.5">⚠️</span>
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1.5">
                    {t.emailLabel}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input 
                      id="login-email-input"
                      type="email" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. maruichi@maruichi.co.jp"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white rounded-xl pl-10 pr-3.5 py-3 text-sm text-slate-900 outline-none transition" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1.5">
                    {t.passwordLabel}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input 
                      id="login-password-input"
                      type="password" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white rounded-xl pl-10 pr-3.5 py-3 text-sm text-slate-950 outline-none transition" 
                      required 
                    />
                  </div>
                </div>

                <button 
                  id="login-submit-btn"
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {t.loginBtn}
                </button>
              </form>
            </div>
          </div>

          {/* Right Block: Demo Accounts Autofill */}
          <div className="lg:col-span-5 w-full space-y-4">
            <div className="bg-slate-100 border border-slate-200 rounded-3xl p-6 shadow-3xs space-y-4">
              <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>{t.demoInfoTitle}</span>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button 
                    key={acc.role}
                    type="button"
                    onClick={() => handleAutofillLogin(acc)}
                    className="w-full p-3.5 bg-white hover:bg-indigo-50/20 border border-slate-200/80 hover:border-indigo-300 rounded-2xl text-left transition duration-200 group flex items-center gap-3.5 cursor-pointer shadow-3xs"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-indigo-50 border border-slate-150 flex items-center justify-center text-slate-700 group-hover:text-indigo-700 font-black text-xs font-mono shrink-0 transition-all">
                      {acc.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-bold text-xs text-slate-900 truncate group-hover:text-indigo-600 transition">
                          {lang === 'ja' ? acc.nameJa : acc.nameEn}
                        </p>
                        <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 font-bold font-mono rounded">
                          {acc.password}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                        {acc.email}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[9px] px-2 py-0.5 bg-indigo-50 border border-indigo-100/60 text-indigo-700 font-bold rounded-full">
                          {lang === 'ja' ? acc.badgeJa : acc.badgeEn}
                        </span>
                        <span className="text-[8px] text-slate-400 font-mono font-semibold">
                          ID: {acc.id}
                        </span>
                      </div>
                    </div>
                    <div className="text-slate-300 group-hover:text-indigo-600 transition shrink-0 pl-1">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="py-6 px-4 border-t border-slate-200 text-center text-[10px] text-slate-400 font-medium mt-auto">
          © 2026 Maruichi Souko (Shipper) & Shinwa Company Transport Partnership Platform.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-indigo-100">
      
      {/* Top Warning/Meta Header */}
      <div className="bg-amber-50 border-b border-amber-100 px-4 md:px-8 py-2 text-xs text-amber-900 flex flex-wrap justify-between items-center gap-2 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span><strong>B2B Logistics Platform</strong> • Connected Secure Session</span>
        </div>
        <div className="flex items-center gap-3 text-slate-500 text-[10px]">
          <span>{lang === 'ja' ? '接続ステータス: 安全' : 'Connection Status: SECURE'}</span>
          <span>UTC: 2026-06-16</span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white border-b border-slate-200/80 py-4 px-4 md:px-8 flex flex-col lg:flex-row justify-between items-center gap-4 sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 text-slate-700 p-2.5 rounded-xl border border-slate-200/50">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2">
              {t.appName}
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-normal mt-0.5">{t.appSub}</p>
          </div>
        </div>

        {/* Action Controls, Logged-in User Session & Language */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 w-full lg:w-auto justify-end">
          
          {/* User Session Block */}
          {currentUser && (
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center font-mono text-xs">
                {currentUser.avatar}
              </div>
              <div className="leading-tight">
                <p className="font-extrabold text-slate-900">{lang === 'ja' ? currentUser.nameJa : currentUser.nameEn}</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  {lang === 'ja' ? currentUser.companyJa : currentUser.companyEn}
                </p>
              </div>
              
              <button 
                id="logout-action-btn"
                onClick={handleLogout}
                className="ml-2 p-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 rounded-lg transition cursor-pointer"
                title={t.logoutBtn}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Language Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200/60 shrink-0">
            <button 
              id="lang-ja-btn"
              onClick={() => setLang('ja')}
              className={`px-3.5 py-1.5 text-xs rounded-full font-semibold transition-all flex items-center gap-1 cursor-pointer ${lang === 'ja' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Languages className="w-3.5 h-3.5" />
              日本語 (JA)
            </button>
            <button 
              id="lang-en-btn"
              onClick={() => setLang('en')}
              className={`px-3.5 py-1.5 text-xs rounded-full font-semibold transition-all flex items-center gap-1 cursor-pointer ${lang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              English (EN)
            </button>
          </div>
        </div>
      </header>

      {/* Real-time Notification Banner / Alerts */}
      {toastMsg && (
        <div className="bg-indigo-50 text-indigo-900 border-b border-indigo-100 px-6 py-3.5 flex items-center justify-between text-xs font-semibold animate-fade-in shadow-sm">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-indigo-600 animate-bounce" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-indigo-400 hover:text-indigo-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Dynamic Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Selected Role's Core Work Station */}
        <div className="lg:col-span-2 space-y-8">

          {/* ==================== ROLE 1: MARUICHI STAFF ==================== */}
          {activeRole === 'MARUICHI_STAFF' && (
            <div className="space-y-8">
              
              {/* Profile Card & Info */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                      M1
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm md:text-base">丸一倉庫株式会社・東京本部 (Headquarters)</h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">ID: SH-M0418 • Auth Role: MARUICHI_STAFF</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 border border-emerald-200/60 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wide">
                    Shipper (荷主)
                  </span>
                </div>
              </div>

              {/* Request Creation Form */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-5 text-sm md:text-base">
                  <PlusCircle className="w-5 h-5 text-emerald-600" />
                  {t.newRequest}
                </h3>
                <form onSubmit={handleCreateRequest} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1.5">{t.origin}</label>
                    <input 
                      type="text" 
                      value={formOrigin}
                      onChange={(e) => setFormOrigin(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none transition" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1.5">{t.destination}</label>
                    <input 
                      type="text" 
                      value={formDest}
                      onChange={(e) => setFormDest(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none transition" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1.5">{t.cargoType}</label>
                    <input 
                      type="text" 
                      value={formCargo}
                      onChange={(e) => setFormCargo(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none transition" 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1.5">{t.cargoWeight}</label>
                      <input 
                        type="number" 
                        value={formWeight}
                        onChange={(e) => setFormWeight(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none transition" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1.5">{t.vehicleType}</label>
                      <input 
                        type="text" 
                        value={formVehicle}
                        onChange={(e) => setFormVehicle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none transition" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 pt-2">
                    <button 
                      type="submit" 
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                    >
                      <PlusCircle className="w-4 h-4" />
                      {t.submitRequest}
                    </button>
                  </div>
                </form>
              </div>

              {/* Dynamic Map Simulation (SVG) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm md:text-base">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  {lang === 'ja' ? 'リアルタイム配車・運行地理マップ' : 'Live Fleet Geographic Map'}
                </h3>
                <div className="bg-slate-50 rounded-2xl border border-slate-200/60 h-52 relative overflow-hidden flex items-center justify-center p-2">
                  <svg className="w-full h-full max-w-sm" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Japan outline abstraction */}
                    <path d="M50 150 C70 140, 120 120, 180 100 C240 80, 290 50, 350 20" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
                    <path d="M50 150 C70 140, 120 120, 180 100 C240 80, 290 50, 350 20" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                    
                    {/* Locations */}
                    <g className="translate" id="loc-tokyo">
                      <circle cx="280" cy="70" r="5" fill="#f43f5e" className="animate-ping" />
                      <circle cx="280" cy="70" r="4" fill="#ef4444" />
                      <text x="288" y="74" fill="#475569" fontSize="9" fontWeight="bold">東京(Tokyo)</text>
                    </g>
                    <g className="translate" id="loc-nagoya">
                      <circle cx="200" cy="100" r="4" fill="#0ea5e9" />
                      <text x="180" y="93" fill="#64748b" fontSize="8" fontWeight="medium">名古屋(Nagoya)</text>
                    </g>
                    <g className="translate" id="loc-osaka">
                      <circle cx="150" cy="120" r="5" fill="#f59e0b" />
                      <text x="110" y="132" fill="#475569" fontSize="9" fontWeight="bold">大阪(Osaka)</text>
                    </g>

                    {/* Active routing animation (if any matched orders) */}
                    {requests.some(r => r.status === 'DISPATCHED' || r.status === 'PICKED_UP') && (
                      <path d="M280 70 L200 100 L150 120" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5,5" className="animate-[dash_2s_linear_infinite]" />
                    )}
                  </svg>
                  <div className="absolute bottom-3 right-3 bg-white/95 py-1.5 px-2.5 rounded-lg border border-slate-205 text-[10px] font-mono text-slate-600 shadow-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {lang === 'ja' ? '配送中トラック実機シミュレーション有' : 'Active Telemetry Link Enabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== ROLE 2: SHINWA STAFF ==================== */}
          {activeRole === 'SHINWA_STAFF' && (
            <div className="space-y-8">
              
              {/* Profile Card & Info */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                      S1
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm md:text-base">信和運輸株式会社・関東配車管制センター</h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">ID: CA-S2001 • Auth Role: SHINWA_STAFF</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-indigo-50 border border-indigo-200/60 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wide">
                    Primary Carrier (元請)
                  </span>
                </div>
              </div>

              {/* Action Board */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-5 text-sm md:text-base">
                  <Users className="w-5 h-5 text-indigo-600" />
                  {lang === 'ja' ? '配車管制パネル (信和運輸管制)' : 'Fleet Dispatch Routing Hub'}
                </h3>

                <div className="space-y-4">
                  {requests.filter(r => r.status === 'PENDING').length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      {lang === 'ja' ? '現在、未割当ての新規依頼(Pending)はありません。' : 'No incoming pending orders. Everything has been dispatched!'}
                    </div>
                  ) : (
                    requests.filter(r => r.status === 'PENDING').map(req => (
                      <div key={req.id} className="p-5 bg-slate-50/50 border border-slate-100 rounded-xl space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold rounded uppercase tracking-wide font-mono">
                              {t.PENDING}
                            </span>
                            <span className="text-sm font-bold text-slate-900 font-mono">{req.orderNumber}</span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono">{req.createdAt}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs text-slate-650">
                          <div className="flex items-center gap-1">📍 <span className="font-medium text-slate-800">{req.origin}</span></div>
                          <div className="flex items-center gap-1">🏁 <span className="font-medium text-slate-800">{req.destination}</span></div>
                          <div>📦 {req.cargoType} ({req.cargoWeight}t)</div>
                          <div>🚛 {req.vehicleType}</div>
                        </div>

                        <div className="flex gap-2.5 pt-1">
                          <button 
                            onClick={() => handleShinwaAccept(req.id)}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3 rounded-xl text-xs transition cursor-pointer shadow-xs"
                          >
                            🔵 {t.acceptOwn}
                          </button>
                          <button 
                            onClick={() => handleOpenSubcontractModal(req.id)}
                            className="bg-white hover:bg-slate-50 text-amber-700 font-bold py-2 px-3 rounded-xl text-xs border border-amber-200 transition cursor-pointer"
                          >
                            🤝 {t.subcontractTo}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== ROLE 3: SUBCONTRACTOR STAFF ==================== */}
          {activeRole === 'SUBCONTRACTOR_STAFF' && (
            <div className="space-y-8">
              
              {/* Profile Card & Info */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                      S2
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm md:text-base">関東第一急行株式会社 (Kanto Subcontractor)</h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">ID: SC-K4092 • Auth Role: SUBCONTRACTOR_STAFF</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-50 border border-amber-200/60 text-amber-750 rounded-full text-[10px] font-bold uppercase tracking-wide">
                    Subcontractor (下請協力社)
                  </span>
                </div>
              </div>

              {/* Subcontractor Jobs Panel */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4 text-sm md:text-base">
                  <Truck className="w-5 h-5 text-amber-600" />
                  {lang === 'ja' ? '信和運輸からの委託請負案件' : 'Subcontracted Orders Worklist'}
                </h3>

                <p className="text-xs text-amber-850 mb-5 bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/50 leading-relaxed font-medium">
                  ⚠️ {lang === 'ja' ? 'セキュリティ規律: 丸一倉庫の他社運行データおよび自社に委託されていないその他オーダーへのアクセス制限が厳格に適用されています。' : 'RBAC Protection: Strictly isolated view. Unauthorized to view non-delegated Maruichi general telemetry routes.'}
                </p>

                <div className="space-y-4">
                  {requests.filter(r => r.subContractorId === 'sub-kanto').length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      {lang === 'ja' ? '現在、委託された案件はありません。' : 'No subcontracted jobs allocated from Shinwa.'}
                    </div>
                  ) : (
                    requests.filter(r => r.subContractorId === 'sub-kanto').map(req => (
                      <div key={req.id} className="p-5 bg-slate-50/50 border border-slate-100 rounded-xl space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2.5">
                            <span className="px-2.5 py-0.5 bg-amber-50/80 text-amber-700 border border-yellow-200 text-[9px] font-bold rounded uppercase tracking-wide font-mono">
                              {req.status === 'SUBCONTRACTED' ? t.SUBCONTRACTED : t.DRIVER_ASSIGNED}
                            </span>
                            <span className="text-sm font-bold text-slate-900 font-mono">{req.orderNumber}</span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono">{req.createdAt}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs text-slate-650">
                          <div>📍 Origin: <span className="font-semibold text-slate-800">{req.origin}</span></div>
                          <div>🏁 Dest: <span className="font-semibold text-slate-800">{req.destination}</span></div>
                          <div>📦 {req.cargoType} ({req.cargoWeight}t)</div>
                          <div>🪪 {req.driverName ? `運転手: ${req.driverName}` : '運転手: 未割当'} {req.vehiclePlate && `(${req.vehiclePlate})`}</div>
                        </div>

                        {req.status === 'SUBCONTRACTED' && (
                          <div className="pt-1">
                            <button 
                              onClick={() => handleOpenAssignModal(req.id)}
                              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer shadow-xs active:scale-98"
                            >
                              🚚 {t.assignDriver}
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== ROLE 4: DRIVER WEB APP ==================== */}
          {activeRole === 'DRIVER' && (
            <div className="space-y-8">
              
              {/* Specialized touch-friendly smartphone skin */}
              <div className="max-w-[360px] mx-auto bg-slate-900 border-[8px] border-slate-950 rounded-[42px] overflow-hidden shadow-xl relative">
                
                {/* Phone Speaker & Camera Notch */}
                <div className="absolute top-0 inset-x-0 h-4 bg-slate-900 flex justify-center items-center z-20">
                  <div className="w-20 h-3 bg-slate-800 rounded-b-lg"></div>
                </div>

                <div className="pt-6 pb-3.5 bg-indigo-900 border-b border-indigo-950 text-center relative">
                  <div className="px-6 flex justify-between items-center text-[9px] text-indigo-200 font-mono">
                    <span>11:42 AM</span>
                    <span className="text-emerald-400 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      GPS On
                    </span>
                    <span>🔋 88%</span>
                  </div>
                  <h3 className="font-bold text-xs text-white mt-2.5 flex items-center justify-center gap-1.5">
                    <Truck className="w-4 h-4 text-sky-300" />
                    <span>信和/下請 乗務員モバイル (Driver App)</span>
                  </h3>
                  <p className="text-[9px] font-mono text-indigo-300 mt-0.5">Driver Key: DRV-SAT0819</p>
                </div>

                <div className="p-4 bg-slate-50 min-h-[360px] space-y-4">
                  
                  {/* Active Job Block */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3.5 shadow-xs">
                    <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                      <span>⚡ {t.activeJob}</span>
                      <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold font-mono">
                        RUNNING
                      </span>
                    </h4>

                    {requests.filter(r => r.status !== 'DELIVERED' && r.status !== 'CANCELLED' && r.status !== 'PENDING' && r.status !== 'SUBCONTRACTED').length === 0 ? (
                      <div className="text-center py-10 text-xs text-slate-400 font-medium">
                        {t.noActiveJob}
                      </div>
                    ) : (
                      requests.filter(r => r.status !== 'DELIVERED' && r.status !== 'CANCELLED' && r.status !== 'PENDING' && r.status !== 'SUBCONTRACTED').map(req => (
                        <div key={req.id} className="space-y-4">
                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 space-y-2.5">
                            <div className="text-[11px] text-slate-500 font-medium">Order Ref: <span className="font-mono text-slate-900 font-bold">{req.orderNumber}</span></div>
                            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                              積地: {req.origin}
                            </div>
                            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              卸地: {req.destination}
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 font-medium">
                              <div>品名: {req.cargoType}</div>
                              <div>重量: {req.cargoWeight}t</div>
                            </div>
                          </div>

                          {/* Large touch control milestones */}
                          <div className="space-y-2">
                            {req.status === 'DRIVER_ASSIGNED' && (
                              <button 
                                onClick={() => handleDriverMilestoneUpdate(req.id, req.status)}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-xl text-xs font-bold uppercase text-center cursor-pointer tracking-wider shadow-sm select-none active:scale-95 transition-all outline-none"
                              >
                                {t.milestoneStart} ➡
                              </button>
                            )}

                            {req.status === 'DISPATCHED' && (
                              <button 
                                onClick={() => handleDriverMilestoneUpdate(req.id, req.status)}
                                className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 px-4 rounded-xl text-xs font-bold uppercase text-center cursor-pointer tracking-wider shadow-sm select-none active:scale-95 transition-all outline-none"
                              >
                                {t.milestonePickup} ➡
                              </button>
                            )}

                            {req.status === 'PICKED_UP' && (
                              <button 
                                onClick={() => handleDriverMilestoneUpdate(req.id, req.status)}
                                className="w-full bg-indigo-650 hover:bg-indigo-600 text-white py-3 px-4 rounded-xl text-xs font-bold uppercase text-center cursor-pointer tracking-wider shadow-sm select-none active:scale-95 transition-all outline-none"
                              >
                                {t.milestoneDeliver} ✓
                              </button>
                            )}
                          </div>

                          {/* Simulated Call Dispatch buttons */}
                          <div className="flex gap-2 text-[10px] pt-1 font-semibold">
                            <a href="tel:09012345678" className="flex-1 bg-white border border-slate-200 p-2.5 rounded-xl text-center text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1 font-mono shadow-xs">
                              <Phone className="w-3.5 h-3.5 text-indigo-600" />
                              信和管制室
                            </a>
                            <div className="flex-1 bg-white border border-slate-200 p-2.5 rounded-xl text-center text-slate-500 flex items-center justify-center gap-1 font-mono shadow-xs">
                              <Clock className="w-3.5 h-3.5" />
                              Status: {req.status}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Completed / History logs inside Mobile frame */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
                    <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">{t.completedHistory}</h5>
                    <div className="space-y-1.5">
                      {requests.filter(r => r.status === 'DELIVERED').map(r => (
                        <div key={r.id} className="text-[10px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex justify-between items-center text-slate-650">
                          <div>
                            <p className="font-mono font-bold text-slate-800">{r.orderNumber}</p>
                            <p className="text-slate-500 truncate max-w-[125px] font-medium">{r.destination}</p>
                          </div>
                          <span className="text-[9px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-bold">DELIVERED</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Simulated physical home indicator bar */}
                <div className="bg-slate-900 pt-1.5 pb-2.5 flex justify-center">
                  <div className="w-24 h-1 bg-slate-700 rounded-full"></div>
                </div>
              </div>

            </div>
          )}

          {/* Unified Dispatched Fleet Live Tracking Board (Required for transparency across Shippers and Carriers) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5 border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm md:text-base">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                {t.reqList}
              </h3>
              <span className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 font-mono rounded-full text-[10px] font-bold">
                Active Records: {requests.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[9px] font-bold">
                    <th className="py-3 px-2">{t.orderNo}</th>
                    <th className="px-2">{lang === 'ja' ? '区間 (積地 ➡ 卸地)' : 'Route'}</th>
                    <th className="px-2">{t.cargoType}</th>
                    <th className="px-2">{lang === 'ja' ? '運行主体 & 車両' : 'Operator Details'}</th>
                    <th className="text-right px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans text-slate-705">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/75 transition text-slate-800">
                      <td className="py-4 px-2 font-mono font-bold text-indigo-650">{r.orderNumber}</td>
                      <td className="px-2">
                        <div className="font-semibold text-slate-900 truncate max-w-xs">{r.origin}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-xs mt-0.5">➡ {r.destination}</div>
                      </td>
                      <td className="px-2 font-medium">{r.cargoType} ({r.cargoWeight}t)</td>
                      <td className="px-2">
                        {r.subContractorId ? (
                          <div className="text-amber-700 font-bold text-[11px]">{lang === 'ja' ? '下請委託済 (パートナー)' : 'Subcontracted (Partner)'}</div>
                        ) : (
                          <div className="text-indigo-650 font-bold text-[11px]">{lang === 'ja' ? '信和 自社運行' : 'Shinwa Internal'}</div>
                        )}
                        <div className="text-[10px] text-slate-500 mt-0.5">{r.driverName || '未指定'} • {r.vehiclePlate || '車両未配備'}</div>
                      </td>
                      <td className="text-right px-2">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          r.status === 'DELIVERED' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' :
                          r.status === 'DISPATCHED' ? 'bg-amber-50 border border-amber-200 text-amber-700 animate-pulse' :
                          r.status === 'PICKED_UP' ? 'bg-sky-50 border border-sky-200 text-sky-700 animate-pulse' :
                          r.status === 'DRIVER_ASSIGNED' ? 'bg-indigo-50 border border-indigo-100 text-indigo-700' :
                          r.status === 'SUBCONTRACTED' ? 'bg-slate-100 border border-slate-200 text-slate-600' :
                          'bg-slate-100 border border-slate-200 text-slate-600'
                        }`}>
                          {lang === 'ja' ? ja[r.status] : en[r.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Analytical Performance & Real-Time Alerts */}
        <div className="space-y-6">

          {/* Performance Summary - KPI Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2 text-sm md:text-base">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>{t.analyticsTitle}</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">{t.completedCount}</p>
                <p className="text-xl font-bold text-slate-900 font-mono mt-1">{totalCompleted} / {requests.length}</p>
              </div>
              <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">{t.delayRatio}</p>
                <p className="text-xl font-bold text-indigo-600 font-mono mt-1">0.0%</p>
              </div>
            </div>

            {/* Custom SVG Representation of Outsource outsourcing ratio */}
            <div className="bg-slate-50/60 rounded-xl p-4.5 border border-slate-100">
              <div className="flex justify-between items-center text-xs mb-2 font-bold text-slate-705">
                <span>{t.subcontractRatio}</span>
                <span className="font-mono font-bold text-amber-700">{ratioSubcontracted}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                <div style={{ width: `${100 - ratioSubcontracted}%` }} className="bg-indigo-600 h-full" title={t.internalHandling}></div>
                <div style={{ width: `${ratioSubcontracted}%` }} className="bg-amber-500 h-full" title={t.subcontractRatio}></div>
              </div>
              <div className="flex gap-4 mt-3 text-[10px] text-slate-500 font-mono font-bold">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> {t.internalHandling}</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> {t.subcontractRatio}</span>
              </div>
            </div>
          </div>

          {/* Real-time System Notifications Queue (Simulating SSE Feed) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between text-sm md:text-base">
              <span className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" />
                {lang === 'ja' ? 'リアルタイム受信記録 (SSE)' : 'Live SSE Event Registry'}
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] rounded-full tracking-wide uppercase font-bold">
                Active Client
              </span>
            </h3>

            <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-3.5 bg-slate-50/50 border border-slate-100/80 rounded-xl space-y-1.5 shadow-3xs">
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-650 text-xs font-bold font-mono">⚡ {lang === 'ja' ? notif.titleJa : notif.titleEn}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">{notif.time}</span>
                  </div>
                  <p className="text-xs text-slate-655 leading-relaxed font-normal">{lang === 'ja' ? notif.descJa : notif.descEn}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* ==================== GLOBAL MODALS ==================== */}

      {/* Subcontract Assignment Modal */}
      {subcontractModalReqId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                🤝 {lang === 'ja' ? '協力会社へ委託' : 'Delegate to Partner'}
              </h4>
              <button 
                onClick={() => setSubcontractModalReqId(null)} 
                className="text-slate-400 hover:text-slate-750 p-1 rounded-full hover:bg-slate-50 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">
                {lang === 'ja' ? '委託先パートナー企業' : 'Select Vendor'}
              </label>
              <select 
                value={selectedSubcompany} 
                onChange={(e) => setSelectedSubcompany(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none transition"
              >
                <option value="sub-kanto">関東第一急行株式会社 (Kanto Express)</option>
                <option value="sub-kansai">関西エクスプレス有限会社 (Kansai Transit)</option>
              </select>
            </div>

            <button 
              onClick={submitSubcontract}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer shadow-xs active:scale-98"
            >
              🤝 {lang === 'ja' ? '運行依託を確定する' : 'Confirm Subcontract Forward'}
            </button>
          </div>
        </div>
      )}

      {/* Driver/Plate Assignment Modal */}
      {assignModalReqId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                🚚 {t.assignDriver}
              </h4>
              <button 
                onClick={() => setAssignModalReqId(null)} 
                className="text-slate-400 hover:text-slate-750 p-1 rounded-full hover:bg-slate-50 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">{t.driverName}</label>
                <input 
                  type="text" 
                  value={assignDriverName}
                  onChange={(e) => setAssignDriverName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">{t.vehiclePlate}</label>
                <input 
                  type="text" 
                  value={assignPlate}
                  onChange={(e) => setAssignPlate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 outline-none transition"
                />
              </div>
            </div>

            <button 
              onClick={submitDriverAssignment}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer shadow-xs active:scale-98"
            >
              🚛 {lang === 'ja' ? '配車完了として登録' : 'Finalize Trip Dispatch File'}
            </button>
          </div>
        </div>
      )}

      {/* ==================== SIMPLE CORPORATE FOOTER ==================== */}
      <footer className="bg-slate-50 border-t border-slate-200/80 py-8 px-4 text-center text-slate-400 text-xs mt-16">
        <div className="max-w-7xl mx-auto">
          <p>© 2026 Maruichi Souko (Shipper) & Shinwa Company Transport Partnership Platform.</p>
        </div>
      </footer>

    </div>
  );
}

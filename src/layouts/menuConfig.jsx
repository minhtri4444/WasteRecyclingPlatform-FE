import {
  Trash2,
  MapPin,
  BarChart3,
  Truck,
  ClipboardList,
  Trophy,
  Users,
  Factory,
  MessageSquareWarning,
  Star,
  GitBranch,
  UserCog,
  PackageCheck,
  Coins,
  Map,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export const menuConfig = {
  Admin: [
    {
      label: "Thống kê hệ thống",
      path: "/admin/dashboard",
      icon: <BarChart3 size={18} />,
    },
    {
      label: "Quản lý người dùng",
      path: "/admin/users",
      icon: <Users size={18} />,
    },
    {
      label: "Khu vực dịch vụ",
      path: "/admin/areas",
      icon: <MapPin size={18} />,
    },
    {
      label: "Loại rác thải",
      path: "/admin/waste-types",
      icon: <Trash2 size={18} />,
    },
    {
      label: "Phản hồi & Khiếu nại",
      path: "/admin/feedback",
      icon: <MessageSquareWarning size={18} />,
    },
  ],
  Citizen: [
    {
      label: "Báo cáo rác",
      path: "/citizen/report",
      icon: <ClipboardList size={18} />,
    },
    {
      label: "Lịch sử báo cáo",
      path: "/citizen/history",
      icon: <Trash2 size={18} />,
    },
    {
      label: "Bảng xếp hạng",
      path: "/citizen/leaderboard",
      icon: <Trophy size={18} />,
    },
    {
      label: "Phần thưởng",
      path: "/citizen/rewards",
      icon: <Coins size={18} />,
    },
    {
      label: "Gửi khiếu nại",
      path: "/citizen/feedback",
      icon: <AlertCircle size={18} />,
    },
  ],
  Enterprise: [
    {
      label: "Tổng quan",
      path: "/enterprise/dashboard",
      icon: <TrendingUp size={18} />,
    },
    {
      label: "Năng lực xử lý",
      path: "/enterprise/capacities",
      icon: <Factory size={18} />,
    },
    {
      label: "Rác chờ duyệt",
      path: "/enterprise/pending",
      icon: <PackageCheck size={18} />,
    },
    {
      label: "Điều phối Collector",
      path: "/enterprise/assignments",
      icon: <GitBranch size={18} />,
    },
    {
      label: "Quản lý Collector",
      path: "/enterprise/collectors",
      icon: <UserCog size={18} />,
    },
    {
      label: "Quy tắc thưởng",
      path: "/enterprise/rules",
      icon: <Star size={18} />,
    },
  ],
  Collector: [
    {
      label: "Nhiệm vụ thu gom",
      path: "/collector/tasks",
      icon: <Truck size={18} />,
    },
    {
      label: "Bản đồ nhiệm vụ",
      path: "/collector/map",
      icon: <Map size={18} />,
    },
    {
      label: "Thống kê cá nhân",
      path: "/collector/stats",
      icon: <BarChart3 size={18} />,
    },
  ],
};
